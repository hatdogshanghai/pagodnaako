// Cart functionality
document.addEventListener('DOMContentLoaded', function() {
    // Load toast notification CSS
    const toastStylesheet = document.createElement('link');
    toastStylesheet.rel = 'stylesheet';
    toastStylesheet.href = 'src/styles/components/Toast.css';
    document.head.appendChild(toastStylesheet);

    const cartButtons = document.querySelectorAll('.add-to-cart-btn');
    const cartElement = document.querySelector('.card');
    const closeCartButton = document.querySelector('.closeshopping');
    const cartTotal = document.querySelector('.total');
    const cartItemsContainer = document.createElement('div');
    cartItemsContainer.className = 'cart-items';
    cartElement.insertBefore(cartItemsContainer, document.querySelector('.checkout'));

    let cart = [];

    // Initialize cart from localStorage if available
    if (localStorage.getItem('yogeeCart')) {
        try {
            cart = JSON.parse(localStorage.getItem('yogeeCart'));
            updateCartDisplay();
        } catch (e) {
            console.error('Error loading cart from localStorage', e);
            localStorage.removeItem('yogeeCart');
        }
    }

    // Add event listeners to all add-to-cart buttons
    cartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();

            // Get product details from the parent elements
            const productBox = this.closest('.m-item-box');
            const productName = productBox.querySelector('.m-item-des h3').textContent;
            const productPrice = productBox.querySelector('.m-item-price h3').textContent.replace('P', '');
            const productImage = productBox.querySelector('img').src;

            // Check if product is already in cart
            const existingProductIndex = cart.findIndex(item => item.name === productName);

            if (existingProductIndex !== -1) {
                // Increment quantity if product already exists
                cart[existingProductIndex].quantity += 1;
            } else {
                // Add new product to cart
                cart.push({
                    name: productName,
                    price: parseFloat(productPrice),
                    image: productImage,
                    quantity: 1
                });
            }

            // Save cart to localStorage
            localStorage.setItem('yogeeCart', JSON.stringify(cart));

            // Update cart display
            updateCartDisplay();

            // Show cart
            showCart();

            // Update cart count in the header
            updateCartCount();

            // Show toast notification
            showToast(
                'Added to Cart',
                `${productName} has been added to your cart.`,
                'bx-cart-add',
                3000
            );
        });
    });

    // Show cart when cart icon in header is clicked
    document.querySelector('.cart').addEventListener('click', function(e) {
        e.preventDefault();
        showCart();
    });

    // Close cart when close button is clicked
    closeCartButton.addEventListener('click', hideCart);

    function showCart() {
        cartElement.style.display = 'block';
        cartElement.style.right = '0';
    }

    function hideCart() {
        cartElement.style.right = '-400px';
        setTimeout(() => {
            cartElement.style.display = 'none';
        }, 500);
    }

    function updateCartDisplay() {
        // Clear current cart items
        cartItemsContainer.innerHTML = '';

        // Calculate total
        let total = 0;

        // Add each item to the cart display
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            const cartItemElement = document.createElement('div');
            cartItemElement.className = 'cart-item';
            cartItemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p>₱${item.price.toFixed(2)} x ${item.quantity}</p>
                    <p>Total: ₱${itemTotal.toFixed(2)}</p>
                </div>
                <div class="cart-item-actions">
                    <button class="quantity-btn" data-action="decrease" data-index="${index}">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" data-action="increase" data-index="${index}">+</button>
                    <button class="remove-btn" data-index="${index}">×</button>
                </div>
            `;

            cartItemsContainer.appendChild(cartItemElement);
        });

        // Update total display
        cartTotal.textContent = `Total: ₱${total.toFixed(2)}`;

        // Add event listeners to quantity and remove buttons
        document.querySelectorAll('.quantity-btn').forEach(button => {
            button.addEventListener('click', handleQuantityChange);
        });

        document.querySelectorAll('.remove-btn').forEach(button => {
            button.addEventListener('click', handleRemoveItem);
        });

        // Update cart count in the header
        updateCartCount();
    }

    function handleQuantityChange(e) {
        const index = parseInt(e.target.dataset.index);
        const action = e.target.dataset.action;

        if (action === 'increase') {
            cart[index].quantity += 1;
        } else if (action === 'decrease') {
            if (cart[index].quantity > 1) {
                cart[index].quantity -= 1;
            } else {
                // Remove item if quantity would be 0
                cart.splice(index, 1);
            }
        }

        // Save cart to localStorage
        localStorage.setItem('yogeeCart', JSON.stringify(cart));

        // Update cart display
        updateCartDisplay();
    }

    function handleRemoveItem(e) {
        const index = parseInt(e.target.dataset.index);
        cart.splice(index, 1);

        // Save cart to localStorage
        localStorage.setItem('yogeeCart', JSON.stringify(cart));

        // Update cart display
        updateCartDisplay();
    }

    function updateCartCount() {
        const cartCount = document.querySelector('.cart span');
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
    }

    /**
     * Show a toast notification
     * @param {string} title - The notification title
     * @param {string} message - The notification message
     * @param {string} icon - The icon class (Boxicons)
     * @param {number} duration - How long to show the toast in milliseconds
     */
    function showToast(title, message, icon = 'bx-cart-add', duration = 3000) {
        // Create toast container if it doesn't exist
        let toastContainer = document.getElementById('toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toast-container';
            document.body.appendChild(toastContainer);
        }

        // Create toast element
        const toast = document.createElement('div');
        toast.className = 'toast cart-toast';

        // Set toast content
        toast.innerHTML = `
            <div class="toast-header">
                <i class='bx ${icon}'></i>
                <span class="toast-title">${title}</span>
                <button class="toast-close">&times;</button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        `;

        // Add toast to container
        toastContainer.appendChild(toast);

        // Add event listener to close button
        const closeButton = toast.querySelector('.toast-close');
        closeButton.addEventListener('click', () => {
            toast.classList.add('toast-hiding');
            setTimeout(() => {
                toast.remove();
            }, 300);
        });

        // Show the toast
        setTimeout(() => {
            toast.classList.add('toast-visible');
        }, 10);

        // Auto-hide the toast after specified duration
        setTimeout(() => {
            toast.classList.add('toast-hiding');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, duration);
    }

    // Initialize cart display on page load
    updateCartDisplay();
});
