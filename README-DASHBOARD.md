# 🧰 Panduan Setup Dashboard Laboratorium UMA

Dashboard 4 role (Admin, Laboran, Kepala Lab, Asisten) menggunakan **Google Sheets + Google Apps Script** sebagai backend gratis. Ikuti langkah ini satu kali (±15 menit).

---

## Bagian A — Siapkan Google Sheet (Database)

1. Buka [https://sheets.new](https://sheets.new) (membuat spreadsheet baru).
2. Rename sheet jadi misal **`Laboratorium UMA Database`**.

## Bagian B — Pasang Backend Script

1. Di spreadsheet, menu **Extensions → Apps Script**.
2. Hapus isi editor, lalu **tempel seluruh isi** file `backend/code.gs` dari repo ini.
3. Klik **Save** (ikon disket) → beri nama project misal `LabUMA-Backend`.
4. Di editor Apps Script, pilih fungsi `setupDB`, lalu klik **Run**.
   - Muncul dialog izin → **Review permissions** → pilih akun → **Allow** (peringatan "not verified" → *Advanced* → *Go to project*, aman karena script kita sendiri).
   - Fungsi ini akan **membuat 13 tab tabel + mengisi data demo + 4 akun pengguna** secara otomatis.
5. Cek spreadsheet: harus ada tab baru `users`, `equipment`, `consumables`, dll, serta 4 akun demo.

## Bagian C — Deploy sebagai Web App (API)

1. Masih di Apps Script, klik **Deploy → New deployment**.
2. Klik ikon gear ⚙️ (bukan tombol hijau), pilih type: **Web app**.
3. Isi:
   - **Description**: `Lab UMA API`
   - **Execute as**: `Me (email_anda@...)`
   - **Who has access**: `Anyone`
4. Klik **Deploy** → izinkan akses → salin **Web app URL** (berakhiran `/exec`).

## Bagian D — Sambungkan ke Website

1. Edit file `dashboard/js/api.js`.
2. Ganti nilai `APPS_SCRIPT_URL` dengan URL yang tadi kamu salin:
   ```js
   const CONFIG = {
       APPS_SCRIPT_URL: 'https://script.google.com/macros/s/XXXX/exec',
       TOKEN: 'LABUMA2026'
   };
   ```
3. (Opsional) ganti `TOKEN` dengan kata rahasia sendiri — harus SAMA dengan `APP_TOKEN` di `backend/code.gs`.

---

## Akun Demo (hasil setupDB)

| Username   | Password     | Role           |
|------------|--------------|----------------|
| `admin`    | `admin123`   | Administrator  |
| `laboran`  | `laboran123` | Laboran        |
| `kepalalab`| `kepalalab123` | Kepala Lab   |
| `asisten`  | `asisten123` | Asisten Lab    |

Login di: **`https://laboman-wq.github.io/lab-uma/dashboard/login.html`**

---

## Alur Kerja yang Terintegrasi

```
PENGADAAN:
Laboran aju alat/bahan → Kepala Lab setujui/tolak → Admin "Proses Pembelian"
   → Laboran "Terima Barang" → otomatis masuk inventaris (Selesai)

PEMINJAMAN:
Asisten aju → Laboran "Validasi" → Kepala Lab "Setujui" → Asisten cetak surat

LAPORAN:
Asisten kirim laporan → Laboran "Verifikasi" → Kepala Lab "Setujui" → Cetak

SERTIFIKAT:
Kepala Lab setujui → Asisten cetak sertifikat (kode + ttd digital)
```

---

## Fitur Cetak (Print A4)

- Surat Pengajuan Alat & Bahan
- Surat Peminjaman Alat (ttd 3 pihak)
- Laporan Praktikum
- Sertifikat Asisten
- Laporan Inventaris Alat
- Kartu Stok Bahan
- Jadwal Praktikum
- **Laporan Bulanan** (rekap agregat)

---

## ⚠️ Catatan Penting

- **Gratis & tanpa kartu kredit.** Data tersimpan rapi di spreadsheet kamu.
- **Keamanan:** cukup untuk demo/kampus internal. Password disimpan apa adanya di spreadsheet dan API memakai token sederhana. Untuk produksi publik, migrasikan ke Firebase.
- **Kuota:** Apps Script gratis cukup untuk puluhan pengguna aktif harian.
- Setup ulang database (hapus semua data): jalankan `setupDB()` lagi di Apps Script.