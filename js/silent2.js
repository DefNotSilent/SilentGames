// --- GLOBAL VARIABLES ---
var win;
const UPDATE_VERSION = "v2.0_silent_games"; 

// --- 1. CORE UTILITIES ---
function hexToRgb(hex) {
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    const bigint = parseInt(hex, 16);
    return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
}

function getCurrentPrimaryColor() {
    return getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim() || '#ffffff';
}

// --- 2. PARTICLE ENGINE ---
async function loadParticlesWithTheme() {
    const themeColor = getCurrentPrimaryColor();
    try {
        const response = await fetch('/particlesjs-config.json');
        const config = await response.json();

        // Inject theme color into JSON config
        config.particles.color.value = themeColor;
        if (config.particles.line_linked) config.particles.line_linked.color = themeColor;

        particlesJS('particles-js', config);
    } catch (error) {
        console.error("Error loading particle JSON, falling back to default:", error);
        // Fallback if JSON fails
        particlesJS("particles-js", {
            "particles": {
                "number": { "value": 80 },
                "color": { "value": themeColor },
                "move": { "enable": true, "speed": 9, "direction": "bottom-right" }
            }
        });
    }
}

function updateParticlesColorSmooth(colorHex) {
    if (!window.pJSDom || !window.pJSDom.length) return;
    const pJS = window.pJSDom[0].pJS;
    const target = hexToRgb(colorHex);
    pJS.particles.color.value = colorHex;

    pJS.particles.array.forEach(p => {
        if (!p.color || !p.color.rgb) return;
        p.color.rgb = { ...target }; // Direct update for performance on hosted sites
    });
}

// --- 3. MODALS (DataLink & Update Notification) ---
function datalink() {
    const html = `<!DOCTYPE html><html><head><title>Home | Schoology</title><style>body,html{margin:0;padding:0;height:100%;overflow:hidden;}iframe{border:none;width:100%;height:100%;}</style></head><body><iframe src="${window.location.href}"></iframe></body></html>`;
    const dataUrl = `data:text/html;charset=utf-8,${encodeURIComponent(html)}`;
    const themeColor = getCurrentPrimaryColor();

    const modal = document.createElement('div');
    Object.assign(modal.style, {
        position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(12px)',
        zIndex: '1000000', display: 'flex', justifyContent: 'center', alignItems: 'center'
    });

    modal.innerHTML = `
        <div style="background:#111; padding:35px; border-radius:20px; border:1px solid rgba(255,255,255,0.1); width:90%; max-width:500px; text-align:center; font-family:'Fredoka',sans-serif; color:#fff;">
            <h2 style="color:${themeColor}; text-shadow:0 0 10px ${themeColor};">Stealth Link</h2>
            <p style="opacity:0.6; font-size:14px; margin-bottom:20px;">Copy the link below to open in a new tab.</p>
            <div style="display:flex; gap:10px;">
                <input type="text" id="data-url-input" value="${dataUrl}" readonly style="flex:1; padding:12px; border-radius:10px; border:1px solid #333; background:#000; color:#fff;">
                <button id="copy-btn" style="padding:12px 20px; border-radius:10px; border:none; background:${themeColor}; color:#000; font-weight:bold; cursor:pointer;">Copy</button>
            </div>
            <button id="close-modal" style="margin-top:20px; background:none; border:none; color:#555; cursor:pointer;">Close</button>
        </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('copy-btn').onclick = function() {
        document.getElementById('data-url-input').select();
        document.execCommand('copy');
        this.textContent = "Copied!";
    };
    document.getElementById('close-modal').onclick = () => document.body.removeChild(modal);
}

function showUpdatePopup(force = false) {
    if (!force && localStorage.getItem("seenUpdate") === UPDATE_VERSION) return;
    const themeColor = getCurrentPrimaryColor();

    const overlay = document.createElement('div');
    Object.assign(overlay.style, {
        position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh',
        backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(15px)', zIndex: '2000000',
        display: 'flex', justifyContent: 'center', alignItems: 'center'
    });

    overlay.innerHTML = `
        <div style="background:rgba(20,20,20,0.9); padding:40px; border-radius:24px; border:1px solid ${themeColor}33; width:90%; max-width:400px; text-align:center; color:#fff; font-family:'Fredoka',sans-serif;">
            <div style="font-size:40px; margin-bottom:15px;">🚀</div>
            <h2 style="color:${themeColor}; margin-bottom:10px;">New Updates!</h2>
            <p style="opacity:0.8; margin-bottom:20px;">New games, smoother particles, and custom NightByte themes added! 🎮</p>
            <button id="close-update" style="width:100%; padding:15px; border-radius:12px; border:none; background:${themeColor}; color:#000; font-weight:bold; cursor:pointer;">Got it!</button>
        </div>
    `;
    document.body.appendChild(overlay);

    document.getElementById('close-update').onclick = () => {
        localStorage.setItem("seenUpdate", UPDATE_VERSION);
        document.body.removeChild(overlay);
    };
}

// --- 4. SETTINGS & NAVIGATION ---
document.addEventListener('DOMContentLoaded', () => {
    const themeSelector = document.getElementById('theme-selector');
    const particlesToggle = document.getElementById('particles-toggle');
    const particleSpeed = document.getElementById('particle-speed');
    const settingsPanel = document.getElementById('settings-panel');
    const openSettings = document.getElementById('open-settings');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    // Hamburger Menu
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('show');
        const icon = hamburger.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });

    // Theme Logic
    themeSelector.addEventListener('change', e => {
        const [primary, bg, header] = e.target.value.split(',');
        document.documentElement.style.setProperty('--primary-color', primary);
        document.documentElement.style.setProperty('--bg-color', bg);
        document.documentElement.style.setProperty('--header-bg', header);
        localStorage.setItem('nightbyte-theme', e.target.value);
        updateParticlesColorSmooth(primary);
    });

    // Toggle Settings
    openSettings.addEventListener('click', () => settingsPanel.classList.toggle('open'));

    // Initialize Particles and Modals
    setTimeout(loadParticlesWithTheme, 200);
    setTimeout(showUpdatePopup, 1000);
});
