/*********************************************************************
 * DASHBOARD — Role: Laboran
 * Inventaris alat, bahan habis pakai, pengajuan, jadwal, peminjaman, laporan
 *********************************************************************/

function vLaboranDashboard() {
    const content = $('#content');
    const user = Auth.current();
    content.innerHTML = `<div class="p-6 text-center py-10 text-slate-400">Memuat...</div>`;
    (async () => {
        try {
            const s = await getSummary();
            const cards = [
                { label: 'Alat Lab', val: s.equipment, icon: 'microscope', c: 'text-cyan-600 bg-cyan-100' },
                { label: 'Bahan (stok menipis)', val: s.low_stock, icon: 'package', c: 'text-red-600 bg-red-100' },
                { label: 'Peminjaman Menunggu', val: s.bor_pending, icon: 'hand', c: 'text-amber-600 bg-amber-100' },
                { label: 'Laporan Menunggu', val: s.rep_pending, icon: 'file-text', c: 'text-purple-600 bg-purple-100' },
                { label: 'Pengajuan Menunggu', val: s.req_pending, icon: 'shopping-bag', c: 'text-indigo-600 bg-indigo-100' },
                { label: 'Jadwal Aktif', val: s.schedules, icon: 'calendar', c: 'text-emerald-600 bg-emerald-100' }
            ];
            content.innerHTML = `
            <div class="p-6 md:p-8">
                <h1 class="font-display text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">Halo, ${esc(user.name)} 🔬</h1>
                <p class="text-sm text-slate-500 mt-1">Kelola inventaris, pengajuan, dan layanan laboratorium.</p>
                <div class="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                    ${cards.map(c => `<div class="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
                        <div class="w-11 h-11 rounded-xl ${c.c} flex items-center justify-center mb-3"><i data-lucide="${c.icon}" class="w-5 h-5"></i></div>
                        <p class="text-2xl font-extrabold text-slate-800 dark:text-white">${c.val}</p><p class="text-sm text-slate-500">${c.label}</p></div>`).join('')}
                </div>
                <div class="mt-6 grid lg:grid-cols-2 gap-5">
                    <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
                        <h3 class="font-semibold mb-3">Aksi Cepat</h3>
                        <div class="grid grid-cols-2 gap-2 text-sm">
                            <a href="#" onclick="goto('inventaris-alat');return false;" class="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-cyan-50 dark:bg-slate-700 text-cyan-700 dark:text-cyan-300"><i data-lucide="microscope" class="w-4 h-4"></i> Inventaris Alat</a>
                            <a href="#" onclick="goto('pengajuan-alat');return false;" class="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-amber-50 dark:bg-slate-700 text-amber-700 dark:text-amber-300"><i data-lucide="shopping-bag" class="w-4 h-4"></i> Pengajuan Alat</a>
                            <a href="#" onclick="goto('peminjaman');return false;" class="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-blue-50 dark:bg-slate-700 text-blue-700 dark:text-blue-300"><i data-lucide="hand" class="w-4 h-4"></i> Peminjaman</a>
                            <a href="#" onclick="goto('laporan');return false;" class="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-purple-50 dark:bg-slate-700 text-purple-700 dark:text-purple-300"><i data-lucide="file-text" class="w-4 h-4"></i> Verifikasi Laporan</a>
                        </div>
                    </div>
                    ${s.low_stock ? '' : ''}
                </div>
            </div>`;
            initIconsNow();
        } catch (e) { toast(e.message, 'error'); }
    })();
}

/* ================= INVENTARIS ALAT (CRUD) ================= */
function vLaboranInventarisAlat() {
    const content = $('#content');
    content.innerHTML = `<div class="p-6 text-center py-10 text-slate-400">Memuat...</div>`;
    getTable('equipment').then(eq => {
        window._eqData = eq;
        content.innerHTML = `
        <div class="p-6">
            <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
                <h1 class="font-display text-2xl font-extrabold text-slate-900 dark:text-white">Inventaris Alat Lab</h1>
                <div class="flex gap-2">
                    <button onclick="printInventarisAlat()" class="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-sm font-semibold hover:bg-slate-50"><i data-lucide="printer" class="w-4 h-4"></i> Cetak</button>
                    <button onclick="modalAlat()" class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-700 text-white text-sm font-semibold hover:bg-primary-800"><i data-lucide="plus" class="w-4 h-4"></i> Tambah Alat</button>
                </div>
            </div>
            <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-x-auto">
                <table class="w-full text-sm"><thead><tr class="text-left text-xs uppercase tracking-wider text-slate-400 bg-slate-50 dark:bg-slate-900">
                    <th class="py-3 px-3">Kode</th><th class="py-3 px-3">Nama</th><th class="py-3 px-3 text-center">Jumlah</th><th class="py-3 px-3">Kondisi</th><th class="py-3 px-3">Lokasi</th><th class="py-3 px-3">Masuk</th><th class="py-3 px-3 text-right">Aksi</th></tr></thead><tbody>
                ${eq.map(r => `<tr class="border-b border-slate-100 dark:border-slate-700">
                    <td class="py-3 px-3 text-slate-500">${esc(r.kode)}</td><td class="py-3 px-3 font-medium text-slate-800 dark:text-white">${esc(r.nama)}</td>
                    <td class="py-3 px-3 text-center text-slate-600">${esc(r.jumlah)}</td><td class="py-3 px-3">${badge(r.kondisi)}</td>
                    <td class="py-3 px-3 text-slate-600">${esc(r.lokasi_lab)}</td><td class="py-3 px-3 text-slate-600">${fmtDate(r.tanggal_masuk)}</td>
                    <td class="py-3 px-3 text-right whitespace-nowrap">
                        <button onclick='modalAlatEdit(${JSON.stringify(r).replace(/'/g, '&#39;')})' class="text-cyan-600 hover:underline text-sm font-semibold mr-2">Edit</button>
                        <button onclick="hapusAlat('${r.id}')" class="text-red-500 hover:underline text-sm font-semibold">Hapus</button></td></tr>`).join('') || '<tr><td colspan="7" class="py-8 text-center text-slate-400">Belum ada data.</td></tr>'}
                </tbody></table></div>
        </div>`;
        initIconsNow();
    }).catch(e => toast(e.message, 'error'));
}

function printInventarisAlat() { Print.open(buildLaporanInventaris(window._eqData || [])); }

function modalAlat(data = {}) {
    const isEdit = !!data.id;
    openModal(`
        <form id="frm-alat" class="p-6">
            <div class="flex items-center justify-between mb-4"><h3 class="font-display text-lg font-bold text-slate-900 dark:text-white">${isEdit ? 'Edit' : 'Tambah'} Alat Lab</h3><button type="button" onclick="closeModal()" class="w-8 h-8 rounded-lg hover:bg-slate-100"><i data-lucide="x" class="w-5 h-5"></i></button></div>
            <div class="space-y-4">
                <div class="grid grid-cols-2 gap-3">
                    <div><label class="block text-sm font-medium mb-1">Kode</label><input id="a-kode" required value="${esc(data.kode || '')}" placeholder="EQ-007" class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm"></div>
                    <div><label class="block text-sm font-medium mb-1">Jumlah</label><input id="a-jumlah" type="number" min="1" required value="${esc(data.jumlah || 1)}" class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm"></div>
                </div>
                <div><label class="block text-sm font-medium mb-1">Nama Alat</label><input id="a-nama" required value="${esc(data.nama || '')}" placeholder="Mikroskop Binokuler" class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm"></div>
                <div class="grid grid-cols-2 gap-3">
                    <div><label class="block text-sm font-medium mb-1">Kondisi</label><select id="a-kondisi" class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm">
                        <option ${data.kondisi === 'Baik' ? 'selected' : ''}>Baik</option><option ${data.kondisi === 'Perbaikan' ? 'selected' : ''}>Perbaikan</option><option ${data.kondisi === 'Rusak' ? 'selected' : ''}>Rusak</option></select></div>
                    <div><label class="block text-sm font-medium mb-1">Tanggal Masuk</label><input id="a-tanggal" type="date" value="${esc(data.tanggal_masuk || todayStr())}" class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm"></div>
                </div>
                <div><label class="block text-sm font-medium mb-1">Lokasi Lab</label><input id="a-lokasi" required value="${esc(data.lokasi_lab || '')}" class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm"></div>
                <div><label class="block text-sm font-medium mb-1">Keterangan</label><input id="a-ket" value="${esc(data.keterangan || '')}" class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm"></div>
                <button class="w-full py-2.5 rounded-lg bg-primary-700 text-white font-semibold text-sm">${isEdit ? 'Simpan Perubahan' : 'Tambah Alat'}</button>
            </div>
        </form>`);
    $('#frm-alat').addEventListener('submit', async e => {
        e.preventDefault();
        const payload = {
            kode: $('#a-kode').value, nama: $('#a-nama').value, jumlah: $('#a-jumlah').value,
            kondisi: $('#a-kondisi').value, lokasi_lab: $('#a-lokasi').value,
            tanggal_masuk: $('#a-tanggal').value || todayStr(), keterangan: $('#a-ket').value
        };
        try {
            if (isEdit) { await updateRow('equipment', data.id, payload); toast('Data alat diperbarui'); }
            else { await addRow('equipment', payload); toast('Alat ditambahkan'); }
            closeModal(); vLaboranInventarisAlat();
        } catch (err) { toast(err.message, 'error'); }
    });
}
function modalAlatEdit(d) { modalAlat(d); }
async function hapusAlat(id) {
    if (!confirm('Hapus alat ini?')) return;
    try { await deleteRow('equipment', id); toast('Alat dihapus'); vLaboranInventarisAlat(); }
    catch (e) { toast(e.message, 'error'); }
}

/* ================= INVENTARIS BAHAN (stok) ================= */
function vLaboranInventarisBahan() {
    const content = $('#content');
    content.innerHTML = `<div class="p-6 text-center py-10 text-slate-400">Memuat...</div>`;
    getTable('consumables').then(cb => {
        window._cbData = cb;
        content.innerHTML = `
        <div class="p-6">
            <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
                <h1 class="font-display text-2xl font-extrabold text-slate-900 dark:text-white">Inventaris Bahan Habis Pakai</h1>
                <div class="flex gap-2">
                    <button onclick="printKartuStok()" class="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-sm font-semibold hover:bg-slate-50"><i data-lucide="printer" class="w-4 h-4"></i> Kartu Stok</button>
                    <button onclick="modalBahan()" class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-700 text-white text-sm font-semibold hover:bg-primary-800"><i data-lucide="plus" class="w-4 h-4"></i> Tambah Bahan</button>
                </div>
            </div>
            <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-x-auto">
                <table class="w-full text-sm"><thead><tr class="text-left text-xs uppercase tracking-wider text-slate-400 bg-slate-50 dark:bg-slate-900">
                    <th class="py-3 px-3">Kode</th><th class="py-3 px-3">Nama</th><th class="py-3 px-3 text-center">Masuk</th><th class="py-3 px-3 text-center">Keluar</th>
                    <th class="py-3 px-3 text-center">Sisa</th><th class="py-3 px-3 text-center">Min.</th><th class="py-3 px-3">Status</th><th class="py-3 px-3 text-right">Aksi</th></tr></thead><tbody>
                ${cb.map(r => {
                    const low = (parseInt(r.stok_sisa, 10) || 0) <= (parseInt(r.stok_minimum, 10) || 0);
                    return `<tr class="border-b border-slate-100 dark:border-slate-700 ${low ? 'bg-red-50 dark:bg-red-900/10' : ''}">
                        <td class="py-3 px-3 text-slate-500">${esc(r.kode)}</td><td class="py-3 px-3 font-medium text-slate-800 dark:text-white">${esc(r.nama)}</td>
                        <td class="py-3 px-3 text-center text-slate-600">${esc(r.stok_masuk)}</td><td class="py-3 px-3 text-center text-slate-600">${esc(r.stok_keluar)}</td>
                        <td class="py-3 px-3 text-center font-bold text-slate-800 dark:text-white">${esc(r.stok_sisa)} ${esc(r.satuan)}</td>
                        <td class="py-3 px-3 text-center text-slate-400">${esc(r.stok_minimum)}</td>
                        <td class="py-3 px-3">${low ? '<span class="text-xs font-bold text-red-600">⚠ MENIPIS</span>' : '<span class="text-xs font-bold text-emerald-600">AMAN</span>'}</td>
                        <td class="py-3 px-3 text-right whitespace-nowrap">
                            <button onclick="modalStokMasuk('${r.id}')" class="text-emerald-600 hover:underline text-sm font-semibold mr-2">+ Masuk</button>
                            <button onclick="modalStokKeluar('${r.id}')" class="text-amber-600 hover:underline text-sm font-semibold mr-2">- Keluar</button>
                            <button onclick='modalBahanEdit(${JSON.stringify(r).replace(/'/g, '&#39;')})' class="text-cyan-600 hover:underline text-sm font-semibold mr-2">Edit</button></td></tr>`;
                }).join('') || '<tr><td colspan="8" class="py-8 text-center text-slate-400">Belum ada data.</td></tr>'}
                </tbody></table></div>
        </div>`;
        initIconsNow();
    }).catch(e => toast(e.message, 'error'));
}

function printKartuStok() { Print.open(buildKartuStok(window._cbData || [])); }

function modalBahan(data = {}) {
    const isEdit = !!data.id;
    openModal(`
        <form id="frm-bahan" class="p-6">
            <div class="flex items-center justify-between mb-4"><h3 class="font-display text-lg font-bold text-slate-900 dark:text-white">${isEdit ? 'Edit' : 'Tambah'} Bahan</h3><button type="button" onclick="closeModal()" class="w-8 h-8 rounded-lg hover:bg-slate-100"><i data-lucide="x" class="w-5 h-5"></i></button></div>
            <div class="space-y-4">
                <div class="grid grid-cols-2 gap-3">
                    <div><label class="block text-sm font-medium mb-1">Kode</label><input id="b-kode" required value="${esc(data.kode || '')}" placeholder="CB-007" class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm"></div>
                    <div><label class="block text-sm font-medium mb-1">Satuan</label><input id="b-satuan" required value="${esc(data.satuan || '')}" placeholder="liter / box / pak" class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm"></div>
                </div>
                <div><label class="block text-sm font-medium mb-1">Nama Bahan</label><input id="b-nama" required value="${esc(data.nama || '')}" class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm"></div>
                <div class="grid grid-cols-2 gap-3">
                    <div><label class="block text-sm font-medium mb-1">Stok Sisa</label><input id="b-sisa" required type="number" min="0" value="${esc(data.stok_sisa || 0)}" class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm"></div>
                    <div><label class="block text-sm font-medium mb-1">Stok Minimum</label><input id="b-min" required type="number" min="0" value="${esc(data.stok_minimum || 0)}" class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm"></div>
                </div>
                <div><label class="block text-sm font-medium mb-1">Supplier</label><input id="b-supplier" value="${esc(data.supplier || '')}" class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm"></div>
                <button class="w-full py-2.5 rounded-lg bg-primary-700 text-white font-semibold text-sm">${isEdit ? 'Simpan' : 'Tambah Bahan'}</button>
            </div>
        </form>`);
    $('#frm-bahan').addEventListener('submit', async e => {
        e.preventDefault();
        const payload = {
            kode: $('#b-kode').value, nama: $('#b-nama').value, satuan: $('#b-satuan').value,
            stok_masuk: data.stok_masuk || 0, stok_keluar: data.stok_keluar || 0,
            stok_sisa: $('#b-sisa').value, stok_minimum: $('#b-min').value,
            supplier: $('#b-supplier').value, keterangan: ''
        };
        try {
            if (isEdit) { await updateRow('consumables', data.id, payload); toast('Bahan diperbarui'); }
            else { payload.stok_sisa = $('#b-sisa').value; await addRow('consumables', payload); toast('Bahan ditambahkan'); }
            closeModal(); vLaboranInventarisBahan();
        } catch (err) { toast(err.message, 'error'); }
    });
}
function modalBahanEdit(d) { modalBahan(d); }

async function modalStokMasuk(id) {
    const r = (window._cbData || []).find(x => x.id === String(id));
    if (!r) return;
    const n = prompt('Jumlah stok masuk (' + r.satuan + ') untuk ' + r.nama + ':', '0');
    if (n === null) return;
    const add = parseInt(n, 10); if (isNaN(add) || add <= 0) { toast('Jumlah tidak valid', 'warn'); return; }
    const masuk = (parseInt(r.stok_masuk, 10) || 0) + add;
    const sisa = (parseInt(r.stok_sisa, 10) || 0) + add;
    try {
        await updateRow('consumables', id, { stok_masuk: masuk, stok_sisa: sisa });
        toast(r.nama + ': stok masuk +' + add); vLaboranInventarisBahan();
    } catch (e) { toast(e.message, 'error'); }
}

async function modalStokKeluar(id) {
    const r = (window._cbData || []).find(x => x.id === String(id));
    if (!r) return;
    const n = prompt('Jumlah stok keluar (' + r.satuan + ') untuk ' + r.nama + ':', '0');
    if (n === null) return;
    const sub = parseInt(n, 10); if (isNaN(sub) || sub <= 0) { toast('Jumlah tidak valid', 'warn'); return; }
    const keluar = (parseInt(r.stok_keluar, 10) || 0) + sub;
    const sisa = (parseInt(r.stok_sisa, 10) || 0) - sub;
    if (sisa < 0) { toast('Stok tidak cukup!', 'warn'); return; }
    try {
        await updateRow('consumables', id, { stok_keluar: keluar, stok_sisa: sisa });
        toast(r.nama + ': stok keluar -' + sub); vLaboranInventarisBahan();
    } catch (e) { toast(e.message, 'error'); }
}

/* ================= PENGAJUAN ALAT ================= */
function vLaboranPengajuanAlat() {
    const content = $('#content');
    const user = Auth.current();
    content.innerHTML = `<div class="p-6 text-center py-10 text-slate-400">Memuat...</div>`;
    getTable('equipment_req').then(list => {
        window._eqReqData = list;
        content.innerHTML = `
        <div class="p-6">
            <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
                <h1 class="font-display text-2xl font-extrabold text-slate-900 dark:text-white">Pengajuan Alat Lab</h1>
                <button onclick="modalPengajuanAlat()" class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-700 text-white text-sm font-semibold hover:bg-primary-800"><i data-lucide="plus" class="w-4 h-4"></i> Ajukan Pengadaan</button>
            </div>
            <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-x-auto">
                <table class="w-full text-sm"><thead><tr class="text-left text-xs uppercase tracking-wider text-slate-400 bg-slate-50 dark:bg-slate-900">
                    <th class="py-3 px-3">No. Surat</th><th class="py-3 px-3">Nama Alat</th><th class="py-3 px-3 text-center">Jumlah</th><th class="py-3 px-3">Tanggal</th><th class="py-3 px-3">Status</th><th class="py-3 px-3 text-right">Aksi</th></tr></thead><tbody>
                ${list.map(r => `<tr class="border-b border-slate-100 dark:border-slate-700">
                    <td class="py-3 px-3 font-medium text-slate-800 dark:text-white">${esc(r.no_surat)}</td>
                    <td class="py-3 px-3 text-slate-600">${esc(r.nama_alat)}</td><td class="py-3 px-3 text-center text-slate-600">${esc(r.jumlah)}</td>
                    <td class="py-3 px-3 text-slate-600">${fmtDate(r.tanggal)}</td><td class="py-3 px-3">${badge(r.status)}</td>
                    <td class="py-3 px-3 text-right">
                        ${r.status === 'Diproses' ? `<button onclick="terimaAlat('${r.id}')" class="text-emerald-600 hover:underline text-sm font-semibold mr-2">✔ Terima Barang</button>` : ''}
                        <button onclick="printPengajuanAlat('${r.id}')" class="text-cyan-600 hover:underline text-sm font-semibold">Cetak Surat</button></td></tr>`).join('') || '<tr><td colspan="6" class="py-8 text-center text-slate-400">Belum ada pengajuan.</td></tr>'}
                </tbody></table></div>
        </div>`;
        initIconsNow();
    }).catch(e => toast(e.message, 'error'));
}

function modalPengajuanAlat() {
    const user = Auth.current();
    openModal(`
        <form id="frm-pa" class="p-6">
            <div class="flex items-center justify-between mb-4"><h3 class="font-display text-lg font-bold text-slate-900 dark:text-white">Pengajuan Pengadaan Alat</h3><button type="button" onclick="closeModal()" class="w-8 h-8 rounded-lg hover:bg-slate-100"><i data-lucide="x" class="w-5 h-5"></i></button></div>
            <div class="space-y-4">
                <div><label class="block text-sm font-medium mb-1">Nama Alat</label><input id="pa-nama" required placeholder="Mikroskop Stereo" class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm"></div>
                <div class="grid grid-cols-2 gap-3">
                    <div><label class="block text-sm font-medium mb-1">Jumlah</label><input id="pa-jumlah" required type="number" min="1" value="1" class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm"></div>
                    <div><label class="block text-sm font-medium mb-1">Spesifikasi</label><input id="pa-spec" placeholder="Kemo, objektif 40x" class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm"></div>
                </div>
                <div><label class="block text-sm font-medium mb-1">Alasan Pengadaan</label><textarea id="pa-alasan" required rows="2" class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm"></textarea></div>
                <button class="w-full py-2.5 rounded-lg bg-primary-700 text-white font-semibold text-sm">Ajukan</button>
            </div>
        </form>`);
    $('#frm-pa').addEventListener('submit', async e => {
        e.preventDefault();
        try {
            const no = await nextNo('PA');
            await addRow('equipment_req', {
                no_surat: no, nama_alat: $('#pa-nama').value, jumlah: $('#pa-jumlah').value,
                spesifikasi: $('#pa-spec').value, alasan: $('#pa-alasan').value,
                pengaju: user.name, tanggal: todayStr(), status: 'Menunggu', by_kepala: '', keterangan: '', tanggal_selesai: ''
            });
            closeModal(); toast('Pengajuan dibuat: ' + no); vLaboranPengajuanAlat();
        } catch (err) { toast(err.message, 'error'); }
    });
}

function printPengajuanAlat(id) {
    const r = (window._eqReqData || []).find(x => x.id === String(id));
    if (!r) return;
    const names = { laboran: r.pengaju, kepalalab: r.by_kepala || '' };
    Print.open(buildSuratPengajuan(r, names, 'alat'));
}

async function terimaAlat(id) {
    const r = (window._eqReqData || []).find(x => x.id === String(id));
    if (!r) return;
    const lokasi = prompt('Lokasi penempatan alat ' + r.nama_alat + ':', 'Kampus Medan Estate');
    if (lokasi === null) return;
    const idBaru = prompt('Kode inventaris (mis. EQ-007):', 'EQ-' + String(Date.now()).slice(-3));
    if (idBaru === null) return;
    try {
        await addRow('equipment', {
            kode: idBaru, nama: r.nama_alat, jumlah: r.jumlah, kondisi: 'Baik',
            lokasi_lab: lokasi, tanggal_masuk: todayStr(), keterangan: 'Dari: ' + r.no_surat
        });
        await updateRow('equipment_req', id, { status: 'Selesai', tanggal_selesai: todayStr() });
        toast(r.nama_alat + ' masuk inventaris (Selesai)'); vLaboranPengajuanAlat();
    } catch (e) { toast(e.message, 'error'); }
}

/* ================= PENGAJUAN BAHAN ================= */
function vLaboranPengajuanBahan() {
    const content = $('#content');
    const user = Auth.current();
    content.innerHTML = `<div class="p-6 text-center py-10 text-slate-400">Memuat...</div>`;
    getTable('consumable_req').then(list => {
        window._cbReqData = list;
        content.innerHTML = `
        <div class="p-6">
            <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
                <h1 class="font-display text-2xl font-extrabold text-slate-900 dark:text-white">Pengajuan Bahan Habis Pakai</h1>
                <button onclick="modalPengajuanBahan()" class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-700 text-white text-sm font-semibold hover:bg-primary-800"><i data-lucide="plus" class="w-4 h-4"></i> Ajukan Pengadaan</button>
            </div>
            <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-x-auto">
                <table class="w-full text-sm"><thead><tr class="text-left text-xs uppercase tracking-wider text-slate-400 bg-slate-50 dark:bg-slate-900">
                    <th class="py-3 px-3">No. Surat</th><th class="py-3 px-3">Nama Bahan</th><th class="py-3 px-3 text-center">Jumlah</th><th class="py-3 px-3">Tanggal</th><th class="py-3 px-3">Status</th><th class="py-3 px-3 text-right">Aksi</th></tr></thead><tbody>
                ${list.map(r => `<tr class="border-b border-slate-100 dark:border-slate-700">
                    <td class="py-3 px-3 font-medium text-slate-800 dark:text-white">${esc(r.no_surat)}</td>
                    <td class="py-3 px-3 text-slate-600">${esc(r.nama_bahan)}</td><td class="py-3 px-3 text-center text-slate-600">${esc(r.jumlah)} ${esc(r.satuan)}</td>
                    <td class="py-3 px-3 text-slate-600">${fmtDate(r.tanggal)}</td><td class="py-3 px-3">${badge(r.status)}</td>
                    <td class="py-3 px-3 text-right">
                        ${r.status === 'Diproses' ? `<button onclick="terimaBahan('${r.id}')" class="text-emerald-600 hover:underline text-sm font-semibold mr-2">✔ Terima Barang</button>` : ''}
                        <button onclick="printPengajuanBahan('${r.id}')" class="text-cyan-600 hover:underline text-sm font-semibold">Cetak Surat</button></td></tr>`).join('') || '<tr><td colspan="6" class="py-8 text-center text-slate-400">Belum ada pengajuan.</td></tr>'}
                </tbody></table></div>
        </div>`;
        initIconsNow();
    }).catch(e => toast(e.message, 'error'));
}

function modalPengajuanBahan() {
    const user = Auth.current();
    openModal(`
        <form id="frm-pb" class="p-6">
            <div class="flex items-center justify-between mb-4"><h3 class="font-display text-lg font-bold text-slate-900 dark:text-white">Pengajuan Pengadaan Bahan</h3><button type="button" onclick="closeModal()" class="w-8 h-8 rounded-lg hover:bg-slate-100"><i data-lucide="x" class="w-5 h-5"></i></button></div>
            <div class="space-y-4">
                <div><label class="block text-sm font-medium mb-1">Nama Bahan</label><input id="pb-nama" required placeholder="Reagen Methanol" class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm"></div>
                <div class="grid grid-cols-2 gap-3">
                    <div><label class="block text-sm font-medium mb-1">Jumlah</label><input id="pb-jumlah" required type="number" min="1" value="1" class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm"></div>
                    <div><label class="block text-sm font-medium mb-1">Satuan</label><input id="pb-satuan" required placeholder="liter / botol" class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm"></div>
                </div>
                <div><label class="block text-sm font-medium mb-1">Alasan Pengadaan</label><textarea id="pb-alasan" required rows="2" class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm"></textarea></div>
                <button class="w-full py-2.5 rounded-lg bg-primary-700 text-white font-semibold text-sm">Ajukan</button>
            </div>
        </form>`);
    $('#frm-pb').addEventListener('submit', async e => {
        e.preventDefault();
        try {
            const no = await nextNo('PB');
            await addRow('consumable_req', {
                no_surat: no, nama_bahan: $('#pb-nama').value, jumlah: $('#pb-jumlah').value,
                satuan: $('#pb-satuan').value, alasan: $('#pb-alasan').value,
                pengaju: user.name, tanggal: todayStr(), status: 'Menunggu', by_kepala: '', keterangan: '', tanggal_selesai: ''
            });
            closeModal(); toast('Pengajuan dibuat: ' + no); vLaboranPengajuanBahan();
        } catch (err) { toast(err.message, 'error'); }
    });
}

function printPengajuanBahan(id) {
    const r = (window._cbReqData || []).find(x => x.id === String(id));
    if (!r) return;
    const names = { laboran: r.pengaju, kepalalab: r.by_kepala || '' };
    Print.open(buildSuratPengajuan(r, names, 'bahan'));
}

async function terimaBahan(id) {
    const r = (window._cbReqData || []).find(x => x.id === String(id));
    if (!r) return;
    const tambah = prompt('Jumlah ' + r.nama_bahan + ' yang masuk (' + r.satuan + '):', r.jumlah);
    if (tambah === null) return;
    const add = parseInt(tambah, 10);
    if (isNaN(add) || add <= 0) { toast('Jumlah tidak valid', 'warn'); return; }
    const namaBahan = r.nama_bahan;
    const satuan = r.satuan;
    try {
        const cb = await getTable('consumables');
        const existing = cb.find(c => c.nama.toLowerCase() === String(namaBahan).toLowerCase());
        if (existing) {
            await updateRow('consumables', existing.id, {
                stok_masuk: (parseInt(existing.stok_masuk, 10) || 0) + add,
                stok_sisa: (parseInt(existing.stok_sisa, 10) || 0) + add
            });
        } else {
            const min = prompt('Batas stok minimum (untuk peringatan):', '10');
            const kode = prompt('Kode inventaris (mis. CB-008):', 'CB-' + String(Date.now()).slice(-3));
            await addRow('consumables', {
                kode: kode, nama: namaBahan, satuan: satuan, stok_masuk: add, stok_keluar: 0,
                stok_sisa: add, stok_minimum: min || 10, supplier: '', keterangan: 'Dari: ' + r.no_surat
            });
        }
        await updateRow('consumable_req', id, { status: 'Selesai', tanggal_selesai: todayStr() });
        toast(r.nama_bahan + ' masuk stok (Selesai)'); vLaboranPengajuanBahan();
    } catch (e) { toast(e.message, 'error'); }
}

/* ================= JADWAL PRAKTIKUM (CRUD) ================= */
function vLaboranJadwal() {
    const content = $('#content');
    content.innerHTML = `<div class="p-6 text-center py-10 text-slate-400">Memuat...</div>`;
    getTable('schedules').then(list => {
        window._schData2 = list;
        content.innerHTML = `
        <div class="p-6">
            <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
                <h1 class="font-display text-2xl font-extrabold text-slate-900 dark:text-white">Jadwal Praktikum</h1>
                <button onclick="modalJadwal()" class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-700 text-white text-sm font-semibold hover:bg-primary-800"><i data-lucide="plus" class="w-4 h-4"></i> Tambah Jadwal</button>
            </div>
            <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-x-auto">
                <table class="w-full text-sm"><thead><tr class="text-left text-xs uppercase tracking-wider text-slate-400 bg-slate-50 dark:bg-slate-900">
                    <th class="py-3 px-3">Kode</th><th class="py-3 px-3">Matakuliah</th><th class="py-3 px-3">Lab</th><th class="py-3 px-3">Fak/Prodi</th><th class="py-3 px-3">Dosen</th><th class="py-3 px-3">Asisten</th><th class="py-3 px-3">Jadwal</th><th class="py-3 px-3">Ruang</th><th class="py-3 px-3 text-right">Aksi</th></tr></thead><tbody>
                ${list.map(s => `<tr class="border-b border-slate-100 dark:border-slate-700">
                    <td class="py-3 px-3 text-slate-500">${esc(s.kode)}</td><td class="py-3 px-3 font-medium text-slate-800 dark:text-white">${esc(s.matkul)}</td>
                    <td class="py-3 px-3 text-slate-600">${esc(s.lab)}</td><td class="py-3 px-3 text-slate-600">${esc(s.fakultas)}/${esc(s.prodi)}</td>
                    <td class="py-3 px-3 text-slate-600">${esc(s.dosen)}</td><td class="py-3 px-3 text-slate-600">${esc(s.asisten)}</td>
                    <td class="py-3 px-3 text-slate-600">${esc(s.hari)} ${esc(s.jam_mulai)}-${esc(s.jam_selesai)}</td><td class="py-3 px-3 text-slate-600">${esc(s.ruang)}</td>
                    <td class="py-3 px-3 text-right"><button onclick='modalJadwalEdit(${JSON.stringify(s).replace(/'/g, '&#39;')})' class="text-cyan-600 hover:underline text-sm font-semibold mr-2">Edit</button>
                    <button onclick="hapusJadwal('${s.id}')" class="text-red-500 hover:underline text-sm font-semibold">Hapus</button></td></tr>`).join('') || '<tr><td colspan="9" class="py-8 text-center text-slate-400">Belum ada jadwal.</td></tr>'}
                </tbody></table></div>
        </div>`;
        initIconsNow();
    }).catch(e => toast(e.message, 'error'));
}

function modalJadwal(data = {}) {
    const isEdit = !!data.id;
    const user = Auth.current();
    openModal(`
        <form id="frm-jadwal" class="p-6">
            <div class="flex items-center justify-between mb-4"><h3 class="font-display text-lg font-bold text-slate-900 dark:text-white">${isEdit ? 'Edit' : 'Tambah'} Jadwal</h3><button type="button" onclick="closeModal()" class="w-8 h-8 rounded-lg hover:bg-slate-100"><i data-lucide="x" class="w-5 h-5"></i></button></div>
            <div class="space-y-4">
                <div class="grid grid-cols-2 gap-3">
                    <div><label class="block text-sm font-medium mb-1">Kode</label><input id="j-kode" required value="${esc(data.kode || '')}" placeholder="SD-004" class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm"></div>
                    <div><label class="block text-sm font-medium mb-1">Lab</label><input id="j-lab" required value="${esc(data.lab || '')}" class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm"></div>
                </div>
                <div><label class="block text-sm font-medium mb-1">Matakuliah</label><input id="j-matkul" required value="${esc(data.matkul || '')}" class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm"></div>
                <div class="grid grid-cols-2 gap-3">
                    <div><label class="block text-sm font-medium mb-1">Fakultas</label><input id="j-fak" required value="${esc(data.fakultas || '')}" class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm"></div>
                    <div><label class="block text-sm font-medium mb-1">Prodi</label><input id="j-prodi" required value="${esc(data.prodi || '')}" class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm"></div>
                </div>
                <div class="grid grid-cols-3 gap-3">
                    <div><label class="block text-sm font-medium mb-1">Dosen</label><input id="j-dosen" required value="${esc(data.dosen || '')}" class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm"></div>
                    <div><label class="block text-sm font-medium mb-1">Asisten</label><input id="j-asisten" required value="${esc(data.asisten || user.name)}" class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm"></div>
                    <div><label class="block text-sm font-medium mb-1">Ruang</label><input id="j-ruang" required value="${esc(data.ruang || '')}" class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm"></div>
                </div>
                <div class="grid grid-cols-3 gap-3">
                    <div><label class="block text-sm font-medium mb-1">Hari</label><select id="j-hari" class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm">${['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map(h => `<option ${data.hari === h ? 'selected' : ''}>${h}</option>`).join('')}</select></div>
                    <div><label class="block text-sm font-medium mb-1">Mulai</label><input id="j-mulai" type="time" required value="${esc(data.jam_mulai || '08:00')}" class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm"></div>
                    <div><label class="block text-sm font-medium mb-1">Selesai</label><input id="j-selesai" type="time" required value="${esc(data.jam_selesai || '10:00')}" class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm"></div>
                </div>
                <div><label class="block text-sm font-medium mb-1">Semester</label><input id="j-semester" required value="${esc(data.semester || 'Ganjil 2025/2026')}" class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm"></div>
                <button class="w-full py-2.5 rounded-lg bg-primary-700 text-white font-semibold text-sm">${isEdit ? 'Simpan' : 'Tambah Jadwal'}</button>
            </div>
        </form>`);
    $('#frm-jadwal').addEventListener('submit', async e => {
        e.preventDefault();
        const payload = {
            kode: $('#j-kode').value, lab: $('#j-lab').value, matkul: $('#j-matkul').value,
            fakultas: $('#j-fak').value, prodi: $('#j-prodi').value, dosen: $('#j-dosen').value,
            asisten: $('#j-asisten').value, hari: $('#j-hari').value, jam_mulai: $('#j-mulai').value,
            jam_selesai: $('#j-selesai').value, ruang: $('#j-ruang').value, semester: $('#j-semester').value
        };
        try {
            if (isEdit) { await updateRow('schedules', data.id, payload); toast('Jadwal diperbarui'); }
            else { payload.kode = payload.kode || 'SD-' + Date.now(); await addRow('schedules', payload); toast('Jadwal ditambahkan'); }
            closeModal(); vLaboranJadwal();
        } catch (err) { toast(err.message, 'error'); }
    });
}
function modalJadwalEdit(d) { modalJadwal(d); }
async function hapusJadwal(id) {
    if (!confirm('Hapus jadwal ini?')) return;
    try { await deleteRow('schedules', id); toast('Jadwal dihapus'); vLaboranJadwal(); }
    catch (e) { toast(e.message, 'error'); }
}

/* ================= PEMINJAMAN (proses laboran) ================= */
function vLaboranPeminjaman() {
    const content = $('#content');
    const user = Auth.current();
    content.innerHTML = `<div class="p-6 text-center py-10 text-slate-400">Memuat...</div>`;
    getTable('borrowings').then(bor => {
        window._borDataL = bor;
        content.innerHTML = `
        <div class="p-6">
            <h1 class="font-display text-2xl font-extrabold text-slate-900 dark:text-white mb-6">Peminjaman Alat</h1>
            <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-x-auto">
                <table class="w-full text-sm"><thead><tr class="text-left text-xs uppercase tracking-wider text-slate-400 bg-slate-50 dark:bg-slate-900">
                    <th class="py-3 px-3">No. Surat</th><th class="py-3 px-3">Peminjam</th><th class="py-3 px-3">Keperluan</th><th class="py-3 px-3">Pinjam</th><th class="py-3 px-3">Kembali</th><th class="py-3 px-3">Status</th><th class="py-3 px-3 text-right">Aksi</th></tr></thead><tbody>
                ${bor.map(b => `<tr class="border-b border-slate-100 dark:border-slate-700">
                    <td class="py-3 px-3 font-medium text-slate-800 dark:text-white">${esc(b.no_surat)}</td>
                    <td class="py-3 px-3 text-slate-600">${esc(b.peminjam)}</td><td class="py-3 px-3 text-slate-600">${esc(b.keperluan)}</td>
                    <td class="py-3 px-3 text-slate-600">${fmtDate(b.tanggal_pinjam)}</td><td class="py-3 px-3 text-slate-600">${fmtDate(b.tanggal_kembali)}</td>
                    <td class="py-3 px-3">${badge(b.status)}</td>
                    <td class="py-3 px-3 text-right whitespace-nowrap">
                        ${b.status === 'Menunggu' ? `<button onclick="validasiPeminjaman('${b.id}')" class="text-sky-600 hover:underline text-sm font-semibold mr-2">Validasi</button>` : ''}
                        <button onclick="printSuratPeminjamanL('${b.id}')" class="text-cyan-600 hover:underline text-sm font-semibold">Cetak</button></td></tr>`).join('') || '<tr><td colspan="7" class="py-8 text-center text-slate-400">Belum ada peminjaman.</td></tr>'}
                </tbody></table></div>
        </div>`;
        initIconsNow();
    }).catch(e => toast(e.message, 'error'));
}

async function validasiPeminjaman(id) {
    if (!confirm('Validasi peminjaman ini (status menjadi Divalidasi)?')) return;
    const user = Auth.current();
    try {
        await updateRow('borrowings', id, { status: 'Divalidasi', by_laboran: user.name });
        toast('Peminjaman divalidasi oleh ' + user.name); vLaboranPeminjaman();
    } catch (e) { toast(e.message, 'error'); }
}

function printSuratPeminjamanL(id) {
    const b = (window._borDataL || []).find(x => x.id === String(id));
    if (!b) return;
    const names = { asisten: b.peminjam, laboran: b.by_laboran || '', kepalalab: b.by_kepala || '' };
    Print.open(buildSuratPeminjaman(b, names));
}

/* ================= VERIFIKASI LAPORAN ================= */
function vLaboranLaporan() {
    const content = $('#content');
    const user = Auth.current();
    content.innerHTML = `<div class="p-6 text-center py-10 text-slate-400">Memuat...</div>`;
    getTable('reports').then(rep => {
        window._repDataL = rep;
        content.innerHTML = `
        <div class="p-6">
            <h1 class="font-display text-2xl font-extrabold text-slate-900 dark:text-white mb-6">Verifikasi Laporan Praktikum</h1>
            <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-x-auto">
                <table class="w-full text-sm"><thead><tr class="text-left text-xs uppercase tracking-wider text-slate-400 bg-slate-50 dark:bg-slate-900">
                    <th class="py-3 px-3">Kode</th><th class="py-3 px-3">Judul</th><th class="py-3 px-3">Asisten</th><th class="py-3 px-3">Tanggal</th><th class="py-3 px-3">Status</th><th class="py-3 px-3 text-right">Aksi</th></tr></thead><tbody>
                ${rep.map(r => `<tr class="border-b border-slate-100 dark:border-slate-700">
                    <td class="py-3 px-3 font-medium text-slate-800 dark:text-white">${esc(r.kode)}</td>
                    <td class="py-3 px-3 text-slate-600">${esc(r.judul)}</td><td class="py-3 px-3 text-slate-600">${esc(r.asisten)}</td>
                    <td class="py-3 px-3 text-slate-600">${fmtDate(r.tanggal)}</td><td class="py-3 px-3">${badge(r.status)}</td>
                    <td class="py-3 px-3 text-right">
                        ${r.status === 'Menunggu' ? `<button onclick="verifLaporan('${r.id}')" class="text-sky-600 hover:underline text-sm font-semibold mr-2">Verifikasi</button>` : ''}
                        <button onclick="lihatLaporan('${r.id}')" class="text-cyan-600 hover:underline text-sm font-semibold mr-2">Lihat</button></td></tr>`).join('') || '<tr><td colspan="6" class="py-8 text-center text-slate-400">Belum ada laporan.</td></tr>'}
                </tbody></table></div>
        </div>`;
        initIconsNow();
    }).catch(e => toast(e.message, 'error'));
}

async function verifLaporan(id) {
    if (!confirm('Verifikasi laporan ini (status Divalidasi)?')) return;
    const user = Auth.current();
    try { await updateRow('reports', id, { status: 'Divalidasi', by_laboran: user.name }); toast('Laporan diverifikasi'); vLaboranLaporan(); }
    catch (e) { toast(e.message, 'error'); }
}

function lihatLaporan(id) {
    const r = (window._repDataL || []).find(x => x.id === String(id));
    if (!r) return;
    openModal(`<div class="p-6">
        <div class="flex items-center justify-between mb-4"><h3 class="font-display text-lg font-bold">${esc(r.judul)}</h3><button type="button" onclick="closeModal()" class="w-8 h-8 rounded-lg hover:bg-slate-100"><i data-lucide="x" class="w-5 h-5"></i></button></div>
        <div class="space-y-3 text-sm">
            <p><b>Matkul:</b> ${esc(r.matkul)}</p><p><b>Asisten:</b> ${esc(r.asisten)}</p><p><b>Tanggal:</b> ${fmtDate(r.tanggal)}</p>
            <p><b>Ringkasan:</b><br>${esc(r.ringkasan || '-')}</p><p><b>Hasil:</b><br>${esc(r.hasil || '-')}</p>
            <p class="text-xs text-slate-400">Status: ${esc(r.status)}</p>
        </div></div>`);
    initIconsNow();
}

window.boards.laboran = {
    nav: [
        { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
        { id: 'inventaris-alat', label: 'Inventaris Alat', icon: 'microscope' },
        { id: 'inventaris-bahan', label: 'Inventaris Bahan', icon: 'package' },
        { id: 'pengajuan-alat', label: 'Pengajuan Alat', icon: 'shopping-bag' },
        { id: 'pengajuan-bahan', label: 'Pengajuan Bahan', icon: 'shopping-cart' },
        { id: 'jadwal', label: 'Jadwal Praktikum', icon: 'calendar' },
        { id: 'peminjaman', label: 'Peminjaman Alat', icon: 'hand' },
        { id: 'laporan', label: 'Verifikasi Laporan', icon: 'file-check' }
    ],
    views: {
        dashboard: vLaboranDashboard,
        'inventaris-alat': vLaboranInventarisAlat,
        'inventaris-bahan': vLaboranInventarisBahan,
        'pengajuan-alat': vLaboranPengajuanAlat,
        'pengajuan-bahan': vLaboranPengajuanBahan,
        jadwal: vLaboranJadwal,
        peminjaman: vLaboranPeminjaman,
        laporan: vLaboranLaporan
    }
};