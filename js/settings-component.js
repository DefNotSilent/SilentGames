/**
 * SilentGames Settings Injector
 * This script injects the Settings Window HTML automatically.
 */

function injectSettings() {
    const settingsHTML = `
    <div id="settings-overlay" onclick="toggleSettings()"></div>

<div id="settings-panel">
    <div class="window-header">
        <div class="header-title"><i class="fas fa-microchip"></i> SYSTEM_CONFIG.EXE</div>
        <button onclick="toggleSettings()" class="win-close">×</button>
    </div>

    <div class="window-body">
        <div class="setting-section">
            <label class="section-label">Interface Appearance</label>
            <div class="setting-item">
                <label for="theme-selector">Choose Theme:</label>
                <select id="theme-selector"></select>
            </div>
            <div class="setting-item horizontal">
                <label for="particles-toggle">Particle Engine:</label>
                <input type="checkbox" id="particles-toggle" checked>
            </div>
            <div class="setting-item">
    <label for="particle-count">
        Particle Count: <span id="count-val" style="color: var(--primary-color); font-weight: bold;">80</span>
    </label>
    <input type="range" id="particle-count" min="0" max="500" value="80">
</div>
            <div class="setting-item">
            <label for="particle-speed"> Animation Velocity: <span id="speed-val" style="color: var(--primary-color); font-weight: bold;">9</span> </label>
            <input type="range" id="particle-speed" min="1" max="50" value="9">
        </div>
        </div>

        <div class="setting-section">
            <label class="section-label">Stealth Protocols</label>
            <div class="setting-item flex-btns">
                <button id="abdisguise">About:Blank</button>
                <button onclick="datalink()">Data Link</button>
            </div>
            <div class="setting-item">
                <label>Tab Disguise</label>
                <select id="faviconDropdown">
                <option disabled selected>Select Disguise</option>
                </select>
            </div>
            <div class="setting-item">
                <label>Panic Redirect</label>
                <div class="input-row">
                    <select id="tabselect" onchange="checkCustomPanic(this.value)">
                        <option value="custom">-- Custom --</option>
                    </select>
                    <button onclick="confirmtab()" class="confirm-btn">Confirm</button>
                </div>
                <input type="text" id="custom-panic-input" placeholder="Paste link..." style="display:none;">
            </div>
            <div class="setting-item">
                <label>Emergency Keybind</label>
                <button id="setkeybind">Set Panic Key</button>
                <div id="output">Current key: none</div>
            </div>
        </div>
        <button id="reset-settings">RESET TO DEFAULT</button>
    </div>
</div>

<button id="open-settings" onclick="toggleSettings()"><i class="fas fa-cog"></i></button>
    `;

    // Append the settings to the end of the body
    document.body.insertAdjacentHTML('beforeend', settingsHTML);
}

// Run injection immediately
injectSettings();
