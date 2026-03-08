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
            <h2 style="font-size: 24px; margin-top: 0;">System Configuration</h2>

            <div class="setting-section">
                <label class="section-label">Interface Appearance</label>
                <div class="setting-item">
                    <label for="theme-selector">Ghost Signal Theme:</label>
                    <select id="theme-selector"></select>
                </div>
                <div class="setting-item horizontal">
                    <label for="particles-toggle">Particle Engine:</label>
                    <input type="checkbox" id="particles-toggle" checked>
                </div>
                <div class="setting-item">
                    <label for="particle-speed">Animation Velocity: <span id="speed-val">9</span></label>
                    <input type="range" id="particle-speed" min="1" max="20" value="9">
                </div>
                <div class="setting-item">
                    <label for="particle-count">System Density: <span id="count-val">80</span></label>
                    <input type="range" id="particle-count" min="0" max="250" value="80">
                </div>
            </div>

            <div class="setting-section">
                <label class="section-label">Stealth Protocols</label>
                <div class="setting-item flex-btns">
                    <button id="abdisguise" onclick="openAbdisguise()">Open in about:blank</button>
                    <button onclick="datalink()">Data Link</button>
                </div>
                <div class="setting-item">
                    <label>Panic Redirect URL</label>
                    <div class="input-row">
                        <select id="tabselect" onchange="checkCustomPanic(this.value)">
                            <option value="custom">-- Custom URL --</option>
                        </select>
                        <button onclick="confirmtab()" class="confirm-btn">Confirm</button>
                    </div>
                    <input type="text" id="custom-panic-input" placeholder="Paste school link here...">
                </div>
            </div>

            <button id="reset-settings">RESET SYSTEM TO DEFAULT</button>
        </div>
    </div>
    <button id="open-settings" onclick="toggleSettings()"><i class="fas fa-cog"></i></button>
    `;

    // Append the settings to the end of the body
    document.body.insertAdjacentHTML('beforeend', settingsHTML);
}

// Run injection immediately
injectSettings();
