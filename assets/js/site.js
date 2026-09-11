/*********************************************************************
 * Engine frontend publik — mengambil menu, berita, sertifikat
 * dan konten halaman dari Google Apps Script (backend dashboard).
 * Dipakai oleh semua halaman publik (index, profil, berita, page, dll).
 *********************************************************************/
(function () {
    var CONFIG = {
        API: 'https://script.google.com/macros/s/AKfycbzhyilkrP1JmImvK9UGK5oqsQIaJHq8xtE7V9XlZNi4uJt_qhv5mt3yw7fHdm1vqdEQiw/exec',
        TOKEN: 'LABUMA2026'
    };
    var CACHE_KEY = 'lab_site_cache_v1';
    var CACHE_TTL = 300000; // 5 menit

    function esc(s) {
        return String(s == null ? '' : s).replace(/[&<>"']/g, function (m) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
        });
    }

    function fmtDate(d) {
        if (!d) return '-';
        var s = String(d).slice(0, 10), p = s.split('-');
        if (p.length !== 3) return d;
        var b = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        return p[2] + ' ' + b[parseInt(p[1], 10) - 1] + ' ' + p[0];
    }

    function postRaw(body) {
        return fetch(CONFIG.API, { method: 'POST', body: JSON.stringify(body) }).then(function (r) { return r.text(); });
    }

    async function apiOnce(body) {
        var txt = await postRaw(body);
        try { return JSON.parse(txt); } catch (e) {
            // Kebutuhan kedua untuk Apps Script (mengikuti redirect)
            txt = await postRaw(body);
            return JSON.parse(txt);
        }
    }

    async function fetchSite(force) {
        if (!force) {
            var cached = localStorage.getItem(CACHE_KEY);
            if (cached) {
                try {
                    var c = JSON.parse(cached);
                    if (Date.now() - c.ts < CACHE_TTL && c.data && c.data.ok) return c.data;
                } catch (e) { }
            }
        }
        var data = await apiOnce({ action: 'site', token: CONFIG.TOKEN });
        if (data && data.ok) {
            try { localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data: data })); } catch (e) { }
        }
        return data;
    }

    function pageUrl(m) {
        var slug = m.slug || '';
        if (m.tipe === 'link' || /^https?:\/\//i.test(slug)) return slug;
        if (/\.html/.test(slug) || slug.indexOf('#') > -1) return slug;
        return 'page.html?slug=' + encodeURIComponent(slug);
    }

    function childDesc(c) {
        var s = (c.slug || '').split('/').pop().split('#').pop();
        return s ? s.replace(/-/g, ' ') : 'Buka halaman';
    }

    function lucide() { if (window.lucide && lucide.createIcons) lucide.createIcons(); }

    /* ============ NAV DESKTOP ============ */
    function renderDesktop(menus) {
        var box = document.getElementById('site-nav-desktop');
        if (!box) return;
        var out = menus.map(function (m) {
            if (m.children && m.children.length) {
                return '<div class="nav-item relative">' +
                    '<button type="button" class="px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-primary-700 dark:hover:text-cyan-400 transition rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 inline-flex items-center gap-1">' + esc(m.label) + ' <i data-lucide="chevron-down" class="w-4 h-4"></i></button>' +
                    '<div class="mega-menu" style="left:auto;right:0;transform:none;"><div class="grid grid-cols-2 gap-1 min-w-[340px]">' +
                    m.children.map(function (c) {
                        var ic = c.ikon || 'file-text';
                        return '<a href="' + esc(pageUrl(c)) + '" data-slug="' + esc(c.slug || '') + '">' +
                            '<span class="mm-icon bg-blue-100 dark:bg-slate-700 text-blue-600 dark:text-cyan-400"><i data-lucide="' + esc(ic) + '" class="w-4 h-4"></i></span>' +
                            '<span><span class="mm-title block">' + esc(c.label) + '</span><span class="mm-desc block">' + esc(childDesc(c)) + '</span></span></a>';
                    }).join('') + '</div></div></div>';
            }
            return '<a href="' + esc(pageUrl(m)) + '" data-slug="' + esc(m.slug || '') + '" class="nav-link px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-primary-700 dark:hover:text-cyan-400 transition rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">' + esc(m.label) + '</a>';
        }).join('');

        out += '<a href="dashboard/login.html" class="ml-2 inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg bg-primary-700 text-white hover:bg-primary-800 transition shadow-sm"><i data-lucide="log-in" class="w-4 h-4"></i> Login</a>';
        box.innerHTML = out;
        lucide();
    }

    /* ============ NAV MOBILE ============ */
    function renderMobile(menus) {
        var box = document.getElementById('site-nav-mobile');
        if (!box) return;
        var out = menus.map(function (m) {
            if (m.children && m.children.length) {
                return '<div class="mn-group"><button type="button" class="mn-trigger">' +
                    '<span class="inline-flex items-center gap-2"><i data-lucide="' + esc(m.ikon || 'folder') + '" class="w-4 h-4"></i> ' + esc(m.label) + '</span>' +
                    '<i data-lucide="chevron-down" class="w-4 h-4 chev"></i></button><div class="mn-body">' +
                    m.children.map(function (c) {
                        return '<a href="' + esc(pageUrl(c)) + '">' + esc(c.label) + '</a>';
                    }).join('') + '</div></div>';
            }
            return '<a href="' + esc(pageUrl(m)) + '" class="flex items-center gap-2 px-3 py-2.5 rounded-lg font-semibold text-sm hover:bg-cyan-50 dark:hover:bg-slate-800">' +
                '<i data-lucide="' + esc(m.ikon || 'circle') + '" class="w-4 h-4 text-cyan-600"></i> ' + esc(m.label) + '</a>';
        }).join('');
        out += '<a href="dashboard/login.html" class="mt-3 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary-700 text-white font-semibold text-sm"><i data-lucide="log-in" class="w-4 h-4"></i> Login</a>';
        box.innerHTML = out;
        lucide();
        bindAccordion();
    }

    function bindAccordion() {
        document.querySelectorAll('.mobile-nav .mn-trigger').forEach(function (t) {
            t.onclick = function () {
                var g = t.parentElement;
                var open = g.classList.contains('open');
                g.parentElement.querySelectorAll('.mn-group.open').forEach(function (x) { x.classList.remove('open'); });
                if (!open) g.classList.add('open');
            };
        });
    }

    function renderFallbackNav() {
        var links = [
            ['index.html', 'Beranda'], ['profil.html', 'Profil'], ['fasilitas.html', 'Fasilitas'],
            ['layanan.html', 'Layanan'], ['penelitian.html', 'Penelitian'], ['galeri.html', 'Galeri'],
            ['berita.html', 'Berita'], ['kontak.html', 'Kontak']
        ];
        var d = document.getElementById('site-nav-desktop');
        if (d) d.innerHTML = links.map(function (l) {
            return '<a href="' + l[0] + '" class="px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-primary-700 transition rounded-lg hover:bg-slate-50">' + l[1] + '</a>';
        }).join('') + '<a href="dashboard/login.html" class="ml-2 inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg bg-primary-700 text-white">Login</a>';
        var m = document.getElementById('site-nav-mobile');
        if (m) m.innerHTML = links.map(function (l) {
            return '<a href="' + l[0] + '" class="flex items-center gap-2 px-3 py-2.5 rounded-lg font-semibold text-sm">' + l[1] + '</a>';
        }).join('') + '<a href="dashboard/login.html" class="mt-3 flex justify-center px-4 py-2.5 rounded-lg bg-primary-700 text-white text-sm font-semibold">Login</a>';
        lucide();
    }

    function highlightActive() {
        var page = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase().split('?')[0];
        if (page === '') page = 'index.html';
        document.querySelectorAll('#site-nav-desktop a[data-slug]').forEach(function (a) {
            var slug = (a.getAttribute('data-slug') || '').toLowerCase();
            if (slug.indexOf('#') > -1) return;
            if (slug === page || slug.indexOf(page) > -1) {
                a.classList.add('bg-cyan-50', 'dark:bg-slate-800', 'text-primary-700', 'dark:text-cyan-400', 'font-semibold');
            }
        });
    }

    /* ============ DRAWER ============ */
    function initDrawer() {
        var hb = document.getElementById('site-hamburger');
        var nav = document.getElementById('site-nav-mobile');
        var bd = document.getElementById('site-backdrop');
        if (!hb || !nav) return;
        function open() { nav.classList.add('open'); if (bd) bd.classList.add('show'); document.body.style.overflow = 'hidden'; }
        function close() { nav.classList.remove('open'); if (bd) bd.classList.remove('show'); document.body.style.overflow = ''; }
        hb.addEventListener('click', open);
        if (bd) bd.addEventListener('click', close);
        var closeBtn = nav.querySelector('.mn-close');
        if (closeBtn) closeBtn.addEventListener('click', close);
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    }

    /* ============ RENDER BLOK KONTEN ============ */
    function renderBlocks(el, isi) {
        if (!el) return;
        var blocks = [];
        try { blocks = JSON.parse(isi || '[]') || []; } catch (e) { blocks = []; }
        (blocks || []).forEach(function (b) {
            var node = null;
            if (b.t === 'p') {
                node = document.createElement('p');
                node.className = 'my-3 text-slate-600 dark:text-slate-300 leading-relaxed';
                node.textContent = b.v || '';
            } else if (b.t === 'h') {
                node = document.createElement('h2');
                node.className = 'mt-7 mb-2 font-display text-xl md:text-2xl font-bold text-slate-900 dark:text-white';
                node.textContent = b.v || '';
            } else if (b.t === 'img') {
                node = document.createElement('img');
                node.src = b.v || '';
                node.alt = 'Gambar';
                node.className = 'my-4 rounded-xl w-full object-cover max-h-80 shadow-sm';
            } else if (b.t === 'r') {
                node = document.createElement('div');
                node.className = 'prose-content my-3 leading-relaxed text-slate-600 dark:text-slate-300';
                node.innerHTML = b.v || '';
            } else if (b.t === 'list') {
                node = document.createElement('ul');
                node.className = 'my-3 space-y-1.5 list-disc pl-5 text-slate-600 dark:text-slate-300';
                (b.v || []).forEach(function (t) {
                    var li = document.createElement('li');
                    li.textContent = t;
                    node.appendChild(li);
                });
            }
            if (node) el.appendChild(node);
        });
    }

    /* ============ API tambahan ============ */
    async function pageBySlug(slug) {
        return apiOnce({ action: 'page', slug: slug, token: CONFIG.TOKEN });
    }
    async function postsByCat(cat) {
        return apiOnce({ action: 'posts', category: cat || 'all', token: CONFIG.TOKEN });
    }
    async function postById(id) {
        return apiOnce({ action: 'post', id: id, token: CONFIG.TOKEN });
    }
    async function certByKode(kode) {
        return apiOnce({ action: 'cert', kode: kode, token: CONFIG.TOKEN });
    }

    /* ============ INISIALISASI ============ */
    document.addEventListener('DOMContentLoaded', function () {
        initDrawer();
        fetchSite().then(function (data) {
            if (data && data.ok) {
                renderDesktop(data.menus);
                renderMobile(data.menus);
                highlightActive();
                window.SiteData = data;
                var ev = new CustomEvent('site:ready', { detail: data });
                document.dispatchEvent(ev);
            } else {
                renderFallbackNav();
            }
        }).catch(function () { renderFallbackNav(); });
    });

    window.Site = {
        esc: esc,
        fmtDate: fmtDate,
        renderBlocks: renderBlocks,
        fetchSite: fetchSite,
        pageBySlug: pageBySlug,
        postsByCat: postsByCat,
        postById: postById,
        certByKode: certByKode
    };
})();