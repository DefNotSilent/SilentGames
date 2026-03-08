/**
 * SilentGames Unified Script v2.2
 * Features: Persistent Themes, Smooth Particles, Privacy Tools, Windowed Settings
 * FIX: Hard-Sync Logic for Particle Speed & Density
 */

// --- CONFIGURATION & GLOBALS ---
const STORAGE_KEY = 'nightbyte-settings';
const UPDATE_VERSION = "v2.6_silent_games_stable";
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

    if (panel.classList.contains('open')) {
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
        particleCount: document.getElementById('particle-count')?.value || "80",
        panicUrl: document.getElementById('tabselect')?.value || "https://classroom.google.com",
        customPanic: document.getElementById('custom-panic-input')?.value || ""
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

function loadSettings() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    const config = JSON.parse(saved);
    
    // UI Sync Logic
    const elements = {
        'theme-selector': config.theme,
        'particles-toggle': config.particlesEnabled,
        'particle-speed': config.particleSpeed,
        'speed-val': config.particleSpeed,
        'particle-count': config.particleCount || "80",
        'count-val': config.particleCount || "80",
        'tabselect': config.panicUrl,
        'custom-panic-input': config.customPanic
    };

    for (const [id, val] of Object.entries(elements)) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.type === 'checkbox') el.checked = val;
        else if (el.tagName === 'SPAN') el.textContent = val;
        else el.value = val;
    }

    // Apply Themes
    if (config.theme?.includes(',')) {
        const [primary, bg, header] = config.theme.split(',');
        document.documentElement.style.setProperty('--primary-color', primary);
        document.documentElement.style.setProperty('--bg-color', bg);
        document.documentElement.style.setProperty('--header-bg', header);
    }

    // Hard-Sync Initial Boot
    setTimeout(() => {
        if (window.pJSDom?.[0]) {
            const pJS = window.pJSDom[0].pJS;
            
            // Overwrite the engine's internal config object
            pJS.particles.move.speed = parseFloat(config.particleSpeed || 9);
            pJS.particles.number.value = parseInt(config.particleCount || 80);
            
            pJS.fn.particlesRefresh();
            updateParticlesColorSmooth(getCurrentPrimaryColor());
            setParticleOpacity(config.particlesEnabled);
        }
    }, 800);
}

// --- 4. INITIALIZATION & LISTENERS ---

document.addEventListener('DOMContentLoaded', () => {
    // Hamburger Logic
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    hamburger?.addEventListener('click', () => {
        navLinks.classList.toggle('show');
        hamburger.classList.toggle('active');
        const icon = hamburger.querySelector('i');
        if (icon) { icon.classList.toggle('fa-bars'); icon.classList.toggle('fa-times'); }
    });

    // Theme Switch
    document.getElementById('theme-selector')?.addEventListener('change', (e) => {
        if (e.target.value.includes(',')) {
            const [p, b, h] = e.target.value.split(',');
            document.documentElement.style.setProperty('--primary-color', p);
            document.documentElement.style.setProperty('--bg-color', b);
            document.documentElement.style.setProperty('--header-bg', h);
            updateParticlesColorSmooth(p);
        }
        saveSettings();
    });

    // Toggle Particles
    document.getElementById('particles-toggle')?.addEventListener('change', (e) => {
        setParticleOpacity(e.target.checked);
        saveSettings();
    });

    // Velocity Slider
    const speedInput = document.getElementById('particle-speed');
    const speedVal = document.getElementById('speed-val');
    speedInput?.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        if (speedVal) speedVal.textContent = val;
        
        if (window.pJSDom?.[0]) {
            // Update live particles AND the internal config object
            window.pJSDom[0].pJS.particles.move.speed = val;
        }
        saveSettings();
    });

    // Density Slider (The "Safe-Refresh" Fix)
    const countInput = document.getElementById('particle-count');
    const countVal = document.getElementById('count-val');
    
    countInput?.addEventListener('input', (e) => {
        if (countVal) countVal.textContent = e.target.value;
    });

    countInput?.addEventListener('change', (e) => {
        if (window.pJSDom?.[0]) {
            const pJS = window.pJSDom[0].pJS;
            const currentSpeed = parseFloat(speedInput?.value || 9);
            const currentCount = parseInt(e.target.value || 80);

            // 1. Force both values into the "Blueprint"
            pJS.particles.move.speed = currentSpeed;
            pJS.particles.number.value = currentCount;

            // 2. Refresh with the new hard-coded config
            pJS.fn.particlesRefresh();
            
            // 3. Re-apply colors after the brief refresh blink
            setTimeout(() => {
                updateParticlesColorSmooth(getCurrentPrimaryColor());
            }, 50);
        }
        saveSettings();
    });

    // Reset Logic
    document.getElementById('reset-settings')?.addEventListener('click', () => {
        localStorage.removeItem(STORAGE_KEY);
        const resetBtn = document.getElementById('reset-settings');
        resetBtn.textContent = "DELETING PROTOCOLS...";
        setTimeout(() => location.reload(), 800);
    });

    loadSettings();
});

// --- 5. ASSETS & LOADER ---

window.addEventListener('load', async () => {
    const loader = document.getElementById('loader-wrapper');
    const tipDisplay = document.getElementById('loader-tip');
    if (tipDisplay) {
        try {
            const res = await fetch('/json/quotes.json');
            const tips = await res.json();
            tipDisplay.textContent = tips[Math.floor(Math.random() * tips.length)];
        } catch (e) { tipDisplay.textContent = "Neural Link Established."; }
    }
    setTimeout(() => loader?.classList.add('loader-hidden'), 800); 
});
