// --- PANIC REDIRECT SYSTEM ---

async function loadPanicSites() {
    const tabselectElement = document.querySelector('#tabselect');
    if (!tabselectElement) return;

    try {
        const response = await fetch('/json/panic.json');
        const sites = await response.json();

        tabselectElement.innerHTML = ''; // Clear

        sites.forEach(site => {
            const option = document.createElement('option');
            option.value = site.url;
            option.textContent = site.name;
            tabselectElement.appendChild(option);
        });

        // Sync with LocalStorage
        const sitefortab = localStorage.getItem('sitefortab');
        if (sitefortab) {
            tabselectElement.value = sitefortab;
        }
    } catch (e) {
        console.error("Panic JSON failed to load:", e);
    }
}

function initPanicSystem() {
    const confirmBtn = document.getElementById('confirm-panic');
    const tabselectElement = document.querySelector('#tabselect');
    const keybind = localStorage.getItem('keybind') || '`'; // Default to tilde `

    // Save Selection
    if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
            const selectedUrl = tabselectElement.value;
            localStorage.setItem('sitefortab', selectedUrl);
            alert("Panic site updated to: " + tabselectElement.options[tabselectElement.selectedIndex].text);
        });
    }

    // Global Key Listener for Panic
    document.body.addEventListener('keydown', (event) => {
        if (event.key === keybind) {
            const site = localStorage.getItem('sitefortab') || 'https://google.com';
            window.location.href = site;
        }
    });
}
