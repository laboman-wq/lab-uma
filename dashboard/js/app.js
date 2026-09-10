/*********************************************************************
 * Helpers UI + Router dashboard
 *********************************************************************/
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

function esc(str) {
    return String(str == null ? '' : str).replace(/[&<>"']/g, m => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[m]));
}

function fmtDate(d) {
    if (!d) return '-';
    const s = String(d).slice(0, 10);
    const p = s.split('-');
    if (p.length !== 3) return d;
    const bulan = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    return `${p[2]} ${bulan[parseInt(p[1]) - 1]} ${p[0]}`;
}

function todayStr() {
    const d = new Date();
    const p = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function bulanList() {
    return [
        ['01', 'Januari'], ['02', 'Februari'], ['03', 'Maret'], ['04', 'April'],
        ['05', 'Mei'], ['06', 'Juni'], ['07', 'Juli'], ['08', 'Agustus'],
        ['09', 'September'], ['10', 'Oktober'], ['11', 'November'], ['12', 'Desember']
    ];
}

function badge(status) {
    const map = {
        'Menunggu': 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
        'Divalidasi': 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
        'Disetujui': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
        'Ditolak': 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
        'Diproses': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
        'Selesai': 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
        'Aktif': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
        'Tidak Aktif': 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
        'Baik': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
        'Rusak': 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
        'Perbaikan': 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
    };
    const cls = map[status] || 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300';
    return `<span class="inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${cls}">${esc(status)}</span>`;
}

function toast(msg, type = 'success') {
    const colors = type === 'error' ? 'bg-red-600' : type === 'warn' ? 'bg-amber-500' : 'bg-emerald-600';
    const box = document.createElement('div');
    box.className = `fixed bottom-5 right-5 z-[100] ${colors} text-white px-5 py-3 rounded-xl shadow-xl text-sm font-medium`;
    box.textContent = msg;
    document.body.appendChild(box);
    setTimeout(() => box.remove(), 3000);
}

function openModal(html) {
    const wrap = document.createElement('div');
    wrap.id = 'modal-wrap';
    wrap.className = 'fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm';
    wrap.innerHTML = `<div class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">${html}</div>`;
    wrap.addEventListener('click', e => { if (e.target === wrap) closeModal(); });
    document.body.appendChild(wrap);
    initIconsNow();
}

function closeModal() {
    const w = $('#modal-wrap');
    if (w) w.remove();
}

function initIconsNow() {
    if (window.lucide && lucide.createIcons) lucide.createIcons();
}

/* ============ ROUTER ============ */
window.boards = {};

function setNav(nav) {
    const wrap = $('#sidebar-nav');
    if (!wrap) return;
    wrap.innerHTML = nav.map(n =>
        `<a href="#" data-view="${n.id}" class="nav-link flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-cyan-50 dark:hover:bg-slate-800 hover:text-primary-700 dark:hover:text-cyan-400 transition">
            <i data-lucide="${n.icon}" class="w-4.5 h-4.5 w-[18px] h-[18px]"></i> ${n.label}
        </a>`).join('');
    $$('.nav-link', wrap).forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            goto(a.dataset.view);
        });
    });
    initIconsNow();
}

function goto(viewId) {
    const user = Auth.current();
    if (!user) { window.location.href = 'login.html'; return; }
    const board = window.boards[user.role];
    if (!board || !board.views[viewId]) { toast('Halaman tidak ditemukan', 'error'); return; }
    $$('.nav-link').forEach(a => {
        a.classList.toggle('bg-cyan-50', a.dataset.view === viewId);
        a.classList.toggle('dark:bg-slate-800', a.dataset.view === viewId);
        a.classList.toggle('text-primary-700', a.dataset.view === viewId);
        a.classList.toggle('dark:text-cyan-400', a.dataset.view === viewId);
        a.classList.toggle('font-semibold', a.dataset.view === viewId);
    });
    board.views[viewId]();
}

function initDashboard() {
    const user = Auth.guard();
    if (!user) return;
    const board = window.boards[user.role];
    if (!board) { toast('Role tidak dikenali', 'error'); Auth.clear(); window.location.href = 'login.html'; return; }

    // Header user info (defensif: jangan crash jika elemen belum ada)
    const uName = $('#user-name'); const uRole = $('#user-role');
    if (uName) uName.textContent = user.name;
    if (uRole) uRole.textContent = roleLabel(user.role);

    setNav(board.nav);

    const logout = $('#logout-btn');
    if (logout) logout.addEventListener('click', () => {
        Auth.clear();
        window.location.href = '../index.html';
    });
    const backSite = $('#back-site');
    if (backSite) backSite.addEventListener('click', e => { e.preventDefault(); window.location.href = '../index.html'; });

    goto('dashboard');
}

function roleLabel(role) {
    return {
        admin: 'Administrator',
        laboran: 'Laboran',
        kepalalab: 'Kepala Laboratorium',
        asisten: 'Asisten Lab'
    }[role] || role;
}

document.addEventListener('DOMContentLoaded', initDashboard);