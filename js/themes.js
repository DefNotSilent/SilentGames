async function loadThemes() {
    const selector = document.getElementById('theme-selector');
    if (!selector) return;

    try {
        const response = await fetch('/json/themes.json');
        const themes = await response.json();
        selector.innerHTML = '';

        themes.forEach(item => {
            if (item.category) {
                // Add a disabled category header
                const label = document.createElement('option');
                label.disabled = true;
                label.textContent = `── ${item.category} ──`;
                label.style.background = "#111";
                label.style.color = "#555";
                selector.appendChild(label);
            } else {
                // Add the actual selectable theme
                const option = document.createElement('option');
                option.value = item.colors;
                option.textContent = item.name;
                selector.appendChild(option);
            }
        });

        // Sync with saved settings
        const saved = localStorage.getItem('nightbyte-settings');
        if (saved) {
            const config = JSON.parse(saved);
            selector.value = config.theme;
        }
    } catch (e) {
        console.error("Theme load failed:", e);
    }
}
