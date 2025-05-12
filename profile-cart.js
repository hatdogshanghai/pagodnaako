// Profile page cart functionality
document.addEventListener('DOMContentLoaded', function() {
    // Update cart count in header
    updateCartCount();

    // Add cart sidebar to profile page
    addCartSidebar();

    // Add event listener to cart icon
    document.querySelector('.cart').addEventListener('click', function(e) {
        e.preventDefault();
        showCart();
    });

    // Function to update cart count in header
    function updateCartCount() {
        const cartCount = document.querySelector('.cart span');
        let totalItems = 0;

        if (localStorage.getItem('yogeeCart')) {
            try {
                const cart = JSON.parse(localStorage.getItem('yogeeCart'));
                totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            } catch (e) {
                console.error('Error loading cart from localStorage', e);
            }
        }

        cartCount.textContent = totalItems;
    }

    // Function to add cart sidebar to the page
    function addCartSidebar() {
        // Create cart sidebar element
        const cartSidebar = document.createElement('div');
        cartSidebar.className = 'card';
        cartSidebar.innerHTML = `
            <h1>Yogee's Cart</h1>
            <div class="cart-items"></div>
            <div class="checkout">
                <div class="total">Total: ₱0.00</div>
                <div class="closeshopping">Close</div>
            </div>
            <div style="padding: 0 15px 15px 15px;">
                <a href="checkout.html" class="btn" style="width: 100%; background: linear-gradient(135deg, #6a11cb, #2575fc); color: white; margin: 0 auto; font-weight: bold; font-size: 1.1rem; box-shadow: 0 4px 8px rgba(0,0,0,0.2); transition: all 0.3s ease;">
                    Proceed to Checkout
                </a>
            </div>
        `;

        // Add cart sidebar to the body
        document.body.appendChild(cartSidebar);

        // Add event listener to close button
        cartSidebar.querySelector('.closeshopping').addEventListener('click', hideCart);

        // Update cart display
        updateCartDisplay();
    }

    // Function to show cart
    function showCart() {
        const cartElement = document.querySelector('.card');
        cartElement.style.display = 'block';
        cartElement.style.right = '0';
    }

    // Function to hide cart
    function hideCart() {
        const cartElement = document.querySelector('.card');
        cartElement.style.right = '-400px';
        setTimeout(() => {
            cartElement.style.display = 'none';
        }, 500);
    }

    // Function to update cart display
    function updateCartDisplay() {
        const cartItemsContainer = document.querySelector('.cart-items');
        const cartTotal = document.querySelector('.total');

        // Clear current cart items
        cartItemsContainer.innerHTML = '';

        // Get cart from localStorage
        let cart = [];
        let total = 0;

        if (localStorage.getItem('yogeeCart')) {
            try {
                cart = JSON.parse(localStorage.getItem('yogeeCart'));
            } catch (e) {
                console.error('Error loading cart from localStorage', e);
            }
        }

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
    }

    // Function to handle quantity change
    function handleQuantityChange(e) {
        const index = parseInt(e.target.dataset.index);
        const action = e.target.dataset.action;

        // Get cart from localStorage
        let cart = [];
        if (localStorage.getItem('yogeeCart')) {
            try {
                cart = JSON.parse(localStorage.getItem('yogeeCart'));
            } catch (e) {
                console.error('Error loading cart from localStorage', e);
                return;
            }
        }

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

        // Update cart count
        updateCartCount();
    }

    // Function to handle remove item
    function handleRemoveItem(e) {
        const index = parseInt(e.target.dataset.index);

        // Get cart from localStorage
        let cart = [];
        if (localStorage.getItem('yogeeCart')) {
            try {
                cart = JSON.parse(localStorage.getItem('yogeeCart'));
            } catch (e) {
                console.error('Error loading cart from localStorage', e);
                return;
            }
        }

        // Remove item from cart
        cart.splice(index, 1);

        // Save cart to localStorage
        localStorage.setItem('yogeeCart', JSON.stringify(cart));

        // Update cart display
        updateCartDisplay();

        // Update cart count
        updateCartCount();
    }

    // Add a section to the profile page to show current cart items
    function addCartSection() {
        // Get cart from localStorage
        let cart = [];
        if (localStorage.getItem('yogeeCart')) {
            try {
                cart = JSON.parse(localStorage.getItem('yogeeCart'));
            } catch (e) {
                console.error('Error loading cart from localStorage', e);
                return;
            }
        }

        // Only add the section if there are items in the cart
        if (cart.length > 0) {
            // Create cart section element
            const cartSection = document.createElement('div');
            cartSection.className = 'profile-section';
            cartSection.innerHTML = `
                <h2>Current Cart</h2>
                <div id="profile-cart-items">
                    <!-- Cart items will be populated here -->
                </div>
                <div style="margin-top: 20px;">
                    <a href="checkout.html" class="btn-edit-profile" style="background: linear-gradient(135deg, #6a11cb, #2575fc); color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; display: inline-block;">
                        Proceed to Checkout
                    </a>
                </div>
            `;

            // Find the order history section and insert the cart section before it
            const orderHistorySection = document.querySelector('.order-history');
            orderHistorySection.parentNode.insertBefore(cartSection, orderHistorySection);

            // Populate cart items
            const cartItemsContainer = document.getElementById('profile-cart-items');
            let total = 0;

            // Add each item to the cart display
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;

                const cartItemElement = document.createElement('div');
                cartItemElement.className = 'cart-summary-item';
                cartItemElement.style.display = 'flex';
                cartItemElement.style.alignItems = 'center';
                cartItemElement.style.marginBottom = '15px';
                cartItemElement.style.padding = '10px';
                cartItemElement.style.backgroundColor = '#f9f9f9';
                cartItemElement.style.borderRadius = '8px';

                cartItemElement.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; margin-right: 15px;">
                    <div style="flex-grow: 1;">
                        <h3 style="margin: 0 0 5px 0;">${item.name}</h3>
                        <p style="margin: 0; color: #666;">₱${item.price.toFixed(2)} x ${item.quantity}</p>
                    </div>
                    <div style="font-weight: bold; color: #6a11cb;">
                        ₱${itemTotal.toFixed(2)}
                    </div>
                `;

                cartItemsContainer.appendChild(cartItemElement);
            });

            // Add total row
            const totalElement = document.createElement('div');
            totalElement.style.display = 'flex';
            totalElement.style.justifyContent = 'space-between';
            totalElement.style.marginTop = '15px';
            totalElement.style.padding = '10px';
            totalElement.style.borderTop = '1px solid #eee';
            totalElement.style.fontWeight = 'bold';

            totalElement.innerHTML = `
                <span>Total:</span>
                <span style="color: #6a11cb;">₱${total.toFixed(2)}</span>
            `;

            cartItemsContainer.appendChild(totalElement);
        }
    }

    // Call the function to add cart section to profile page
    addCartSection();
});
