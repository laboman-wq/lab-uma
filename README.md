# 🧪 Laboratorium Universitas Medan Area — Redesign Prototype

Website demo prototype untuk **Laboratorium Universitas Medan Area (UMA)** dengan desain modern, responsif, dan mendukung dark mode. Termasuk **Dashboard 4 Role** yang terintegrasi dengan Google Sheets.

## ✅ Fitur Website

- 🎨 **Desain Modern** — Tailwind CSS + Poppins font + Lucide icons
- 📱 **Fully Responsive** — Mobile hamburger menu (drawer), adaptif di semua layar
- 🌙 **Dark Mode Toggle** — Beralih tema terang/gelap di top bar
- 🧭 **Mega Menu** — Dropdown lebar dengan ikon + deskripsi (desktop)
- 📂 **Menu Lengkap & Aktif** — Semua menu mengarah ke halaman nyata
- 🔍 **Auto-highlight menu aktif** — Deteksi halaman dari URL
- 🖼 **Galeri dengan Filter** — Galeri dapat disaring per fakultas (JS)

## ✅ Dashboard Operasional (4 Role)

| Role | Menu Utama |
|------|------------|
| **Admin** | Kelola pengguna, master data lab, proses pembelian, pantau aktivitas, laporan inventaris & bulanan |
| **Laboran** | Inventaris alat, inventaris bahan (stok + peringatan), pengajuan alat/bahan, jadwal, peminjaman, verifikasi laporan, terima barang |
| **Kepala Lab** | Setujui pengajuan, peminjaman, laporan, sertifikat, statistik & laporan bulanan |
| **Asisten** | Jadwal, inventaris (view), peminjaman + cetak surat, laporan praktikum, sertifikat |

**Backend:** Google Sheets + Google Apps Script (gratis, data transparan) — lihat `README-DASHBOARD.md` untuk panduan setup (±15 menit).

**Output cetak (A4):** surat pengajuan alat/bahan, surat peminjaman, laporan praktikum, sertifikat, laporan inventaris, kartu stok, jadwal, laporan bulanan.

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
├── dashboard/              # ★ Dashboard 4 role
│   ├── login.html          #   Login
│   ├── dashboard.html      #   Shell dashboard (sidebar + konten)
│   ├── css/print.css       #   Layout cetak A4
│   └── js/                 #   api, auth, app(router), print,
│                           #   views-admin/laboran/kepalalab/asisten
├── backend/
│   └── code.gs             # ★ Google Apps Script (backend/database)
├── _shell.html             # Template kerangka (untuk build script)
├── build.ps1               # Script generate halaman dari template
├── navbar-template.html    # Referensi blok navbar (arsip)
├── assets/
│   ├── css/style.css       # Custom CSS
│   ├── css/nav.css         # CSS mega menu + mobile nav
│   ├── js/app.js           # Custom JS (theme, galeri filter)
│   ├── js/nav.js           # JS navigasi (drawer, active highlight)
│   └── img/                # Gambar lokal (jika diperlukan)
├── README.md
└── README-DASHBOARD.md     # ★ Panduan setup Google Sheets + Apps Script
```

## ⚠️ Catatan

- Prototype ini **clone visual** dari situs resmi `laboratorium.uma.ac.id` untuk keperluan **demonstrasi** upgrade tampilan.
- **Dashboard memerlukan setup Google Sheets** — ikuti `README-DASHBOARD.md` (±15 menit). Sampai di-setup, halaman login akan menampilkan pesan "koneksi gagal".
- Tombol **Login** di website publik sudah mengarah ke `dashboard/login.html`.
- Jika ingin menambah/mengubah halaman publik, gunakan `_shell.html` sebagai template lalu jalankan `build.ps1`.

## 🔧 Roadmap

- [x] Redesign tampilan + halaman lengkap + responsive
- [x] Dashboard 4 role + inventaris + pengajuan + laporan + sertifikat + cetak
- [ ] Integrasi jadwal praktikum real-time dari sistem asli
- [ ] Multi-akun per fakultas/prodi
- [ ] Migrasi ke Firebase bila hendak produksi publik
- [ ] Custom domain (jika punya)
