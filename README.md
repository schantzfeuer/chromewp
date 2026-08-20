# Ayumin Gallery

Ayumin Gallery adalah ekstensi Chrome yang mengganti halaman **New Tab** dengan wallpaper kolase foto, jam dan tanggal, sapaan, Bookmarks, serta History. Foto diambil dari folder `images` dan daftar file di `photos.json`.

## Yang baru di versi 2.3

- Maksimal **25 foto/ubin** dirender sekaligus untuk menjaga performa dan mengurangi lag.
- Jika jumlah foto yang tersedia lebih sedikit daripada jumlah ubin yang dibutuhkan, foto yang ada akan **dipakai ulang otomatis** sampai wallpaper terisi.
- Efek foto sekarang bisa diatur dari popup:
  - **Acak otomatis** untuk mengganti efek saat kolase disegarkan.
  - **Tanpa efek tambahan** untuk tampilan dasar.
  - Pilih **satu efek tertentu** jika Anda tidak ingin efek berubah secara acak.
- Efek baru: **Film hangat**, **Monokrom**, dan **Dreamy pastel**.
- Popup pengaturan kini menyimpan pilihan efek bersama pengaturan lainnya.

## Fitur utama

- Kolase foto dengan beberapa variasi layout.
- Maksimal 25 ubin foto dalam satu tampilan.
- Foto otomatis diulang bila koleksi terlalu sedikit untuk memenuhi kolase.
- Efek visual acak atau efek tetap pilihan pengguna.
- Animasi Ken Burns, gerakan ubin, dan parallax yang bisa dimatikan.
- Jam, tanggal, dan sapaan berdasarkan waktu.
- Nama panggilan opsional pada sapaan.
- Panel Bookmarks dan History yang bisa ditampilkan atau disembunyikan.
- Favicon untuk item Bookmarks dan History.
- Pergantian layout otomatis setiap 2–30 menit.
- Klik dua kali pada area wallpaper untuk langsung mengacak ulang kolase.
- Mengikuti pengaturan sistem `prefers-reduced-motion`.

## Efek yang tersedia

| Efek | Tampilan |
| --- | --- |
| **Acak otomatis** | Memilih efek secara otomatis setiap kali kolase dibangun ulang. |
| **Tanpa efek tambahan** | Foto tampil dengan gaya dasar kolase. |
| **Kartu melayang** | Foto sedikit miring, sudut lebih bulat, dan bayangan seperti kartu. |
| **Polaroid** | Bingkai kertas, sedikit sepia, dan efek kilau tipis. |
| **Bingkai galeri** | Bingkai ganda yang lebih rapi dan formal. |
| **Tumpukan foto** | Beberapa lapisan terlihat di belakang foto utama seperti tumpukan cetakan. |
| **Kilau neon** | Cincin violet yang berdenyut saat animasi aktif. |
| **Film hangat** | Warna hangat, vignette, dan tekstur garis halus seperti film lama. |
| **Monokrom** | Hitam-putih dengan kontras lebih tinggi. |
| **Dreamy pastel** | Warna lebih lembut dengan sudut bulat dan glow pastel. |

> Jika **Animasi latar** dimatikan, efek visual statis tetap dapat digunakan, tetapi gerakan seperti Ken Burns, drift, parallax, kilau bergerak, dan animasi masuk akan dihentikan.

## Cara memasang ekstensi

### 1. Unduh proyek

Unduh repository dari GitHub:

`https://github.com/arzhavz/chromewp`

Pilih **Code → Download ZIP**, lalu ekstrak ZIP ke folder yang mudah ditemukan.

### 2. Tambahkan foto

Buka folder `images`, lalu tambahkan foto yang ingin digunakan.

Format umum seperti `.jpg`, `.jpeg`, `.png`, dan `.webp` dapat digunakan selama nama file tersebut didaftarkan di `photos.json`.

### 3. Perbarui `photos.json`

Cara termudah adalah menjalankan `start.cmd` yang disediakan proyek untuk mendaftarkan foto secara otomatis.

Jika ingin mengaturnya manual, `photos.json` harus berupa array nama file, misalnya:

```json
[
  "foto-01.jpg",
  "foto-02.png",
  "foto-03.webp"
]
```

Nama di `photos.json` harus sama dengan nama file di folder `images`.

### 4. Buka halaman ekstensi Chrome

Di address bar Chrome, buka:

`chrome://extensions/`

Aktifkan **Developer mode** di halaman tersebut.

### 5. Muat ekstensi

Klik **Load unpacked**, lalu pilih **folder utama proyek**—folder yang berisi `manifest.json`, bukan folder `images`.

Setelah berhasil dimuat, buka tab baru. Ayumin Gallery akan menggantikan halaman New Tab Chrome.

### 6. Buka pengaturan

Klik ikon Ayumin Gallery di toolbar Chrome. Jika ikonnya belum terlihat, buka menu Extensions dan pin Ayumin Gallery.

Dari popup Anda dapat mengatur:

- tampil/sembunyikan Bookmarks;
- tampil/sembunyikan History;
- aktif/nonaktifkan animasi latar;
- pilih efek acak, tanpa efek tambahan, atau satu efek tertentu;
- interval pergantian kolase;
- nama panggilan untuk sapaan.

## Cara kerja batas 25 foto

Ayumin Gallery menghitung ukuran layout berdasarkan ukuran layar. Layout yang terlalu padat akan otomatis dibuat lebih renggang agar tidak membutuhkan lebih dari **25 elemen foto**.

Contoh:

- Jika tersedia **60 foto**, satu tampilan tetap menggunakan maksimal 25 foto/ubin.
- Jika tersedia hanya **6 foto** tetapi layout membutuhkan 18 ubin, keenam foto tersebut akan diacak dan **digunakan kembali** sampai 18 ubin terisi.

Tujuannya adalah menjaga wallpaper tetap penuh tanpa membuat terlalu banyak elemen gambar yang dapat menyebabkan lag.

## Mengganti foto

1. Tambahkan, hapus, atau ganti file di folder `images`.
2. Jalankan kembali `start.cmd`, atau edit `photos.json` secara manual.
3. Buka `chrome://extensions/`.
4. Klik tombol **Reload** pada Ayumin Gallery.
5. Buka tab baru untuk melihat hasilnya.

## Troubleshooting

**Foto tidak muncul**  
Pastikan nama file di `photos.json` sama persis dengan file yang ada di folder `images`.

**Muncul pesan “Gagal membaca photos.json”**  
Periksa apakah `photos.json` ada di folder utama dan format JSON-nya valid.

**Ekstensi tidak muncul setelah di-load**  
Pastikan folder yang dipilih melalui **Load unpacked** adalah folder yang memiliki `manifest.json`.

**Bookmark atau History kosong**  
Pastikan panel terkait aktif di popup. History atau bookmark yang memang belum tersedia akan menampilkan keadaan kosong.

**Favicon tidak muncul**  
Favicon diambil melalui fasilitas favicon Chrome dan mungkin belum tersedia untuk situs yang belum pernah dikunjungi.

**Animasi terlalu berat**  
Matikan **Animasi latar** dari popup. Versi 2.3 juga membatasi wallpaper ke maksimal 25 ubin foto untuk mengurangi beban render.

## File penting

- `manifest.json` — konfigurasi ekstensi dan permission Chrome.
- `index.html` — struktur halaman New Tab.
- `style.css` — tampilan halaman dan efek kolase.
- `script.js` — jam, kolase, Bookmarks, History, pengaturan, dan logika efek.
- `popup.html` / `popup.css` / `popup.js` — antarmuka dan penyimpanan pengaturan.
- `images/` — folder foto wallpaper.
- `photos.json` — daftar foto yang boleh digunakan.

## Permission

Ekstensi menggunakan permission berikut:

- `bookmarks` — membaca bookmark untuk panel Bookmarks.
- `history` — membaca history untuk panel History.
- `storage` — menyimpan pengaturan secara lokal.
- `favicon` — menampilkan favicon pada daftar link.

Data pengaturan disimpan melalui `chrome.storage.local`.
