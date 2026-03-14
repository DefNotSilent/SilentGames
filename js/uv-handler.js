// --- UV PROXY HANDLER ---

const BARE_SERVER = 'https://tomp.app/'; // This is a common public Bare Server

function launchProxy() {
    const input = document.getElementById('proxy-input')?.value;
    if (!input) return;

    // Show a loading state on the button
    const btn = document.querySelector('.proxy-go-btn');
    if (btn) btn.textContent = "INITIALIZING...";

    // Register Service Worker
    navigator.serviceWorker.register('/uv.sw.js', {
        scope: __uv$config.prefix
    }).then(() => {
        let url = input.trim();
        const searchUrl = 'https://www.google.com/search?q=';

        if (!isUrl(url)) url = searchUrl + url;
        else if (!(url.startsWith('https://') || url.startsWith('http://'))) url = 'http://' + url;

        // Redirect to the encoded UV URL
        // Format: /service/encoded_url
        window.location.href = __uv$config.prefix + __uv$config.encodeUrl(url);
    });
}

function isUrl(val = '') {
    if (/^http(s?):\/\//.test(val) || val.includes('.') && val.substr(0, 1) !== ' ') return true;
    return false;
}