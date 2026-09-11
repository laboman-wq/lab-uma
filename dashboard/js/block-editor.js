/*********************************************************************
 * Block Editor — susun isi artikel/halaman:
 * Paragraf, Judul, Gambar (URL), Daftar bullet.
 * Dipakai oleh views admin, laboran, dan halaman editor (postingan.html).
 *********************************************************************/
window.BlockEditor = {
    container: null,
    data: [],
    init(elId, blocks) {
        this.container = document.getElementById(elId);
        this.data = blocks && blocks.length ? blocks : [];
        if (this.container) this.render();
    },
    typeOpts(t) {
        const map = { p: 'Paragraf', h: 'Judul', img: 'Gambar (URL)', list: 'Daftar Bullet' };
        return Object.keys(map).map(k => `<option value="${k}" ${t === k ? 'selected' : ''}>${map[k]}</option>`).join('');
    },
    inputFor(b, i) {
        if (b.t === 'img') return `<input data-be-idx="${i}" value="${esc(b.v || '')}" placeholder="https://" class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm">`;
        const ph = b.t === 'list' ? 'Satu item per baris' : b.t === 'h' ? 'Teks judul' : 'Tulis paragraf...';
        const val = b.t === 'list' ? (b.v || []).join('\n') : (b.v || '');
        return `<textarea data-be-idx="${i}" rows="${b.t === 'p' ? 3 : 2}" placeholder="${ph}" class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm">${esc(val)}</textarea>`;
    },
    render() {
        const wrap = this.container;
        if (!wrap) return;
        const rows = this.data.map((b, i) => `
            <div class="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 be-row" data-row="${i}">
                <div class="flex items-center gap-2 mb-1.5">
                    <select onchange="window.BlockEditor.setT(${i},this.value)" class="px-2 py-1 rounded-lg border border-slate-200 text-sm bg-white dark:bg-slate-800">${this.typeOpts(b.t)}</select>
                    <span class="text-xs text-slate-400">Blok ${i + 1}</span>
                    <button type="button" onclick="window.BlockEditor.del(${i})" class="ml-auto text-xs font-semibold text-red-500">Hapus</button>
                </div>
                ${this.inputFor(b, i)}
            </div>`).join('');
        wrap.innerHTML = rows +
            `<button type="button" onclick="window.BlockEditor.add()" class="mt-3 w-full px-3 py-2.5 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 text-sm font-semibold text-cyan-600 hover:border-cyan-400 transition">+ Tambah Blok</button>`;
    },
    add() { this.data.push({ t: 'p', v: '' }); this.render(); },
    del(i) { this.data.splice(i, 1); this.render(); },
    setT(i, t) { this.data[i].t = t; this.data[i].v = []; this.render(); },
    collect() {
        if (!this.container) return '[]';
        const out = [];
        this.container.querySelectorAll('.be-row').forEach(row => {
            const i = parseInt(row.getAttribute('data-row'), 10);
            const el = row.querySelector('[data-be-idx]');
            const type = this.data[i] ? this.data[i].t : 'p';
            const raw = el ? el.value.trim() : '';
            if (!raw) return;
            if (type === 'list') out.push({ t: type, v: raw.split(/\n/).map(s => s.trim()).filter(Boolean) });
            else out.push({ t: type, v: raw });
        });
        return JSON.stringify(out);
    }
};