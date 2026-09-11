/*********************************************************************
 * LABORATORIUM UMA — API Client
 * Ganti APPS_SCRIPT_URL dengan URL web app Google Apps Script kamu
 * (berakhiran /exec). Langkah setup ada di README-DASHBOARD.md
 *********************************************************************/
const CONFIG = {
    APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbxpIiYlrfh9tfIIJ1G6JL2YO9cUM2EXJCCrePqXoVeH6iQCC-OUgSDLkY-mTC4_IvM-iQ/exec',
    TOKEN: 'LABUMA2026'
};

async function api(action, payload = {}) {
    const body = Object.assign({ action, token: CONFIG.TOKEN }, payload);
    try {
        const res = await fetch(CONFIG.APPS_SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify(body)
        });
        const text = await res.text();
        // Apps Script kadang membungkus response; coba parse JSON
        try {
            return JSON.parse(text);
        } catch (e) {
            // Beberapa browser memerlukan koneksi kedua kali utk CORS
            const res2 = await fetch(CONFIG.APPS_SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify(body)
            });
            return JSON.parse(await res2.text());
        }
    } catch (err) {
        return { ok: false, message: 'Gagal terhubung ke server: ' + err.message };
    }
}

async function getTable(table) {
    const r = await api('get', { table });
    if (!r.ok) throw new Error(r.message || 'Gagal mengambil data');
    return r.data;
}

async function addRow(table, data) {
    const r = await api('add', { table, data });
    if (!r.ok) throw new Error(r.message || 'Gagal menyimpan data');
    return r.id;
}

async function updateRow(table, id, data) {
    const r = await api('update', { table, id, data });
    if (!r.ok) throw new Error(r.message || 'Gagal memperbarui data');
    return r.id;
}

async function deleteRow(table, id) {
    const r = await api('delete', { table, id });
    if (!r.ok) throw new Error(r.message || 'Gagal menghapus data');
    return r.id;
}

async function nextNo(prefix) {
    const r = await api('nextno', { prefix });
    if (!r.ok) throw new Error(r.message || 'Gagal membuat nomor');
    return r.no;
}

async function getSummary() {
    const r = await api('summary');
    if (!r.ok) throw new Error(r.message);
    return r;
}

async function getOptions() {
    const r = await api('options');
    if (!r.ok) throw new Error(r.message);
    return r;
}

async function getMonthly(bulan, tahun) {
    const r = await api('monthly', { bulan, tahun });
    if (!r.ok) throw new Error(r.message || 'Gagal membuat laporan bulanan');
    return r;
}