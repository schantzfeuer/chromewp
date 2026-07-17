const storageKey = 'dashboardSettings';
const defaultSettings = { bookmarksEnabled: true, historyEnabled: true };

const bookmarksToggle = document.getElementById('bookmarks-toggle');
const historyToggle = document.getElementById('history-toggle');

function loadSettings() {
    chrome.storage.local.get([storageKey], (result) => {
        const settings = { ...defaultSettings, ...(result[storageKey] || {}) };
        bookmarksToggle.checked = settings.bookmarksEnabled !== false;
        historyToggle.checked = settings.historyEnabled !== false;
    });
}

function saveSettings() {
    const settings = {
        bookmarksEnabled: bookmarksToggle.checked,
        historyEnabled: historyToggle.checked
    };

    chrome.storage.local.set({ [storageKey]: settings });
}

bookmarksToggle.addEventListener('change', saveSettings);
historyToggle.addEventListener('change', saveSettings);

loadSettings();
