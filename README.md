# 🧪 Laboratorium Universitas Medan Area — Redesign Prototype

Website demo prototype untuk **Laboratorium Universitas Medan Area (UMA)** dengan desain modern, responsif, dan mendukung dark mode.

## ✅ Fitur Redesign

- 🎨 **Desain Modern** — Tailwind CSS + Poppins font + Lucide icons
- 📱 **Fully Responsive** — Mobile hamburger menu (drawer), adaptif di semua layar
- 🌙 **Dark Mode Toggle** — Beralih tema terang/gelap di top bar
- 🧭 **Mega Menu** — Dropdown lebar dengan ikon + deskripsi (desktop)
- 📂 **Menu Lengkap & Aktif** — Semua menu mengarah ke halaman nyata
- 🃏 **Card-based Layout** — Untuk fakultas, berita, galeri, dan layanan
- 📊 **Statistik Interaktif** — Section ringkasan angka
- 🖼 **Galeri dengan Filter** — Galeri dapat disaring per fakultas (JS)
- 🔍 **Auto-highlight menu aktif** — Deteksi halaman dari URL

## 🗂 Struktur Halaman

| File | Isi |
|------|-----|
| `index.html` | Beranda (hero, statistik, fakultas, layanan, berita, galeri) |
| `profil.html` | Visi & misi, struktur organisasi, maps |
| `fasilitas.html` | Daftar laboratorium |
| `layanan.html` | Jadwal praktikum, matakuliah, pengelola |
| `penelitian.html` | Jenis lab penelitian (fisiologi, proteksi, lahan, rumah kasa) |
| `galeri.html` | Galeri + filter per fakultas |
| `berita.html` | Berita & pengumuman |
| `unduhan.html` | Dokumen & sertifikat |
| `kontak.html` | Kontak, form, dan maps |

## 🛠 Teknologi (Semua Free / CDN)

| Teknologi | Peran |
|-----------|-------|
| [Tailwind CSS](https://tailwindcss.com) | Styling & responsive |
| [Lucide Icons](https://lucide.dev) | Ikon modern |
| [Google Fonts](https://fonts.google.com) | Poppins + Inter |

## 🌐 Cara Deploy ke GitHub Pages

1. Buat repository baru di GitHub: `lab-uma` (pastikan akun `laboman-wq`)
2. Push seluruh folder ini ke repository
3. Buka repo → **Settings** → **Pages**
4. Source: `Deploy from a branch` → Branch: `main` → Folder: `/ (root)` → **Save**
5. Tunggu beberapa menit, website live di:
   ```
   https://laboman-wq.github.io/lab-uma/
   ```

### Alternatif Hosting Gratis (Drag & Drop)
Selain GitHub Pages, bisa juga deploy ke [Netlify](https://netlify.com) atau [Vercel](https://vercel.com) dengan drag-and-drop folder — tanpa perlu command line.

## 📁 Struktur File

```
lab-uma/
├── index.html              # Halaman Beranda
├── profil.html             # Profil (visi misi, struktur, maps)
├── fasilitas.html          # Daftar laboratorium
├── layanan.html            # Jadwal, matakuliah, pengelola
├── penelitian.html         # Jenis lab penelitian
├── galeri.html             # Galeri + filter
├── berita.html             # Berita & pengumuman
├── unduhan.html            # Dokumen & sertifikat
├── kontak.html             # Kontak + form + maps
├── _shell.html             # Template kerangka (untuk build script)
├── build.ps1               # Script generate halaman dari template
├── navbar-template.html    # Referensi blok navbar (arsip)
├── assets/
│   ├── css/style.css       # Custom CSS
│   ├── css/nav.css         # CSS mega menu + mobile nav
│   ├── js/app.js           # Custom JS (theme, galeri filter)
│   ├── js/nav.js           # JS navigasi (drawer, active highlight)
│   └── img/                # Gambar lokal (jika diperlukan)
└── README.md
```

## ⚠️ Catatan

- Prototype ini **clone visual** dari situs resmi `laboratorium.uma.ac.id` untuk keperluan **demonstrasi** upgrade tampilan.
- Live URL pada tautan (Lab Pengujian ISO, P2MAL, login) mengarah ke situs asli agar data tetap real-time.
- Jika ingin menambah/mengubah halaman, gunakan `_shell.html` sebagai template lalu jalankan `build.ps1`.

## 🔧 Untuk Selanjutnya (Roadmap)

- [ ] Halaman detail Profil, Struktur Organisasi
- [ ] Halaman Galeri per Fakultas/Prodi
- [ ] Dashboard admin dengan statistik & kalender
- [ ] Integrasi jadwal praktikum real-time
- [ ] Custom domain (jika punya)
