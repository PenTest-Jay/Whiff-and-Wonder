// ========================================
// Whiff and Wonder - Main JavaScript
// ========================================

// === Cart Functionality ===

function getCart() {
    const cart = localStorage.getItem('whiffCart');
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem('whiffCart', JSON.stringify(cart));
}

// Add item to cart
function addToCart(productName, price) {
    const cart = getCart();
    const existingItem = cart.find(item => item.name === productName);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        const cards = document.querySelectorAll('.product-card');
        let image = 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=100&q=80';
        cards.forEach(card => {
            if (card.getAttribute('data-name') === productName) {
                const img = card.querySelector('.product-image');
                if (img) image = img.src;
            }
        });
        cart.push({ name: productName, price: price, quantity: 1, image });
    }

    saveCart(cart);
    updateCartBadge();
    showAddedToast(productName);
}

// Remove item from cart
function removeFromCart(productName) {
    let cart = getCart().filter(item => item.name !== productName);
    saveCart(cart);
    updateCartBadge();
    renderCart();
}

// Update item quantity
function updateQuantity(productName, newQuantity) {
    const cart = getCart();
    const item = cart.find(item => item.name === productName);
    if (item) {
        item.quantity = parseInt(newQuantity);
        saveCart(cart);
        updateCartBadge();
        renderCart();
    }
}

// Calculate totals
function calculateTotals() {
    const cart = getCart();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal === 0 ? 0 : subtotal > 100 ? 0 : 10.00;
    const total = subtotal + shipping;
    return {
        subtotal: subtotal.toFixed(2),
        shipping: shipping === 0 ? 'FREE' : shipping.toFixed(2),
        total: total.toFixed(2)
    };
}

// === Cart Badge ===
function updateCartBadge() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartLink = document.querySelector('a[href="cart.html"]');
    if (!cartLink) return;

    const existingBadge = cartLink.querySelector('.cart-badge');
    if (existingBadge) existingBadge.remove();

    if (totalItems > 0) {
        const badge = document.createElement('span');
        badge.className = 'cart-badge';
        badge.textContent = totalItems > 99 ? '99+' : totalItems;
        cartLink.style.position = 'relative';
        cartLink.appendChild(badge);
    }
}

// === Toast Notification ===
function showAddedToast(productName) {
    const existing = document.querySelector('.cart-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'cart-toast';
    toast.textContent = `✓ ${productName} added to cart`;
    document.body.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

// === Render Cart Table ===
function renderCart() {
    const cart = getCart();
    const cartItemsBody = document.getElementById('cartItems');
    const emptyCart = document.getElementById('emptyCart');
    const cartContainer = document.getElementById('cartContainer');

    if (!cartItemsBody) return;

    if (cart.length === 0) {
        emptyCart.classList.remove('hidden');
        cartContainer.classList.add('hidden');
        return;
    }

    emptyCart.classList.add('hidden');
    cartContainer.classList.remove('hidden');

    cartItemsBody.innerHTML = cart.map(item => `
        <tr>
            <td><img src="${item.image}" alt="${item.name}" class="cart-item-image"></td>
            <td class="cart-item-name">${item.name}</td>
            <td>
                <select class="cart-item-qty"
                    onchange="updateQuantity('${item.name}', this.value)"
                    aria-label="Quantity for ${item.name}">
                    ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num =>
        `<option value="${num}" ${num === item.quantity ? 'selected' : ''}>${num}</option>`
    ).join('')}
                </select>
            </td>
            <td class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</td>
            <td>
                <button class="remove-btn"
                    onclick="removeFromCart('${item.name}')"
                    aria-label="Remove ${item.name} from cart">×</button>
            </td>
        </tr>
    `).join('');

    const totals = calculateTotals();
    document.getElementById('subtotal').textContent = `$${totals.subtotal}`;
    document.getElementById('shipping').textContent = totals.shipping === 'FREE' ? 'FREE' : `$${totals.shipping}`;
    document.getElementById('total').textContent = `$${totals.total}`;
}

// Proceed to checkout
function proceedToCheckout() {
    alert('Proceeding to checkout... (This is a demo)');
}

// === Contact Form Validation ===

function validateFullName(name) {
    return /^[a-zA-Z\s'-]+$/.test(name) && name.trim().length > 0;
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function setFieldError(input, hasError) {
    const fieldset = input.closest('fieldset');
    if (!fieldset) return;
    if (hasError) {
        fieldset.classList.add('error');
    } else {
        fieldset.classList.remove('error');
    }
}

function handleContactFormSubmit(event) {
    event.preventDefault();

    const fullName = document.getElementById('fullName');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    let isValid = true;

    if (!validateFullName(fullName.value)) {
        setFieldError(fullName, true);
        isValid = false;
    } else {
        setFieldError(fullName, false);
    }

    if (!validateEmail(email.value)) {
        setFieldError(email, true);
        isValid = false;
    } else {
        setFieldError(email, false);
    }

    if (message.value.trim().length === 0) {
        setFieldError(message, true);
        isValid = false;
    } else {
        setFieldError(message, false);
    }

    if (isValid) {
        const successBanner = document.getElementById('successBanner');
        successBanner.removeAttribute('hidden');
        fullName.value = '';
        email.value = '';
        message.value = '';
        setTimeout(() => successBanner.setAttribute('hidden', ''), 5000);
    }
}

function handleNameInput(event) {
    const name = event.target.value;
    if (name.length > 0 && !validateFullName(name)) {
        setFieldError(event.target, true);
    } else {
        setFieldError(event.target, false);
    }
}

// === Product Search ===
function handleProductSearch(event) {
    const searchTerm = event.target.value.toLowerCase().trim();
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        const name = (card.getAttribute('data-name') || '').toLowerCase();
        const text = card.textContent.toLowerCase();
        card.style.display = (name.includes(searchTerm) || text.includes(searchTerm)) ? '' : 'none';
    });
}

// === Newsletter Validation ===
// Uses event delegation so it works with dynamically loaded footer
function initNewsletter() {
    document.addEventListener('submit', function (e) {
        if (!e.target.matches('#newsletterForm')) return;
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
            error.removeAttribute('hidden');
            input.style.borderColor = '#c0392b';
            input.focus();
            return;
        }

        // Valid
        input.value = '';
        e.target.style.display = 'none';
        success.removeAttribute('hidden');

        setTimeout(() => {
            success.setAttribute('hidden', '');
            e.target.style.display = '';
        }, 6000);
    });

    // Clear error on typing
    document.addEventListener('input', function (e) {
        if (!e.target.matches('#newsletterEmail')) return;
        document.getElementById('newsletterError').setAttribute('hidden', '');
        e.target.style.borderColor = '';
    });
}

// === Initialize ===
document.addEventListener('DOMContentLoaded', function () {

    // Cart page
    if (document.getElementById('cartItems')) {
        renderCart();
    }

    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactFormSubmit);
        const fullNameInput = document.getElementById('fullName');
        if (fullNameInput) {
            fullNameInput.addEventListener('input', handleNameInput);
        }
    }

    // Product search
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', handleProductSearch);
    }

    // Newsletter — call it here so it's always initialised
    initNewsletter();

}); // <-- closing brace was missing before