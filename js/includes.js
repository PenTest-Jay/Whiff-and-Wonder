async function loadIncludes() {
    const header = document.getElementById('header-placeholder');
    const footer = document.getElementById('footer-placeholder');

    const base = window.location.pathname.replace(/\/[^/]*$/, '/');

    if (header) {
        const res = await fetch(base + 'header.html');
        const text = await res.text();
        header.innerHTML = text;

        // Set active nav link
        const currentPage = location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav-link').forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            }
        });

        // Badge runs AFTER header is in the DOM
        updateCartBadge();
    }

    if (footer) {
        const res = await fetch(base + 'footer.html');
        footer.innerHTML = await res.text();
        initNewsletter();
    }
}

document.addEventListener('DOMContentLoaded', loadIncludes);