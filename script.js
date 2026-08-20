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

    let settings = { ...DEFAULT_SETTINGS };
    let shuffleTimer = null;
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    /* ============================================================
       UTIL ACAK
       ============================================================ */
    function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function randomFloat(min, max) {
        return Math.random() * (max - min) + min;
    }

    function clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    function shuffleArray(arr) {
        const copy = [...arr];
        for (let i = copy.length - 1; i > 0; i--) {
            const j = randomInt(0, i);
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
    }

    function pickWeighted(options) {
        const total = options.reduce((sum, o) => sum + o.weight, 0);
        let roll = Math.random() * total;
        for (const option of options) {
            roll -= option.weight;
            if (roll <= 0) return option;
        }
        return options[options.length - 1];
    }

    /* ============================================================
       1. JAM, TANGGAL & SAPAAN
       ============================================================ */
    function getGreeting(hour) {
        if (hour < 4) return 'Selamat Malam';
        if (hour < 11) return 'Selamat Pagi';
        if (hour < 15) return 'Selamat Siang';
        if (hour < 19) return 'Selamat Sore';
        return 'Selamat Malam';
    }

    function updateClock() {
        const now = new Date();
        const hhEl = document.getElementById('time-hh');
        const mmEl = document.getElementById('time-mm');
        const dateEl = document.getElementById('date');
        const greetingEl = document.getElementById('greeting');

        hhEl.textContent = String(now.getHours()).padStart(2, '0');
        mmEl.textContent = String(now.getMinutes()).padStart(2, '0');

        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateEl.textContent = now.toLocaleDateString('id-ID', options);

        const greeting = getGreeting(now.getHours());
        greetingEl.textContent = settings.userName ? `${greeting}, ${settings.userName}` : greeting;
    }

    setInterval(updateClock, 30 * 1000); // detik tidak perlu diperbarui tiap 1 detik
    updateClock();

    /* ============================================================
       2. KOLASE FOTO — BENTO GRID DENGAN BANYAK GAYA TATANAN
       ============================================================
       Setiap kali kolase disegarkan, salah satu "gaya tatanan" di
       bawah ini dipilih secara acak, lalu jumlah kolom, ukuran ubin,
       dan susunan foto turut diacak. Hasilnya, tampilan latar tidak
       pernah terasa sama dua kali. */
    const track = document.getElementById('gallery-track');
    const galleryContainer = document.getElementById('gallery-container');
    const MAX_DISPLAYED_PHOTOS = 35;
    const MIN_DISPLAYED_PHOTOS = 15;
    const VALID_EFFECTS = new Set([
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
    let allPhotos = [];

    // Setiap preset membawa daftar "aksen" — gaya hias opsional untuk
    // ubinnya (lihat style.css bagian aksen kolase). Dalam mode acak satu
    // aksen dipilih berbobot; pengguna juga bisa mengunci efek tertentu
    // lewat popup pengaturan.
    const LAYOUT_PRESETS = [
        {
            name: 'mosaic-halus',
            cols: [14, 20],
            rowAspect: [0.55, 0.8],
            gap: 4,
            spans: [
                { c: 1, r: 1, weight: 78 },
                { c: 2, r: 1, weight: 12 },
                { c: 1, r: 2, weight: 8 },
                { c: 2, r: 2, weight: 2 }
            ],
            // Ubinnya sangat kecil, jadi aksen dengan bingkai/padding tebal
            // (polaroid, tumpukan) tidak akan terbaca — cukup polos atau kilau tipis.
            accents: [
                { name: 'flat', weight: 40 },
                { name: 'glow', weight: 20 },
                { name: 'monochrome', weight: 20 },
                { name: 'film', weight: 20 }
            ]
        },
        {
            name: 'bento-campur',
            cols: [7, 10],
            rowAspect: [0.75, 1.05],
            gap: 6,
            spans: [
                { c: 1, r: 1, weight: 44 },
                { c: 2, r: 1, weight: 18 },
                { c: 1, r: 2, weight: 18 },
                { c: 2, r: 2, weight: 16 },
                { c: 3, r: 2, weight: 4 }
            ],
            accents: [
                { name: 'flat', weight: 20 },
                { name: 'framed', weight: 20 },
                { name: 'polaroid', weight: 20 },
                { name: 'film', weight: 20 },
                { name: 'dreamy', weight: 20 }
            ]
        },
        {
            name: 'dinding-fitur',
            cols: [4, 6],
            rowAspect: [0.9, 1.2],
            gap: 8,
            spans: [
                { c: 2, r: 2, weight: 42 },
                { c: 2, r: 1, weight: 24 },
                { c: 1, r: 2, weight: 20 },
                { c: 1, r: 1, weight: 14 }
            ],
            // Ubin besar & gap lega — cocok untuk pigura krisp atau efek tumpukan.
            accents: [
                { name: 'framed', weight: 30 },
                { name: 'stacked', weight: 25 },
                { name: 'flat', weight: 15 },
                { name: 'film', weight: 15 },
                { name: 'dreamy', weight: 15 }
            ]
        },
        {
            name: 'baris-vertikal',
            cols: [9, 13],
            rowAspect: [0.45, 0.65],
            gap: 5,
            spans: [
                { c: 1, r: 1, weight: 38 },
                { c: 1, r: 2, weight: 32 },
                { c: 1, r: 3, weight: 15 },
                { c: 2, r: 2, weight: 15 }
            ],
            accents: [
                { name: 'flat', weight: 30 },
                { name: 'glow', weight: 20 },
                { name: 'framed', weight: 15 },
                { name: 'monochrome', weight: 20 },
                { name: 'dreamy', weight: 15 }
            ]
        },
        {
            name: 'kartu-melayang',
            cols: [8, 11],
            rowAspect: [0.85, 1.05],
            gap: 12,
            spans: [
                { c: 1, r: 1, weight: 55 },
                { c: 2, r: 2, weight: 25 },
                { c: 2, r: 1, weight: 20 }
            ],
            // Gaya ciri khasnya sendiri — tetap dipertahankan apa adanya.
            accents: [
                { name: 'floating', weight: 100 }
            ]
        },
        {
            name: 'halftone-mikro',
            cols: [20, 26],
            rowAspect: [0.55, 0.7],
            gap: 3,
            spans: [
                { c: 1, r: 1, weight: 92 },
                { c: 1, r: 2, weight: 8 }
            ],
            accents: [
                { name: 'flat', weight: 35 },
                { name: 'glow', weight: 20 },
                { name: 'monochrome', weight: 25 },
                { name: 'film', weight: 20 }
            ]
        },
        {
            name: 'kolom-editorial',
            cols: [3, 4],
            rowAspect: [1.7, 2.3],
            gap: 10,
            spans: [
                { c: 1, r: 2, weight: 45 },
                { c: 1, r: 3, weight: 25 },
                { c: 1, r: 1, weight: 20 },
                { c: 2, r: 2, weight: 10 }
            ],
            accents: [
                { name: 'polaroid', weight: 30 },
                { name: 'framed', weight: 20 },
                { name: 'flat', weight: 15 },
                { name: 'film', weight: 20 },
                { name: 'dreamy', weight: 15 }
            ]
        },
        {
            // Papan tempel — kolom & baris sedang dengan gap lega, seolah
            // foto-foto ditempel/dijepit langsung ke dinding gabus.
            name: 'papan-tempel',
            cols: [6, 9],
            rowAspect: [0.85, 1.1],
            gap: 14,
            spans: [
                { c: 1, r: 1, weight: 60 },
                { c: 2, r: 1, weight: 20 },
                { c: 1, r: 2, weight: 15 },
                { c: 2, r: 2, weight: 5 }
            ],
            accents: [
                { name: 'polaroid', weight: 35 },
                { name: 'floating', weight: 25 },
                { name: 'flat', weight: 10 },
                { name: 'film', weight: 15 },
                { name: 'dreamy', weight: 15 }
            ]
        }
    ];

    function pickPreset() {
        return LAYOUT_PRESETS[randomInt(0, LAYOUT_PRESETS.length - 1)];
    }

    function pickAccent(preset) {
        return pickWeighted(preset.accents);
    }

    function resolveAccent(preset) {
        const requested = settings.effectMode || 'random';
        if (requested === 'random') return pickAccent(preset);
        return { name: VALID_EFFECTS.has(requested) ? requested : 'flat' };
    }

    function calculateGalleryGeometry(preset, viewportW, viewportH) {
        const aspect = randomFloat(preset.rowAspect[0], preset.rowAspect[1]);
        const weightSum = preset.spans.reduce((sum, span) => sum + span.weight, 0);
        const avgArea = preset.spans.reduce((sum, span) => sum + span.c * span.r * span.weight, 0) / weightSum;

        let cols = randomInt(preset.cols[0], preset.cols[1]);
        let rowPx = 0;
        let rowsNeeded = 0;
        let idealTileCount = Infinity;

        // Dense presets can require hundreds of DOM nodes. Gradually reduce
        // column density until the viewport can be covered with at most 25 tiles.
        while (cols >= 3) {
            const colWidth = viewportW / cols;
            rowPx = Math.max(40, Math.round(colWidth * aspect));
            rowsNeeded = Math.ceil(viewportH / rowPx) + 2;
            idealTileCount = Math.ceil(((cols * rowsNeeded) / avgArea) * 1.2);
            if (idealTileCount <= MAX_DISPLAYED_PHOTOS || cols === 3) break;
            cols -= 1;
        }

        // Keep enough rows visible even when an editorial preset calculates a
        // very large row from the viewport width. Extra tiles can extend
        // slightly beyond the edges, but the visible area must remain dense.
        const minimumVisibleRows = 5;
        const maximumRowPx = Math.max(72, Math.floor(viewportH / minimumVisibleRows));
        rowPx = Math.min(rowPx, maximumRowPx);
        rowsNeeded = Math.ceil(viewportH / rowPx) + 2;
        idealTileCount = Math.ceil(((cols * rowsNeeded) / avgArea) * 1.2);

        return {
            cols,
            rowPx,
            tileCount: clamp(idealTileCount, MIN_DISPLAYED_PHOTOS, MAX_DISPLAYED_PHOTOS)
        };
    }

    function buildCollage() {
        if (allPhotos.length === 0) return;

        const preset = pickPreset();
        const accent = resolveAccent(preset);
        const viewportW = galleryContainer.clientWidth || window.innerWidth;
        const viewportH = galleryContainer.clientHeight || window.innerHeight;
        const geometry = calculateGalleryGeometry(preset, viewportW, viewportH);
        const { cols, rowPx, tileCount } = geometry;

        track.style.setProperty('--gallery-cols', cols);
        track.style.setProperty('--gallery-row', `${rowPx}px`);
        track.style.setProperty('--gallery-gap', `${preset.gap}px`);
        track.dataset.preset = preset.name;
        track.dataset.style = accent.name;

        // Never render more than 25 photo tiles. If the collection is smaller
        // than the required tile count, keep reshuffling and reusing its photos
        // until enough entries exist to fill the wallpaper.
        const pool = [];
        while (pool.length < tileCount) pool.push(...shuffleArray(allPhotos));
        const selection = pool.slice(0, tileCount);

        const fragment = document.createDocumentFragment();

        selection.forEach((photoName, idx) => {
            const span = pickWeighted(preset.spans);
            const isTall = span.r > span.c;

            const tile = document.createElement('div');
            tile.className = 'gallery-tile';
            tile.style.gridColumn = `span ${Math.min(span.c, cols)}`;
            tile.style.gridRow = `span ${span.r}`;

            // Ubin masuk secara bergelombang, bukan serentak.
            const inDelay = Math.min(idx * 10, 550) + randomInt(0, 40);
            tile.style.setProperty('--tile-in-delay', `${inDelay}ms`);
            // Tiap ubin melayang pelan dengan ritme sedikit berbeda, biar
            // kolase terasa hidup tanpa terlihat serempak.
            tile.style.setProperty('--tile-drift-delay', `${randomFloat(0, 4).toFixed(2)}s`);
            tile.style.setProperty('--tile-drift-duration', `${randomInt(7, 12)}s`);

            // Detail khusus tiap aksen: kemiringan kartu/polaroid, kemiringan
            // tumpukan foto di belakang, atau jeda kilau — supaya efeknya
            // tidak seragam di semua ubin.
            if (accent.name === 'floating') {
                tile.style.setProperty('--tile-rotate', `${randomFloat(-6, 6).toFixed(1)}deg`);
            } else if (accent.name === 'polaroid') {
                tile.style.setProperty('--tile-rotate', `${randomFloat(-4, 4).toFixed(1)}deg`);
                tile.style.setProperty('--tile-sheen-delay', `${randomFloat(0, 6).toFixed(2)}s`);
            } else if (accent.name === 'stacked') {
                tile.style.setProperty('--tile-stack-rotate-1', `${randomFloat(-7, -3).toFixed(1)}deg`);
                tile.style.setProperty('--tile-stack-rotate-2', `${randomFloat(3, 7).toFixed(1)}deg`);
            } else if (accent.name === 'glow') {
                tile.style.setProperty('--tile-glow-delay', `${randomFloat(0, 5).toFixed(2)}s`);
            } else if (accent.name === 'film') {
                tile.style.setProperty('--tile-film-shift', `${randomFloat(-8, 8).toFixed(1)}%`);
            } else if (accent.name === 'dreamy') {
                tile.style.setProperty('--tile-dream-glow', `${randomFloat(0.12, 0.28).toFixed(2)}`);
            }

            // Titik fokus crop & titik awal zoom disatukan, supaya Ken Burns
            // selalu menarik perhatian ke bagian foto yang sama dengan yang
            // dipakai untuk memotong gambar — bukan dua titik acak berbeda.
            const focusX = randomInt(35, 65);
            const focusY = isTall ? randomInt(28, 45) : randomInt(40, 60);

            const inner = document.createElement('div');
            inner.className = 'tile-inner';

            const img = document.createElement('img');
            img.src = chrome.runtime.getURL(`images/${photoName}`);
            img.loading = 'lazy';
            img.decoding = 'async';
            img.alt = '';
            img.style.setProperty('--tile-focus-x', `${focusX}%`);
            img.style.setProperty('--tile-focus-y', `${focusY}%`);
            img.style.setProperty('--tile-origin', `${focusX}% ${focusY}%`);
            img.style.setProperty('--tile-duration', `${randomInt(20, 36)}s`);
            img.style.setProperty('--tile-delay', `-${randomInt(0, 14)}s`);
            img.style.setProperty('--tile-gray', `${randomInt(0, 30)}%`);
            img.style.setProperty('--tile-sat', `${randomInt(85, 115)}%`);
            img.onerror = () => tile.remove();

            inner.appendChild(img);
            tile.appendChild(inner);
            fragment.appendChild(tile);
        });

        track.classList.add('is-shuffling');
        window.setTimeout(() => {
            track.innerHTML = '';
            track.appendChild(fragment);
            track.classList.remove('is-shuffling');
        }, 380);
    }

    function showGalleryMessage(message) {
        track.innerHTML = '';
        const empty = document.createElement('div');
        empty.className = 'gallery-empty';
        empty.textContent = message;
        track.appendChild(empty);
    }

    function loadGallery() {
        fetch(chrome.runtime.getURL('photos.json'))
            .then((response) => response.json())
            .then((photos) => {
                allPhotos = Array.isArray(photos) ? photos : [];
                if (allPhotos.length === 0) {
                    showGalleryMessage('Belum ada foto terdaftar. Tambahkan foto ke folder images.');
                    return;
                }
                buildCollage();
                scheduleShuffle();
            })
            .catch((err) => {
                console.error('Gagal memuat photos.json. Pastikan file ada dan formatnya benar.', err);
                showGalleryMessage('Gagal membaca photos.json.');
            });
    }

    function scheduleShuffle() {
        clearInterval(shuffleTimer);
        const minutes = Math.max(1, Number(settings.shuffleMinutes) || 5);
        shuffleTimer = setInterval(buildCollage, minutes * 60 * 1000);
    }

    let resizeTimeout = null;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (allPhotos.length > 0) buildCollage();
        }, 400);
    });

    // Klik dua kali di area kolase untuk langsung mengocok ulang tatanannya.
    galleryContainer.addEventListener('dblclick', () => {
        if (allPhotos.length > 0) buildCollage();
    });

    /* ------------------------------------------------------------
       Parallax kursor — kolase bergeser tipis mengikuti posisi kursor
       untuk kesan kedalaman, dimatikan otomatis bila animasi nonaktif.
       ------------------------------------------------------------ */
    let parallaxAttached = false;
    let parallaxRaf = null;

    function onPointerMove(e) {
        if (parallaxRaf) return;
        parallaxRaf = requestAnimationFrame(() => {
            const x = (e.clientX / window.innerWidth - 0.5) * 2; // -1..1
            const y = (e.clientY / window.innerHeight - 0.5) * 2;
            track.style.setProperty('--parallax-x', `${(-x * 14).toFixed(1)}px`);
            track.style.setProperty('--parallax-y', `${(-y * 14).toFixed(1)}px`);
            parallaxRaf = null;
        });
    }

    function setParallaxEnabled(enabled) {
        if (enabled && !parallaxAttached) {
            window.addEventListener('pointermove', onPointerMove, { passive: true });
            parallaxAttached = true;
        } else if (!enabled && parallaxAttached) {
            window.removeEventListener('pointermove', onPointerMove);
            parallaxAttached = false;
            track.style.setProperty('--parallax-x', '0px');
            track.style.setProperty('--parallax-y', '0px');
        }
    }

    function applyMotionSetting() {
        const disableMotion = settings.motionEnabled === false || reducedMotionQuery.matches;
        document.body.classList.toggle('motion-off', settings.motionEnabled === false);
        setParallaxEnabled(!disableMotion);
    }

    reducedMotionQuery.addEventListener('change', applyMotionSetting);

    /* ============================================================
       3. BOOKMARKS & HISTORY (dengan favicon, toggle & animasi masuk)
       ============================================================ */
    let bookmarksList = null;
    let historyList = null;

    function faviconUrl(pageUrl, size = 24) {
        const url = new URL(chrome.runtime.getURL('/_favicon/'));
        url.searchParams.set('pageUrl', pageUrl);
        url.searchParams.set('size', String(size));
        return url.toString();
    }

    function buildLinkItem(title, url, index) {
        const li = document.createElement('li');
        li.className = 'link-item';
        li.style.setProperty('--item-delay', `${Math.min(index * 40, 400)}ms`);

        const a = document.createElement('a');
        a.href = url;
        a.title = title || url;

        const icon = document.createElement('img');
        icon.className = 'favicon';
        icon.alt = '';
        icon.loading = 'lazy';
        icon.src = faviconUrl(url, 24);
        icon.onerror = () => { icon.style.visibility = 'hidden'; };

        const label = document.createElement('span');
        label.textContent = title || url;

        a.appendChild(icon);
        a.appendChild(label);
        li.appendChild(a);
        return li;
    }

    function applyPanelVisibility() {
        const bookmarksBox = document.getElementById('bookmarks-box');
        const historyBox = document.getElementById('history-box');
        const menuContainer = document.getElementById('menu-container');

        const showBookmarks = settings.bookmarksEnabled !== false;
        const showHistory = settings.historyEnabled !== false;

        if (bookmarksBox) bookmarksBox.hidden = !showBookmarks;
        if (historyBox) historyBox.hidden = !showHistory;
        if (menuContainer) menuContainer.hidden = !(showBookmarks || showHistory);
    }

    function flattenBookmarks(nodes) {
        return nodes.reduce((all, node) => {
            if (node.url) all.push(node);
            if (node.children) all.push(...flattenBookmarks(node.children));
            return all;
        }, []);
    }

    function loadBookmarks() {
        if (!bookmarksList) return;
        if (settings.bookmarksEnabled === false) {
            bookmarksList.innerHTML = '';
            return;
        }

        chrome.bookmarks.getTree((tree) => {
            const items = flattenBookmarks(tree);
            bookmarksList.innerHTML = '';

            if (items.length === 0) {
                bookmarksList.innerHTML = '<li class="empty-state">Belum ada bookmark.</li>';
                return;
            }

            const fragment = document.createDocumentFragment();
            items.forEach((b, i) => fragment.appendChild(buildLinkItem(b.title, b.url, i)));
            bookmarksList.appendChild(fragment);
        });
    }

    function loadHistory() {
        if (!historyList) return;
        if (settings.historyEnabled === false) {
            historyList.innerHTML = '';
            return;
        }

        chrome.history.search({ text: '', maxResults: 15 }, (items) => {
            historyList.innerHTML = '';

            if (items.length === 0) {
                historyList.innerHTML = '<li class="empty-state">Belum ada history.</li>';
                return;
            }

            const fragment = document.createDocumentFragment();
            items.forEach((h, i) => fragment.appendChild(buildLinkItem(h.title, h.url, i)));
            historyList.appendChild(fragment);
        });
    }

    /* ============================================================
       4. PENGATURAN (sinkron dengan popup)
       ============================================================ */
    function refreshFromSettings() {
        applyPanelVisibility();
        applyMotionSetting();
        loadBookmarks();
        loadHistory();
        updateClock();
        if (allPhotos.length > 0) buildCollage();
    }

    function loadSettings() {
        chrome.storage.local.get([STORAGE_KEY], (result) => {
            settings = { ...DEFAULT_SETTINGS, ...(result[STORAGE_KEY] || {}) };
            refreshFromSettings();
            scheduleShuffle();
        });
    }

    chrome.storage.onChanged.addListener((changes, areaName) => {
        if (areaName === 'local' && changes[STORAGE_KEY]) {
            settings = { ...DEFAULT_SETTINGS, ...(changes[STORAGE_KEY].newValue || {}) };
            refreshFromSettings();
            scheduleShuffle();
        }
    });

    bookmarksList = document.getElementById('bookmarks-list');
    historyList = document.getElementById('history-list');

    loadSettings();
    loadGallery();
});
