// Initialize particles
particlesJS("particles-js", {
  "particles": {
    "number": {
      "value": 80,
      "density": {
        "enable": true,
        "value_area": 800
      }
    },
    "color": {
      "value": getComputedStyle(document.documentElement).getPropertyValue('--primary-color') || "#ffffff"
    },
    "shape": {
      "type": "circle"
    },
    "opacity": {
      "value": 0.5
    },
    "size": {
      "value": 3.9,
      "random": true,
      "anim": {
        "enable": true,
        "speed": 14,
        "size_min": 0.1,
        "sync": false
      }
    },
    "line_linked": {
      "enable": false
    },
    "move": {
      "enable": true,
      "speed": 9,
      "direction": "bottom-right"
    }
  },
  "interactivity": {
    "detect_on": "canvas",
    "events": {
      "onhover": {
        "enable": true,
        "mode": "repulse"
      },
      "onclick": {
        "enable": true,
        "mode": "push"
      },
      "resize": true
    }
  },
  "retina_detect": true
});

// Helper
function hexToRgb(hex) {
  hex = hex.replace('#', '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  const bigint = parseInt(hex, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  };
}

function getCurrentPrimaryColor() {
  return getComputedStyle(document.documentElement)
    .getPropertyValue('--primary-color')
    .trim();
}

function updateParticlesColorSmooth(colorHex) {
  if (!window.pJSDom || !window.pJSDom.length) return;

  const pJS = window.pJSDom[0].pJS;
  const target = hexToRgb(colorHex);

  // Update base config (IMPORTANT)
  pJS.particles.color.value = colorHex;

  // Smoothly update existing particles
  pJS.particles.array.forEach(p => {
    if (!p.color || !p.color.rgb) return;

    let steps = 25;
    let count = 0;

    const interval = setInterval(() => {
      p.color.rgb.r += (target.r - p.color.rgb.r) / steps;
      p.color.rgb.g += (target.g - p.color.rgb.g) / steps;
      p.color.rgb.b += (target.b - p.color.rgb.b) / steps;

      count++;
      if (count >= steps) {
        p.color.rgb.r = target.r;
        p.color.rgb.g = target.g;
        p.color.rgb.b = target.b;
        clearInterval(interval);
      }
    }, 16);
  });
}


let resizeTimeout;

window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);

  resizeTimeout = setTimeout(() => {
    const currentColor = getCurrentPrimaryColor();
    updateParticlesColorSmooth(currentColor);
  }, 150);
});


// Settings
const themeSelector = document.getElementById('theme-selector');
const particlesToggle = document.getElementById('particles-toggle');
const particleSpeed = document.getElementById('particle-speed');
const settingsPanel = document.getElementById('settings-panel');
const openSettings = document.getElementById('open-settings');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
    // Toggle the classes
    navLinks.classList.toggle('show');
    hamburger.classList.toggle('active');
    
    // Optional: Switch icon from Bars to X
    const icon = hamburger.querySelector('i');
    if (navLinks.classList.contains('show')) {
        icon.classList.replace('fa-bars', 'fa-times');
    } else {
        icon.classList.replace('fa-times', 'fa-bars');
    }
});

// Close menu if a link is clicked
document.querySelectorAll('#nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('show');
        hamburger.classList.remove('active');
        hamburger.querySelector('i').classList.replace('fa-times', 'fa-bars');
    });
});

if (localStorage.getItem('nightbyte-theme')) {
  const saved = localStorage.getItem('nightbyte-theme').split(',');
  document.documentElement.style.setProperty('--primary-color', saved[0]);
  document.documentElement.style.setProperty('--bg-color', saved[1]);
  document.documentElement.style.setProperty('--header-bg', saved[2]);
  themeSelector.value = localStorage.getItem('nightbyte-theme');
  updateParticlesColorSmooth(saved[0]);
}
if (localStorage.getItem('nightbyte-particles')) {
  particlesToggle.checked = localStorage.getItem('nightbyte-particles') === 'true';
  document.getElementById('particles-js').style.display = particlesToggle.checked ? 'block' : 'none';
}
if (localStorage.getItem('nightbyte-speed')) {
  particleSpeed.value = localStorage.getItem('nightbyte-speed');
  if (window.pJSDom && window.pJSDom.length)
    window.pJSDom[0].pJS.particles.move.speed = particleSpeed.value;
}

// Theme change
themeSelector.addEventListener('change', e => {
  const [primary, bg, header] = e.target.value.split(',');
  document.documentElement.style.setProperty('--primary-color', primary);
  document.documentElement.style.setProperty('--bg-color', bg);
  document.documentElement.style.setProperty('--header-bg', header);
  localStorage.setItem('nightbyte-theme', e.target.value);
  updateParticlesColorSmooth(primary);
});

// Particle toggle and speed
particlesToggle.addEventListener('change', e => {
  document.getElementById('particles-js').style.display = e.target.checked ? 'block' : 'none';
  localStorage.setItem('nightbyte-particles', e.target.checked);
});
particleSpeed.addEventListener('input', e => {
  if (window.pJSDom && window.pJSDom.length)
    window.pJSDom[0].pJS.particles.move.speed = e.target.value;
  localStorage.setItem('nightbyte-speed', e.target.value);
});

// Reset button: fully fixed header
document.getElementById('reset-settings').addEventListener('click', () => {
  const defaultPrimary = "#ffffff";
  const defaultBg = "#000000";
  const defaultHeader = "#2a2a2a";
  const defaultParticles = true;
  const defaultSpeed = 9;
  const root = document.documentElement;

  // Reset particles
  const particlesContainer = document.getElementById('particles-js');
  particlesContainer.style.display = defaultParticles ? 'block' : 'none';
  if (window.pJSDom && window.pJSDom.length) {
    const p = window.pJSDom[0].pJS.particles;
    p.move.speed = defaultSpeed;
    p.array.forEach(particle => particle.color.rgb = {
      r: 255,
      g: 255,
      b: 255
    });
  }

  // Animate primary and background
  const currentPrimary = getComputedStyle(root).getPropertyValue('--primary-color').trim();
  const currentBg = getComputedStyle(root).getPropertyValue('--bg-color').trim();

  function animateColor(varName, fromHex, toHex, duration = 400) {
    const start = Date.now();
    const from = hexToRgb(fromHex);
    const to = hexToRgb(toHex);
    const step = () => {
      let now = Date.now();
      let progress = Math.min((now - start) / duration, 1);
      const r = Math.round(from.r + (to.r - from.r) * progress);
      const g = Math.round(from.g + (to.g - from.g) * progress);
      const b = Math.round(from.b + (to.b - from.b) * progress);
      root.style.setProperty(varName, `rgb(${r},${g},${b})`);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  animateColor('--primary-color', currentPrimary, defaultPrimary);
  animateColor('--bg-color', currentBg, defaultBg);

  // Reset header instantly
  root.style.setProperty('--header-bg', defaultHeader);

  // Update inputs and localStorage
  themeSelector.value = `${defaultPrimary},${defaultBg},${defaultHeader}`;
  particlesToggle.checked = defaultParticles;
  particleSpeed.value = defaultSpeed;
  localStorage.setItem('nightbyte-theme', `${defaultPrimary},${defaultBg},${defaultHeader}`);
  localStorage.setItem('nightbyte-particles', defaultParticles);
  localStorage.setItem('nightbyte-speed', defaultSpeed);
});

// Settings panel toggle
openSettings.addEventListener('click', () => {
  settingsPanel.classList.toggle('open');
});
