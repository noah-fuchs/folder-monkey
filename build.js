const esbuild = require('esbuild');
const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

const CLI_DIR = __dirname;
const USER_DIR = process.cwd();

const SRC_DIR = path.join(CLI_DIR, 'src');
const DIST_DIR = path.join(USER_DIR, 'dist');
const SCRIPTS_DIR = path.join(USER_DIR, 'scripts');
const DIST_SCRIPTS_DIR = path.join(DIST_DIR, 'scripts');

async function build() {
  console.log('Starting build...');

  // 1. Clean dist directory
  await fs.emptyDir(DIST_DIR);

  // 2. Copy popup and background script
  if (await fs.pathExists(path.join(SRC_DIR, 'popup'))) {
    await fs.copy(path.join(SRC_DIR, 'popup'), path.join(DIST_DIR, 'popup'));
  }
  if (await fs.pathExists(path.join(SRC_DIR, 'background.js'))) {
    await fs.copy(path.join(SRC_DIR, 'background.js'), path.join(DIST_DIR, 'background.js'));
  }

  // 3. Read manifest-base.json
  const manifestBase = await fs.readJson(path.join(SRC_DIR, 'manifest-base.json'));
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

    // Pre-build Tailwind CSS if styles.css exists
    const stylesFile = path.join(scriptPath, 'styles.css');
    const builtCssFile = path.join(scriptPath, '.styles.built.css');
    if (await fs.pathExists(stylesFile)) {
      console.log(`  Building Tailwind CSS for ${dir}...`);
      execSync(`npx --yes @tailwindcss/cli -i "${stylesFile}" -o "${builtCssFile}" --minify`, {
        cwd: scriptPath,
        stdio: 'inherit',
      });
    }

    // Build the script
    const outFilename = `${dir}.js`;
    await esbuild.build({
      entryPoints: [indexFile],
      bundle: true,
      outfile: path.join(DIST_SCRIPTS_DIR, outFilename),
      format: 'iife',
      minify: false,
      jsx: 'automatic',
      loader: { '.css': 'text' },
    });

    // Clean up temp CSS
    if (await fs.pathExists(builtCssFile)) {
      await fs.remove(builtCssFile);
    }

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
