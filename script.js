document.addEventListener("DOMContentLoaded", () => {
    // --- 1. FITUR JAM & TANGGAL LIVE ---
    function updateClock() {
        const now = new Date();
        const timeElement = document.getElementById('time');
        const dateElement = document.getElementById('date');

        // Format Waktu (HH:MM)
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        timeElement.textContent = `${hours}:${minutes}`;

        // Format Tanggal (Contoh: Kamis, 16 Juli 2026)
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateElement.textContent = now.toLocaleDateString('id-ID', options);
    }
    setInterval(updateClock, 1000);
    updateClock(); // Jalankan langsung saat dimuat

    // --- 2. FITUR GALLERY (Unlimited Photos) ---
    const track = document.getElementById('gallery-track');
    const SHUFFLE_INTERVAL = 5 * 60 * 1000; // 5 menit
    let allPhotos = [];

    function loadAndShuffleGallery() {
        fetch(chrome.runtime.getURL('photos.json'))
            .then(response => response.json())
            .then(photos => {
                allPhotos = photos;
                displayGallery();
            })
            .catch(err => {
                console.error("Gagal memuat photos.json. Pastikan file ada dan formatnya benar.", err);
                track.innerHTML = '<div style="color:white; padding:20px;">Belum ada foto/Error membaca JSON</div>';
            });
    }

    function displayGallery() {
        if (allPhotos.length === 0) return;

        // Transisi halus saat ganti foto
        track.style.opacity = 0;

        setTimeout(() => {
            track.innerHTML = '';

            // Acak urutan foto
            let shuffled = [...allPhotos].sort(() => Math.random() - 0.5);
            // Ambil maksimal 30 foto untuk mengisi grid tanpa membuat browser berat
            const displayPhotos = shuffled.slice(0, 30);

            displayPhotos.forEach(photoName => {
                const img = document.createElement('img');
                img.src = chrome.runtime.getURL(`images/${photoName}`);
                img.className = 'gallery-img';
                track.appendChild(img);
            });

            // Munculkan kembali dengan transisi
            track.style.opacity = 1;
        }, 500); // Jeda 0.5 detik untuk animasi memudar
    }

    loadAndShuffleGallery();
    setInterval(displayGallery, SHUFFLE_INTERVAL);

    // --- 3. FITUR BOOKMARKS & HISTORY DENGAN TOGGLE ---
    const storageKey = 'dashboardSettings';
    const defaultSettings = { bookmarksEnabled: true, historyEnabled: true };
    let settings = { ...defaultSettings };
    let bookmarksList = null;
    let historyList = null;

    function applyPanelVisibility() {
        const bookmarksBox = document.getElementById('bookmarks-box');
        const historyBox = document.getElementById('history-box');
        const menuContainer = document.querySelector('.menu-container');

        const showBookmarks = settings.bookmarksEnabled !== false;
        const showHistory = settings.historyEnabled !== false;

        if (bookmarksBox) bookmarksBox.hidden = !showBookmarks;
        if (historyBox) historyBox.hidden = !showHistory;

        if (menuContainer) {
            menuContainer.style.display = (showBookmarks || showHistory) ? 'flex' : 'none';
        }
    }

    function clearBookmarksList() {
        if (bookmarksList) {
            bookmarksList.innerHTML = '';
        }
    }

    function clearHistoryList() {
        if (historyList) {
            historyList.innerHTML = '';
        }
    }

    function flattenBookmarks(nodes) {
        return nodes.reduce((allBookmarks, node) => {
            if (node.url) {
                allBookmarks.push(node);
            }
            if (node.children) {
                allBookmarks.push(...flattenBookmarks(node.children));
            }
            return allBookmarks;
        }, []);
    }

    function loadBookmarks() {
        if (!bookmarksList || settings.bookmarksEnabled === false) {
            clearBookmarksList();
            return;
        }

        bookmarksList.innerHTML = '';
        chrome.bookmarks.getTree((tree) => {
            const allBookmarks = flattenBookmarks(tree);

            if (allBookmarks.length === 0) {
                bookmarksList.innerHTML = '<li><a>Belum ada bookmark.</a></li>';
                return;
            }

            allBookmarks.forEach(bookmark => {
                if (bookmark.url) {
                    const li = document.createElement('li');
                    const a = document.createElement('a');
                    a.href = bookmark.url;
                    a.textContent = bookmark.title || bookmark.url;
                    a.title = bookmark.title || bookmark.url; // Tooltip saat di-hover
                    li.appendChild(a);
                    bookmarksList.appendChild(li);
                }
            });
        });
    }

    function loadHistory() {
        if (!historyList || settings.historyEnabled === false) {
            clearHistoryList();
            return;
        }

        historyList.innerHTML = '';
        chrome.history.search({ text: '', maxResults: 15 }, (historyItems) => {
            if (historyItems.length === 0) {
                historyList.innerHTML = '<li><a>Belum ada history.</a></li>';
                return;
            }

            historyItems.forEach(item => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = item.url;
                a.textContent = item.title || item.url;
                a.title = item.title || item.url;
                li.appendChild(a);
                historyList.appendChild(li);
            });
        });
    }

    function loadSettings() {
        chrome.storage.local.get([storageKey], (result) => {
            settings = { ...defaultSettings, ...(result[storageKey] || {}) };
            applyPanelVisibility();
            loadBookmarks();
            loadHistory();
        });
    }

    chrome.storage.onChanged.addListener((changes, areaName) => {
        if (areaName === 'local' && changes[storageKey]) {
            settings = { ...defaultSettings, ...(changes[storageKey].newValue || {}) };
            applyPanelVisibility();
            loadBookmarks();
            loadHistory();
        }
    });

    bookmarksList = document.getElementById('bookmarks-list');
    historyList = document.getElementById('history-list');

    loadSettings();
});