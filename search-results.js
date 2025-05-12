// Search results page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Load toast notification CSS
    const toastStylesheet = document.createElement('link');
    toastStylesheet.rel = 'stylesheet';
    toastStylesheet.href = 'src/styles/components/Toast.css';
    document.head.appendChild(toastStylesheet);

    // Get query parameter from URL
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('query');

    // Display the search query
    const searchQueryDisplay = document.getElementById('search-query-display');
    if (searchQueryDisplay) {
        searchQueryDisplay.textContent = query || 'All Products';
    }

    // If no query, show all products
    if (!query) {
        fetchAllProducts();
        return;
    }

    // Fetch products from Firebase
    fetchProductsBySearch(query);
});

// Function to fetch all products
function fetchAllProducts() {
    // Import Firebase modules
    import("https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js")
        .then((firebaseApp) => {
            import("https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js")
                .then((firebaseDB) => {
                    const { initializeApp } = firebaseApp;
                    const { getDatabase, ref, get } = firebaseDB;

                    // Initialize Firebase
                    const firebaseConfig = {
                        apiKey: "AIzaSyAe_9cLfhCyt9ACJcndpZrn6FslK8v83Rk",
                        authDomain: "yogeelogin.firebaseapp.com",
                        databaseURL: "https://yogeelogin-default-rtdb.firebaseio.com",
                        projectId: "yogeelogin",
                        storageBucket: "yogeelogin.appspot.com",
                        messagingSenderId: "48290836478",
                        appId: "1:48290836478:web:8b43881d88456ad9659aaf"
                    };

                    const app = initializeApp(firebaseConfig);
                    const database = getDatabase(app);

                    // Get products from Firebase
                    get(ref(database, 'items'))
                        .then((snapshot) => {
                            if (snapshot.exists()) {
                                const items = snapshot.val();
                                displaySearchResults(Object.values(items));
                            } else {
                                // If no items in database, use hardcoded products
                                displaySearchResults(getHardcodedProducts());
                            }
                        })
                        .catch((error) => {
                            console.error("Error fetching products:", error);
                            // Fallback to hardcoded products
                            displaySearchResults(getHardcodedProducts());
                        });
                })
                .catch(error => {
                    console.error("Error importing Firebase database module:", error);
                    // Fallback to hardcoded products
                    displaySearchResults(getHardcodedProducts());
                });
        })
        .catch(error => {
            console.error("Error importing Firebase app module:", error);
            // Fallback to hardcoded products
            displaySearchResults(getHardcodedProducts());
        });
}

// Function to fetch products by search query
function fetchProductsBySearch(query) {
    // Import Firebase modules
    import("https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js")
        .then((firebaseApp) => {
            import("https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js")
                .then((firebaseDB) => {
                    const { initializeApp } = firebaseApp;
                    const { getDatabase, ref, get } = firebaseDB;

                    // Initialize Firebase
                    const firebaseConfig = {
                        apiKey: "AIzaSyAe_9cLfhCyt9ACJcndpZrn6FslK8v83Rk",
                        authDomain: "yogeelogin.firebaseapp.com",
                        databaseURL: "https://yogeelogin-default-rtdb.firebaseio.com",
                        projectId: "yogeelogin",
                        storageBucket: "yogeelogin.appspot.com",
                        messagingSenderId: "48290836478",
                        appId: "1:48290836478:web:8b43881d88456ad9659aaf"
                    };

                    const app = initializeApp(firebaseConfig);
                    const database = getDatabase(app);

                    // Get products from Firebase
                    get(ref(database, 'items'))
                        .then((snapshot) => {
                            if (snapshot.exists()) {
                                const items = snapshot.val();
                                const allProducts = Object.values(items);

                                // Filter products by search query
                                const filteredProducts = filterProductsByQuery(allProducts, query);
                                displaySearchResults(filteredProducts);
                            } else {
                                // If no items in database, use hardcoded products
                                const hardcodedProducts = getHardcodedProducts();
                                const filteredProducts = filterProductsByQuery(hardcodedProducts, query);
                                displaySearchResults(filteredProducts);
                            }
                        })
                        .catch((error) => {
                            console.error("Error fetching products:", error);
                            // Fallback to hardcoded products
                            const hardcodedProducts = getHardcodedProducts();
                            const filteredProducts = filterProductsByQuery(hardcodedProducts, query);
                            displaySearchResults(filteredProducts);
                        });
                })
                .catch(error => {
                    console.error("Error importing Firebase database module:", error);
                    // Fallback to hardcoded products
                    const hardcodedProducts = getHardcodedProducts();
                    const filteredProducts = filterProductsByQuery(hardcodedProducts, query);
                    displaySearchResults(filteredProducts);
                });
        })
        .catch(error => {
            console.error("Error importing Firebase app module:", error);
            // Fallback to hardcoded products
            const hardcodedProducts = getHardcodedProducts();
            const filteredProducts = filterProductsByQuery(hardcodedProducts, query);
            displaySearchResults(filteredProducts);
        });
}

// Function to filter products by query
function filterProductsByQuery(products, query) {
    if (!query) return products;

    query = query.toLowerCase();
    return products.filter(product => {
        return (
            (product.title && product.title.toLowerCase().includes(query)) ||
            (product.description && product.description.toLowerCase().includes(query)) ||
            (product.price && product.price.toString().includes(query)) ||
            (product.category && product.category.toLowerCase().includes(query))
        );
    });
}

// Function to display search results
function displaySearchResults(products) {
    const searchResultsContainer = document.getElementById('search-results');

    // Clear previous results
    searchResultsContainer.innerHTML = '';

    // If no products found
    if (!products || products.length === 0) {
        searchResultsContainer.innerHTML = `
            <div class="no-results">
                <i class='bx bx-search-alt' style="font-size: 3rem; color: #6a11cb;"></i>
                <p>No products found matching your search. Try a different keyword.</p>
            </div>
        `;
        return;
    }

    // Display products
    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'search-result-item';

        productElement.innerHTML = `
            <img src="${product.image || 'placeholder.jpg'}" alt="${product.title}" class="search-result-img">
            <div class="search-result-info">
                <h3 class="search-result-title">${product.title || 'Product'}</h3>
                <p class="search-result-desc">${product.description || ''}</p>
                <p class="search-result-price">${product.price || 'Price not available'}</p>
                <button class="search-result-btn add-to-cart-btn" data-id="${product.id || ''}" data-title="${product.title || 'Product'}" data-price="${product.price || '0'}" data-image="${product.image || 'placeholder.jpg'}">
                    Add to Cart
                </button>
            </div>
        `;

        searchResultsContainer.appendChild(productElement);
    });

    // Add event listeners to Add to Cart buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            const productTitle = this.getAttribute('data-title');
            const productPrice = this.getAttribute('data-price');
            const productImage = this.getAttribute('data-image');

            // Add to cart functionality
            addToCart({
                id: productId,
                title: productTitle,
                price: productPrice,
                image: productImage,
                quantity: 1
            });

            // Show toast notification
            showToast(
                'Added to Cart',
                `${productTitle} has been added to your cart.`,
                'bx-cart-add',
                3000
            );
        });
    });
}

// Function to get hardcoded products (fallback)
function getHardcodedProducts() {
    return [
        {
            id: '1',
            title: 'Cheesy Spam overload',
            description: 'Gooey Spam Waffles',
            price: 'P130.00',
            image: 'waffle1.jpg',
            category: 'Croffles'
        },
        {
            id: '2',
            title: 'Chic & Flakes',
            description: 'Where Style Meets Flavor.',
            price: 'P99.00',
            image: 'waffle3.jpg',
            category: 'Croffles'
        },
        {
            id: '3',
            title: 'Melted Cheese',
            description: 'Ultimate Cheesy Waffle',
            price: 'P125.00',
            image: 'waffle4.jpg',
            category: 'Croffles'
        },
        {
            id: '4',
            title: 'Yogu Overload',
            description: 'Drink the Overload, Feel the Rush!',
            price: 'P140.00',
            image: 'drinks.jpg',
            category: 'Yogu Yogu'
        },
        {
            id: '5',
            title: 'Kiwi Melon',
            description: 'Refresh with a Kiwi Melon Burst!',
            price: 'P165.00',
            image: 'drink3.jpg',
            category: 'Yogu Yogu'
        },
        {
            id: '6',
            title: 'Yogu mini Overload',
            description: 'Mini Drinks, Maximum Overload!',
            price: 'P100.00',
            image: 'drinks2.jpg',
            category: 'Yogu Yogu'
        },
        {
            id: '7',
            title: 'Oatmilk Ice Cream',
            description: 'Scoop the Oat',
            price: 'P175.00',
            image: 'ice.jpg',
            category: 'Frozen Yogurt'
        },
        {
            id: '8',
            title: 'Fruity Matcha',
            description: 'Fresh Matcha Burst',
            price: 'P140.00',
            image: 'ice2.jpg',
            category: 'Frozen Yogurt'
        },
        {
            id: '9',
            title: 'Fromilk Blueberry',
            description: 'Creamy, Fruity Bliss!',
            price: 'P135.00',
            image: 'ice3.jpg',
            category: 'Frozen Yogurt'
        }
    ];
}

// Function to add product to cart
function addToCart(product) {
    // Get existing cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Check if product already exists in cart
    const existingProductIndex = cart.findIndex(item => item.id === product.id);

    if (existingProductIndex !== -1) {
        // If product exists, increase quantity
        cart[existingProductIndex].quantity += 1;
    } else {
        // If product doesn't exist, add it to cart
        cart.push(product);
    }

    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Update cart count
    updateCartCount();
}

// Function to update cart count
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

    // Update cart count in header
    const cartCountElement = document.querySelector('.cart span');
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
    }
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
