# 🧪 Laboratorium Universitas Medan Area — Sistem Informasi & Dashboard

Website resmi **Laboratorium Universitas Medan Area (UMA)** yang mencakup:

- **Website publik** — profil, fasilitas, layanan, penelitian, galeri, berita, unduhan, verifikasi sertifikat
- **Dashboard operator 4 role** — Admin, Laboran, Kepala Lab, Asisten Lab
- **Content Management System (CMS)** — menu, halaman, postingan, dan slider website dapat dikelola dari dashboard

Backend memakai **Google Sheets + Google Apps Script** (gratis). Hosting **GitHub Pages** (gratis).

---

## 🌐 Akses

| Halaman | URL |
|---------|-----|
| Website Publik | https://laboman-wq.github.io/lab-uma/ |
| Login Dashboard | https://laboman-wq.github.io/lab-uma/dashboard/login.html |
| Halaman Berita | https://laboman-wq.github.io/lab-uma/berita.html |
| Verifikasi Sertifikat | https://laboman-wq.github.io/lab-uma/verifikasi.html |

### Akun Pengujian (1 per role)

| Username | Password | Role |
|----------|----------|------|
| `admin` | `admin123` | Administrator |
| `laboran` | `laboran123` | Laboran |
| `kepalalab` | `kepalalab123` | Kepala Lab |
| `asisten` | `asisten123` | Asisten Lab |

---

## 🗂 Modul per Role

| Role | Modul |
|------|-------|
| **Admin** | **Menu Website** (tambah/susun menu & sub menu) · **Halaman Dinamis** · **Postingan & Berita** · **Slider/Banner** · Kelola Pengguna & Lab · Proses Pembelian · **Terbitkan Sertifikat** · Laporan Inventaris & Bulanan |
| **Laboran** | Inventaris Alat · Inventaris Bahan (stok + peringatan menipis) · Pengajuan Alat/Bahan · Jadwal Praktikum · Peminjaman · Verifikasi Laporan · **Postingan (draft → kirim)** |
| **Kepala Lab** | **Setujui Postingan** · Setujui Pengajuan · Peminjaman · Laporan · Sertifikat · Statistik & Laporan Bulanan |
| **Asisten** | Jadwal · Inventaris (view) · Peminjaman + cetak surat · Laporan Praktikum · Cetak Sertifikat |

---

## 🖥 Website Publik (Diatur dari Dashboard)

- **Menu header** (megamenu desktop + drawer mobile) di-render dari tabel `menus` — perubahan di dashboard langsung terlihat di semua halaman.
- **Beranda** — berita terbaru dinamis dari tabel `posts`.
- **Berita** — daftar + filter kategori, detail di `post.html`.
- **Halaman dinamis** — `page.html?slug=...` buatan admin, bisa ditautkan di menu (contoh: `sop-laboratorium`).
- **Unduhan** — sertifikat terbit tampil otomatis.
- **Verifikasi Sertifikat** — masukkan kode untuk cek keaslian (`verifikasi.html`), juga dicetak.

**Alur terbit sertifikat:** Asisten lab → Kepala Lab setujui → Admin "Terbitkan" → tampil di Unduhan + bisa diverifikasi publik.

**Alur postingan:** Laboran buat draft → kirim → Kepala Lab setujui → Admin terbitkan → tampil di berita.

---

## 🛠 Teknologi

| Teknologi | Peran |
|-----------|-------|
| [GitHub Pages](https://pages.github.com) | Hosting gratis (statis) |
| [Tailwind CSS](https://tailwindcss.com) | Styling & responsive |
| [Alpine-compatible custom JS](https://developer.mozilla.org/docs/Web/JavaScript) | Logika dashboards & website |
| [Lucide Icons](https://lucide.dev) | Ikon modern |
| [Google Fonts](https://fonts.google.com) | Poppins + Inter |
| [Google Sheets + Apps Script](https://script.google.com) | Database & API gratis |

---

## 📁 Struktur Proyek

```
lab-uma/
├── index.html / profil.html / fasilitas.html / layanan.html
├── penelitian.html / galeri.html / berita.html / unduhan.html / kontak.html
├── page.html              # Render halaman dinamis (?slug=)
├── post.html              # Render detail berita (?id=)
├── verifikasi.html        # Verifikasi sertifikat publik
├── assets/
│   ├── css/style.css      # Custom CSS
│   ├── css/nav.css        # CSS navigasi (mega menu + mobile)
│   ├── js/app.js          # Tema, galeri filter, animasi
│   └── js/site.js         # Engine konten publik (fetch + nav + render blok)
├── dashboard/             # Dashboard operator (4 role)
│   ├── login.html
│   ├── dashboard.html
│   ├── css/print.css      # Layout cetak A4
│   └── js/                # api, auth, app, print, views-*
└── backend/
    ├── code.gs            # Google Apps Script (API + database)
    └── appsscript.json    # Konfigurasi web app (deploy via clasp)
```

---

## 🚀 Deploy & Setup

1. **Website (GitHub Pages):** push repo ini ke GitHub → Settings → Pages → branch `main`.
2. **Backend (Google Apps Script):** copy `backend/code.gs` ke Apps Script → jalankan `setupDB()` (database baru) atau `upgradeDB()` (tambah fitur tanpa hapus data) → Deploy Web App (Execute as: Me, Access: Anyone).
3. **Sambungkan:** pastikan URL `/exec` di `dashboard/js/api.js` dan `assets/js/site.js` sudah benar.
4. **(Opsional) Deploy ulang backend via clasp:** `clasp push -f && clasp deploy`.

Seluruh alur kerja dan dokumentasi mendetail ada di `README-DASHBOARD.md`.

---

## 🔧 Roadmap

- [x] Redesign website + halaman lengkap + responsive
- [x] Dashboard 4 role + inventaris + pengajuan + laporan + sertifikat + cetak A4
- [x] CMS: menu dinamis, halaman, postingan, slider, terbitkan & verifikasi sertifikat
- [ ] Autentikasi lebih kuat (hash password) bila dipindah ke produksi
- [ ] Migrasi ke Firebase/Postgres untuk skala besar
- [ ] Custom domain