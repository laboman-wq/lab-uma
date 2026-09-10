// Laboratorium UMA - Custom JS

// ===== Dark / Light theme toggle =====
(function theme() {
    var dark = localStorage.getItem('lab-uma-theme') === 'dark';
    var root = document.documentElement;

    function apply() {
        if (dark) root.classList.add('dark'); else root.classList.remove('dark');
        document.querySelectorAll('.theme-label').forEach(function (el) {
            el.textContent = dark ? 'Terang' : 'Gelap';
        });
    }

    document.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-theme-toggle]');
        if (btn) {
            dark = !dark;
            localStorage.setItem('lab-uma-theme', dark ? 'dark' : 'light');
            apply();
        }
    });

    apply();
})();

function initIcons() {
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
}

document.addEventListener('alpine:initialized', function () {
    setTimeout(initIcons, 100);
});

document.addEventListener('DOMContentLoaded', function () {
    initIcons();

    // Gallery filter
    var filterTabs = document.getElementById('filterTabs');
    if (filterTabs) {
        filterTabs.querySelectorAll('.filter-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var cat = btn.getAttribute('data-filter');
                filterTabs.querySelectorAll('.filter-btn').forEach(function (b) {
                    b.className = 'filter-btn px-4 py-2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-slate-300 transition';
                });
                btn.className = 'filter-btn px-4 py-2 rounded-full bg-primary-700 text-white text-sm font-semibold';
                document.querySelectorAll('.gallery-item').forEach(function (item) {
                    if (cat === 'all' || item.getAttribute('data-cat') === cat) {
                        item.style.display = '';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    // Reveal-on-scroll animation
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-up');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach(function (el) {
        observer.observe(el);
    });
});
