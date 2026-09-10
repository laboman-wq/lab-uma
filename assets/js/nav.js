// Shared navigation JS for Laboratorium UMA

function initLabNav() {
    var hamburger = document.querySelector('.mobile-hamburger');
    var mobileNav = document.querySelector('.mobile-nav');
    var backdrop = document.querySelector('.nav-backdrop');
    var closeBtn = document.querySelector('.mn-close');

    function open() {
        if (mobileNav) mobileNav.classList.add('open');
        if (backdrop) backdrop.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
    function close() {
        if (mobileNav) mobileNav.classList.remove('open');
        if (backdrop) backdrop.classList.remove('show');
        document.body.style.overflow = '';
    }

    if (hamburger) hamburger.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', close);
    if (backdrop) backdrop.addEventListener('click', close);

    // Mobile accordion groups
    document.querySelectorAll('.mn-trigger').forEach(function (trigger) {
        trigger.addEventListener('click', function () {
            var group = trigger.closest('.mn-group');
            var isOpen = group.classList.contains('open');
            // close siblings
            if (group.parentElement) {
                group.parentElement.querySelectorAll('.mn-group.open').forEach(function (g) {
                    if (g !== group) g.classList.remove('open');
                });
            }
            group.classList.toggle('open', !isOpen);
        });
    });

    // Close on escape
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') close();
    });
}

// Auto-highlight active nav item based on current page
function highlightActive() {
    var page = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
    if (page === '') page = 'index.html';

    var map = {
        'index.html': 'Beranda',
        'profil.html': 'Profil',
        'fasilitas.html': 'Fasilitas',
        'layanan.html': 'Layanan',
        'penelitian.html': 'Penelitian',
        'galeri.html': 'Galeri',
        'berita.html': 'Berita',
        'unduhan.html': 'Unduhan',
        'kontak.html': 'Kontak'
    };
    var target = map[page];
    if (!target) return;

    // Desktop nav
    var deskNav = document.querySelector('.desktop-nav');
    if (deskNav) {
        deskNav.querySelectorAll('button, a').forEach(function (el) {
            var txt = (el.textContent || '').trim().replace(/\s+/g, ' ');
            // match exact label (first word matters)
            var isMatch = txt.indexOf(target) === 0 || txt === target;
            if (isMatch) {
                el.classList.add('bg-cyan-50', 'dark:bg-slate-800', 'text-primary-700', 'dark:text-cyan-400', 'font-semibold');
                el.classList.remove('font-medium');
            }
        });
    }

    // Mobile nav
    var mobNav = document.querySelector('.mobile-nav');
    if (mobNav) {
        mobNav.querySelectorAll('a').forEach(function (el) {
            var txt = (el.textContent || '').trim();
            if (txt === target) {
                el.classList.add('bg-cyan-50', 'dark:bg-slate-800', 'text-primary-700', 'dark:text-cyan-400');
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', initLabNav);
document.addEventListener('DOMContentLoaded', highlightActive);
