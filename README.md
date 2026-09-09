# 🧪 Laboratorium Universitas Medan Area — Redesign Prototype

Website demo prototype untuk **Laboratorium Universitas Medan Area (UMA)** dengan desain modern, responsif, dan mendukung dark mode.

## ✅ Fitur Redesign

- 🎨 **Desain Modern** — Tailwind CSS + Poppins font + Lucide icons
- 📱 **Fully Responsive** — Mobile hamburger menu, adaptif di semua layar
- 🌙 **Dark Mode Toggle** — Beralih tema terang/gelap di top bar
- 🧭 **Mega Menu + Hover Dropdown** — Navigasi yang lebih smooth
- 🃏 **Card-based Layout** — Untuk fakultas, berita, galeri, dan layanan
- 📊 **Statistik Interaktif** — Section ringkasan angka
- 🖼 **Galeri Grid Hover** — Foto langsung dari website asli

## 🛠 Teknologi (Semua Free / CDN)

| Teknologi | Peran |
|-----------|-------|
| [Tailwind CSS](https://tailwindcss.com) | Styling & responsive |
| [Alpine.js](https://alpinejs.dev) | Interaktivitas (menu, dark mode) |
| [Google Fonts](https://fonts.google.com) | Poppins + Inter |
| [Lucide Icons](https://lucide.dev) | Ikon modern |

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
├── index.html              # Halaman utama (prototype)
├── assets/
│   ├── css/style.css       # Custom CSS
│   ├── js/app.js           # Custom JS
│   └── img/                # Gambar lokal (jika diperlulakan)
└── README.md
```

## ⚠️ Catatan

- Prototype ini **clone visual** dari situs resmi `laboratorium.uma.ac.id` untuk keperluan **demonstrasi** upgrade tampilan.
- Live URL pada tautan navbar masih mengarah ke situs asli agar data tetap real-time.
- Halaman belum memiliki halaman detail (Profil, Galeri per Prodi, dll.) — fokus pada tampilan homepage.

## 🔧 Untuk Selanjutnya (Roadmap)

- [ ] Halaman detail Profil, Struktur Organisasi
- [ ] Halaman Galeri per Fakultas/Prodi
- [ ] Dashboard admin dengan statistik & kalender
- [ ] Integrasi jadwal praktikum real-time
- [ ] Custom domain (jika punya)
