// --- GLOBAL VARIABLES & CONFIG ---
var win;
const UPDATE_VERSION = "v2.0_silent_games"; 
const STORAGE_KEY = 'nightbyte-settings';

// --- 1. THEME ENGINE (Persistence) ---
function applyTheme(primary, bg, header) {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', primary);
    root.style.setProperty('--bg-color', bg);
    root.style.setProperty('--header-bg', header);
    
    // Update Particles smoothly
    updateParticles(primary);
}

function saveSettings() {
    const settings = {
        theme: document.getElementById('theme-selector').value,
        particlesEnabled: document.getElementById('particles-toggle').checked,
        particleSpeed: document.getElementById('particle-speed').value,
        panicUrl: document.getElementById('tabselect').value
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

function loadSettings() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        const config = JSON.parse(saved);
        
        // Apply HTML values
        document.getElementById('theme-selector').value = config.theme;
        document.getElementById('particles-toggle').checked = config.particlesEnabled;
        document.getElementById('particle-speed').value = config.particleSpeed;
        document.getElementById('tabselect').value = config.panicUrl;

        // Apply visual theme
        const [p, b, h] = config.theme.split(',');
        applyTheme(p, b, h);
        
        // Apply Particle visibility
        document.getElementById('particles-js').style.display = config.particlesEnabled ? 'block' : 'none';
    } else {
        // Default Load
        updateParticles("#ffffff");
    }
}

// --- 2. PARTICLE ENGINE (Color Fix) ---
function updateParticles(color) {
    if (!document.getElementById('particles-js')) return;
    
    // Destroy existing particles to force color change
    if (window.pJSDom && window.pJSDom.length > 0) {
        window.pJSDom[0].pJS.fn.vendors.destroypJS();
        window.pJSDom = [];
    }

    const speed = document.getElementById('particle-speed')?.value || 9;

    particlesJS("particles-js", {
        "particles": {
            "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
            "color": { "value": color },
            "shape": { "type": "circle" },
            "opacity": { "value": 0.5 },
            "size": { "value": 3.5, "random": true },
            "line_linked": { "enable": false },
            "move": { 
                "enable": true, 
                "speed": parseFloat(speed), 
                "direction": "bottom-right",
                "random": false,
                "straight": false,
                "out_mode": "out"
            }
        },
        "interactivity": {
            "events": { "onhover": { "enable": true, "mode": "repulse" } }
        },
        "retina_detect": true
    });
}

// --- 3. MODALS & TOOLS ---
function datalink() {
    const html = `<!DOCTYPE html><html><head><title>Home</title><style>body,html{margin:0;padding:0;height:100%;overflow:hidden;}iframe{border:none;width:100%;height:100%;}</style></head><body><iframe src="${window.location.href}"></iframe></body></html>`;
    const dataUrl = `data:text/html;charset=utf-8,${encodeURIComponent(html)}`;
    const themeColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color');

    const modal = document.createElement('div');
    Object.assign(modal.style, {
        position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
        backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: '10000',
        display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'Fredoka, sans-serif'
    });

    modal.innerHTML = `
        <div style="background:#111; padding:30px; border-radius:15px; border:1px solid ${themeColor}; text-align:center; color:white; width:80%; max-width:450px;">
            <h2 style="color:${themeColor}">Data Link Ready</h2>
            <input type="text" value="${dataUrl}" readonly style="width:100%; padding:10px; margin:15px 0; background:#000; border:1px solid #333; color:white; border-radius:5px;">
            <button onclick="navigator.clipboard.writeText('${dataUrl}'); this.innerText='Copied!'" style="background:${themeColor}; color:black; border:none; padding:10px 20px; border-radius:5px; font-weight:bold; cursor:pointer;">Copy Link</button>
            <br><button onclick="this.parentElement.parentElement.remove()" style="margin-top:15px; background:none; border:none; color:#777; cursor:pointer;">Close</button>
        </div>
    `;
    document.body.appendChild(modal);
}

// --- 4. INITIALIZATION & EVENT LISTENERS ---
document.addEventListener('DOMContentLoaded', () => {
    const themeSelector = document.getElementById('theme-selector');
    const particlesToggle = document.getElementById('particles-toggle');
    const speedInput = document.getElementById('particle-speed');
    const openBtn = document.getElementById('open-settings');
    const panel = document.getElementById('settings-panel');

    // Toggle Panel
    openBtn?.addEventListener('click', () => panel.classList.toggle('open'));

    // Theme Change
    themeSelector.addEventListener('change', (e) => {
        const [p, b, h] = e.target.value.split(',');
        applyTheme(p, b, h);
        saveSettings();
    });

    // Particle Toggle
    particlesToggle.addEventListener('change', (e) => {
        document.getElementById('particles-js').style.display = e.target.checked ? 'block' : 'none';
        saveSettings();
    });

    // Speed Change
    speedInput.addEventListener('input', () => {
        const primary = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();
        updateParticles(primary);
        saveSettings();
    });

    // Reset
    document.getElementById('reset-settings').addEventListener('click', () => {
        localStorage.removeItem(STORAGE_KEY);
        location.reload();
    });

    // About:Blank Logic
    document.getElementById('abcloak').onclick = () => {
        let win = window.open();
        win.document.body.innerHTML = `<iframe src="${window.location.href}" style="border:none;width:100%;height:100vh;margin:0;"></iframe>`;
        window.location.replace("https://google.com");
    };

    // LOAD SAVED DATA
    loadSettings();
});
