/**
 * SilentGames Unified Script v2.2
 * Features: Persistent Themes, Smooth Particles, Privacy Tools, Windowed Settings
 * Includes: Live Slider Value Display
 */

// --- CONFIGURATION & GLOBALS ---
const STORAGE_KEY = 'nightbyte-settings';
const UPDATE_VERSION = "v2.2_silent_games";
var win; // For about:blank cloak

// --- 1. CORE UTILITIES ---

function hexToRgb(hex) {
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    const bigint = parseInt(hex, 16);
    return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
}

function getCurrentPrimaryColor() {
    return getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim() || '#ff0055';
}

// --- 2. PARTICLE ENGINE ---

function updateParticlesColorSmooth(colorHex) {
    if (!window.pJSDom || !window.pJSDom.length) return;
    const pJS = window.pJSDom[0].pJS;
    const target = hexToRgb(colorHex);

    pJS.particles.color.value = colorHex;
    if (pJS.particles.line_linked) pJS.particles.line_linked.color = colorHex;

    pJS.particles.array.forEach(p => {
        if (p.color && p.color.rgb) {
            p.color.rgb = { r: target.r, g: target.g, b: target.b };
        }
    });
}

function setParticleOpacity(enabled) {
    const canvas = document.querySelector('#particles-js canvas');
    if (canvas) {
        canvas.style.transition = 'opacity 0.8s ease';
        canvas.style.opacity = enabled ? "1" : "0";
    }
}

// --- 3. SETTINGS & WINDOW LOGIC ---

function toggleSettings() {
    const panel = document.getElementById('settings-panel');
    const overlay = document.getElementById('settings-overlay');
    
    if (!panel || !overlay) return;

    const isOpen = panel.classList.contains('open');
    
    if (isOpen) {
        panel.classList.remove('open');
        overlay.style.display = 'none';
    } else {
        panel.classList.add('open');
        overlay.style.display = 'block';
    }
}

function saveSettings() {
    const settings = {
        theme: document.getElementById('theme-selector')?.value || "",
        particlesEnabled: document.getElementById('particles-toggle')?.checked ?? true,
        particleSpeed: document.getElementById('particle-speed')?.value || "9",
        panicUrl: document.getElementById('tabselect')?.value || "https://classroom.google.com",
        customPanic: document.getElementById('custom-panic-input')?.value || ""
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

function loadSettings() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    const config = JSON.parse(saved);
    
    const themeEl = document.getElementById('theme-selector');
    const partToggle = document.getElementById('particles-toggle');
    const speedInput = document.getElementById('particle-speed');
    const speedVal = document.getElementById('speed-val'); // New number display
    const panicSelect = document.getElementById('tabselect');
    const customInput = document.getElementById('custom-panic-input');

    if (themeEl) themeEl.value = config.theme;
    if (partToggle) partToggle.checked = config.particlesEnabled;
    if (speedInput) speedInput.value = config.particleSpeed;
    if (speedVal) speedVal.textContent = config.particleSpeed; // Sync text on load
    if (panicSelect) panicSelect.value = config.panicUrl;
    if (customInput) customInput.value = config.customPanic || "";

    if (config.theme && config.theme.includes(',')) {
        const [primary, bg, header] = config.theme.split(',');
        document.documentElement.style.setProperty('--primary-color', primary);
        document.documentElement.style.setProperty('--bg-color', bg);
        document.documentElement.style.setProperty('--header-bg', header);
    }

    setTimeout(() => {
        if (window.pJSDom && window.pJSDom.length) {
            const pJS = window.pJSDom[0].pJS;
            updateParticlesColorSmooth(getCurrentPrimaryColor());
            pJS.particles.move.speed = parseFloat(config.particleSpeed);
            setParticleOpacity(config.particlesEnabled);
        }
    }, 500);
}

// --- 4. INITIALIZATION ---

document.addEventListener('DOMContentLoaded', () => {
    // Hamburger Menu Logic
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    hamburger?.addEventListener('click', () => {
        navLinks.classList.toggle('show');
        hamburger.classList.toggle('active');
        const icon = hamburger.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        }
    });

    // Theme Change Listener
    document.getElementById('theme-selector')?.addEventListener('change', (e) => {
        if (e.target.value.includes(',')) {
            const [primary, bg, header] = e.target.value.split(',');
            document.documentElement.style.setProperty('--primary-color', primary);
            document.documentElement.style.setProperty('--bg-color', bg);
            document.documentElement.style.setProperty('--header-bg', header);
            updateParticlesColorSmooth(primary);
        }
        saveSettings();
    });

    // Particle Toggle Listener
    document.getElementById('particles-toggle')?.addEventListener('change', (e) => {
        setParticleOpacity(e.target.checked);
        saveSettings();
    });

    // Speed Slider Listener (Updated with Display Logic)
    const speedInput = document.getElementById('particle-speed');
    const speedVal = document.getElementById('speed-val');

    speedInput?.addEventListener('input', (e) => {
        // 1. Update the number text next to the label
        if (speedVal) speedVal.textContent = e.target.value;

        // 2. Update the actual particles
        if (window.pJSDom?.[0]) {
            window.pJSDom[0].pJS.particles.move.speed = parseFloat(e.target.value);
        }
        
        // 3. Auto-save
        saveSettings();
    });

    // Reset Button Logic
    document.getElementById('reset-settings')?.addEventListener('click', () => {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem('keybind');
        const resetBtn = document.getElementById('reset-settings');
        resetBtn.textContent = "REBOOTING...";
        resetBtn.style.background = "#2ecc71";
        setTimeout(() => location.reload(), 800);
    });

    // Run Startup Functions
    if (typeof loadThemes === "function") loadThemes();
    loadSettings();
    if (typeof loadPanicSites === "function") loadPanicSites();
    if (typeof initPanicSystem === "function") initPanicSystem();
    
    if (typeof showUpdatePopup === "function") {
        setTimeout(showUpdatePopup, 1500);
    }
});

// --- 5. LOADER & EXTERNAL ASSETS ---

window.addEventListener('load', async () => {
    const loader = document.getElementById('loader-wrapper');
    const tipDisplay = document.getElementById('loader-tip');

    if (tipDisplay) {
        try {
            const response = await fetch('/json/quotes.json');
            const tips = await response.json();
            tipDisplay.textContent = tips[Math.floor(Math.random() * tips.length)];
        } catch (e) {
            tipDisplay.textContent = "Protocol Initialized.";
        }
    }

    setTimeout(() => {
        if (loader) loader.classList.add('loader-hidden');
    }, 800); 
});

window.addEventListener('load', () => {
    setTimeout(() => {
        updateParticlesColorSmooth(getCurrentPrimaryColor());
    }, 1000);
});
