# ChromeWP

ChromeWP membuat halaman tab baru Chrome menjadi wallpaper foto pribadi. Setiap membuka tab baru, Anda akan melihat kolase foto, jam, tanggal, sapaan, bookmark, dan riwayat halaman yang baru dibuka.

Panduan ini ditulis untuk pengguna umum. Anda tidak perlu bisa membuat program. Anda hanya perlu Chrome dan folder ChromeWP yang sudah diunduh.

## Apa saja yang bisa dilakukan?

- Menampilkan foto pribadi sebagai kolase wallpaper.
- Mengubah susunan kolase secara otomatis setiap 2, 5, 10, 15, atau 30 menit.
- Menampilkan atau menyembunyikan Bookmark dan History.
- Menampilkan jam, tanggal, serta sapaan sesuai waktu.
- Menambahkan nama panggilan pada sapaan.
- Memilih gaya foto atau membiarkan gaya berubah secara acak.
- Mematikan animasi jika tampilan terasa berat.
- Mengacak kolase segera dengan klik dua kali pada area wallpaper.

Foto yang sedikit tetap cukup: foto akan digunakan ulang secara otomatis agar wallpaper tetap penuh. Dalam satu tampilan, paling banyak 35 ubin foto yang ditampilkan untuk menjaga Chrome tetap ringan.

## Memasang ChromeWP

Pemasangan dilakukan satu kali.

### 1. Unduh dan buka folder

1. Buka halaman proyek ChromeWP di GitHub: https://github.com/schantzfeuer/chromewp
2. Klik tombol **Code**, lalu pilih **Download ZIP**.
3. Buka file ZIP yang terunduh.
4. Pilih **Extract all** atau **Ekstrak semua**, lalu tentukan lokasi penyimpanan.
5. Buka folder hasil ekstrak. Pilih folder yang langsung berisi `manifest.json`.

Jangan memilih folder `images` saja. Folder utama harus berisi file `manifest.json`, `index.html`, dan folder `images`.

### 2. Pasang di Chrome

1. Buka Chrome.
2. Ketik `chrome://extensions/` pada address bar, lalu tekan Enter.
3. Nyalakan tombol **Developer mode** di kanan atas.
4. Klik **Load unpacked**.
5. Pilih folder utama ChromeWP yang berisi `manifest.json`.
6. Klik **Select Folder** atau **Pilih Folder**.

Jika berhasil, ChromeWP akan terlihat di daftar ekstensi. Buka tab baru untuk melihatnya.

> Chrome menampilkan Developer mode karena ekstensi ini dipasang dari folder pribadi, bukan dari Chrome Web Store. Ini adalah langkah normal untuk pemasangan manual.

## Menambahkan foto pribadi

1. Buka folder utama ChromeWP di komputer.
2. Buka folder `images`.
3. Salin foto Anda ke folder tersebut.
4. Klik dua kali file `start.cmd` di folder utama. Jendela hitam akan muncul sebentar dan memperbarui daftar foto secara otomatis.

Format foto yang umum digunakan adalah `.jpg`, `.jpeg`, `.png`, dan `.webp`. Gunakan nama file sederhana, misalnya `liburan-01.jpg`, dan hindari memindahkan atau menghapus folder `images`.

Setelah menambahkan foto:

1. Kembali ke `chrome://extensions/`.
2. Cari **ChromeWP**.
3. Klik tombol **Reload** atau ikon muat ulang.
4. Buka tab baru.

## Menggunakan halaman tab baru

- Jam dan tanggal diperbarui otomatis.
- Bookmark adalah situs yang Anda simpan sebagai favorit di Chrome.
- History adalah daftar halaman web yang baru Anda kunjungi.
- Klik judul atau item Bookmark/History untuk membukanya.
- Klik dua kali bagian wallpaper untuk mengganti susunan kolase saat itu juga.

## Mengatur tampilan

1. Klik ikon **Extensions** (ikon kepingan puzzle) di toolbar Chrome.
2. Cari **ChromeWP**. Klik ikon pin agar mudah ditemukan lain kali.
3. Klik ChromeWP untuk membuka pengaturan.
4. Setiap perubahan tersimpan otomatis dan akan menampilkan tulisan **Tersimpan**.

### Panel

- **Tampilkan Bookmarks**: menampilkan atau menyembunyikan daftar bookmark.
- **Tampilkan History**: menampilkan atau menyembunyikan riwayat halaman.

### Kolase dan gerakan

- **Animasi latar (Ken Burns)**: menyalakan atau mematikan gerakan lembut pada foto. Mematikannya dapat membantu jika komputer terasa lambat.
- **Efek foto**: memilih gaya foto.
- **Ganti tatanan kolase setiap**: menentukan seberapa sering susunan wallpaper berubah.

Pilihan efek foto:

| Pilihan | Keterangan sederhana |
| --- | --- |
| **Randomized** | Gaya berubah otomatis saat kolase dibuat ulang. |
| **Plain** | Tampilan foto sederhana tanpa hiasan tambahan. |
| **Floating** | Foto tampak seperti kartu yang sedikit melayang. |
| **Polaroid** | Foto bergaya cetakan polaroid. |
| **Framed** | Foto memiliki bingkai seperti pajangan galeri. |
| **Stacked** | Foto tampak seperti beberapa cetakan yang ditumpuk. |
| **Neon** | Foto memiliki cahaya neon. |
| **Warm** | Warna foto terasa hangat seperti film lama. |
| **Monochrome** | Foto tampil hitam putih. |
| **Dreamy** | Warna lembut dengan nuansa seperti mimpi. |

### Sapaan

Isi **Nama panggilan (opsional)** jika ingin nama muncul setelah sapaan, misalnya “Selamat Pagi, Ayumin”. Kosongkan jika tidak ingin menggunakan nama.

## Mengganti atau menghapus foto

1. Buka folder `images`.
2. Tambahkan foto baru atau hapus foto yang tidak diinginkan.
3. Klik dua kali `start.cmd` agar daftar foto diperbarui.
4. Di Chrome, buka `chrome://extensions/` dan klik **Reload** pada ChromeWP.
5. Buka tab baru.

## Jika terjadi masalah

**Wallpaper kosong atau foto tidak muncul**

Pastikan foto berada di folder `images`, lalu jalankan `start.cmd` dan klik **Reload** pada halaman ekstensi.

**Muncul pesan “Gagal membaca photos.json”**

Pastikan file `photos.json` ada di folder utama, bukan di dalam `images`. Jalankan kembali `start.cmd`.

**Chrome menolak folder saat pemasangan**

Pilih folder yang berisi `manifest.json`. Jangan memilih file ZIP atau folder `images`.

**Bookmark atau History tidak terlihat**

Buka pengaturan ChromeWP dan pastikan pilihan **Tampilkan Bookmarks** atau **Tampilkan History** menyala. Jika daftar tetap kosong, mungkin belum ada data bookmark atau riwayat yang dapat ditampilkan.

**Komputer terasa lambat**

Matikan **Animasi latar (Ken Burns)**. Anda juga dapat memilih **Plain** sebagai efek foto.

**Foto lama masih terlihat setelah diganti**

Jalankan `start.cmd`, klik **Reload** di `chrome://extensions/`, lalu tutup dan buka kembali tab baru.

## Catatan keamanan dan privasi

ChromeWP membaca Bookmark dan History hanya untuk menampilkannya di halaman tab baru. Pengaturan disimpan di Chrome pada komputer Anda. Foto digunakan dari folder lokal ekstensi.

## Persyaratan

- Google Chrome versi 116 atau lebih baru.
- Komputer Windows untuk menjalankan `start.cmd` secara otomatis.
- Folder utama ChromeWP tetap berada di komputer dan tidak dihapus setelah dipasang.
