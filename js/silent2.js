/**
 * SilentGames Unified Script v2.1
 * Features: Persistent Themes, Smooth Particles, Privacy Tools, Windowed Settings
 */

const STORAGE_KEY = 'nightbyte-settings';
const UPDATE_VERSION = "v2.1_silent_games_fix";
var win; 

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
    pJS.particles.array.forEach(p => {
        if (p.color && p.color.rgb) p.color.rgb = { r: target.r, g: target.g, b: target.b };
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
        theme: document.getElementById('theme-selector').value,
        particlesEnabled: document.getElementById('particles-toggle').checked,
        particleSpeed: document.getElementById('particle-speed').value,
        panicUrl: document.getElementById('tabselect').value,
        customPanic: document.getElementById('custom-panic-input').value,
        keybind: localStorage.getItem('keybind') || 'none'
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

function loadSettings() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return applyDefaults();

    const config = JSON.parse(saved);
    
    // Sync UI Elements
    if(document.getElementById('theme-selector')) document.getElementById('theme-selector').value = config.theme;
    document.getElementById('particles-toggle').checked = config.particlesEnabled;
    document.getElementById('particle-speed').value = config.particleSpeed;
    document.getElementById('tabselect').value = config.panicUrl;
    document.getElementById('custom-panic-input').value = config.customPanic || "";

    // Apply Visuals
    const [primary, bg, header] = config.theme.split(',');
    document.documentElement.style.setProperty('--primary-color', primary);
    document.documentElement.style.setProperty('--bg-color', bg);
    document.documentElement.style.setProperty('--header-bg', header);

    setTimeout(() => {
        if (window.pJSDom && window.pJSDom.length) {
            const pJS = window.pJSDom[0].pJS;
            updateParticlesColorSmooth(primary);
            pJS.particles.move.speed = parseFloat(config.particleSpeed);
            setParticleOpacity(config.particlesEnabled);
        }
    }, 500);
}

function applyDefaults() {
    document.documentElement.style.setProperty('--primary-color', '#ff0055');
    document.documentElement.style.setProperty('--bg-color', '#0d0221');
    document.documentElement.style.setProperty('--header-bg', '#261447');
}

// --- 4. INITIALIZATION ---

document.addEventListener('DOMContentLoaded', () => {
    // 1. Navigation / Hamburger
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    hamburger?.addEventListener('click', () => {
        navLinks.classList.toggle('show');
        hamburger.classList.toggle('active');
        const icon = hamburger.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });

    // 2. Settings Listeners
    document.getElementById('theme-selector')?.addEventListener('change', (e) => {
        const [primary, bg, header] = e.target.value.split(',');
        document.documentElement.style.setProperty('--primary-color', primary);
        document.documentElement.style.setProperty('--bg-color', bg);
        document.documentElement.style.setProperty('--header-bg', header);
        updateParticlesColorSmooth(primary);
        saveSettings();
    });

    document.getElementById('particles-toggle')?.addEventListener('change', () => {
        setParticleOpacity(document.getElementById('particles-toggle').checked);
        saveSettings();
    });

    document.getElementById('particle-speed')?.addEventListener('input', (e) => {
        if (window.pJSDom?.[0]) window.pJSDom[0].pJS.particles.move.speed = parseFloat(e.target.value);
        saveSettings();
    });

    // 3. Reset Button
    document.getElementById('reset-settings')?.addEventListener('click', () => {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem('keybind');
        
        const btn = document.getElementById('reset-settings');
        btn.textContent = "SYSTEM RESETTING...";
        setTimeout(() => location.reload(), 1000);
    });

    // 4. Start Systems
    loadSettings();
    setTimeout(showUpdatePopup, 1500);
});

// Load Loader Tips
window.addEventListener('load', async () => {
    const tipDisplay = document.getElementById('loader-tip');
    try {
        const response = await fetch('/json/quotes.json');
        const tips = await response.json();
        if (tipDisplay) tipDisplay.textContent = tips[Math.floor(Math.random() * tips.length)];
    } catch (e) {
        if (tipDisplay) tipDisplay.textContent = "Protocol Initialized.";
    }
    setTimeout(() => document.getElementById('loader-wrapper')?.classList.add('loader-hidden'), 800); 
});
