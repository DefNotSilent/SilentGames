/**
 * NightByte Unified Script
 * Features: Persistent Themes, Smooth Particles, Privacy Tools, Update System
 */

// --- CONFIGURATION & GLOBALS ---
const STORAGE_KEY = 'nightbyte-settings';
const UPDATE_VERSION = "v2.0_silent_games";
var win; // For about:blank cloak

// --- 1. CORE UTILITIES ---

// Converts Hex to RGB for smooth particle transitions
function hexToRgb(hex) {
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    const bigint = parseInt(hex, 16);
    return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
}

// Gets the current primary color from CSS variables
function getCurrentPrimaryColor() {
    return getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim() || '#ff0055';
}

// --- 2. PARTICLE ENGINE (Smooth Transitions) ---

function updateParticlesColorSmooth(colorHex) {
    if (!window.pJSDom || !window.pJSDom.length) return;
    const pJS = window.pJSDom[0].pJS;
    const target = hexToRgb(colorHex);

    // Update internal config so new particles use the right color
    pJS.particles.color.value = colorHex;

    // Update existing particles instantly without resetting positions
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

// --- 3. SETTINGS & PERSISTENCE ---

function saveSettings() {
    const settings = {
        theme: document.getElementById('theme-selector').value,
        particlesEnabled: document.getElementById('particles-toggle').checked,
        particleSpeed: document.getElementById('particle-speed').value,
        panicUrl: document.getElementById('tabselect').value,
        lastUpdateSeen: localStorage.getItem('seenUpdate')
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

function loadSettings() {
    const saved = localStorage.getItem(STORAGE_KEY);
    const themeSelector = document.getElementById('theme-selector');
    
    let config;
    if (saved) {
        config = JSON.parse(saved);
        // Sync HTML elements with saved data
        if(themeSelector) themeSelector.value = config.theme;
        document.getElementById('particles-toggle').checked = config.particlesEnabled;
        document.getElementById('particle-speed').value = config.particleSpeed;
        document.getElementById('tabselect').value = config.panicUrl;
    } else {
        // Defaults
        config = { 
            theme: "#ff0055,#0d0221,#261447", 
            particlesEnabled: true, 
            particleSpeed: 9,
            panicUrl: "https://classroom.google.com"
        };
    }
    
    const [primary, bg, header] = config.theme.split(',');
    
    // Apply CSS Variables
    document.documentElement.style.setProperty('--primary-color', primary);
    document.documentElement.style.setProperty('--bg-color', bg);
    document.documentElement.style.setProperty('--header-bg', header);

    // Initialize/Update Particles
    setTimeout(() => {
        if (window.pJSDom && window.pJSDom.length) {
            const pJS = window.pJSDom[0].pJS;
            updateParticlesColorSmooth(primary);
            pJS.particles.move.speed = parseFloat(config.particleSpeed);
            setParticleOpacity(config.particlesEnabled);
        }
    }, 500);
}

// --- 4. INITIALIZATION ---

document.addEventListener('DOMContentLoaded', () => {
    const themeSelector = document.getElementById('theme-selector');
    const particlesToggle = document.getElementById('particles-toggle');
    const speedInput = document.getElementById('particle-speed');
    const settingsPanel = document.getElementById('settings-panel');
    const openSettings = document.getElementById('open-settings');
    const resetBtn = document.getElementById('reset-settings');

    // Toggle Panel
    openSettings?.addEventListener('click', () => {
        settingsPanel.classList.toggle('open');
    });

    // Theme Selector
    themeSelector?.addEventListener('change', (e) => {
        const [primary, bg, header] = e.target.value.split(',');
        document.documentElement.style.setProperty('--primary-color', primary);
        document.documentElement.style.setProperty('--bg-color', bg);
        document.documentElement.style.setProperty('--header-bg', header);
        updateParticlesColorSmooth(primary);
        saveSettings();
    });

    // Particles Toggle
    particlesToggle?.addEventListener('change', (e) => {
        setParticleOpacity(e.target.checked);
        saveSettings();
    });

    // Speed Input
    speedInput?.addEventListener('input', (e) => {
        if (window.pJSDom && window.pJSDom.length) {
            window.pJSDom[0].pJS.particles.move.speed = parseFloat(e.target.value);
        }
        saveSettings();
    });

    // Reset Button
    resetBtn?.addEventListener('click', () => {
        localStorage.removeItem(STORAGE_KEY);
        location.reload();
    });

    /* About:Blank Cloak
    document.getElementById('abcloak').onclick = () => {
        let win = window.open();
        win.document.body.style.margin = '0';
        win.document.body.style.height = '100vh';
        let iframe = win.document.createElement('iframe');
        Object.assign(iframe.style, { border: 'none', width: '100%', height: '100%' });
        iframe.src = window.location.href;
        win.document.body.appendChild(iframe);
        window.location.replace("https://google.com");
    }; */

    // FINAL BOOTUP
    loadThemes();
    loadSettings();
    loadPanicSites(); // New
    initPanicSystem(); // New
    setTimeout(showUpdatePopup, 1500);
});

// Extra fix for particles after JSON load
window.addEventListener('load', () => {
    setTimeout(() => {
        const color = getCurrentPrimaryColor();
        updateParticlesColorSmooth(color);
    }, 800);
});
