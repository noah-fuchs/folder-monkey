import { logMessage, highlightLinks } from './utils';

function init() {
    logMessage('Example script loaded successfully!');
    const count = highlightLinks();
    logMessage(`Highligted ${count} links on this page.`);
}

// Run the script
init();
