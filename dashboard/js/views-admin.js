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
                        <h3 class="font-semibold text-slate-800 dark:text-white mb-3">Akun Demo</h3>
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

window.boards.admin = {
    nav: [
        { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
        { id: 'users', label: 'Kelola Pengguna', icon: 'users' },
        { id: 'labs', label: 'Master Data Lab', icon: 'building-2' },
        { id: 'pengajuan', label: 'Proses Pembelian', icon: 'credit-card' },
        { id: 'monitor', label: 'Pantau Aktivitas', icon: 'eye' },
        { id: 'laporan-inventaris', label: 'Laporan Inventaris', icon: 'box' },
        { id: 'laporan-bulanan', label: 'Laporan Bulanan', icon: 'file-text' }
    ],
    views: {
        dashboard: vAdminDashboard,
        users: vAdminUsers,
        labs: vAdminLabs,
        pengajuan: vAdminPengajuan,
        monitor: vAdminMonitor,
        'laporan-inventaris': vAdminLapInventaris,
        'laporan-bulanan': vAdminLapBulanan
    }
};