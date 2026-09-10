/*********************************************************************
 * DASHBOARD — Role: Kepala Laboratorium
 * Approve pengajuan, peminjaman, laporan, sertifikat + laporan bulanan
 *********************************************************************/

function vKepalaDashboard() {
    const content = $('#content');
    const user = Auth.current();
    content.innerHTML = `<div class="p-6 text-center py-10 text-slate-400">Memuat...</div>`;
    (async () => {
        try {
            const s = await getSummary();
            const cards = [
                { label: 'Pengajuan Menunggu', val: s.req_pending, icon: 'inbox', c: 'text-amber-600 bg-amber-100' },
                { label: 'Peminjaman Menunggu', val: s.bor_pending, icon: 'hand', c: 'text-blue-600 bg-blue-100' },
                { label: 'Laporan Menunggu', val: s.rep_pending, icon: 'file-text', c: 'text-purple-600 bg-purple-100' },
                { label: 'Bahan Stok Menipis', val: s.low_stock, icon: 'package', c: 'text-red-600 bg-red-100' },
                { label: 'Alat Lab', val: s.equipment, icon: 'microscope', c: 'text-cyan-600 bg-cyan-100' },
                { label: 'Jadwal Aktif', val: s.schedules, icon: 'calendar', c: 'text-emerald-600 bg-emerald-100' }
            ];
            content.innerHTML = `
            <div class="p-6 md:p-8">
                <h1 class="font-display text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">Dashboard Kepala Laboratorium 🧪</h1>
                <p class="text-sm text-slate-500 mt-1">Tinjau & setujui permohonan, pantau kondisi laboratorium.</p>
                <div class="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                    ${cards.map(c => `<div class="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
                        <div class="w-11 h-11 rounded-xl ${c.c} flex items-center justify-center mb-3"><i data-lucide="${c.icon}" class="w-5 h-5"></i></div>
                        <p class="text-2xl font-extrabold text-slate-800 dark:text-white">${c.val}</p><p class="text-sm text-slate-500">${c.label}</p></div>`).join('')}
                </div>
                <div class="mt-6 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
                    <h3 class="font-semibold text-slate-800 dark:text-white mb-3">⚠ Bahan Habis Pakai Menipis</h3>
                    <div class="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 text-sm text-red-700 dark:text-red-300">
                        ${s.low_stock > 0 ? `Terdapat <b>${s.low_stock}</b> jenis bahan di bawah batas minimum. Segera instruksikan laboran mengajukan pengadaan.` : 'Semua stok bahan dalam kondisi aman.'}
                    </div>
                </div>
            </div>`;
            initIconsNow();
        } catch (e) { toast(e.message, 'error'); }
    })();
}

/* ================= APPROVE PENGAJUAN ALAT ================= */
function vKepalaPengajuanAlat() {
    const content = $('#content');
    content.innerHTML = `<div class="p-6 text-center py-10 text-slate-400">Memuat...</div>`;
    getTable('equipment_req').then(list => {
        window._klEqReq = list;
        content.innerHTML = buildApprovalTable('alat', list);
        initIconsNow();
    }).catch(e => toast(e.message, 'error'));
}

function vKepalaPengajuanBahan() {
    const content = $('#content');
    content.innerHTML = `<div class="p-6 text-center py-10 text-slate-400">Memuat...</div>`;
    getTable('consumable_req').then(list => {
        window._klCbReq = list;
        content.innerHTML = buildApprovalTable('bahan', list);
        initIconsNow();
    }).catch(e => toast(e.message, 'error'));
}

function buildApprovalTable(jenis, list) {
    const title = jenis === 'alat' ? 'Persetujuan Pengajuan Alat' : 'Persetujuan Pengajuan Bahan';
    const nameField = jenis === 'alat' ? 'nama_alat' : 'nama_bahan';
    const rows = list.map(r => `<tr class="border-b border-slate-100 dark:border-slate-700">
        <td class="py-3 px-3 font-medium text-slate-800 dark:text-white">${esc(r.no_surat)}</td>
        <td class="py-3 px-3 text-slate-600">${esc(r[nameField])}</td>
        <td class="py-3 px-3 text-center text-slate-600">${esc(r.jumlah)}${jenis === 'bahan' ? ' ' + esc(r.satuan) : ''}</td>
        <td class="py-3 px-3 text-slate-600">${esc(r.pengaju)}</td>
        <td class="py-3 px-3 text-slate-600">${fmtDate(r.tanggal)}</td>
        <td class="py-3 px-3">${badge(r.status)}</td>
        <td class="py-3 px-3 text-right whitespace-nowrap">
            ${r.status === 'Menunggu' ? `<button onclick="kepalaApproveReq('${jenis}', '${r.id}', 'Disetujui')" class="text-emerald-600 hover:underline text-sm font-semibold mr-2">✔ Setujui</button>
            <button onclick="kepalaApproveReq('${jenis}', '${r.id}', 'Ditolak')" class="text-red-500 hover:underline text-sm font-semibold">✖ Tolak</button>` : ''}
            <button onclick="printPengajuanKl('${jenis}', '${r.id}')" class="text-cyan-600 hover:underline text-sm font-semibold">Cetak</button></td></tr>`).join('');

    return `<div class="p-6">
        <h1 class="font-display text-2xl font-extrabold text-slate-900 dark:text-white mb-6">${title}</h1>
        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-x-auto">
        <table class="w-full text-sm"><thead><tr class="text-left text-xs uppercase tracking-wider text-slate-400 bg-slate-50 dark:bg-slate-900">
            <th class="py-3 px-3">No. Surat</th><th class="py-3 px-3">Item</th><th class="py-3 px-3 text-center">Jumlah</th><th class="py-3 px-3">Pengaju</th><th class="py-3 px-3">Tanggal</th><th class="py-3 px-3">Status</th><th class="py-3 px-3 text-right">Aksi</th></tr></thead><tbody>
        ${rows || '<tr><td colspan="7" class="py-8 text-center text-slate-400">Tidak ada data.</td></tr>'}</tbody></table></div></div>`;
}

async function kepalaApproveReq(jenis, id, status) {
    if (!confirm('Setujui status menjadi ' + status + '?')) return;
    const user = Auth.current();
    try {
        await updateRow(jenis === 'alat' ? 'equipment_req' : 'consumable_req', id, { status, by_kepala: user.name });
        toast('Status diubah: ' + status);
        if (jenis === 'alat') vKepalaPengajuanAlat(); else vKepalaPengajuanBahan();
    } catch (e) { toast(e.message, 'error'); }
}

function printPengajuanKl(jenis, id) {
    const list = jenis === 'alat' ? (window._klEqReq || []) : (window._klCbReq || []);
    const r = list.find(x => x.id === String(id));
    if (!r) return;
    const names = { laboran: r.pengaju, kepalalab: r.by_kepala || Auth.current().name };
    Print.open(buildSuratPengajuan(r, names, jenis));
}

/* ================= APPROVE PEMINJAMAN ================= */
function vKepalaPeminjaman() {
    const content = $('#content');
    content.innerHTML = `<div class="p-6 text-center py-10 text-slate-400">Memuat...</div>`;
    getTable('borrowings').then(bor => {
        window._klBor = bor;
        content.innerHTML = `
        <div class="p-6">
            <h1 class="font-display text-2xl font-extrabold text-slate-900 dark:text-white mb-6">Persetujuan Peminjaman Alat</h1>
            <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-x-auto">
            <table class="w-full text-sm"><thead><tr class="text-left text-xs uppercase tracking-wider text-slate-400 bg-slate-50 dark:bg-slate-900">
                <th class="py-3 px-3">No. Surat</th><th class="py-3 px-3">Peminjam</th><th class="py-3 px-3">Keperluan</th><th class="py-3 px-3">Pinjam</th><th class="py-3 px-3">Kembali</th><th class="py-3 px-3">Status</th><th class="py-3 px-3 text-right">Aksi</th></tr></thead><tbody>
            ${bor.map(b => `<tr class="border-b border-slate-100 dark:border-slate-700">
                <td class="py-3 px-3 font-medium">${esc(b.no_surat)}</td><td class="py-3 px-3">${esc(b.peminjam)}</td><td class="py-3 px-3">${esc(b.keperluan)}</td>
                <td class="py-3 px-3">${fmtDate(b.tanggal_pinjam)}</td><td class="py-3 px-3">${fmtDate(b.tanggal_kembali)}</td><td class="py-3 px-3">${badge(b.status)}</td>
                <td class="py-3 px-3 text-right whitespace-nowrap">
                    ${b.status === 'Divalidasi' ? `<button onclick="kepalaApproveBor('${b.id}', 'Disetujui')" class="text-emerald-600 hover:underline text-sm font-semibold mr-2">✔ Setujui</button>
                    <button onclick="kepalaApproveBor('${b.id}', 'Ditolak')" class="text-red-500 hover:underline text-sm font-semibold mr-2">✖</button>` : ''}
                    <button onclick="printSuratKl('${b.id}')" class="text-cyan-600 hover:underline text-sm font-semibold">Cetak</button>
                </td></tr>`).join('') || '<tr><td colspan="7" class="py-8 text-center text-slate-400">Tidak ada data.</td></tr>'}
            </tbody></table></div>
        </div>`;
        initIconsNow();
    }).catch(e => toast(e.message, 'error'));
}

async function kepalaApproveBor(id, status) {
    if (!confirm('Ubah status peminjaman menjadi ' + status + '?')) return;
    const user = Auth.current();
    try { await updateRow('borrowings', id, { status, by_kepala: user.name }); toast('Status: ' + status); vKepalaPeminjaman(); }
    catch (e) { toast(e.message, 'error'); }
}
function printSuratKl(id) {
    const b = (window._klBor || []).find(x => x.id === String(id));
    if (!b) return;
    const names = { asisten: b.peminjam, laboran: b.by_laboran || '', kepalalab: b.by_kepala || Auth.current().name };
    Print.open(buildSuratPeminjaman(b, names));
}

/* ================= APPROVE LAPORAN ================= */
function vKepalaLaporan() {
    const content = $('#content');
    content.innerHTML = `<div class="p-6 text-center py-10 text-slate-400">Memuat...</div>`;
    getTable('reports').then(rep => {
        window._klRep = rep;
        content.innerHTML = `
        <div class="p-6">
            <h1 class="font-display text-2xl font-extrabold text-slate-900 dark:text-white mb-6">Persetujuan Laporan Praktikum</h1>
            <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-x-auto">
            <table class="w-full text-sm"><thead><tr class="text-left text-xs uppercase tracking-wider text-slate-400 bg-slate-50 dark:bg-slate-900">
                <th class="py-3 px-3">Kode</th><th class="py-3 px-3">Judul</th><th class="py-3 px-3">Asisten</th><th class="py-3 px-3">Tanggal</th><th class="py-3 px-3">Status</th><th class="py-3 px-3 text-right">Aksi</th></tr></thead><tbody>
            ${rep.map(r => `<tr class="border-b border-slate-100 dark:border-slate-700">
                <td class="py-3 px-3 font-medium">${esc(r.kode)}</td><td class="py-3 px-3">${esc(r.judul)}</td><td class="py-3 px-3">${esc(r.asisten)}</td>
                <td class="py-3 px-3">${fmtDate(r.tanggal)}</td><td class="py-3 px-3">${badge(r.status)}</td>
                <td class="py-3 px-3 text-right whitespace-nowrap">
                    ${r.status === 'Divalidasi' ? `<button onclick="kepalaApproveRep('${r.id}', 'Disetujui')" class="text-emerald-600 hover:underline text-sm font-semibold mr-2">✔ Setujui</button>
                    <button onclick="kepalaApproveRep('${r.id}', 'Ditolak')" class="text-red-500 hover:underline text-sm font-semibold mr-2">✖</button>` : ''}
                    <button onclick="printLaporanKl('${r.id}')" class="text-cyan-600 hover:underline text-sm font-semibold">Cetak</button></td></tr>`).join('') || '<tr><td colspan="6" class="py-8 text-center text-slate-400">Tidak ada data.</td></tr>'}
            </tbody></table></div>
        </div>`;
        initIconsNow();
    }).catch(e => toast(e.message, 'error'));
}

async function kepalaApproveRep(id, status) {
    if (!confirm('Ubah status laporan menjadi ' + status + '?')) return;
    const user = Auth.current();
    try { await updateRow('reports', id, { status, by_kepala: user.name }); toast('Status: ' + status); vKepalaLaporan(); }
    catch (e) { toast(e.message, 'error'); }
}
function printLaporanKl(id) {
    const r = (window._klRep || []).find(x => x.id === String(id));
    if (r) Print.open(buildLaporanPraktikum(r));
}

/* ================= APPROVE SERTIFIKAT ================= */
function vKepalaSertifikat() {
    const content = $('#content');
    content.innerHTML = `<div class="p-6 text-center py-10 text-slate-400">Memuat...</div>`;
    getTable('certificates').then(cert => {
        window._klCert = cert;
        content.innerHTML = `
        <div class="p-6">
            <h1 class="font-display text-2xl font-extrabold text-slate-900 dark:text-white mb-6">Persetujuan Sertifikat Asisten</h1>
            <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-x-auto">
            <table class="w-full text-sm"><thead><tr class="text-left text-xs uppercase tracking-wider text-slate-400 bg-slate-50 dark:bg-slate-900">
                <th class="py-3 px-3">Kode</th><th class="py-3 px-3">Nama</th><th class="py-3 px-3">Fakultas/Prodi</th><th class="py-3 px-3">Semester</th><th class="py-3 px-3">Status</th><th class="py-3 px-3 text-right">Aksi</th></tr></thead><tbody>
            ${cert.map(c => `<tr class="border-b border-slate-100 dark:border-slate-700">
                <td class="py-3 px-3 font-medium">${esc(c.kode)}</td><td class="py-3 px-3">${esc(c.nama)}</td><td class="py-3 px-3">${esc(c.fakultas)}/${esc(c.prodi)}</td>
                <td class="py-3 px-3">${esc(c.semester)}</td><td class="py-3 px-3">${badge(c.status)}</td>
                <td class="py-3 px-3 text-right">
                    <button onclick="kepalaApproveCert('${c.id}')" class="text-emerald-600 hover:underline text-sm font-semibold mr-2">✔ Setujui</button>
                    <button onclick="printSertifikatKl('${c.id}')" class="text-cyan-600 hover:underline text-sm font-semibold">Cetak</button></td></tr>`).join('') || '<tr><td colspan="6" class="py-8 text-center text-slate-400">Tidak ada data.</td></tr>'}
            </tbody></table></div>
        </div>`;
        initIconsNow();
    }).catch(e => toast(e.message, 'error'));
}

async function kepalaApproveCert(id) {
    if (!confirm('Setujui sertifikat ini?')) return;
    const user = Auth.current();
    try { await updateRow('certificates', id, { status: 'Disetujui', by_kepala: user.name }); toast('Sertifikat disetujui'); vKepalaSertifikat(); }
    catch (e) { toast(e.message, 'error'); }
}
function printSertifikatKl(id) {
    const c = (window._klCert || []).find(x => x.id === String(id));
    if (c) { c.by_kepala = c.by_kepala || Auth.current().name; Print.open(buildSertifikat(c)); }
}

/* ================= STATISTIK & LAPORAN BULANAN ================= */
function vKepalaStatistik() {
    const content = $('#content');
    content.innerHTML = `<div class="p-6 text-center py-10 text-slate-400">Memuat...</div>`;

    (async () => {
        try {
            const s = await getSummary();
            const cb = await getTable('consumables');
            const lowRows = cb.filter(r => (parseInt(r.stok_sisa, 10) || 0) <= (parseInt(r.stok_minimum, 10) || 0));
            content.innerHTML = `
            <div class="p-6">
                <h1 class="font-display text-2xl font-extrabold text-slate-900 dark:text-white mb-6">Statistik Laboratorium</h1>
                <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div class="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border"><p class="text-3xl font-extrabold text-primary-700">${s.equipment}</p><p class="text-sm text-slate-500">Total Alat</p></div>
                    <div class="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border"><p class="text-3xl font-extrabold text-primary-700">${s.consumables}</p><p class="text-sm text-slate-500">Total Bahan</p></div>
                    <div class="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border"><p class="text-3xl font-extrabold text-red-600">${s.low_stock}</p><p class="text-sm text-slate-500">Stok Menipis</p></div>
                    <div class="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border"><p class="text-3xl font-extrabold text-primary-700">${s.schedules}</p><p class="text-sm text-slate-500">Jadwal Aktif</p></div>
                </div>
                <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border mb-6">
                    <h3 class="font-semibold text-slate-800 dark:text-white mb-3">Bahan Menipis</h3>
                    ${lowRows.length ? lowRows.map(r => `<div class="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                        <span class="text-sm">${esc(r.nama)}</span><span class="text-sm font-bold text-red-600">${esc(r.stok_sisa)} ${esc(r.satuan)} (min ${esc(r.stok_minimum)})</span></div>`).join('')
                        : '<p class="text-sm text-slate-400">Semua aman.</p>'}
                </div>
                <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border">
                    <h3 class="font-semibold text-slate-800 dark:text-white mb-3">Laporan Bulanan</h3>
                    <div class="flex flex-wrap items-end gap-3">
                        <div><label class="block text-sm font-medium mb-1">Bulan</label><select id="ml-bulan" class="px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm">${bulanList().map(b => `<option value="${b[0]}">${b[1]}</option>`).join('')}</select></div>
                        <div><label class="block text-sm font-medium mb-1">Tahun</label><select id="ml-tahun" class="px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm">${[2025, 2026].map(y => `<option>${y}</option>`).join('')}</select></div>
                        <button onclick="buatLaporanBulanan()" class="px-5 py-2.5 rounded-lg bg-primary-700 text-white text-sm font-semibold"><i data-lucide="file-text" class="w-4 h-4 inline mr-1"></i> Buat & Cetak Laporan</button>
                    </div>
                </div>
            </div>`;
            initIconsNow();
        } catch (e) { toast(e.message, 'error'); }
    })();
}

async function buatLaporanBulanan() {
    const bulan = $('#ml-bulan').value;
    const tahun = $('#ml-tahun').value;
    try {
        const m = await getMonthly(bulan, tahun);
        const user = Auth.current();
        Print.open(buildLaporanBulanan(m, { name: user.name, kepalalab: user.name }));
    } catch (e) { toast(e.message, 'error'); }
}

/* ================= APPROVE POSTINGAN ================= */
function vKepalaPostingan() {
    const content = $('#content');
    content.innerHTML = `<div class="p-6 text-center py-10 text-slate-400">Memuat...</div>`;
    getTable('posts').then(posts => {
        posts.sort((a, b) => String(b.tanggal).localeCompare(String(a.tanggal)));
        content.innerHTML = `
        <div class="p-6">
            <h1 class="font-display text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Persetujuan Postingan</h1>
            <p class="text-sm text-slate-500 mb-6">Setelah disetujui, Admin akan menerbitkan ke website publik.</p>
            <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-x-auto">
            <table class="w-full text-sm"><thead><tr class="text-left text-xs uppercase tracking-wider text-slate-400 bg-slate-50 dark:bg-slate-900">
                <th class="py-3 px-3">Judul</th><th class="py-3 px-3">Kategori</th><th class="py-3 px-3">Penulis</th><th class="py-3 px-3">Tanggal</th><th class="py-3 px-3">Status</th><th class="py-3 px-3 text-right">Aksi</th></tr></thead><tbody>
            ${posts.map(p => `<tr class="border-b border-slate-100 dark:border-slate-700">
                <td class="py-3 px-3 font-medium">${esc(p.judul)}</td><td class="py-3 px-3">${esc(p.kategori)}</td>
                <td class="py-3 px-3">${esc(p.penulis)}</td><td class="py-3 px-3">${fmtDate(p.tanggal)}</td><td class="py-3 px-3">${badge(p.status)}</td>
                <td class="py-3 px-3 text-right whitespace-nowrap">
                    ${p.status === 'Menunggu' ? `<button onclick="kepalaPost('${p.id}','Disetujui')" class="text-emerald-600 hover:underline text-sm font-semibold mr-2">✔ Setujui</button><button onclick="kepalaPost('${p.id}','Ditolak')" class="text-red-500 hover:underline text-sm font-semibold mr-2">✖</button>` : ''}
                    <button onclick="lihatPost('${p.id}')" class="text-cyan-600 hover:underline text-sm font-semibold">Lihat</button>
                </td></tr>`).join('') || '<tr><td colspan="6" class="py-8 text-center text-slate-400">Tidak ada postingan.</td></tr>'}
            </tbody></table></div>
        </div>`;
        window._klPosts = posts;
        initIconsNow();
    }).catch(e => toast(e.message, 'error'));
}

async function kepalaPost(id, status) {
    if (!confirm('Ubah status postingan menjadi ' + status + '?')) return;
    const user = Auth.current();
    try { await updateRow('posts', id, { status, by_kepala: status === 'Disetujui' ? user.name : '' }); toast('Status: ' + status); vKepalaPostingan(); }
    catch (e) { toast(e.message, 'error'); }
}

function lihatPost(id) {
    const p = (window._klPosts || []).find(x => x.id === String(id));
    if (!p) return;
    openModal(`<div class="p-6 max-w-3xl">
        <div class="flex items-center justify-between mb-4"><h3 class="font-display text-lg font-bold">${esc(p.judul)}</h3><button type="button" onclick="closeModal()" class="w-8 h-8 rounded-lg hover:bg-slate-100"><i data-lucide="x" class="w-5 h-5"></i></button></div>
        <p class="text-xs text-slate-400 mb-4">${esc(p.kategori)} · ${fmtDate(p.tanggal)} · ${esc(p.penulis)} · ${badge(p.status)}</p>
        <p class="text-sm text-slate-600 dark:text-slate-300 mb-4">${esc(p.ringkasan || '')}</p>
        <div id="kl-post-body" class="space-y-2"></div>
    </div>`);
    const box = $('#kl-post-body');
    try { const blocks = JSON.parse(p.isi || '[]'); (blocks || []).forEach(b => { const el = document.createElement('div'); el.className = 'text-sm text-slate-600 dark:text-slate-300'; el.textContent = b.v || ''; box.appendChild(el); }); } catch (e) { }
    initIconsNow();
}

window.boards.kepalalab = {
    nav: [
        { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
        { id: 'postingan', label: 'Setujui Postingan', icon: 'newspaper' },
        { id: 'pengajuan-alat', label: 'Setujui Pengajuan Alat', icon: 'shopping-bag' },
        { id: 'pengajuan-bahan', label: 'Setujui Pengajuan Bahan', icon: 'shopping-cart' },
        { id: 'peminjaman', label: 'Setujui Peminjaman', icon: 'hand' },
        { id: 'laporan', label: 'Setujui Laporan', icon: 'file-text' },
        { id: 'sertifikat', label: 'Setujui Sertifikat', icon: 'award' },
        { id: 'statistik', label: 'Statistik & Lap. Bulanan', icon: 'bar-chart-3' }
    ],
    views: {
        dashboard: vKepalaDashboard,
        postingan: vKepalaPostingan,
        'pengajuan-alat': vKepalaPengajuanAlat,
        'pengajuan-bahan': vKepalaPengajuanBahan,
        peminjaman: vKepalaPeminjaman,
        laporan: vKepalaLaporan,
        sertifikat: vKepalaSertifikat,
        statistik: vKepalaStatistik
    }
};