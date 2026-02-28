#!/usr/bin/env node

const path = require('path');
const { spawnSync } = require('child_process');

const args = process.argv.slice(2);
const command = args[0];

const validCommands = ['build', 'watch'];

if (!validCommands.includes(command)) {
    console.error(`Invalid command. Usage: folder-monkey <${validCommands.join('|')}>`);
    process.exit(1);
}

const scriptPath = path.join(__dirname, '..', `${command}.js`);

const result = spawnSync('node', [scriptPath], {
    stdio: 'inherit',
    cwd: process.cwd(), // Runs inside the user's workspace
});

if (result.error) {
    console.error(`Error executing ${command}.js:`, result.error);
    process.exit(1);
}

process.exit(result.status || 0);
