export function logMessage(msg) {
    console.log(`[ScriptExecutor: Example]: ${msg}`);
}

export function highlightLinks() {
    const links = document.querySelectorAll('a');
    links.forEach(link => {
        link.style.border = '2px solid red';
    });
    return links.length;
}
