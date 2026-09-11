/*********************************************************************
 * Block Editor — susun isi artikel/halaman.
 * Jenis blok: Paragraf, Judul, Gambar (URL), Daftar bullet,
 * dan Teks Kaya (Rich Text) dengan toolbar format.
 * Dipakai oleh views admin/laboran dan halaman editor (postingan.html).
 *********************************************************************/
window.BlockEditor = {
    container: null,
    data: [],
    quill: 'richtext', // opsi rich text via contenteditable + execCommand

    toolbarHTML(i) {
        const b = (cmd, lbl, t) =>
            `<button type="button" class="be-rtb" data-i="${i}" data-cmd="${cmd}" title="${t}" onmousedown="event.preventDefault(); window.BlockEditor.exec(${i},'${cmd}')">${lbl}</button>`;
        return `<div class="be-rt-toolbar">
            ${b('bold', '<b>B</b>', 'Tebal')}
            ${b('italic', '<i>I</i>', 'Miring')}
            ${b('underline', '<u>U</u>', 'Garis bawah')}
            ${b('strikeThrough', '<s>S</s>', 'Coret')}
            <span class="be-rt-sep"></span>
            ${b('h2', 'H2', 'Judul sub-bagian')}
            ${b('p', '&#182;', 'Paragraf')}
            <span class="be-rt-sep"></span>
            ${b('insertUnorderedList', '&#8226;', 'Daftar bullet')}
            ${b('insertOrderedList', '1.', 'Daftar nomor')}
            ${b('blockquote', '&#10077;', 'Kutipan')}
            <span class="be-rt-sep"></span>
            ${b('link', '&#128279;', 'Sisipkan tautan')}
            ${b('removeFormat', '&#9003;', 'Bersihkan format')}
        </div>`;
    },

    init(elId, blocks) {
        this.container = document.getElementById(elId);
        this.data = blocks && blocks.length ? blocks : [];
        if (this.container) this.render();
    },
    typeOpts(t) {
        const map = { p: 'Paragraf', h: 'Judul', img: 'Gambar (URL)', list: 'Daftar Bullet', r: 'Teks Kaya (Rich Text)' };
        return Object.keys(map).map(k => `<option value="${k}" ${t === k ? 'selected' : ''}>${map[k]}</option>`).join('');
    },
    inputFor(b, i) {
        if (b.t === 'img') return `<input data-be-idx="${i}" value="${esc(b.v || '')}" placeholder="https://" class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm">`;
        if (b.t === 'r') {
            return `<div class="be-rt-wrap" data-be-idx="${i}">${this.toolbarHTML(i)}
                <div class="be-rt" contenteditable="true" data-be-rich="${i}">${b.v || ''}</div>
            </div>`;
        }
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
                    <span class="ml-auto flex items-center gap-1">
                        <button type="button" onclick="window.BlockEditor.move(${i},-1)" class="px-1.5 py-0.5 text-xs rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700" title="Naik">&#8593;</button>
                        <button type="button" onclick="window.BlockEditor.move(${i},1)" class="px-1.5 py-0.5 text-xs rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700" title="Turun">&#8595;</button>
                        <button type="button" onclick="window.BlockEditor.del(${i})" class="ml-1 text-xs font-semibold text-red-500">Hapus</button>
                    </span>
                </div>
                ${this.inputFor(b, i)}
            </div>`).join('');
        wrap.innerHTML = rows +
            `<button type="button" onclick="window.BlockEditor.add()" class="mt-3 w-full px-3 py-2.5 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 text-sm font-semibold text-cyan-600 hover:border-cyan-400 transition">+ Tambah Blok</button>`;
    },
    add() { this.sync(); this.data.push({ t: 'p', v: '' }); this.render(); },
    del(i) { this.sync(); this.data.splice(i, 1); this.render(); },
    setT(i, t) { this.sync(); this.data[i].t = t; this.data[i].v = t === 'list' ? [] : ''; this.render(); },
    move(i, dir) {
        const j = i + dir;
        if (j < 0 || j >= this.data.length) return;
        this.sync();
        const tmp = this.data[i]; this.data[i] = this.data[j]; this.data[j] = tmp;
        this.render();
    },
    // Simpan nilai semua blok DARI DOM ke data (dipanggil sebelum render ulang)
    sync() {
        const wrap = this.container;
        if (!wrap) return;
        wrap.querySelectorAll('.be-row').forEach(row => {
            const i = parseInt(row.getAttribute('data-row'), 10);
            if (!this.data[i]) return;
            const t = this.data[i].t;
            if (t === 'r') {
                const rt = row.querySelector(`[data-be-rich="${i}"]`);
                if (rt) this.data[i].v = rt.innerHTML;
            } else {
                const el = row.querySelector('[data-be-idx]');
                if (el) this.data[i].v = el.value.trim();
            }
        });
    },
    // Terapkan perintah format ke blok rich text
    exec(i, cmd) {
        const el = this.container.querySelector(`[data-be-rich="${i}"]`);
        if (!el) return;
        el.focus();
        if (cmd === 'link') {
            const url = prompt('URL tautan:', 'https://');
            if (url) document.execCommand('createLink', false, url);
            return;
        }
        if (cmd === 'h2') { document.execCommand('formatBlock', false, 'H2'); return; }
        if (cmd === 'p') { document.execCommand('formatBlock', false, 'p'); return; }
        document.execCommand(cmd, false, null);
    },
    collect() {
        if (!this.container) return '[]';
        const out = [];
        this.container.querySelectorAll('.be-row').forEach(row => {
            const i = parseInt(row.getAttribute('data-row'), 10);
            const type = this.data[i] ? this.data[i].t : 'p';
            let raw = '';
            if (type === 'r') {
                const rt = row.querySelector(`[data-be-rich="${i}"]`);
                raw = rt ? rt.innerHTML : '';
            } else {
                const el = row.querySelector('[data-be-idx]');
                raw = el ? el.value.trim() : '';
            }
            if (!raw) return;
            if (type === 'list') out.push({ t: type, v: raw.split(/\n/).map(s => s.trim()).filter(Boolean) });
            else out.push({ t: type, v: raw });
        });
        return JSON.stringify(out);
    }
};