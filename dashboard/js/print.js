/*********************************************************************
 * Sistem Cetak (A4) — generator dokumen laboratorium
 *********************************************************************/

const Print = {
    open(html) {
        let area = document.getElementById('print-area');
        if (!area) {
            area = document.createElement('div');
            area.id = 'print-area';
            document.body.appendChild(area);
        }
        area.innerHTML = html;
        area.style.display = 'block';
        document.body.classList.add('printing');
        initIconsNow();
        // tunggu sebentar agar font/icon render, lalu print
        setTimeout(() => window.print(), 150);
    },
    close() {
        document.body.classList.remove('printing');
        const a = document.getElementById('print-area');
        if (a) a.style.display = 'none';
    }
};

window.addEventListener('afterprint', () => Print.close());

/* ---- Letterhead (kop surat) ---- */
function docHeader(judul, noSurat = '') {
    return `
    <div style="display:flex;align-items:center;gap:14px;border-bottom:3px solid #1e40af;padding-bottom:10px;margin-bottom:18px;">
        <img src="https://susitao.uma.ac.id/assets/img/logo-main.webp" style="width:64px;height:64px;object-fit:contain;background:#fff;border-radius:8px;padding:4px;border:1px solid #e2e8f0;" />
        <div style="flex:1;text-align:center;">
            <div style="font-size:8px;letter-spacing:3px;color:#64748b;">UNIVERSITAS MEDAN AREA</div>
            <div style="font-size:20px;font-weight:800;color:#1e40af;letter-spacing:1px;">LABORATORIUM</div>
            <div style="font-size:10px;color:#475569;">Jalan Kolam Nomor 1 Medan Estate / Jalan Gedung PBSI, Medan 20223</div>
            <div style="font-size:9px;color:#64748b;">Telp. (061) 7360168 · lab@uma.ac.id</div>
        </div>
    </div>
    <div style="text-align:center;margin-bottom:16px;">
        <div style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;text-decoration:underline;">${judul}</div>
        ${noSurat ? `<div style="font-size:11px;margin-top:3px;">Nomor: ${noSurat}</div>` : ''}
    </div>`;
}

function ttdBlock(rows) {
    const html = rows.map(r => `
        <div style="text-align:center;width:${100 / Math.max(rows.length, 1)}%;">
            <div style="font-size:10px;margin-bottom:60px;">${r.role}</div>
            <div style="font-size:11px;font-weight:700;border-top:1px solid #334155;padding-top:3px;display:inline-block;min-width:140px;">${r.name || '................'}</div>
        </div>`).join('');
    return `<div style="display:flex;margin-top:50px;">${html}</div>`;
}

/* ---- Dokumen 1: Surat Peminjaman Alat ---- */
function buildSuratPeminjaman(b, names) {
    let items = [];
    try { items = JSON.parse(b.items || '[]'); } catch (e) { items = []; }
    const rows = items.map((it, i) =>
        `<tr><td style="padding:6px;border:1px solid #cbd5e1;">${i + 1}</td>
              <td style="padding:6px;border:1px solid #cbd5e1;">${esc(it.nama)}</td>
              <td style="padding:6px;border:1px solid #cbd5e1;text-align:center;">${esc(it.jumlah)}</td>
              <td style="padding:6px;border:1px solid #cbd5e1;text-align:center;">${esc(it.kondisi || '-')}</td></tr>`).join('');
    return `<div style="font-family:'Poppins',Arial,sans-serif;color:#0f172a;font-size:12px;">
        ${docHeader('SURAT PEMINJAMAN ALAT', b.no_surat)}
        <p>Yang bertanda tangan di bawah ini mengajukan peminjaman alat laboratorium dengan rincian sebagai berikut:</p>
        <table style="width:100%;border-collapse:collapse;margin:10px 0;">
            <tr><td style="width:160px;padding:4px;"><b>Peminjam</b></td><td>: ${esc(b.peminjam)} (${esc(roleLabel(b.role))})</td></tr>
            <tr><td style="padding:4px;"><b>Keperluan</b></td><td>: ${esc(b.keperluan)}</td></tr>
            <tr><td style="padding:4px;"><b>Tanggal Pinjam</b></td><td>: ${fmtDate(b.tanggal_pinjam)}</td></tr>
            <tr><td style="padding:4px;"><b>Tanggal Kembali</b></td><td>: ${fmtDate(b.tanggal_kembali)}</td></tr>
        </table>
        <table style="width:100%;border-collapse:collapse;">
            <tr style="background:#f1f5f9;">
                <th style="padding:6px;border:1px solid #cbd5e1;">No</th>
                <th style="padding:6px;border:1px solid #cbd5e1;">Nama Alat</th>
                <th style="padding:6px;border:1px solid #cbd5e1;">Jumlah</th>
                <th style="padding:6px;border:1px solid #cbd5e1;">Kondisi</th>
            </tr>${rows}
        </table>
        <p style="margin-top:10px;">Demikian surat permohonan ini dibuat agar dapat digunakan sebagaimana mestinya.</p>
        ${ttdBlock([
            { role: 'Peminjam', name: names.asisten },
            { role: 'Laboran', name: names.laboran },
            { role: 'Kepala Laboratorium', name: names.kepalalab }
        ])}
    </div>`;
}

/* ---- Dokumen 2 & 3: Surat Pengajuan Alat/Bahan ---- */
function buildSuratPengajuan(r, names, jenis) {
    const isAlat = jenis === 'alat';
    const body1 = isAlat
        ? `<tr><td style="width:160px;padding:4px;"><b>Nama Alat</b></td><td>: ${esc(r.nama_alat)}</td></tr>
           <tr><td style="padding:4px;"><b>Jumlah</b></td><td>: ${esc(r.jumlah)} unit</td></tr>
           <tr><td style="padding:4px;"><b>Spesifikasi</b></td><td>: ${esc(r.spesifikasi || '-')}</td></tr>`
        : `<tr><td style="width:160px;padding:4px;"><b>Nama Bahan</b></td><td>: ${esc(r.nama_bahan)}</td></tr>
           <tr><td style="padding:4px;"><b>Jumlah</b></td><td>: ${esc(r.jumlah)} ${esc(r.satuan || '')}</td></tr>`;
    return `<div style="font-family:'Poppins',Arial,sans-serif;color:#0f172a;font-size:12px;">
        ${docHeader(isAlat ? 'SURAT PENGADAAN ALAT' : 'SURAT PENGADAAN BAHAN HABIS PAKAI', r.no_surat)}
        <p>Menindaklanjuti kebutuhan laboratorium, dengan ini kami mengajukan pengadaan sebagai berikut:</p>
        <table style="width:100%;border-collapse:collapse;margin:10px 0;">
            ${body1}
            <tr><td style="padding:4px;"><b>Alasan</b></td><td>: ${esc(r.alasan || '-')}</td></tr>
            <tr><td style="padding:4px;"><b>Diajukan oleh</b></td><td>: ${esc(r.pengaju)}</td></tr>
            <tr><td style="padding:4px;"><b>Tanggal</b></td><td>: ${fmtDate(r.tanggal)}</td></tr>
        </table>
        <p>Demikian pengajuan ini disampaikan. Atas perhatian dan persetujuan Bapak/Ibu, kami ucapkan terima kasih.</p>
        ${ttdBlock([
            { role: 'Laboran', name: names.laboran },
            { role: 'Kepala Laboratorium', name: names.kepalalab }
        ])}
    </div>`;
}

/* ---- Dokumen 4: Laporan Praktikum ---- */
function buildLaporanPraktikum(r) {
    return `<div style="font-family:'Poppins',Arial,sans-serif;color:#0f172a;font-size:12px;">
        ${docHeader('LAPORAN HASIL PRAKTIKUM', r.kode)}
        <table style="width:100%;border-collapse:collapse;margin:10px 0;">
            <tr><td style="width:160px;padding:4px;"><b>Judul</b></td><td>: ${esc(r.judul)}</td></tr>
            <tr><td style="padding:4px;"><b>Fakultas / Prodi</b></td><td>: ${esc(r.fakultas)} / ${esc(r.prodi)}</td></tr>
            <tr><td style="padding:4px;"><b>Matakuliah</b></td><td>: ${esc(r.matkul)}</td></tr>
            <tr><td style="padding:4px;"><b>Asisten / Pengisi</b></td><td>: ${esc(r.asisten)}</td></tr>
            <tr><td style="padding:4px;"><b>Tanggal</b></td><td>: ${fmtDate(r.tanggal)}</td></tr>
            <tr><td style="padding:4px;"><b>Status</b></td><td>: ${esc(r.status)}</td></tr>
        </table>
        <div style="margin:8px 0;"><b>Ringkasan:</b><br>${esc(r.ringkasan || '-')}</div>
        <div style="margin:8px 0;"><b>Hasil:</b><br>${esc(r.hasil || '-')}</div>
        ${ttdBlock([
            { role: 'Asisten Praktikum', name: r.asisten },
            { role: 'Laboran', name: r.by_laboran }
        ])}
    </div>`;
}

/* ---- Dokumen 5: Sertifikat Asisten ---- */
function buildSertifikat(c) {
    return `
    <div style="font-family:'Poppins',Arial,sans-serif;color:#0f172a;">
        <div style="border:3px double #1e40af;border-radius:16px;padding:30px;text-align:center;">
            <img src="https://susitao.uma.ac.id/assets/img/logo-main.webp" style="width:80px;height:80px;object-fit:contain;background:#fff;border-radius:10px;padding:5px;border:1px solid #e2e8f0;" />
            <div style="font-size:10px;letter-spacing:3px;color:#64748b;margin-top:8px;">UNIVERSITAS MEDAN AREA</div>
            <div style="font-size:26px;font-weight:800;color:#1e40af;">SERTIFIKAT</div>
            <div style="color:#64748b;font-size:11px;">PENGHARGAAN ASISTEN LABORATORIUM</div>
            <div style="font-size:11px;color:#475569;margin-top:18px;">Diberikan kepada:</div>
            <div style="font-size:24px;font-weight:800;color:#0f172a;margin-top:6px;">${esc(c.nama)}</div>
            <div style="font-size:12px;color:#475569;margin-top:4px;">Sebagai ${esc(c.role)} ${esc(c.fakultas)} · ${esc(c.prodi)}</div>
            <div style="font-size:11px;color:#475569;margin-top:14px;">atas dedikasi dalam mendukung kegiatan praktikum semester <b>${esc(c.semester)}</b></div>
            <div style="font-size:10px;color:#94a3b8;margin-top:16px;">Kode Verifikasi: <b>${esc(c.kode)}</b> | Diterbitkan: ${fmtDate(c.tanggal_terbit)}</div>
            ${ttdBlock([{ role: 'Kepala Laboratorium', name: c.by_kepala }])}
        </div>
    </div>`;
}

/* ---- Dokumen 6: Laporan Inventaris Alat ---- */
function buildLaporanInventaris(list) {
    const rows = list.map((r, i) =>
        `<tr><td style="padding:6px;border:1px solid #cbd5e1;text-align:center;">${i + 1}</td>
              <td style="padding:6px;border:1px solid #cbd5e1;">${esc(r.kode)}</td>
              <td style="padding:6px;border:1px solid #cbd5e1;">${esc(r.nama)}</td>
              <td style="padding:6px;border:1px solid #cbd5e1;text-align:center;">${esc(r.jumlah)}</td>
              <td style="padding:6px;border:1px solid #cbd5e1;text-align:center;">${esc(r.kondisi)}</td>
              <td style="padding:6px;border:1px solid #cbd5e1;">${esc(r.lokasi_lab)}</td></tr>`).join('');
    return `<div style="font-family:'Poppins',Arial,sans-serif;color:#0f172a;font-size:12px;">
        ${docHeader('LAPORAN INVENTARIS ALAT LABORATORIUM', '')}
        <table style="width:100%;border-collapse:collapse;">
            <tr style="background:#f1f5f9;">
                <th style="padding:6px;border:1px solid #cbd5e1;">No</th>
                <th style="padding:6px;border:1px solid #cbd5e1;">Kode</th>
                <th style="padding:6px;border:1px solid #cbd5e1;">Nama Alat</th>
                <th style="padding:6px;border:1px solid #cbd5e1;">Jumlah</th>
                <th style="padding:6px;border:1px solid #cbd5e1;">Kondisi</th>
                <th style="padding:6px;border:1px solid #cbd5e1;">Lokasi Lab</th>
            </tr>${rows || '<tr><td colspan="6" style="padding:8px;border:1px solid #cbd5e1;text-align:center;">Tidak ada data</td></tr>'}
        </table>
        <p style="margin-top:8px;font-size:10px;color:#64748b;">Dicetak: ${fmtDate(todayStr())} · Total: ${list.length} item</p>
    </div>`;
}

/* ---- Dokumen 7: Kartu Stok Bahan ---- */
function buildKartuStok(list) {
    const rows = list.map((r, i) =>
        `<tr><td style="padding:6px;border:1px solid #cbd5e1;text-align:center;">${i + 1}</td>
              <td style="padding:6px;border:1px solid #cbd5e1;">${esc(r.kode)}</td>
              <td style="padding:6px;border:1px solid #cbd5e1;">${esc(r.nama)}</td>
              <td style="padding:6px;border:1px solid #cbd5e1;text-align:center;">${esc(r.stok_masuk)}</td>
              <td style="padding:6px;border:1px solid #cbd5e1;text-align:center;">${esc(r.stok_keluar)}</td>
              <td style="padding:6px;border:1px solid #cbd5e1;text-align:center;"><b>${esc(r.stok_sisa)}</b> ${esc(r.satuan)}</td>
              <td style="padding:6px;border:1px solid #cbd5e1;text-align:center;">${esc(r.stok_minimum)}</td></tr>`).join('');
    return `<div style="font-family:'Poppins',Arial,sans-serif;color:#0f172a;font-size:12px;">
        ${docHeader('KARTU STOK BAHAN HABIS PAKAI', '')}
        <table style="width:100%;border-collapse:collapse;">
            <tr style="background:#f1f5f9;">
                <th style="padding:6px;border:1px solid #cbd5e1;">No</th>
                <th style="padding:6px;border:1px solid #cbd5e1;">Kode</th>
                <th style="padding:6px;border:1px solid #cbd5e1;">Nama Bahan</th>
                <th style="padding:6px;border:1px solid #cbd5e1;">Masuk</th>
                <th style="padding:6px;border:1px solid #cbd5e1;">Keluar</th>
                <th style="padding:6px;border:1px solid #cbd5e1;">Sisa</th>
                <th style="padding:6px;border:1px solid #cbd5e1;">Min.</th>
            </tr>${rows || '<tr><td colspan="7" style="padding:8px;border:1px solid #cbd5e1;text-align:center;">Tidak ada data</td></tr>'}
        </table>
        <p style="margin-top:8px;font-size:10px;color:#64748b;">Dicetak: ${fmtDate(todayStr())} · Baris berwarna = stok di bawah minimum</p>
    </div>`;
}

/* ---- Dokumen 8: Laporan Bulanan ---- */
function buildLaporanBulanan(m, disusunOleh) {
    const t = (rows, headers) => rows.length
        ? `<table style="width:100%;border-collapse:collapse;margin:6px 0;">
             <tr style="background:#f1f5f9;">${headers.map(h => `<th style="padding:5px;border:1px solid #cbd5e1;font-size:10px;">${h}</th>`).join('')}</tr>${rows}</table>`
        : `<p style="font-size:10px;color:#94a3b8;">Tidak ada data.</p>`;

    const namaBulan = (bulanList().find(b => b[0] === m.bulan) || ['', m.bulan])[1];

    return `<div style="font-family:'Poppins',Arial,sans-serif;color:#0f172a;font-size:12px;">
        ${docHeader('LAPORAN BULANAN LABORATORIUM', '')}
        <p style="text-align:center;font-size:12px;"><b>Periode: ${namaBulan} ${m.tahun}</b></p>

        <div style="font-size:12px;font-weight:700;margin-top:12px;">A. Ringkasan</div>
        <table style="width:100%;border-collapse:collapse;margin:6px 0;">
            <tr><td style="padding:5px;border:1px solid #cbd5e1;">Total Peminjaman Alat (diajukan)</td><td style="padding:5px;border:1px solid #cbd5e1;text-align:center;">${m.borrowings.length}</td></tr>
            <tr><td style="padding:5px;border:1px solid #cbd5e1;">Laporan Praktikum (diinput)</td><td style="padding:5px;border:1px solid #cbd5e1;text-align:center;">${m.reports.length}</td></tr>
            <tr><td style="padding:5px;border:1px solid #cbd5e1;">Pengajuan Alat</td><td style="padding:5px;border:1px solid #cbd5e1;text-align:center;">${m.equipment_req.length}</td></tr>
            <tr><td style="padding:5px;border:1px solid #cbd5e1;">Pengajuan Bahan</td><td style="padding:5px;border:1px solid #cbd5e1;text-align:center;">${m.consumable_req.length}</td></tr>
            <tr><td style="padding:5px;border:1px solid #cbd5e1;">Total Alat (seluruhnya)</td><td style="padding:5px;border:1px solid #cbd5e1;text-align:center;">${m.equipment_total} (Baik: ${m.equipment_baik})</td></tr>
            <tr><td style="padding:5px;border:1px solid #cbd5e1;">Bahan Stok Menipis</td><td style="padding:5px;border:1px solid #cbd5e1;text-align:center;color:#b91c1c;"><b>${m.low_stock.length}</b></td></tr>
        </table>

        <div style="font-size:12px;font-weight:700;margin-top:14px;">B. Peminjaman Alat</div>
        ${t(m.borrowings.map(r => `<tr><td style="padding:5px;border:1px solid #cbd5e1;">${esc(r.no_surat)}</td><td style="padding:5px;border:1px solid #cbd5e1;">${esc(r.peminjam)}</td><td style="padding:5px;border:1px solid #cbd5e1;">${esc(r.keperluan)}</td><td style="padding:5px;border:1px solid #cbd5e1;text-align:center;">${esc(r.status)}</td></tr>`), ['No. Surat', 'Peminjam', 'Keperluan', 'Status'])}

        <div style="font-size:12px;font-weight:700;margin-top:14px;">C. Laporan Praktikum</div>
        ${t(m.reports.map(r => `<tr><td style="padding:5px;border:1px solid #cbd5e1;">${esc(r.kode)}</td><td style="padding:5px;border:1px solid #cbd5e1;">${esc(r.judul)}</td><td style="padding:5px;border:1px solid #cbd5e1;">${esc(r.asisten)}</td><td style="padding:5px;border:1px solid #cbd5e1;text-align:center;">${esc(r.status)}</td></tr>`), ['Kode', 'Judul', 'Asisten', 'Status'])}

        <div style="font-size:12px;font-weight:700;margin-top:14px;">D. Pengajuan Pengadaan</div>
        ${t(m.equipment_req.map(r => `<tr><td style="padding:5px;border:1px solid #cbd5e1;">${esc(r.no_surat)}</td><td style="padding:5px;border:1px solid #cbd5e1;">${esc(r.nama_alat)}</td><td style="padding:5px;border:1px solid #cbd5e1;text-align:center;">${esc(r.jumlah)}</td><td style="padding:5px;border:1px solid #cbd5e1;text-align:center;">${esc(r.status)}</td></tr>`), ['No. Surat', 'Nama Alat', 'Jumlah', 'Status'])}

        ${ttdBlock([
            { role: 'Disusun oleh', name: disusunOleh.name },
            { role: 'Kepala Laboratorium', name: disusunOleh.kepalalab }
        ])}
    </div>`;
}