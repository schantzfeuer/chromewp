document.addEventListener('DOMContentLoaded', () => {
    const STORAGE_KEY = 'dashboardSettings';
    const DEFAULT_SETTINGS = {
        bookmarksEnabled: true,
        historyEnabled: true,
        motionEnabled: true,
        shuffleMinutes: 5,
        effectMode: 'random',
        userName: ''
    };

    const VALID_EFFECTS = new Set([
        'random',
        'flat',
        'floating',
        'polaroid',
        'framed',
        'stacked',
        'glow',
        'film',
        'monochrome',
        'dreamy'
    ]);
    const VALID_INTERVALS = new Set([2, 5, 10, 15, 30]);

    const bookmarksToggle = document.getElementById('bookmarks-toggle');
    const historyToggle = document.getElementById('history-toggle');
    const motionToggle = document.getElementById('motion-toggle');
    const effectMode = document.getElementById('effect-mode');
    const shuffleInterval = document.getElementById('shuffle-interval');
    const usernameInput = document.getElementById('username-input');
    const saveIndicator = document.getElementById('save-indicator');

    let settings = { ...DEFAULT_SETTINGS };
    let indicatorTimer = null;

    function sanitizeSettings(raw = {}) {
        const merged = { ...DEFAULT_SETTINGS, ...raw };
        const minutes = Number(merged.shuffleMinutes);

        return {
            bookmarksEnabled: merged.bookmarksEnabled !== false,
            historyEnabled: merged.historyEnabled !== false,
            motionEnabled: merged.motionEnabled !== false,
            shuffleMinutes: VALID_INTERVALS.has(minutes) ? minutes : DEFAULT_SETTINGS.shuffleMinutes,
            effectMode: VALID_EFFECTS.has(merged.effectMode) ? merged.effectMode : DEFAULT_SETTINGS.effectMode,
            userName: String(merged.userName || '').trim().slice(0, 24)
        };
    }

    function renderSettings() {
        bookmarksToggle.checked = settings.bookmarksEnabled;
        historyToggle.checked = settings.historyEnabled;
        motionToggle.checked = settings.motionEnabled;
        effectMode.value = settings.effectMode;
        shuffleInterval.value = String(settings.shuffleMinutes);
        usernameInput.value = settings.userName;
    }

    function showSaved() {
        clearTimeout(indicatorTimer);
        saveIndicator.textContent = 'Tersimpan';
        saveIndicator.classList.add('visible');
        indicatorTimer = setTimeout(() => {
            saveIndicator.classList.remove('visible');
        }, 1200);
    }

    function saveSettings(patch) {
        settings = sanitizeSettings({ ...settings, ...patch });
        chrome.storage.local.set({ [STORAGE_KEY]: settings }, showSaved);
    }

    bookmarksToggle.addEventListener('change', () => {
        saveSettings({ bookmarksEnabled: bookmarksToggle.checked });
    });

    historyToggle.addEventListener('change', () => {
        saveSettings({ historyEnabled: historyToggle.checked });
    });

    motionToggle.addEventListener('change', () => {
        saveSettings({ motionEnabled: motionToggle.checked });
    });

    effectMode.addEventListener('change', () => {
        saveSettings({ effectMode: effectMode.value });
    });

    shuffleInterval.addEventListener('change', () => {
        saveSettings({ shuffleMinutes: Number(shuffleInterval.value) });
    });

    usernameInput.addEventListener('input', () => {
        saveSettings({ userName: usernameInput.value });
    });

    chrome.storage.local.get([STORAGE_KEY], (result) => {
        settings = sanitizeSettings(result[STORAGE_KEY]);
        renderSettings();
    });
});
