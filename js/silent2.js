// --- GLOBAL VARIABLES ---
const UPDATE_VERSION = "v2.0_silent_games"; 
const STORAGE_KEY = 'nightbyte-settings';

// --- 1. CORE UTILITIES ---
function hexToRgb(hex) {
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    const bigint = parseInt(hex, 16);
    return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
}

// --- 2. SMOOTH PARTICLE ENGINE ---
function updateParticlesColorSmooth(colorHex) {
    if (!window.pJSDom || !window.pJSDom.length) return;
    const pJS = window.pJSDom[0].pJS;
    const target = hexToRgb(colorHex);

    // Update the config so new particles have the right color
    pJS.particles.color.value = colorHex;

    // Transition existing particles
    pJS.particles.array.forEach(p => {
        if (p.color && p.color.rgb) {
            p.color.rgb = { r: target.r, g: target.g, b: target.b };
        }
    });
}

function setParticleOpacity(opacity) {
    const canvas = document.querySelector('#particles-js canvas');
    if (canvas) {
        canvas.style.transition = 'opacity 0.8s ease';
        canvas.style.opacity = opacity;
    }
}

// --- 3. PERSISTENCE (Saving & Loading) ---
function saveSettings() {
    const settings = {
        theme: document.getElementById('theme-selector').value,
        particlesEnabled: document.getElementById('particles-toggle').checked,
        particleSpeed: document.getElementById('particle-speed').value,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

function loadSettings() {
    const saved = localStorage.getItem(STORAGE_KEY);
    const themeSelector = document.getElementById('theme-selector');
    
    let config;
    if (saved) {
        config = JSON.parse(saved);
        themeSelector.value = config.theme;
        document.getElementById('particles-toggle').checked = config.particlesEnabled;
        document.getElementById('particle-speed').value = config.particleSpeed;
    } else {
        // Defaults if no storage exists
        config = { 
            theme: "#ffffff,#000000,#2a2a2a", 
            particlesEnabled: true, 
            particleSpeed: 9 
        };
    }

    const [primary, bg, header] = config.theme.split(',');
    
    // Apply CSS
    document.documentElement.style.setProperty('--primary-color', primary);
    document.documentElement.style.setProperty('--bg-color', bg);
    document.documentElement.style.setProperty('--header-bg', header);

    // Apply Particles
    setTimeout(() => {
        if (window.pJSDom && window.pJSDom.length) {
            const pJS = window.pJSDom[0].pJS;
            updateParticlesColorSmooth(primary);
            pJS.particles.move.speed = parseFloat(config.particleSpeed);
            setParticleOpacity(config.particlesEnabled ? "1" : "0");
        }
    }, 500); // Small delay to let library load
}

// --- 4. EVENT LISTENERS ---
document.addEventListener('DOMContentLoaded', () => {
    const themeSelector = document.getElementById('theme-selector');
    const particlesToggle = document.getElementById('particles-toggle');
    const speedInput = document.getElementById('particle-speed');

    // Theme Change
    themeSelector.addEventListener('change', (e) => {
        const [primary, bg, header] = e.target.value.split(',');
        document.documentElement.style.setProperty('--primary-color', primary);
        document.documentElement.style.setProperty('--bg-color', bg);
        document.documentElement.style.setProperty('--header-bg', header);
        
        updateParticlesColorSmooth(primary);
        saveSettings();
    });

    // Smooth Opacity Toggle
    particlesToggle.addEventListener('change', (e) => {
        setParticleOpacity(e.target.checked ? "1" : "0");
        saveSettings();
    });

    // Smooth Speed Change
    speedInput.addEventListener('input', (e) => {
        if (window.pJSDom && window.pJSDom.length) {
            window.pJSDom[0].pJS.particles.move.speed = parseFloat(e.target.value);
        }
        saveSettings();
    });

    // Reset Logic
    document.getElementById('reset-settings').addEventListener('click', () => {
        localStorage.removeItem(STORAGE_KEY);
        location.reload();
    });

    loadSettings();
});
