// Laboratorium UMA - Custom JS
// Initializes lucide icons after Alpine loads them dynamically

function initIcons() {
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
}

// Re-init icons when Alpine re-renders (dropdown open etc.)
document.addEventListener('alpine:initialized', () => {
    setTimeout(initIcons, 100);
});

// Simple Intersection Observer for reveal-on-scroll animations
document.addEventListener('DOMContentLoaded', () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-up');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });

    // Initial icon load
    initIcons();
});
