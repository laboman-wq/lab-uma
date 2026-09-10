/*********************************************************************
 * DASHBOARD — Role: Asisten Lab
 *********************************************************************/

function vAsistenDashboard() {
    const content = $('#content');
    const user = Auth.current();
    content.innerHTML = `<div class="text-center py-16 text-slate-400">Memuat...</div>`;

    (async () => {
        try {
            const [sch, bor, rep, cert] = await Promise.all([
                getTable('schedules'),
                getTable('borrowings'),
                getTable('reports'),
                getTable('certificates')
            ]);
            const myBor = bor.filter(b => b.peminjam === user.name);
            const myRep = rep.filter(r => r.asisten === user.name);
            const myCert = cert.filter(c => c.nama === user.name);

            const stats = [
                { label: 'Jadwal Praktikum', val: sch.length, icon: 'calendar', color: 'text-cyan-600 bg-cyan-100' },
                { label: 'Peminjaman Aktif', val: myBor.filter(b => b.status !== 'Ditolak').length, icon: 'hand', color: 'text-blue-600 bg-blue-100' },
                { label: 'Laporan Saya', val: myRep.length, icon: 'file-text', color: 'text-emerald-600 bg-emerald-100' },
                { label: 'Sertifikat', val: myCert.length, icon: 'award', color: 'text-amber-600 bg-amber-100' }
            ];

            content.innerHTML = `
            <div class="p-6 md:p-8">
                <div class="flex flex-wrap items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 class="font-display text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">Halo, ${esc(user.name)} 👋</h1>
                        <p class="text-sm text-slate-500 mt-1">Berikut ringkasan kegiatan praktikum Anda.</p>
                    </div>
                </div>
                <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    ${stats.map(s => `<div class="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
                        <div class="w-11 h-11 rounded-xl ${s.color} flex items-center justify-center mb-3"><i data-lucide="${s.icon}" class="w-5 h-5"></i></div>
                        <p class="text-2xl font-extrabold text-slate-800 dark:text-white">${s.val}</p>
                        <p class="text-sm text-slate-500">${s.label}</p></div>`).join('')}
                </div>

                <div class="grid lg:grid-cols-2 gap-6 mt-8">
                    <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
                        <h3 class="font-semibold text-slate-800 dark:text-white mb-4">Jadwal Praktikum</h3>
                        ${sch.slice(0, 4).map(s => `<div class="flex items-center gap-3 py-2 border-b border-slate-100 dark:border-slate-700 last:border-0">
                            <div class="w-9 h-9 rounded-lg bg-cyan-100 dark:bg-slate-700 text-cyan-600 flex items-center justify-center"><i data-lucide="calendar" class="w-4 h-4"></i></div>
                            <div class="flex-1"><p class="text-sm font-medium text-slate-800 dark:text-white">${esc(s.matkul)}</p>
                            <p class="text-xs text-slate-400">${esc(s.lab)} · ${esc(s.hari)} ${esc(s.jam_mulai)}-${esc(s.jam_selesai)}</p></div></div>`).join('') || '<p class="text-sm text-slate-400">Belum ada jadwal.</p>'}
                        <a href="#" onclick="goto('jadwal');return false;" class="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-cyan-600">Lihat semua <i data-lucide="arrow-right" class="w-4 h-4"></i></a>
                    </div>
                    <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
                        <h3 class="font-semibold text-slate-800 dark:text-white mb-4">Status Peminjaman Saya</h3>
                        ${myBor.slice(0, 4).map(b => `<div class="flex items-center justify-between py-2.5 border-b border-slate-100 dark:border-slate-700 last:border-0">
                            <div><p class="text-sm font-medium text-slate-800 dark:text-white">${esc(b.no_surat)}</p>
                            <p class="text-xs text-slate-400">${esc(b.keperluan)}</p></div>${badge(b.status)}</div>`).join('') || '<p class="text-sm text-slate-400">Belum ada peminjaman.</p>'}
                        <a href="#" onclick="goto('peminjaman');return false;" class="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-cyan-600">Aju peminjaman <i data-lucide="arrow-right" class="w-4 h-4"></i></a>
                    </div>
                </div>
            </div>`;
            initIconsNow();
        } catch (e) { toast(e.message, 'error'); content.innerHTML = `<div class="p-10 text-center text-slate-400">${esc(e.message)}</div>`; }
    })();
}

function vAsistenJadwal() {
    const content = $('#content');
    content.innerHTML = `<div class="p-6"><div class="flex items-center justify-between mb-6">
        <h1 class="font-display text-2xl font-extrabold text-slate-900 dark:text-white">Jadwal Praktikum</h1>
        <button onclick="printJadwal()" class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-700 text-white text-sm font-semibold hover:bg-primary-800"><i data-lucide="printer" class="w-4 h-4"></i> Cetak</button></div>
        <div class="text-center py-10 text-slate-400">Memuat...</div></div>`;

    getTable('schedules').then(list => {
        const rows = list.map((s, i) => `<tr class="border-b border-slate-100 dark:border-slate-700">
            <td class="py-3 px-3 text-sm text-slate-500">${i + 1}</td>
            <td class="py-3 px-3 text-sm font-medium text-slate-800 dark:text-white">${esc(s.matkul)}</td>
            <td class="py-3 px-3 text-sm text-slate-600">${esc(s.lab)}</td>
            <td class="py-3 px-3 text-sm text-slate-600">${esc(s.fakultas)} / ${esc(s.prodi)}</td>
            <td class="py-3 px-3 text-sm text-slate-600">${esc(s.dosen)}</td>
            <td class="py-3 px-3 text-sm text-slate-600">${esc(s.hari)} ${esc(s.jam_mulai)}-${esc(s.jam_selesai)}</td>
            <td class="py-3 px-3 text-sm text-slate-600">${esc(s.ruang)}</td></tr>`).join('');
        $('.p-6').innerHTML = `<div class="flex items-center justify-between mb-6">
            <h1 class="font-display text-2xl font-extrabold text-slate-900 dark:text-white">Jadwal Praktikum</h1>
            <button onclick="printJadwal()" class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-700 text-white text-sm font-semibold hover:bg-primary-800"><i data-lucide="printer" class="w-4 h-4"></i> Cetak</button></div>
            <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-x-auto">
            <table class="w-full text-sm"><thead><tr class="text-left text-xs uppercase tracking-wider text-slate-400 bg-slate-50 dark:bg-slate-900">
                <th class="py-3 px-3">No</th><th class="py-3 px-3">Matakuliah</th><th class="py-3 px-3">Lab</th><th class="py-3 px-3">Fakultas/Prodi</th>
                <th class="py-3 px-3">Dosen</th><th class="py-3 px-3">Jadwal</th><th class="py-3 px-3">Ruang</th></tr></thead><tbody>${rows}</tbody></table></div>`;
        window._schData = list;
        initIconsNow();
    }).catch(e => toast(e.message, 'error'));
}

function printJadwal() {
    const list = window._schData || [];
    const rows = list.map((s, i) => `<tr><td style="padding:6px;border:1px solid #cbd5e1;text-align:center;">${i + 1}</td>
        <td style="padding:6px;border:1px solid #cbd5e1;">${esc(s.matkul)}</td><td style="padding:6px;border:1px solid #cbd5e1;">${esc(s.lab)}</td>
        <td style="padding:6px;border:1px solid #cbd5e1;">${esc(s.fakultas)}/${esc(s.prodi)}</td><td style="padding:6px;border:1px solid #cbd5e1;">${esc(s.dosen)}</td>
        <td style="padding:6px;border:1px solid #cbd5e1;">${esc(s.hari)} ${esc(s.jam_mulai)}-${esc(s.jam_selesai)}</td><td style="padding:6px;border:1px solid #cbd5e1;">${esc(s.ruang)}</td></tr>`).join('');
    Print.open(`<div style="font-family:'Poppins',Arial,sans-serif;color:#0f172a;font-size:12px;">
        ${docHeader('JADWAL PRAKTIKUM LABORATORIUM', '')}
        <table style="width:100%;border-collapse:collapse;"><tr style="background:#f1f5f9;">
            <th style="padding:6px;border:1px solid #cbd5e1;">No</th><th style="padding:6px;border:1px solid #cbd5e1;">Matakuliah</th><th style="padding:6px;border:1px solid #cbd5e1;">Lab</th>
            <th style="padding:6px;border:1px solid #cbd5e1;">Fak/Prodi</th><th style="padding:6px;border:1px solid #cbd5e1;">Dosen</th><th style="padding:6px;border:1px solid #cbd5e1;">Jadwal</th><th style="padding:6px;border:1px solid #cbd5e1;">Ruang</th></tr>${rows}</table>
        <p style="margin-top:8px;font-size:10px;color:#64748b;">Dicetak: ${fmtDate(todayStr())}</p></div>`);
}

function vAsistenInventaris() {
    const content = $('#content');
    content.innerHTML = `<div class="p-6 text-center py-10 text-slate-400">Memuat...</div>`;
    Promise.all([getTable('equipment'), getTable('consumables')]).then(([eq, cb]) => {
        const eqRows = eq.map((r, i) => `<tr class="border-b border-slate-100 dark:border-slate-700">
            <td class="py-3 px-3 text-sm text-slate-500">${i + 1}</td><td class="py-3 px-3 text-sm font-medium text-slate-800 dark:text-white">${esc(r.nama)}</td>
            <td class="py-3 px-3 text-sm text-slate-500">${esc(r.kode)}</td><td class="py-3 px-3 text-sm text-slate-600 text-center">${esc(r.jumlah)}</td>
            <td class="py-3 px-3">${badge(r.kondisi)}</td><td class="py-3 px-3 text-sm text-slate-600">${esc(r.lokasi_lab)}</td></tr>`).join('');
        const cbRows = cb.map((r, i) => {
            const low = (parseInt(r.stok_sisa, 10) || 0) <= (parseInt(r.stok_minimum, 10) || 0);
            return `<tr class="border-b border-slate-100 dark:border-slate-700">
                <td class="py-3 px-3 text-sm text-slate-500">${i + 1}</td><td class="py-3 px-3 text-sm font-medium text-slate-800 dark:text-white">${esc(r.nama)}</td>
                <td class="py-3 px-3 text-sm text-slate-600 text-center">${esc(r.stok_sisa)} ${esc(r.satuan)}</td>
                <td class="py-3 px-3 text-sm text-slate-600 text-center">${esc(r.stok_minimum)}</td>
                <td class="py-3 px-3">${low ? '<span class="text-xs font-semibold text-red-600">⚠ Menipis</span>' : '<span class="text-xs font-semibold text-emerald-600">Aman</span>'}</td></tr>`;
        }).join('');
        content.innerHTML = `<div class="p-6">
            <h1 class="font-display text-2xl font-extrabold text-slate-900 dark:text-white mb-6">Inventaris Laboratorium</h1>
            <div class="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 mb-6">
                <h3 class="font-semibold mb-3 text-slate-800 dark:text-white">Alat Laboratorium</h3>
                <div class="overflow-x-auto"><table class="w-full text-sm"><thead><tr class="text-left text-xs uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-700">
                <th class="py-2 px-3">No</th><th class="py-2 px-3">Nama Alat</th><th class="py-2 px-3">Kode</th><th class="py-2 px-3 text-center">Jumlah</th><th class="py-2 px-3">Kondisi</th><th class="py-2 px-3">Lokasi</th></tr></thead><tbody>${eqRows}</tbody></table></div></div>
            <div class="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
                <h3 class="font-semibold mb-3 text-slate-800 dark:text-white">Bahan Habis Pakai</h3>
                <div class="overflow-x-auto"><table class="w-full text-sm"><thead><tr class="text-left text-xs uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-700">
                <th class="py-2 px-3">No</th><th class="py-2 px-3">Nama Bahan</th><th class="py-2 px-3 text-center">Sisa</th><th class="py-2 px-3 text-center">Min.</th><th class="py-2 px-3">Status</th></tr></thead><tbody>${cbRows}</tbody></table></div></div></div>`;
        initIconsNow();
    }).catch(e => toast(e.message, 'error'));
}

function vAsistenPeminjaman() {
    const content = $('#content');
    const user = Auth.current();
    content.innerHTML = `<div class="p-6 text-center py-10 text-slate-400">Memuat...</div>`;

    (async () => {
        try {
            const [bor, eq] = await Promise.all([getTable('borrowings'), getTable('equipment')]);
            const myBor = bor.filter(b => b.peminjam === user.name);
            content.innerHTML = `
            <div class="p-6">
                <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <h1 class="font-display text-2xl font-extrabold text-slate-900 dark:text-white">Peminjaman Alat</h1>
                    <button onclick="modalPeminjaman(${JSON.stringify(eq).replace(/"/g, '&quot;')})" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary-700 text-white text-sm font-semibold hover:bg-primary-800"><i data-lucide="plus" class="w-4 h-4"></i> Ajukan Peminjaman</button>
                </div>
                <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-x-auto">
                    <table class="w-full text-sm"><thead><tr class="text-left text-xs uppercase tracking-wider text-slate-400 bg-slate-50 dark:bg-slate-900">
                        <th class="py-3 px-3">No. Surat</th><th class="py-3 px-3">Keperluan</th><th class="py-3 px-3">Tanggal Pinjam</th><th class="py-3 px-3">Tanggal Kembali</th><th class="py-3 px-3">Status</th><th class="py-3 px-3">Aksi</th></tr></thead><tbody>${
                myBor.map(b => `<tr class="border-b border-slate-100 dark:border-slate-700">
                    <td class="py-3 px-3 font-medium text-slate-800 dark:text-white">${esc(b.no_surat)}</td>
                    <td class="py-3 px-3 text-slate-600">${esc(b.keperluan)}</td>
                    <td class="py-3 px-3 text-slate-600">${fmtDate(b.tanggal_pinjam)}</td>
                    <td class="py-3 px-3 text-slate-600">${fmtDate(b.tanggal_kembali)}</td>
                    <td class="py-3 px-3">${badge(b.status)}</td>
                    <td class="py-3 px-3"><button onclick="printSuratPeminjaman('${b.id}')" class="text-sm font-semibold text-cyan-600 hover:underline">Cetak Surat</button></td></tr>`).join('') || '<tr><td colspan="6" class="py-8 text-center text-slate-400">Belum ada peminjaman.</td></tr>'}
                    </tbody></table></div>
            </div>`;
            window._borData = bor;
            initIconsNow();
        } catch (e) { toast(e.message, 'error'); }
    })();
}

function modalPeminjaman(eqJson) {
    const user = Auth.current();
    const eq = typeof eqJson === 'string' ? JSON.parse(eqJson) : eqJson;
    const options = eq.filter(e => e.jumlah > 0 && e.kondisi === 'Baik')
        .map(e => `<option value="${esc(e.id)}:${esc(e.nama)}">${esc(e.nama)} (sisa ${esc(e.jumlah)})</option>`).join('');
    openModal(`
        <form id="frm-peminjaman" class="p-6">
            <div class="flex items-center justify-between mb-4"><h3 class="font-display text-lg font-bold text-slate-900 dark:text-white">Ajukan Peminjaman Alat</h3><button type="button" onclick="closeModal()" class="w-8 h-8 rounded-lg hover:bg-slate-100"><i data-lucide="x" class="w-5 h-5"></i></button></div>
            <div class="space-y-4">
                <div><label class="block text-sm font-medium mb-1 text-slate-600 dark:text-slate-300">Alat (bisa pilih lebih dari satu)</label>
                    <select id="p-keperluan-eq" class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500">${options}</select></div>
                <div id="p-item-list" class="space-y-2"></div>
                <div><label class="block text-sm font-medium mb-1 text-slate-600 dark:text-slate-300">Keperluan</label>
                    <textarea id="p-keperluan" required rows="2" class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="Mis: praktikum Biologi Umum"></textarea></div>
                <div class="grid grid-cols-2 gap-3">
                    <div><label class="block text-sm font-medium mb-1 text-slate-600 dark:text-slate-300">Tanggal Pinjam</label><input id="p-pinjam" type="date" required class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm"></div>
                    <div><label class="block text-sm font-medium mb-1 text-slate-600 dark:text-slate-300">Tanggal Kembali</label><input id="p-kembali" type="date" required class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm"></div>
                </div>
                <button class="w-full py-2.5 rounded-lg bg-primary-700 text-white font-semibold text-sm">Ajukan</button>
            </div>
        </form>`);
    const sel = $('#p-keperluan-eq');
    sel.addEventListener('change', () => {
        const [id, nama] = sel.value.split(':');
        const list = $('#p-item-list');
        if (!list.querySelector(`[data-id="${id}"]`)) {
            const item = document.createElement('div');
            item.className = 'flex items-center gap-2 bg-slate-50 dark:bg-slate-900 px-3 py-2 rounded-lg';
            item.dataset.id = id;
            item.innerHTML = `<span class="text-sm flex-1">${esc(nama)}</span>
                <input data-id="${id}" data-nama="${esc(nama)}" type="number" min="1" value="1" class="w-20 px-2 py-1 rounded-lg border border-slate-200 text-sm">
                <button type="button" class="text-red-500" onclick="this.parentElement.remove()"><i data-lucide="trash-2" class="w-4 h-4"></i></button>`;
            list.appendChild(item);
            initIconsNow();
        }
    });
    $('#frm-peminjaman').addEventListener('submit', async e => {
        e.preventDefault();
        const items = $$('#p-item-list > div').map(d => ({
            id: d.dataset.id,
            nama: $('input', d).dataset.nama,
            jumlah: $('input', d).value
        }));
        if (!items.length) { toast('Pilih minimal 1 alat', 'warn'); return; }
        try {
            const no = await nextNo('SP');
            await addRow('borrowings', {
                no_surat: no, peminjam: user.name, role: user.role,
                keperluan: $('#p-keperluan').value,
                tanggal_pinjam: $('#p-pinjam').value,
                tanggal_kembali: $('#p-kembali').value,
                items: JSON.stringify(items),
                tanggal_aju: todayStr(), status: 'Menunggu', by_laboran: '', by_kepala: '', keterangan: ''
            });
            closeModal(); toast('Peminjaman diajukan: ' + no);
            vAsistenPeminjaman();
        } catch (err) { toast(err.message, 'error'); }
    });
}

function printSuratPeminjaman(id) {
    const b = (window._borData || []).find(x => x.id === String(id));
    if (!b) return;
    const names = { asisten: b.peminjam, laboran: b.by_laboran || '', kepalalab: b.by_kepala || '' };
    Print.open(buildSuratPeminjaman(b, names));
}

function vAsistenLaporan() {
    const content = $('#content');
    const user = Auth.current();
    content.innerHTML = `<div class="p-6 text-center py-10 text-slate-400">Memuat...</div>`;
    getTable('reports').then(rep => {
        const myRep = rep.filter(r => r.asisten === user.name);
        content.innerHTML = `
        <div class="p-6">
            <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
                <h1 class="font-display text-2xl font-extrabold text-slate-900 dark:text-white">Laporan Praktikum</h1>
                <button onclick="modalLaporan()" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary-700 text-white text-sm font-semibold hover:bg-primary-800"><i data-lucide="plus" class="w-4 h-4"></i> Kirim Laporan</button>
            </div>
            <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-x-auto">
                <table class="w-full text-sm"><thead><tr class="text-left text-xs uppercase tracking-wider text-slate-400 bg-slate-50 dark:bg-slate-900">
                    <th class="py-3 px-3">Kode</th><th class="py-3 px-3">Judul</th><th class="py-3 px-3">Matkul</th><th class="py-3 px-3">Tanggal</th><th class="py-3 px-3">Status</th><th class="py-3 px-3">Aksi</th></tr></thead><tbody>
                ${myRep.map(r => `<tr class="border-b border-slate-100 dark:border-slate-700">
                    <td class="py-3 px-3 font-medium text-slate-800 dark:text-white">${esc(r.kode)}</td>
                    <td class="py-3 px-3 text-slate-600">${esc(r.judul)}</td><td class="py-3 px-3 text-slate-600">${esc(r.matkul)}</td>
                    <td class="py-3 px-3 text-slate-600">${fmtDate(r.tanggal)}</td><td class="py-3 px-3">${badge(r.status)}</td>
                    <td class="py-3 px-3"><button onclick="printLaporan('${r.id}')" class="text-sm font-semibold text-cyan-600 hover:underline">Cetak</button></td></tr>`).join('') || '<tr><td colspan="6" class="py-8 text-center text-slate-400">Belum ada laporan.</td></tr>'}
                </tbody></table></div>
        </div>`;
        window._repData = myRep;
        initIconsNow();
    }).catch(e => toast(e.message, 'error'));
}

function modalLaporan() {
    const user = Auth.current();
    openModal(`
        <form id="frm-laporan" class="p-6">
            <div class="flex items-center justify-between mb-4"><h3 class="font-display text-lg font-bold text-slate-900 dark:text-white">Kirim Laporan Praktikum</h3><button type="button" onclick="closeModal()" class="w-8 h-8 rounded-lg hover:bg-slate-100"><i data-lucide="x" class="w-5 h-5"></i></button></div>
            <div class="space-y-4">
                <div><label class="block text-sm font-medium mb-1 text-slate-600 dark:text-slate-300">Judul Laporan</label><input id="r-judul" required placeholder="Mis: Pengamatan Fotosintesis" class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm"></div>
                <div class="grid grid-cols-2 gap-3">
                    <div><label class="block text-sm font-medium mb-1 text-slate-600 dark:text-slate-300">Fakultas</label><input id="r-fak" required value="${esc(user.fakultas)}" class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm"></div>
                    <div><label class="block text-sm font-medium mb-1 text-slate-600 dark:text-slate-300">Prodi</label><input id="r-prodi" required value="${esc(user.prodi)}" class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm"></div>
                </div>
                <div><label class="block text-sm font-medium mb-1 text-slate-600 dark:text-slate-300">Matakuliah</label><input id="r-matkul" required placeholder="Biologi Umum" class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm"></div>
                <div><label class="block text-sm font-medium mb-1 text-slate-600 dark:text-slate-300">Ringkasan</label><textarea id="r-ringkas" rows="2" required class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm"></textarea></div>
                <div><label class="block text-sm font-medium mb-1 text-slate-600 dark:text-slate-300">Hasil</label><textarea id="r-hasil" rows="3" required class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm"></textarea></div>
                <button class="w-full py-2.5 rounded-lg bg-primary-700 text-white font-semibold text-sm">Kirim Laporan</button>
            </div>
        </form>`);
    $('#frm-laporan').addEventListener('submit', async e => {
        e.preventDefault();
        try {
            const no = await nextNo('LP');
            await addRow('reports', {
                kode: no, judul: $('#r-judul').value, fakultas: $('#r-fak').value, prodi: $('#r-prodi').value,
                matkul: $('#r-matkul').value, asisten: user.name, tanggal: todayStr(),
                ringkasan: $('#r-ringkas').value, hasil: $('#r-hasil').value, file_link: '',
                status: 'Menunggu', by_laboran: '', by_kepala: '', keterangan: ''
            });
            closeModal(); toast('Laporan dikirim: ' + no);
            vAsistenLaporan();
        } catch (err) { toast(err.message, 'error'); }
    });
}

function printLaporan(id) {
    const r = (window._repData || []).find(x => x.id === String(id));
    if (r) Print.open(buildLaporanPraktikum(r));
}

function vAsistenSertifikat() {
    const content = $('#content');
    const user = Auth.current();
    content.innerHTML = `<div class="p-6 text-center py-10 text-slate-400">Memuat...</div>`;
    getTable('certificates').then(cert => {
        const my = cert.filter(c => c.nama === user.name);
        content.innerHTML = `
        <div class="p-6">
            <h1 class="font-display text-2xl font-extrabold text-slate-900 dark:text-white mb-6">Sertifikat Asisten</h1>
            <div class="grid md:grid-cols-2 gap-5">
            ${my.map(c => `<div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
                <div class="flex items-center gap-3 mb-3"><div class="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 flex items-center justify-center"><i data-lucide="award" class="w-6 h-6"></i></div>
                <div><p class="font-semibold text-slate-800 dark:text-white">${esc(c.kode)}</p><p class="text-xs text-slate-400">${esc(c.semester)}</p></div></div>
                <p class="text-sm text-slate-500">Status: ${c.status}</p>
                ${c.status === 'Disetujui' ? `<button onclick="printSertifikat('${c.id}')" class="mt-4 w-full py-2.5 rounded-lg bg-primary-700 text-white text-sm font-semibold hover:bg-primary-800"><i data-lucide="printer" class="w-4 h-4 inline mr-1"></i> Cetak Sertifikat</button>` : ''}
            </div>`).join('') || '<p class="text-sm text-slate-400 col-span-2">Belum ada sertifikat.</p>'}
            </div>
        </div>`;
        window._certData = my;
        initIconsNow();
    }).catch(e => toast(e.message, 'error'));
}

function printSertifikat(id) {
    const c = (window._certData || []).find(x => x.id === String(id));
    if (c) Print.open(buildSertifikat(c));
}

window.boards.asisten = {
    nav: [
        { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
        { id: 'jadwal', label: 'Jadwal Praktikum', icon: 'calendar' },
        { id: 'inventaris', label: 'Inventaris', icon: 'box' },
        { id: 'peminjaman', label: 'Peminjaman Alat', icon: 'hand' },
        { id: 'laporan', label: 'Laporan Praktikum', icon: 'file-text' },
        { id: 'sertifikat', label: 'Sertifikat', icon: 'award' }
    ],
    views: {
        dashboard: vAsistenDashboard,
        jadwal: vAsistenJadwal,
        inventaris: vAsistenInventaris,
        peminjaman: vAsistenPeminjaman,
        laporan: vAsistenLaporan,
        sertifikat: vAsistenSertifikat
    }
};