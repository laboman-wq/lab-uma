/*********************************************************************
 * DASHBOARD — Role: Admin
 * Kelola pengguna, master data, proses pembelian, laporan
 *********************************************************************/

function vAdminDashboard() {
    const content = $('#content');
    const user = Auth.current();
    content.innerHTML = `<div class="p-6 text-center py-10 text-slate-400">Memuat...</div>`;
    (async () => {
        try {
            const s = await getSummary();
            const cards = [
                { label: 'Pengguna Terdaftar', val: s.users, icon: 'users', c: 'text-blue-600 bg-blue-100' },
                { label: 'Alat Lab', val: s.equipment, icon: 'microscope', c: 'text-cyan-600 bg-cyan-100' },
                { label: 'Bahan Menipis', val: s.low_stock, icon: 'package', c: 'text-red-600 bg-red-100' },
                { label: 'Pengajuan Menunggu', val: s.req_pending, icon: 'inbox', c: 'text-amber-600 bg-amber-100' },
                { label: 'Peminjaman', val: s.bor_pending + s.bor_approved, icon: 'hand', c: 'text-emerald-600 bg-emerald-100' },
                { label: 'Jadwal Aktif', val: s.schedules, icon: 'calendar', c: 'text-purple-600 bg-purple-100' }
            ];
            content.innerHTML = `
            <div class="p-6 md:p-8">
                <h1 class="font-display text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">Dashboard Administrator 🛠️</h1>
                <p class="text-sm text-slate-500 mt-1">Kelola sistem, pengguna, dan pantau seluruh aktivitas laboratorium.</p>
                <div class="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                    ${cards.map(c => `<div class="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
                        <div class="w-11 h-11 rounded-xl ${c.c} flex items-center justify-center mb-3"><i data-lucide="${c.icon}" class="w-5 h-5"></i></div>
                        <p class="text-2xl font-extrabold text-slate-800 dark:text-white">${c.val}</p><p class="text-sm text-slate-500">${c.label}</p></div>`).join('')}
                </div>
                <div class="mt-6 grid lg:grid-cols-2 gap-5">
                    <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border">
                        <h3 class="font-semibold mb-3">Aksi Cepat</h3>
                        <div class="grid grid-cols-2 gap-2 text-sm">
                            <a href="#" onclick="goto('users');return false;" class="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-blue-50 dark:bg-slate-700 text-blue-700 dark:text-blue-300"><i data-lucide="user-plus" class="w-4 h-4"></i> Kelola Pengguna</a>
                            <a href="#" onclick="goto('pengajuan');return false;" class="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-amber-50 dark:bg-slate-700 text-amber-700 dark:text-amber-300"><i data-lucide="credit-card" class="w-4 h-4"></i> Proses Pembelian</a>
                            <a href="#" onclick="goto('laporan-inventaris');return false;" class="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-cyan-50 dark:bg-slate-700 text-cyan-700 dark:text-cyan-300"><i data-lucide="box" class="w-4 h-4"></i> Laporan Inventaris</a>
                            <a href="#" onclick="goto('laporan-bulanan');return false;" class="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-purple-50 dark:bg-slate-700 text-purple-700 dark:text-purple-300"><i data-lucide="file-text" class="w-4 h-4"></i> Laporan Bulanan</a>
                        </div>
                    </div>
                    <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border">
                        <h3 class="font-semibold text-slate-800 dark:text-white mb-3">Akun Pengujian</h3>
                        <div class="space-y-2 text-sm">
                            <div class="flex justify-between px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900"><span>admin / admin123</span><span class="text-slate-400">Admin</span></div>
                            <div class="flex justify-between px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900"><span>laboran / laboran123</span><span class="text-slate-400">Laboran</span></div>
                            <div class="flex justify-between px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900"><span>kepalalab / kepalalab123</span><span class="text-slate-400">Kepala Lab</span></div>
                            <div class="flex justify-between px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900"><span>asisten / asisten123</span><span class="text-slate-400">Asisten</span></div>
                        </div>
                    </div>
                </div>
            </div>`;
            initIconsNow();
        } catch (e) { toast(e.message, 'error'); }
    })();
}

/* ================= KELOLA PENGGUNA ================= */
function vAdminUsers() {
    const content = $('#content');
    content.innerHTML = `<div class="p-6 text-center py-10 text-slate-400">Memuat...</div>`;
    getTable('users').then(users => {
        window._usersData = users;
        content.innerHTML = `
        <div class="p-6">
            <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
                <h1 class="font-display text-2xl font-extrabold text-slate-900 dark:text-white">Kelola Pengguna</h1>
                <button onclick="modalUser()" class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-700 text-white text-sm font-semibold hover:bg-primary-800"><i data-lucide="user-plus" class="w-4 h-4"></i> Tambah Pengguna</button>
            </div>
            <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-x-auto">
                <table class="w-full text-sm"><thead><tr class="text-left text-xs uppercase tracking-wider text-slate-400 bg-slate-50 dark:bg-slate-900">
                    <th class="py-3 px-3">Username</th><th class="py-3 px-3">Nama</th><th class="py-3 px-3">Role</th><th class="py-3 px-3">Fakultas/Prodi</th><th class="py-3 px-3">Status</th><th class="py-3 px-3 text-right">Aksi</th></tr></thead><tbody>
                ${users.map(u => `<tr class="border-b border-slate-100 dark:border-slate-700">
                    <td class="py-3 px-3 font-medium text-slate-800 dark:text-white">${esc(u.username)}</td>
                    <td class="py-3 px-3 text-slate-600">${esc(u.name)}</td>
                    <td class="py-3 px-3">${badge(roleLabel(u.role))}</td>
                    <td class="py-3 px-3 text-slate-600">${esc(u.fakultas)}${u.prodi && u.prodi !== '-' ? ' / ' + esc(u.prodi) : ''}</td>
                    <td class="py-3 px-3">${u.aktif === '1' ? badge('Aktif') : badge('Tidak Aktif')}</td>
                    <td class="py-3 px-3 text-right whitespace-nowrap">
                        <button onclick='modalUserEdit(${JSON.stringify(u).replace(/'/g, '&#39;')})' class="text-cyan-600 hover:underline text-sm font-semibold mr-2">Edit</button>
                        <button onclick="hapusUser('${u.id}')" class="text-red-500 hover:underline text-sm font-semibold">Hapus</button></td></tr>`).join('')}
                </tbody></table></div>
        </div>`;
        initIconsNow();
    }).catch(e => toast(e.message, 'error'));
}

function modalUser(data = {}) {
    const isEdit = !!data.id;
    openModal(`
        <form id="frm-user" class="p-6">
            <div class="flex items-center justify-between mb-4"><h3 class="font-display text-lg font-bold">${isEdit ? 'Edit' : 'Tambah'} Pengguna</h3><button type="button" onclick="closeModal()" class="w-8 h-8 rounded-lg hover:bg-slate-100"><i data-lucide="x" class="w-5 h-5"></i></button></div>
            <div class="space-y-4">
                <div class="grid grid-cols-2 gap-3">
                    <div><label class="block text-sm font-medium mb-1">Username</label><input id="u-user" required value="${esc(data.username || '')}" class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm"></div>
                    <div><label class="block text-sm font-medium mb-1">Password</label><input id="u-pass" required value="${esc(data.password || '')}" class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm"></div>
                </div>
                <div><label class="block text-sm font-medium mb-1">Nama Lengkap</label><input id="u-name" required value="${esc(data.name || '')}" class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm"></div>
                <div class="grid grid-cols-2 gap-3">
                    <div><label class="block text-sm font-medium mb-1">Role</label><select id="u-role" class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm">
                        ${['admin', 'laboran', 'kepalalab', 'asisten'].map(r => `<option value="${r}" ${data.role === r ? 'selected' : ''}>${roleLabel(r)}</option>`).join('')}</select></div>
                    <div><label class="block text-sm font-medium mb-1">Status</label><select id="u-aktif" class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm">
                        <option value="1">Aktif</option><option value="0" ${data.aktif === '0' ? 'selected' : ''}>Tidak Aktif</option></select></div>
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <div><label class="block text-sm font-medium mb-1">Fakultas</label><input id="u-fak" value="${esc(data.fakultas || '')}" class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm"></div>
                    <div><label class="block text-sm font-medium mb-1">Prodi</label><input id="u-prodi" value="${esc(data.prodi || '')}" class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm"></div>
                </div>
                <div><label class="block text-sm font-medium mb-1">Email</label><input id="u-email" value="${esc(data.email || '')}" class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm"></div>
                <button class="w-full py-2.5 rounded-lg bg-primary-700 text-white font-semibold text-sm">${isEdit ? 'Simpan' : 'Tambah Pengguna'}</button>
            </div>
        </form>`);
    $('#frm-user').addEventListener('submit', async e => {
        e.preventDefault();
        const payload = {
            username: $('#u-user').value, password: $('#u-pass').value, name: $('#u-name').value,
            role: $('#u-role').value, aktif: $('#u-aktif').value,
            fakultas: $('#u-fak').value || '-', prodi: $('#u-prodi').value || '-', email: $('#u-email').value
        };
        try {
            if (isEdit) { await updateRow('users', data.id, payload); toast('Pengguna diperbarui'); }
            else { await addRow('users', payload); toast('Pengguna ditambahkan'); }
            closeModal(); vAdminUsers();
        } catch (err) { toast(err.message, 'error'); }
    });
}
function modalUserEdit(d) { modalUser(d); }
async function hapusUser(id) {
    if (!confirm('Hapus pengguna ini?')) return;
    try { await deleteRow('users', id); toast('Pengguna dihapus'); vAdminUsers(); }
    catch (e) { toast(e.message, 'error'); }
}

/* ================= MASTER DATA LAB ================= */
function vAdminLabs() {
    const content = $('#content');
    content.innerHTML = `<div class="p-6 text-center py-10 text-slate-400">Memuat...</div>`;
    getTable('labs').then(labs => {
        content.innerHTML = `
        <div class="p-6">
            <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
                <h1 class="font-display text-2xl font-extrabold text-slate-900 dark:text-white">Master Data Laboratorium</h1>
                <button onclick="modalLab()" class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-700 text-white text-sm font-semibold hover:bg-primary-800"><i data-lucide="plus" class="w-4 h-4"></i> Tambah Lab</button>
            </div>
            <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-x-auto">
                <table class="w-full text-sm"><thead><tr class="text-left text-xs uppercase tracking-wider text-slate-400 bg-slate-50 dark:bg-slate-900">
                    <th class="py-3 px-3">No</th><th class="py-3 px-3">Nama Lab</th><th class="py-3 px-3">Fakultas</th><th class="py-3 px-3">Prodi</th><th class="py-3 px-3">Lokasi</th><th class="py-3 px-3 text-right">Aksi</th></tr></thead><tbody>
                ${labs.map((l, i) => `<tr class="border-b border-slate-100 dark:border-slate-700">
                    <td class="py-3 px-3 text-slate-500">${i + 1}</td><td class="py-3 px-3 font-medium text-slate-800 dark:text-white">${esc(l.nama)}</td>
                    <td class="py-3 px-3 text-slate-600">${esc(l.fakultas)}</td><td class="py-3 px-3 text-slate-600">${esc(l.prodi)}</td><td class="py-3 px-3 text-slate-600">${esc(l.lokasi)}</td>
                    <td class="py-3 px-3 text-right"><button onclick='modalLabEdit(${JSON.stringify(l).replace(/'/g, '&#39;')})' class="text-cyan-600 hover:underline text-sm font-semibold mr-2">Edit</button>
                    <button onclick="hapusLab('${l.id}')" class="text-red-500 hover:underline text-sm font-semibold">Hapus</button></td></tr>`).join('')}
                </tbody></table></div>
        </div>`;
        initIconsNow();
    }).catch(e => toast(e.message, 'error'));
}

function modalLab(data = {}) {
    const isEdit = !!data.id;
    openModal(`
        <form id="frm-lab" class="p-6">
            <div class="flex items-center justify-between mb-4"><h3 class="font-display text-lg font-bold">${isEdit ? 'Edit' : 'Tambah'} Lab</h3><button type="button" onclick="closeModal()" class="w-8 h-8 rounded-lg hover:bg-slate-100"><i data-lucide="x" class="w-5 h-5"></i></button></div>
            <div class="space-y-4">
                <div><label class="block text-sm font-medium mb-1">Nama Lab</label><input id="l-nama" required value="${esc(data.nama || '')}" class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm"></div>
                <div class="grid grid-cols-2 gap-3">
                    <div><label class="block text-sm font-medium mb-1">Fakultas</label><input id="l-fak" required value="${esc(data.fakultas || '')}" class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm"></div>
                    <div><label class="block text-sm font-medium mb-1">Prodi</label><input id="l-prodi" value="${esc(data.prodi || '')}" class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm"></div>
                </div>
                <div><label class="block text-sm font-medium mb-1">Lokasi</label><input id="l-lokasi" required value="${esc(data.lokasi || '')}" class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm"></div>
                <div><label class="block text-sm font-medium mb-1">Deskripsi</label><input id="l-desk" value="${esc(data.deskripsi || '')}" class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm"></div>
                <button class="w-full py-2.5 rounded-lg bg-primary-700 text-white font-semibold text-sm">${isEdit ? 'Simpan' : 'Tambah Lab'}</button>
            </div>
        </form>`);
    $('#frm-lab').addEventListener('submit', async e => {
        e.preventDefault();
        const payload = { nama: $('#l-nama').value, fakultas: $('#l-fak').value, prodi: $('#l-prodi').value, lokasi: $('#l-lokasi').value, deskripsi: $('#l-desk').value };
        try {
            if (isEdit) { await updateRow('labs', data.id, payload); toast('Lab diperbarui'); }
            else { await addRow('labs', payload); toast('Lab ditambahkan'); }
            closeModal(); vAdminLabs();
        } catch (err) { toast(err.message, 'error'); }
    });
}
function modalLabEdit(d) { modalLab(d); }
async function hapusLab(id) {
    if (!confirm('Hapus lab ini?')) return;
    try { await deleteRow('labs', id); toast('Lab dihapus'); vAdminLabs(); }
    catch (e) { toast(e.message, 'error'); }
}

/* ================= PROSES PEMBELIAN (pengajuan yg disetujui) ================= */
function vAdminPengajuan() {
    const content = $('#content');
    content.innerHTML = `<div class="p-6 text-center py-10 text-slate-400">Memuat...</div>`;
    Promise.all([getTable('equipment_req'), getTable('consumable_req')]).then(([eq, cb]) => {
        content.innerHTML = `
        <div class="p-6">
            <h1 class="font-display text-2xl font-extrabold text-slate-900 dark:text-white mb-6">Proses Pembelian (Pengajuan)</h1>
            <p class="text-sm text-slate-500 mb-4">Setelah disetujui Kepala Lab, catat proses pembelian (Ditandai Diproses).</p>
            <div class="space-y-8">
            <div class="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border">
                <h3 class="font-semibold mb-3">Pengajuan Alat</h3>
                <div class="overflow-x-auto"><table class="w-full text-sm"><thead><tr class="text-left text-xs uppercase text-slate-400 border-b">
                <th class="py-2 px-2">No. Surat</th><th class="py-2 px-2">Alat</th><th class="py-2 px-2 text-center">Jml</th><th class="py-2 px-2">Status</th><th class="py-2 px-2 text-right">Aksi</th></tr></thead><tbody>
                ${eq.map(r => `<tr class="border-b border-slate-100"><td class="py-2 px-2">${esc(r.no_surat)}</td><td class="py-2 px-2">${esc(r.nama_alat)}</td>
                <td class="py-2 px-2 text-center">${esc(r.jumlah)}</td><td class="py-2 px-2">${badge(r.status)}</td>
                <td class="py-2 px-2 text-right">${r.status === 'Disetujui' ? `<button onclick="adminProses('equipment_req','${r.id}')" class="text-indigo-600 hover:underline text-sm font-semibold">Proses Pembelian</button>` : ''}</td></tr>`).join('') || '<tr><td colspan="5" class="py-4 text-center text-slate-400">Kosong</td></tr>'}
                </tbody></table></div></div>
            <div class="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border">
                <h3 class="font-semibold mb-3">Pengajuan Bahan</h3>
                <div class="overflow-x-auto"><table class="w-full text-sm"><thead><tr class="text-left text-xs uppercase text-slate-400 border-b">
                <th class="py-2 px-2">No. Surat</th><th class="py-2 px-2">Bahan</th><th class="py-2 px-2 text-center">Jml</th><th class="py-2 px-2">Status</th><th class="py-2 px-2 text-right">Aksi</th></tr></thead><tbody>
                ${cb.map(r => `<tr class="border-b border-slate-100"><td class="py-2 px-2">${esc(r.no_surat)}</td><td class="py-2 px-2">${esc(r.nama_bahan)}</td>
                <td class="py-2 px-2 text-center">${esc(r.jumlah)} ${esc(r.satuan)}</td><td class="py-2 px-2">${badge(r.status)}</td>
                <td class="py-2 px-2 text-right">${r.status === 'Disetujui' ? `<button onclick="adminProses('consumable_req','${r.id}')" class="text-indigo-600 hover:underline text-sm font-semibold">Proses Pembelian</button>` : ''}</td></tr>`).join('') || '<tr><td colspan="5" class="py-4 text-center text-slate-400">Kosong</td></tr>'}
                </tbody></table></div></div>
            </div>
        </div>`;
        initIconsNow();
    }).catch(e => toast(e.message, 'error'));
}

async function adminProses(table, id) {
    if (!confirm('Tandai pengajuan ini sebagai sedang diproses pembelian?')) return;
    try { await updateRow(table, id, { status: 'Diproses' }); toast('Ditandai Diproses — lanjut ke laboran utk terima barang'); vAdminPengajuan(); }
    catch (e) { toast(e.message, 'error'); }
}

/* ================= MELIHAT SEMUA (pantauan) ================= */
function vAdminMonitor() {
    const content = $('#content');
    content.innerHTML = `<div class="p-6 text-center py-10 text-slate-400">Memuat...</div>`;
    Promise.all([getTable('borrowings'), getTable('reports'), getTable('certificates')]).then(([bor, rep, cert]) => {
        content.innerHTML = `
        <div class="p-6">
            <h1 class="font-display text-2xl font-extrabold text-slate-900 dark:text-white mb-6">Pantau Semua Aktivitas</h1>
            <div class="grid lg:grid-cols-3 gap-6">
                <div class="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border">
                    <h3 class="font-semibold mb-3">Peminjaman Alat (${bor.length})</h3>
                    ${bor.slice(0, 8).map(b => `<div class="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                        <div><p class="text-sm font-medium">${esc(b.no_surat)}</p><p class="text-xs text-slate-400">${esc(b.peminjam)} · ${fmtDate(b.tanggal_pinjam)}</p></div>${badge(b.status)}</div>`).join('') || '<p class="text-sm text-slate-400">Kosong</p>'}
                </div>
                <div class="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border">
                    <h3 class="font-semibold mb-3">Laporan Praktikum (${rep.length})</h3>
                    ${rep.slice(0, 8).map(r => `<div class="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                        <div><p class="text-sm font-medium">${esc(r.kode)}</p><p class="text-xs text-slate-400">${esc(r.judul)}</p></div>${badge(r.status)}</div>`).join('') || '<p class="text-sm text-slate-400">Kosong</p>'}
                </div>
                <div class="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border">
                    <h3 class="font-semibold mb-3">Sertifikat (${cert.length})</h3>
                    ${cert.slice(0, 8).map(c => `<div class="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                        <div><p class="text-sm font-medium">${esc(c.kode)}</p><p class="text-xs text-slate-400">${esc(c.nama)}</p></div>${badge(c.status)}</div>`).join('') || '<p class="text-sm text-slate-400">Kosong</p>'}
                </div>
            </div>
        </div>`;
        initIconsNow();
    }).catch(e => toast(e.message, 'error'));
}

/* ================= LAPORAN INVENTARIS (print) ================= */
function vAdminLapInventaris() {
    const content = $('#content');
    content.innerHTML = `<div class="p-6 text-center py-10 text-slate-400">Memuat...</div>`;
    Promise.all([getTable('equipment'), getTable('consumables')]).then(([eq, cb]) => {
        window._eqData = eq; window._cbData = cb;
        content.innerHTML = `
        <div class="p-6">
            <h1 class="font-display text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Laporan Inventaris</h1>
            <p class="text-sm text-slate-500 mb-6">Cetak laporan inventaris alat & kartu stok bahan.</p>
            <div class="grid md:grid-cols-2 gap-5">
                <div class="bg-white dark:bg-slate-800 rounded-2xl p-8 text-center shadow-sm border">
                    <div class="w-14 h-14 mx-auto rounded-2xl bg-cyan-100 dark:bg-cyan-900/40 text-cyan-600 flex items-center justify-center mb-4"><i data-lucide="microscope" class="w-7 h-7"></i></div>
                    <h3 class="font-semibold text-lg">Laporan Inventaris Alat</h3>
                    <p class="text-sm text-slate-400 mt-1">${eq.length} item alat terdaftar</p>
                    <button onclick="printInventarisAlat()" class="mt-5 px-6 py-2.5 rounded-lg bg-primary-700 text-white text-sm font-semibold"><i data-lucide="printer" class="w-4 h-4 inline mr-1"></i> Cetak</button>
                </div>
                <div class="bg-white dark:bg-slate-800 rounded-2xl p-8 text-center shadow-sm border">
                    <div class="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 flex items-center justify-center mb-4"><i data-lucide="package" class="w-7 h-7"></i></div>
                    <h3 class="font-semibold text-lg">Kartu Stok Bahan</h3>
                    <p class="text-sm text-slate-400 mt-1">${cb.length} item bahan terdaftar</p>
                    <button onclick="printKartuStok()" class="mt-5 px-6 py-2.5 rounded-lg bg-primary-700 text-white text-sm font-semibold"><i data-lucide="printer" class="w-4 h-4 inline mr-1"></i> Cetak</button>
                </div>
            </div>
        </div>`;
        initIconsNow();
    }).catch(e => toast(e.message, 'error'));
}

/* ================= LAPORAN BULANAN ================= */
function vAdminLapBulanan() {
    const content = $('#content');
    content.innerHTML = `
    <div class="p-6">
        <h1 class="font-display text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Laporan Bulanan</h1>
        <p class="text-sm text-slate-500 mb-6">Generate rekap bulanan (peminjaman, laporan, pengajuan, stok).</p>
        <div class="bg-white dark:bg-slate-800 rounded-2xl p-8 max-w-xl shadow-sm border">
            <div class="flex flex-wrap items-end gap-3">
                <div><label class="block text-sm font-medium mb-1">Bulan</label><select id="ml2-bulan" class="px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm">${bulanList().map(b => `<option value="${b[0]}">${b[1]}</option>`).join('')}</select></div>
                <div><label class="block text-sm font-medium mb-1">Tahun</label><select id="ml2-tahun" class="px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm">${[2025, 2026].map(y => `<option>${y}</option>`).join('')}</select></div>
                <button onclick="buatLapBulananAdmin()" class="px-5 py-2.5 rounded-lg bg-primary-700 text-white text-sm font-semibold"><i data-lucide="file-text" class="w-4 h-4 inline mr-1"></i> Buat & Cetak</button>
            </div>
        </div>
    </div>`;
    initIconsNow();
}

async function buatLapBulananAdmin() {
    const bulan = $('#ml2-bulan').value;
    const tahun = $('#ml2-tahun').value;
    try {
        const m = await getMonthly(bulan, tahun);
        const user = Auth.current();
        Print.open(buildLaporanBulanan(m, { name: user.name, kepalalab: user.name }));
    } catch (e) { toast(e.message, 'error'); }
}

/* ================= MENU BUILDER (Admin) ================= */
function vAdminMenus() {
    const content = $('#content');
    content.innerHTML = `<div class="p-6 text-center py-10 text-slate-400">Memuat...</div>`;
    getTable('menus').then(menus => {
        window._menusData = menus;
        const parents = menus.filter(m => !m.parent_id || m.parent_id === '0' || m.parent_id === '');
        content.innerHTML = `
        <div class="p-6">
            <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
                <h1 class="font-display text-2xl font-extrabold text-slate-900 dark:text-white">Menu & Sub Menu Website</h1>
                <button onclick="modalMenu()" class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-700 text-white text-sm font-semibold hover:bg-primary-800"><i data-lucide="plus" class="w-4 h-4"></i> Tambah Menu</button>
            </div>
            <p class="text-sm text-slate-500 mb-4">Perubahan langsung terlihat di header website. Tipe: <b>parent</b> (punya sub menu), <b>page</b> (halaman), <b>link</b> (tautan eksternal).</p>
            <div class="space-y-3" id="menu-tree">
            ${parents.map(p => `
                <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">
                    <div class="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-900">
                        <span class="font-semibold text-slate-800 dark:text-white">${esc(p.label)}</span>
                        ${badge(p.tipe)} ${p.published === '1' ? badge('Aktif') : badge('Tidak Aktif')}
                        <span class="ml-auto flex gap-1">
                            <button onclick="menuUp('${p.id}')" class="px-2 py-1 text-xs rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700" title="Naik">↑</button>
                            <button onclick="menuDown('${p.id}')" class="px-2 py-1 text-xs rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700" title="Turun">↓</button>
                            <button onclick='modalMenuEdit(${JSON.stringify(p).replace(/'/g, '&#39;')})' class="px-2 py-1 text-xs rounded-lg text-cyan-600 hover:bg-cyan-50 font-semibold">Edit</button>
                            <button onclick="hapusMenu('${p.id}')" class="px-2 py-1 text-xs rounded-lg text-red-500 hover:bg-red-50 font-semibold">Hapus</button>
                        </span>
                    </div>
                    ${p.children && p.children.length ? `<div class="px-4 py-2 space-y-1.5">${p.children.map(c => `
                        <div class="flex items-center gap-2 pl-5 py-1.5 border-l-2 border-cyan-200 dark:border-slate-700">
                            <span class="text-sm text-slate-600 dark:text-slate-300">↳ ${esc(c.label)}</span>
                            <span class="text-xs text-slate-400">${esc(c.slug || '')}</span>
                            <span class="ml-auto flex gap-1">
                                <button onclick='modalMenuEdit(${JSON.stringify(c).replace(/'/g, '&#39;')})' class="px-2 py-0.5 text-xs text-cyan-600 hover:bg-cyan-50 rounded">Edit</button>
                                <button onclick="hapusMenu('${c.id}')" class="px-2 py-0.5 text-xs text-red-500 hover:bg-red-50 rounded">Hapus</button>
                            </span>
                        </div>`).join('')}</div>` : ''}
                </div>`).join('')}
            </div>
        </div>`;
        initIconsNow();
    }).catch(e => toast(e.message, 'error'));
}

function modalMenu(data = {}) {
    const isEdit = !!data.id;
    getTable('menus').then(menus => {
        const parentOpts = menus.filter(m => (!m.parent_id || m.parent_id === '0') && m.id !== data.id)
            .map(m => `<option value="${m.id}" ${String(data.parent_id) === String(m.id) ? 'selected' : ''}>${esc(m.label)}</option>`).join('');
        openModal(`
        <form id="frm-menu" class="p-6">
            <div class="flex items-center justify-between mb-4"><h3 class="font-display text-lg font-bold">${isEdit ? 'Edit' : 'Tambah'} Menu</h3><button type="button" onclick="closeModal()" class="w-8 h-8 rounded-lg hover:bg-slate-100"><i data-lucide="x" class="w-5 h-5"></i></button></div>
            <div class="space-y-4">
                <div><label class="block text-sm font-medium mb-1">Label Menu</label><input id="m-label" required value="${esc(data.label || '')}" placeholder="Biodata Lab" class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm"></div>
                <div class="grid grid-cols-2 gap-3">
                    <div><label class="block text-sm font-medium mb-1">Tipe</label><select id="m-tipe" class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm">
                        <option value="page" ${data.tipe === 'page' ? 'selected' : ''}>Page (halaman)</option>
                        <option value="parent" ${data.tipe === 'parent' ? 'selected' : ''}>Parent (punya sub menu)</option>
                        <option value="link" ${data.tipe === 'link' ? 'selected' : ''}>Link (eksternal)</option></select></div>
                    <div><label class="block text-sm font-medium mb-1">Sub dari (Parent)</label><select id="m-parent" class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm"><option value="">(Menu Utama)</option>${parentOpts}</select></div>
                </div>
                <div><label class="block text-sm font-medium mb-1">Slug / URL</label><input id="m-slug" value="${esc(data.slug || '')}" placeholder="berita.html  atau  page-bar  atau  https://..." class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm">
                    <p class="text-xs text-slate-400 mt-1">Halaman dinamis: tulis slug tanpa .html (mis. <b>sop-laboratorium</b>). Halaman statis: <b>fasilitas.html</b>. Eksternal: full URL.</p></div>
                <div class="grid grid-cols-3 gap-3">
                    <div><label class="block text-sm font-medium mb-1">Urutan</label><input id="m-urutan" type="number" min="1" value="${esc(data.urutan || 1)}" class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm"></div>
                    <div><label class="block text-sm font-medium mb-1">Ikon (Lucide)</label><input id="m-ikon" value="${esc(data.ikon || 'file-text')}" class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm"></div>
                    <div><label class="block text-sm font-medium mb-1">Aktif</label><select id="m-aktif" class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm"><option value="1">Ya</option><option value="0" ${data.published === '0' ? 'selected' : ''}>Tidak</option></select></div>
                </div>
                <button class="w-full py-2.5 rounded-lg bg-primary-700 text-white font-semibold text-sm">${isEdit ? 'Simpan' : 'Tambah'}</button>
            </div>
        </form>`);
        $('#frm-menu').addEventListener('submit', async e => {
            e.preventDefault();
            const payload = {
                label: $('#m-label').value, tipe: $('#m-tipe').value,
                parent_id: $('#m-parent').value || '', slug: $('#m-slug').value,
                urutan: $('#m-urutan').value, ikon: $('#m-ikon').value, published: $('#m-aktif').value, target: ''
            };
            try {
                if (isEdit) { await updateRow('menus', data.id, payload); toast('Menu diperbarui'); }
                else { await addRow('menus', payload); toast('Menu ditambahkan'); }
                closeModal(); vAdminMenus();
            } catch (err) { toast(err.message, 'error'); }
        });
        initIconsNow();
    });
}
function modalMenuEdit(d) { modalMenu(d); }
async function hapusMenu(id) {
    if (!confirm('Hapus menu ini (anak ikut terhapus visual jika di halaman)?')) return;
    try { await deleteRow('menus', id); toast('Menu dihapus'); vAdminMenus(); } catch (e) { toast(e.message, 'error'); }
}
async function menuUp(id) {
    const menus = window._menusData || [];
    const parents = menus.filter(m => !m.parent_id || m.parent_id === '0' || m.parent_id === '').sort((a, b) => (parseInt(a.urutan, 10) || 0) - (parseInt(b.urutan, 10) || 0));
    const idx = parents.findIndex(m => m.id === String(id));
    if (idx <= 0) return;
    const a = parents[idx], b = parents[idx - 1];
    try { await updateRow('menus', a.id, { urutan: b.urutan }); await updateRow('menus', b.id, { urutan: a.urutan }); vAdminMenus(); } catch (e) { toast(e.message, 'error'); }
}
async function menuDown(id) {
    const menus = window._menusData || [];
    const parents = menus.filter(m => !m.parent_id || m.parent_id === '0' || m.parent_id === '').sort((a, b) => (parseInt(a.urutan, 10) || 0) - (parseInt(b.urutan, 10) || 0));
    const idx = parents.findIndex(m => m.id === String(id));
    if (idx < 0 || idx >= parents.length - 1) return;
    const a = parents[idx], b = parents[idx + 1];
    try { await updateRow('menus', a.id, { urutan: b.urutan }); await updateRow('menus', b.id, { urutan: a.urutan }); vAdminMenus(); } catch (e) { toast(e.message, 'error'); }
}

/* ================= KELOLA HALAMAN DINAMIS (Admin) ================= */
function vAdminPages() {
    const content = $('#content');
    content.innerHTML = `<div class="p-6 text-center py-10 text-slate-400">Memuat...</div>`;
    getTable('pages').then(pages => {
        content.innerHTML = `
        <div class="p-6">
            <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
                <h1 class="font-display text-2xl font-extrabold text-slate-900 dark:text-white">Halaman Dinamis</h1>
                <button onclick="modalPage()" class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-700 text-white text-sm font-semibold hover:bg-primary-800"><i data-lucide="plus" class="w-4 h-4"></i> Halaman Baru</button>
            </div>
            <p class="text-sm text-slate-500 mb-4">Halaman dibuat di sini lalu ditautkan lewat Menu Builder (tipe <b>page</b> dengan slug).</p>
            <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-x-auto">
            <table class="w-full text-sm"><thead><tr class="text-left text-xs uppercase tracking-wider text-slate-400 bg-slate-50 dark:bg-slate-900">
                <th class="py-3 px-3">Judul</th><th class="py-3 px-3">Slug</th><th class="py-3 px-3">Kategori</th><th class="py-3 px-3">Tanggal</th><th class="py-3 px-3">Status</th><th class="py-3 px-3 text-right">Aksi</th></tr></thead><tbody>
            ${pages.map(p => `<tr class="border-b border-slate-100 dark:border-slate-700">
                <td class="py-3 px-3 font-medium">${esc(p.judul)}</td><td class="py-3 px-3 text-slate-500">${esc(p.slug)}</td>
                <td class="py-3 px-3">${esc(p.kategori)}</td><td class="py-3 px-3">${fmtDate(p.tanggal)}</td>
                <td class="py-3 px-3">${p.published === '1' ? badge('Aktif') : badge('Tidak Aktif')}</td>
                <td class="py-3 px-3 text-right whitespace-nowrap">
                    <a href="../page.html?slug=${encodeURIComponent(p.slug)}" target="_blank" class="text-xs font-semibold text-slate-400 mr-2">Buka</a>
                    <button onclick='modalPageEdit(${JSON.stringify(p).replace(/'/g, '&#39;')})' class="text-cyan-600 hover:underline text-sm font-semibold mr-2">Edit</button>
                    <button onclick="hapusPage('${p.id}')" class="text-red-500 hover:underline text-sm font-semibold">Hapus</button></td></tr>`).join('') || '<tr><td colspan="6" class="py-8 text-center text-slate-400">Belum ada halaman.</td></tr>'}
            </tbody></table></div>
        </div>`;
        initIconsNow();
    }).catch(e => toast(e.message, 'error'));
}

function modalPage(data = {}) {
    const isEdit = !!data.id;
    openModal(`
        <form id="frm-page" class="p-6">
            <div class="flex items-center justify-between mb-4"><h3 class="font-display text-lg font-bold">${isEdit ? 'Edit' : 'Buat'} Halaman</h3><button type="button" onclick="closeModal()" class="w-8 h-8 rounded-lg hover:bg-slate-100"><i data-lucide="x" class="w-5 h-5"></i></button></div>
            <div class="space-y-4">
                <div class="grid grid-cols-2 gap-3">
                    <div><label class="block text-sm font-medium mb-1">Judul</label><input id="pg-judul" required value="${esc(data.judul || '')}" class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm"></div>
                    <div><label class="block text-sm font-medium mb-1">Slug (unik)</label><input id="pg-slug" required value="${esc(data.slug || '')}" placeholder="visi-misi" class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm"></div>
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <div><label class="block text-sm font-medium mb-1">Kategori</label><input id="pg-kat" value="${esc(data.kategori || 'Halaman')}" class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm"></div>
                    <div><label class="block text-sm font-medium mb-1">Status</label><select id="pg-aktif" class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm"><option value="1">Aktif</option><option value="0" ${data.published === '0' ? 'selected' : ''}>Tidak Aktif</option></select></div>
                </div>
                <div><label class="block text-sm font-medium mb-1">Isi Halaman</label><div id="pg-blocks"></div></div>
                <button class="w-full py-2.5 rounded-lg bg-primary-700 text-white font-semibold text-sm">${isEdit ? 'Simpan' : 'Buat Halaman'}</button>
            </div>
        </form>`);
    try { BlockEditor.init('pg-blocks', JSON.parse(data.isi || '[]')); } catch (e) { BlockEditor.init('pg-blocks', []); }
    $('#frm-page').addEventListener('submit', async e => {
        e.preventDefault();
        const payload = {
            slug: $('#pg-slug').value.trim().toLowerCase().replace(/\s+/g, '-'),
            judul: $('#pg-judul').value, kategori: $('#pg-kat').value || 'Halaman',
            isi: BlockEditor.collect(), published: $('#pg-aktif').value, tanggal: data.tanggal || todayStr()
        };
        try {
            if (isEdit) { await updateRow('pages', data.id, payload); toast('Halaman diperbarui'); }
            else { await addRow('pages', payload); toast('Halaman dibuat'); }
            closeModal(); vAdminPages();
        } catch (err) { toast(err.message, 'error'); }
    });
}
function modalPageEdit(d) { modalPage(d); }
async function hapusPage(id) {
    if (!confirm('Hapus halaman ini?')) return;
    try { await deleteRow('pages', id); toast('Halaman dihapus'); vAdminPages(); }
    catch (e) { toast(e.message, 'error'); }
}

/* ================= POSTINGAN (Admin: kelola & terbitkan) ================= */
function vAdminPosts() {
    const content = $('#content');
    const user = Auth.current();
    content.innerHTML = `<div class="p-6 text-center py-10 text-slate-400">Memuat...</div>`;
    getTable('posts').then(posts => {
        posts.sort((a, b) => String(b.tanggal).localeCompare(String(a.tanggal)));
        content.innerHTML = `
        <div class="p-6">
            <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
                <h1 class="font-display text-2xl font-extrabold text-slate-900 dark:text-white">Postingan / Berita</h1>
                <button onclick="location.href='postingan.html?mode=admin'" class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-700 text-white text-sm font-semibold hover:bg-primary-800"><i data-lucide="plus" class="w-4 h-4"></i> Tulis Postingan</button>
            </div>
            <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-x-auto">
            <table class="w-full text-sm"><thead><tr class="text-left text-xs uppercase tracking-wider text-slate-400 bg-slate-50 dark:bg-slate-900">
                <th class="py-3 px-3">Judul</th><th class="py-3 px-3">Kategori</th><th class="py-3 px-3">Tanggal</th><th class="py-3 px-3">Penulis</th><th class="py-3 px-3">Status</th><th class="py-3 px-3 text-right">Aksi</th></tr></thead><tbody>
            ${posts.map(p => `<tr class="border-b border-slate-100 dark:border-slate-700">
                <td class="py-3 px-3 font-medium text-slate-800 dark:text-white">${esc(p.judul)}</td>
                <td class="py-3 px-3">${esc(p.kategori)}</td><td class="py-3 px-3">${fmtDate(p.tanggal)}</td>
                <td class="py-3 px-3">${esc(p.penulis)}</td><td class="py-3 px-3">${badge(p.status)}</td>
                <td class="py-3 px-3 text-right whitespace-nowrap">
                    ${p.status === 'Disetujui' ? `<button onclick="publishPost('${p.id}','Terbit')" class="text-emerald-600 hover:underline text-sm font-semibold mr-2">✔ Terbitkan</button>` : p.status === 'Draft' ? `<button onclick="publishPost('${p.id}','Terbit')" class="text-emerald-600 hover:underline text-sm font-semibold mr-2">Terbitkan</button>` : p.status === 'Terbit' ? `<button onclick="publishPost('${p.id}','Arsip')" class="text-amber-600 hover:underline text-sm font-semibold mr-2">Arsipkan</button>` : ''}
                    <a href="postingan.html?mode=admin&id=${encodeURIComponent(p.id)}" class="text-cyan-600 hover:underline text-sm font-semibold mr-2">Edit</a>
                    <button onclick="hapusPost('${p.id}')" class="text-red-500 hover:underline text-sm font-semibold">Hapus</button></td></tr>`).join('') || '<tr><td colspan="6" class="py-8 text-center text-slate-400">Belum ada postingan.</td></tr>'}
            </tbody></table></div>
        </div>`;
        initIconsNow();
    }).catch(e => toast(e.message, 'error'));
}

async function publishPost(id, status) {
    if (!confirm('Ubah status menjadi ' + status + '?')) return;
    const user = Auth.current();
    try { await updateRow('posts', id, { status, by_admin: status === 'Terbit' ? user.name : '' }); toast('Status: ' + status); vAdminPosts(); }
    catch (e) { toast(e.message, 'error'); }
}
async function hapusPost(id) {
    if (!confirm('Hapus postingan ini?')) return;
    try { await deleteRow('posts', id); toast('Postingan dihapus'); vAdminPosts(); }
    catch (e) { toast(e.message, 'error'); }
}

/* ================= SLIDER (Admin) ================= */
function vAdminSliders() {
    const content = $('#content');
    content.innerHTML = `<div class="p-6 text-center py-10 text-slate-400">Memuat...</div>`;
    getTable('sliders').then(sliders => {
        content.innerHTML = `
        <div class="p-6">
            <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
                <h1 class="font-display text-2xl font-extrabold text-slate-900 dark:text-white">Slider / Banner</h1>
                <button onclick="modalSlider()" class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-700 text-white text-sm font-semibold hover:bg-primary-800"><i data-lucide="plus" class="w-4 h-4"></i> Tambah Slider</button>
            </div>
            <div class="grid md:grid-cols-2 gap-5">
            ${sliders.map(s => `<div class="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 shadow-sm">
                <img src="${esc(s.gambar || '')}" class="h-40 w-full object-cover" alt="">
                <div class="p-4">
                    <div class="flex items-center justify-between"><p class="font-semibold">${esc(s.judul)}</p>${s.published === '1' ? badge('Aktif') : badge('Tidak Aktif')}</div>
                    <p class="text-sm text-slate-500 mt-1 line-clamp-2">${esc(s.deskripsi)}</p>
                    <div class="flex gap-2 mt-3"><button onclick='modalSliderEdit(${JSON.stringify(s).replace(/'/g, '&#39;')})' class="px-3 py-1.5 rounded-lg bg-cyan-50 text-cyan-700 text-sm font-semibold">Edit</button><button onclick="hapusSlider('${s.id}')" class="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-sm font-semibold">Hapus</button></div>
                </div></div>`).join('') || '<div class="md:col-span-2 text-center py-10 text-slate-400">Belum ada slider.</div>'}
            </div>
        </div>`;
        initIconsNow();
    }).catch(e => toast(e.message, 'error'));
}

function modalSlider(data = {}) {
    const isEdit = !!data.id;
    openModal(`
        <form id="frm-slider" class="p-6">
            <div class="flex items-center justify-between mb-4"><h3 class="font-display text-lg font-bold">${isEdit ? 'Edit' : 'Tambah'} Slider</h3><button type="button" onclick="closeModal()" class="w-8 h-8 rounded-lg hover:bg-slate-100"><i data-lucide="x" class="w-5 h-5"></i></button></div>
            <div class="space-y-4">
                <div><label class="block text-sm font-medium mb-1">Judul</label><input id="sl-judul" required value="${esc(data.judul || '')}" class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm"></div>
                <div><label class="block text-sm font-medium mb-1">Deskripsi</label><textarea id="sl-desk" rows="2" class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm">${esc(data.deskripsi || '')}</textarea></div>
                <div><label class="block text-sm font-medium mb-1">Gambar (URL)</label><input id="sl-gambar" required value="${esc(data.gambar || '')}" class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm"></div>
                <div class="grid grid-cols-3 gap-3">
                    <div class="col-span-2"><label class="block text-sm font-medium mb-1">Link</label><input id="sl-link" value="${esc(data.link || '')}" class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm"></div>
                    <div><label class="block text-sm font-medium mb-1">Urutan</label><input id="sl-urutan" type="number" min="1" value="${esc(data.urutan || 1)}" class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm"></div>
                </div>
                <div><label class="block text-sm font-medium mb-1">Aktif</label><select id="sl-aktif" class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm"><option value="1">Ya</option><option value="0" ${data.published === '0' ? 'selected' : ''}>Tidak</option></select></div>
                <button class="w-full py-2.5 rounded-lg bg-primary-700 text-white font-semibold text-sm">${isEdit ? 'Simpan' : 'Tambah'}</button>
            </div>
        </form>`);
    $('#frm-slider').addEventListener('submit', async e => {
        e.preventDefault();
        const payload = { judul: $('#sl-judul').value, deskripsi: $('#sl-desk').value, gambar: $('#sl-gambar').value, link: $('#sl-link').value, urutan: $('#sl-urutan').value, published: $('#sl-aktif').value };
        try {
            if (isEdit) { await updateRow('sliders', data.id, payload); toast('Slider diperbarui'); }
            else { await addRow('sliders', payload); toast('Slider ditambahkan'); }
            closeModal(); vAdminSliders();
        } catch (err) { toast(err.message, 'error'); }
    });
}
function modalSliderEdit(d) { modalSlider(d); }
async function hapusSlider(id) {
    if (!confirm('Hapus slider ini?')) return;
    try { await deleteRow('sliders', id); toast('Slider dihapus'); vAdminSliders(); }
    catch (e) { toast(e.message, 'error'); }
}

/* ================= TERBITKAN SERTIFIKAT (Admin) ================= */
function vAdminCertPublish() {
    const content = $('#content');
    content.innerHTML = `<div class="p-6 text-center py-10 text-slate-400">Memuat...</div>`;
    getTable('certificates').then(certs => {
        content.innerHTML = `
        <div class="p-6">
            <h1 class="font-display text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Terbitkan Sertifikat</h1>
            <p class="text-sm text-slate-500 mb-6">Sertifikat <b>Disetujui + Terbit</b> akan tampil di halaman Unduhan publik dan bisa diverifikasi.</p>
            <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-x-auto">
            <table class="w-full text-sm"><thead><tr class="text-left text-xs uppercase tracking-wider text-slate-400 bg-slate-50 dark:bg-slate-900">
                <th class="py-3 px-3">Kode</th><th class="py-3 px-3">Nama</th><th class="py-3 px-3">Fakultas/Prodi</th><th class="py-3 px-3">Status</th><th class="py-3 px-3">Publik</th><th class="py-3 px-3 text-right">Aksi</th></tr></thead><tbody>
            ${certs.map(c => `<tr class="border-b border-slate-100 dark:border-slate-700">
                <td class="py-3 px-3 font-medium">${esc(c.kode)}</td><td class="py-3 px-3">${esc(c.nama)}</td><td class="py-3 px-3">${esc(c.fakultas)}/${esc(c.prodi)}</td>
                <td class="py-3 px-3">${badge(c.status)}</td><td class="py-3 px-3">${c.published === '1' ? badge('Aktif') : badge('Tidak Aktif')}</td>
                <td class="py-3 px-3 text-right"><button onclick="toggleCertPublish('${c.id}','${c.published === '1' ? '0' : '1'}')" class="text-${c.published === '1' ? 'amber' : 'emerald'}-600 hover:underline text-sm font-semibold">${c.published === '1' ? 'Tarik dari Publik' : 'Terbitkan'}</button></td></tr>`).join('') || '<tr><td colspan="6" class="py-8 text-center text-slate-400">Belum ada sertifikat.</td></tr>'}
            </tbody></table></div>
        </div>`;
        initIconsNow();
    }).catch(e => toast(e.message, 'error'));
}

async function toggleCertPublish(id, val) {
    try { await updateRow('certificates', id, { published: val }); toast(val === '1' ? 'Sertifikat diterbitkan ke publik' : 'Sertifikat ditarik dari publik'); vAdminCertPublish(); }
    catch (e) { toast(e.message, 'error'); }
}

window.boards.admin = {
    nav: [
        { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
        { id: 'menu', label: 'Menu Website', icon: 'menu' },
        { id: 'halaman', label: 'Halaman Dinamis', icon: 'file-text' },
        { id: 'postingan', label: 'Postingan & Berita', icon: 'newspaper' },
        { id: 'slider', label: 'Slider / Banner', icon: 'image' },
        { id: 'users', label: 'Kelola Pengguna', icon: 'users' },
        { id: 'labs', label: 'Master Data Lab', icon: 'building-2' },
        { id: 'pengajuan', label: 'Proses Pembelian', icon: 'credit-card' },
        { id: 'sertifikat', label: 'Terbitkan Sertifikat', icon: 'award' },
        { id: 'monitor', label: 'Pantau Aktivitas', icon: 'eye' },
        { id: 'laporan-inventaris', label: 'Laporan Inventaris', icon: 'box' },
        { id: 'laporan-bulanan', label: 'Laporan Bulanan', icon: 'file-text' }
    ],
    views: {
        dashboard: vAdminDashboard,
        menu: vAdminMenus,
        halaman: vAdminPages,
        postingan: vAdminPosts,
        slider: vAdminSliders,
        users: vAdminUsers,
        labs: vAdminLabs,
        pengajuan: vAdminPengajuan,
        sertifikat: vAdminCertPublish,
        monitor: vAdminMonitor,
        'laporan-inventaris': vAdminLapInventaris,
        'laporan-bulanan': vAdminLapBulanan
    }
};