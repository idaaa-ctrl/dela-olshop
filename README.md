# 🚀 TokoHub - Platform Jual Beli Modern untuk GitHub Pages

Selamat! Anda baru saja mengunduh template e-commerce statis yang modern, responsif, dan siap di-hosting secara gratis menggunakan **GitHub Pages**.

---

## 📂 Struktur File
- `index.html` : Struktur utama halaman web (Tailwind CSS CDN & Lucide Icons).
- `styles.css` : Styling kustom pendukung dan animasi interaktif.
- `script.js` : Logika pencarian, filter kategori, keranjang belanja (localStorage), dan sistem Checkout ke WhatsApp.
- `products.json` : Database statis produk Anda. Anda bisa menambah/mengubah barang di sini.

---

## 🌐 Cara Hosting di GitHub Pages (Langkah demi Langkah)

1. **Buat Repositori Baru di GitHub**
   - Buka [GitHub](https://github.com/) dan login ke akun Anda.
   - Klik tombol **New** (Repositori baru).
   - Beri nama repositori, misalnya: `toko-online` atau `tokohub`.
   - Pilih **Public**, lalu klik **Create repository**.

2. **Upload File ke GitHub**
   - Ekstrak file ZIP ini ke komputer Anda.
   - Di halaman repositori GitHub yang baru dibuat, klik **uploading an existing file**.
   - Drag & drop seluruh isi file (`index.html`, `styles.css`, `script.js`, `products.json`, `README.md`) ke GitHub.
   - Klik **Commit changes**.

3. **Aktifkan GitHub Pages**
   - Di repositori GitHub Anda, buka tab **Settings**.
   - Di menu sebelah kiri, pilih **Pages**.
   - Pada bagian **Build and deployment** > **Branch**, ubah pilihan dari `None` menjadi `main` (atau `master`).
   - Klik **Save**.

4. **Selesai!**
   - Dalam 1-2 menit, link website toko Anda akan aktif di URL:
     `https://<username-github Anda>.github.io/<nama-repo>/`

---

## ⚙️ Cara Mengubah Nomor WhatsApp Penjual
Buka file `script.js` dan ubah nilai variabel `SELLER_PHONE` di baris pertama:
```javascript
const SELLER_PHONE = "6281234567890"; // Ganti dengan nomor WhatsApp Anda (Gunakan kode negara 62)
```

---

## 📦 Cara Menambah atau Mengubah Produk
Buka file `products.json` dan sesuaikan data produk sesuai keinginan Anda. Contoh format:
```json
{
    "id": 9,
    "name": "Nama Produk Anda",
    "category": "fashion",
    "price": 150000,
    "originalPrice": 200000,
    "rating": 5.0,
    "sold": 10,
    "image": "URL_GAMBAR_PRODUK",
    "description": "Deskripsi barang secara mendalam...",
    "badge": "Promo"
}
```

---

## 💡 Opsional: Penghubung dengan Google Sheets & Google Apps Script
Jika Anda ingin mencatat setiap pesanan secara otomatis ke dalam Google Sheets:
1. Buat Google Form / Google Sheets baru.
2. Buka **Extensions** > **Apps Script**.
3. Buat API `doPost(e)` sederhana untuk menerima JSON payload dari `script.js`.

---
*Dibuat untuk memudahkan pengembangan bisnis online modern dan instan.*
