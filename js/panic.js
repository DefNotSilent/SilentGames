/**
 * Silent Games Panic System
 * Handles: JSON Site Loading, Custom URLs, and Keybind Redirection
 */

const PANIC_KEY_STORAGE = 'sitefortab';
const CUSTOM_PANIC_FLAG = 'is-custom-panic';

// 1. Fetch sites from JSON and populate the dropdown
async function loadPanicSites() {
    const selector = document.querySelector('#tabselect');
    if (!selector) return;

    try {
        const response = await fetch('/json/panic.json');
        const sites = await response.json();
        selector.innerHTML = ''; // Clear existing hardcoded options

        sites.forEach(item => {
            if (item.category) {
                // Create a category header using optgroup
                const group = document.createElement('optgroup');
                group.label = item.category;
                selector.appendChild(group);
            } else {
                const option = document.createElement('option');
                option.value = item.url;
                option.textContent = item.name;
                
                // Append to the last created group or directly to selector
                const lastGroup = selector.lastElementChild;
                if (lastGroup && lastGroup.tagName === 'OPTGROUP') {
                    lastGroup.appendChild(option);
                } else {
                    selector.appendChild(option);
                }
            }
        });

        // Always add the Custom URL option at the very bottom
        const customOpt = document.createElement('option');
        customOpt.value = "custom";
        customOpt.textContent = "── Custom URL ──";
        selector.appendChild(customOpt);

        // Sync selection from LocalStorage
        const savedUrl = localStorage.getItem(PANIC_KEY_STORAGE);
        const isCustom = localStorage.getItem(CUSTOM_PANIC_FLAG);
        
        if (isCustom === "true") {
            selector.value = "custom";
            toggleCustomInput(true);
            document.getElementById('custom-panic-input').value = savedUrl;
        } else if (savedUrl) {
            selector.value = savedUrl;
        }

    } catch (e) {
        console.error("Failed to load panic.json:", e);
    }
}

// 2. Setup the save button and key listener
function initPanicSystem() {
    const confirmBtn = document.getElementById('confirm-panic');
    const selector = document.querySelector('#tabselect');
    const customInput = document.getElementById('custom-panic-input');
    
    // Default keybind is backtick (`)
    const keybind = localStorage.getItem('keybind') || '`';

    // Toggle input visibility when dropdown changes
    if (selector) {
        selector.addEventListener('change', (e) => {
            toggleCustomInput(e.target.value === 'custom');
        });
    }

    // Save logic
    if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
            let selectedUrl = selector.value;
            
            if (selectedUrl === 'custom') {
                selectedUrl = customInput.value.trim();
                if (!selectedUrl.startsWith('http')) selectedUrl = 'https://' + selectedUrl;
                localStorage.setItem(CUSTOM_PANIC_FLAG, "true");
            } else {
                localStorage.setItem(CUSTOM_PANIC_FLAG, "false");
            }

            localStorage.setItem(PANIC_KEY_STORAGE, selectedUrl);
            alert("Panic destination secured!");
        });
    }

    // The Redirect Trigger
    document.addEventListener('keydown', (e) => {
        if (e.key === keybind) {
            const destination = localStorage.getItem(PANIC_KEY_STORAGE) || 'https://google.com';
            window.location.href = destination;
        }
    });
}

function toggleCustomInput(show) {
    const input = document.getElementById('custom-panic-input');
    if (input) input.style.display = show ? 'block' : 'none';
}
