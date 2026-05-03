// ========================================
// includes.js
// Loads header.html and footer.html into
// every page and handles newsletter signup.
// Link this BEFORE main.js on every page:
// <script src="includes.js"></script>
// <script src="main.js"></script>
// ========================================

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

// === Newsletter Validation ===
function initNewsletter() {
    const form = document.getElementById('newsletterForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const input = document.getElementById('newsletterEmail');
        const error = document.getElementById('newsletterError');
        const success = document.getElementById('newsletterSuccess');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Reset state
        error.setAttribute('hidden', '');
        success.setAttribute('hidden', '');
        input.style.borderColor = '';

        if (!emailRegex.test(input.value.trim())) {
            // Show error
            error.removeAttribute('hidden');
            input.style.borderColor = '#c0392b';
            input.focus();
            return;
        }

        // Valid — show success, clear input, hide form
        input.value = '';
        form.style.display = 'none';
        success.removeAttribute('hidden');

        // Reset after 6 seconds
        setTimeout(() => {
            success.setAttribute('hidden', '');
            form.style.display = '';
        }, 6000);
    });

    // Clear error on input
    const input = document.getElementById('newsletterEmail');
    if (input) {
        input.addEventListener('input', function () {
            const error = document.getElementById('newsletterError');
            error.setAttribute('hidden', '');
            input.style.borderColor = '';
        });
    }
}

// === Run on page load ===
document.addEventListener('DOMContentLoaded', loadIncludes);