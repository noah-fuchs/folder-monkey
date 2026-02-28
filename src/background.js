// Connect to the local WebSocket server for hot-reloading
function connect() {
    const ws = new WebSocket('ws://localhost:8080');

    ws.onmessage = (event) => {
        if (event.data === 'reload') {
            console.log('Reload signal received. Setting flag and reloading extension.');
            chrome.runtime.reload();
        }
    };

    ws.onclose = () => {
        // Reconnect after 1 second if the server goes down
        setTimeout(connect, 1000);
    };
}

// Start connection
connect();


