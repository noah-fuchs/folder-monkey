const chokidar = require('chokidar');
const { exec } = require('child_process');
const path = require('path');
const WebSocket = require('ws');

// Setup WebSocket server
const wss = new WebSocket.Server({ port: 8080 });
let clients = [];

wss.on('connection', (ws) => {
    clients.push(ws);
    ws.on('close', () => {
        clients = clients.filter(client => client !== ws);
    });
});

console.log('👀 Watching for file changes in scripts/ directory...');

let isBuilding = false;
let buildPending = false;

const runBuild = () => {
    if (isBuilding) {
        buildPending = true;
        return;
    }
    isBuilding = true;

    console.log('🔄 Rebuilding extension...');
    const buildScript = path.join(__dirname, 'build.js');
    exec(`node "${buildScript}"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`❌ Build error:\n${error}`);
        } else {
            console.log(`✅ Build completed.`);
            if (stderr) console.error(stderr);

            // Notify extension clients to reload
            clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send('reload');
                }
            });
            console.log('🚀 Reload signal sent to extension.');
        }

        isBuilding = false;
        if (buildPending) {
            buildPending = false;
            runBuild();
        }
    });
};

// Initial build
runBuild();

// Watch user scripts folder for any changes
const scriptsFolder = path.join(__dirname, '..', 'scripts');
chokidar.watch(scriptsFolder, {
    ignored: ['**/node_modules/**'],
    ignoreInitial: true
}).on('all', (event, changedPath) => {
    console.log(`File ${changedPath} has been ${event}`);
    runBuild();
});
