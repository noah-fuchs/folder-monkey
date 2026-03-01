const esbuild = require('esbuild');
const fs = require('fs-extra');
const path = require('path');

const CLI_DIR = __dirname; // This is folder-monkey/ inside the workspace
const USER_DIR = path.join(__dirname, '..');

const DIST_DIR = path.join(USER_DIR, 'dist');
const SCRIPTS_DIR = path.join(USER_DIR, 'scripts');
const DIST_SCRIPTS_DIR = path.join(DIST_DIR, 'scripts');

/**
 * ESBuild plugin that processes CSS files through PostCSS + Tailwind CSS.
 * If @tailwindcss/postcss is not installed, CSS files are passed through as-is.
 */
function tailwindPlugin(scriptDir) {
  return {
    name: 'tailwind-postcss',
    setup(build) {
      build.onLoad({ filter: /\.css$/ }, async (args) => {
        const cssContent = await fs.readFile(args.path, 'utf8');

        try {
          const postcss = require('postcss');
          const tailwind = require('@tailwindcss/postcss');

          const result = await postcss([tailwind()]).process(cssContent, {
            from: args.path,
          });

          return { contents: result.css, loader: 'text' };
        } catch (e) {
          // @tailwindcss/postcss not installed — return raw CSS as text
          return { contents: cssContent, loader: 'text' };
        }
      });
    },
  };
}

async function build() {
  console.log('Starting build...');

  // 1. Clean dist directory
  await fs.emptyDir(DIST_DIR);

  // 2. Copy popup and background script
  if (await fs.pathExists(path.join(CLI_DIR, 'popup'))) {
    await fs.copy(path.join(CLI_DIR, 'popup'), path.join(DIST_DIR, 'popup'));
  }
  if (await fs.pathExists(path.join(CLI_DIR, 'background.js'))) {
    await fs.copy(path.join(CLI_DIR, 'background.js'), path.join(DIST_DIR, 'background.js'));
  }

  // 3. Read manifest-base.json
  const manifestBase = await fs.readJson(path.join(CLI_DIR, 'manifest-base.json'));
  manifestBase.content_scripts = [];

  // 4. Process each script directory
  if (!(await fs.pathExists(SCRIPTS_DIR))) {
    console.log(`No scripts folder found at ${SCRIPTS_DIR}. Creating an empty one...`);
    await fs.ensureDir(SCRIPTS_DIR);
  }
  const scriptDirs = await fs.readdir(SCRIPTS_DIR);
  for (const dir of scriptDirs) {
    const scriptPath = path.join(SCRIPTS_DIR, dir);
    const stat = await fs.stat(scriptPath);
    if (!stat.isDirectory()) continue;

    console.log(`Processing script: ${dir}`);
    // Support both .js and .jsx entry files
    let indexFile = path.join(scriptPath, 'index.js');
    if (!(await fs.pathExists(indexFile))) {
      indexFile = path.join(scriptPath, 'index.jsx');
    }
    const configFile = path.join(scriptPath, 'config.json');

    if (!(await fs.pathExists(indexFile)) || !(await fs.pathExists(configFile))) {
      console.warn(`Skipping ${dir}: index.js/index.jsx or config.json missing.`);
      continue;
    }

    const config = await fs.readJson(configFile);

    // Build the script with Tailwind CSS plugin
    const outFilename = `${dir}.js`;
    await esbuild.build({
      entryPoints: [indexFile],
      bundle: true,
      outfile: path.join(DIST_SCRIPTS_DIR, outFilename),
      format: 'iife',
      minify: false,
      jsx: 'automatic',
      plugins: [tailwindPlugin(scriptPath)],
    });

    // Add to manifest
    if (config.matches && config.matches.length > 0) {
      manifestBase.content_scripts.push({
        matches: config.matches,
        js: [`scripts/${outFilename}`],
      });
    } else {
      console.warn(`Skipping ${dir} in manifest: no 'matches' defined in config.json.`);
    }
  }

  // 5. Write final manifest.json
  await fs.writeJson(path.join(DIST_DIR, 'manifest.json'), manifestBase, { spaces: 2 });

  console.log('Build completed successfully.');
}

build().catch((err) => {
  console.error('Build failed:', err);
  process.exit(1);
});
