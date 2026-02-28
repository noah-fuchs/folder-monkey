// Connect to the local WebSocket server for hot-reloading
function connect() {
    const ws = new WebSocket('ws://localhost:8080');

    ws.onmessage = (event) => {
        if (event.data === 'reload') {
            console.log('Reload signal received. Setting flag and reloading extension.');
            chrome.storage.local.set({ justReloaded: true }, () => {
                chrome.runtime.reload();
            });
        }
    };

    ws.onclose = () => {
        // Reconnect after 1 second if the server goes down
        setTimeout(connect, 1000);
    };
}

// Start connection
connect();

// Check if we just reloaded, so we can reload the active tab
chrome.storage.local.get(['justReloaded'], (result) => {
    if (result.justReloaded) {
        chrome.storage.local.set({ justReloaded: false }, () => {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs && tabs[0]) {
                    chrome.tabs.reload(tabs[0].id);
                }
            });
        });
    }
});
