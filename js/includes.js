// === Load Header & Footer ===
async function loadIncludes() {
    const header = document.getElementById('header-placeholder');
    const footer = document.getElementById('footer-placeholder');

    if (header) {
        const res = await fetch('header.html');
        header.innerHTML = await res.text();

        // Auto-set active nav link based on current page
        const currentPage = location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav-link').forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            }
        });
    }

    if (footer) {
        const res = await fetch('footer.html');
        footer.innerHTML = await res.text();

        // Init newsletter after footer loads
        initNewsletter();
    }
}
