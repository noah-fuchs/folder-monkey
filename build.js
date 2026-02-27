const esbuild = require('esbuild');
const fs = require('fs-extra');
const path = require('path');

const SRC_DIR = path.join(__dirname, 'src');
const DIST_DIR = path.join(__dirname, 'dist');
const SCRIPTS_DIR = path.join(SRC_DIR, 'scripts');
const DIST_SCRIPTS_DIR = path.join(DIST_DIR, 'scripts');

async function build() {
  console.log('Starting build...');

  // 1. Clean dist directory
  await fs.emptyDir(DIST_DIR);

  // 2. Copy popup (and other static assets if any)
  if (await fs.pathExists(path.join(SRC_DIR, 'popup'))) {
    await fs.copy(path.join(SRC_DIR, 'popup'), path.join(DIST_DIR, 'popup'));
  }

  // 3. Read manifest-base.json
  const manifestBase = await fs.readJson(path.join(SRC_DIR, 'manifest-base.json'));
  manifestBase.content_scripts = [];

  // 4. Process each script directory
  const scriptDirs = await fs.readdir(SCRIPTS_DIR);
  for (const dir of scriptDirs) {
    const scriptPath = path.join(SCRIPTS_DIR, dir);
    const stat = await fs.stat(scriptPath);
    if (!stat.isDirectory()) continue;

    console.log(`Processing script: ${dir}`);
    const indexFile = path.join(scriptPath, 'index.js');
    const configFile = path.join(scriptPath, 'config.json');

    if (!(await fs.pathExists(indexFile)) || !(await fs.pathExists(configFile))) {
      console.warn(`Skipping ${dir}: index.js or config.json missing.`);
      continue;
    }

    const config = await fs.readJson(configFile);

    // Build the script
    const outFilename = `${dir}.js`;
    await esbuild.build({
      entryPoints: [indexFile],
      bundle: true,
      outfile: path.join(DIST_SCRIPTS_DIR, outFilename),
      format: 'iife',
      minify: false, // Set to true for production later if desired
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
