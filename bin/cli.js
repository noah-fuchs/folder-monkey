#!/usr/bin/env node

const path = require('path');
const fs = require('fs-extra');
const { spawnSync } = require('child_process');

const args = process.argv.slice(2);
const command = args[0];

if (command !== 'init') {
    console.error(`Invalid command. Usage: folder-monkey init`);
    process.exit(1);
}

async function init() {
    const userDir = process.cwd();
    const templateDir = path.join(__dirname, '..', 'template');
    const targetMonkeyDir = path.join(userDir, 'folder-monkey');
    const targetScriptsDir = path.join(userDir, 'scripts');
    const targetPackageJson = path.join(userDir, 'package.json');

    console.log('🐒 Initializing folder-monkey workspace...');

    // 1. Copy template folder
    if (await fs.pathExists(targetMonkeyDir)) {
        console.error(`❌ folder-monkey directory already exists at ${targetMonkeyDir}`);
        process.exit(1);
    }
    await fs.copy(templateDir, targetMonkeyDir);
    console.log('✅ Created folder-monkey/ directory');

    // 2. Create scripts folder
    if (!(await fs.pathExists(targetScriptsDir))) {
        await fs.ensureDir(targetScriptsDir);
        console.log('✅ Created scripts/ directory');
    }

    // 3. Update or create package.json
    let pkg = {};
    if (await fs.pathExists(targetPackageJson)) {
        pkg = await fs.readJson(targetPackageJson);
    } else {
        pkg = {
            name: path.basename(userDir),
            version: '1.0.0',
            description: 'My Folder Monkey Workspace'
        };
    }

    // Ensure scripts are set
    pkg.scripts = pkg.scripts || {};
    pkg.scripts.build = 'node folder-monkey/build.js';
    pkg.scripts.watch = 'node folder-monkey/watch.js';

    // Ensure dependencies are present
    pkg.devDependencies = pkg.devDependencies || {};
    const depsToAdd = {
        "chokidar": "^5.0.0",
        "esbuild": "^0.27.3",
        "fs-extra": "^11.3.3",
        "ws": "^8.19.0"
    };

    for (const [dep, version] of Object.entries(depsToAdd)) {
        pkg.devDependencies[dep] = version;
    }

    await fs.writeJson(targetPackageJson, pkg, { spaces: 2 });
    console.log('✅ Updated package.json with build scripts and dependencies');

    console.log('\n🎉 Initialization complete! Next steps:');
    console.log('  1. Run `npm install` to install dependencies.');
    console.log('  2. Add your extension scripts to the `scripts/` folder.');
    console.log('  3. Run `npm run build` or `npm run watch` to compile.');
}

init().catch(err => {
    console.error('❌ Failed to initialize:', err);
    process.exit(1);
});
