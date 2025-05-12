
// This script demonstrates how to connect checkout.html with the admin dashboard
// Include this script in your checkout.html page

// Function to generate a random order ID
function generateOrderId() {
    const prefix = "ORD-";
    const randomNum = Math.floor(1000 + Math.random() * 9000); // 4-digit number
    return prefix + randomNum;
}

// Function to save order to localStorage
function saveOrder(orderData) {
    // Get existing orders
    const existingOrders = localStorage.getItem('orders');
    let orders = existingOrders ? JSON.parse(existingOrders) : [];
    
    // Add new order
    orders.push(orderData);
    
    // Save to localStorage
    localStorage.setItem('orders', JSON.stringify(orders));
    
    console.log('Order saved successfully:', orderData);
}

// Example of how to use this when a customer completes checkout
document.addEventListener('DOMContentLoaded', function() {
    // Assuming you have a checkout form with id "checkout-form"
    const checkoutForm = document.getElementById('checkout-form');
    
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const address = document.getElementById('address').value;
            
            // Get cart items from localStorage
            const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
            
            // Calculate totals
            let subtotal = 0;
            cartItems.forEach(item => {
                subtotal += item.price * item.quantity;
            });
            
            const shipping = 50; // Fixed shipping cost
            const total = subtotal + shipping;
            
            // Create order object
            const order = {
                id: generateOrderId(),
                customerName: name,
                email: email,
                phone: phone,
                address: address,
                date: new Date().toISOString(),
                items: cartItems,
                subtotal: subtotal,
                shipping: shipping,
                total: total,
                status: "Pending"
            };
            
            // Save order
            saveOrder(order);
            
            // Clear cart
            localStorage.removeItem('cart');
            
            // Redirect to thank you page or show success message
            alert('Order placed successfully! Order ID: ' + order.id);
            // window.location.href = 'thank-you.html';
        });
    }
    
    // For testing: Create a sample order button
    const testOrderBtn = document.createElement('button');
    testOrderBtn.textContent = 'Create Test Order';
    testOrderBtn.style.position = 'fixed';
    testOrderBtn.style.bottom = '20px';
    testOrderBtn.style.right = '20px';
    testOrderBtn.style.zIndex = '1000';
    testOrderBtn.style.padding = '10px';
    testOrderBtn.style.backgroundColor = '#333';
    testOrderBtn.style.color = '#fff';
    testOrderBtn.style.border = 'none';
    testOrderBtn.style.borderRadius = '4px';
    testOrderBtn.style.cursor = 'pointer';
    
    testOrderBtn.addEventListener('click', function() {
        // Create a sample order
        const sampleOrder = {
            id: generateOrderId(),
            customerName: "Customer Name",
            email: "customer@example.com",
            phone: "123-456-7890",
            address: "Customer Address",
            date: "2023-05-15T12:34:56.789Z",
            items: [
                { name: "Product Name", price: 130, quantity: 2 },
                { name: "Another Product", price: 95, quantity: 1 }
            ],
            subtotal: 355,
            shipping: 50,
            total: 405,
            status: "Pending"
        };
        
        // Save order
        saveOrder(sampleOrder);
        
        alert('Test order created! Order ID: ' + sampleOrder.id + '\nCheck the admin dashboard to see it.');
    });
    
    document.body.appendChild(testOrderBtn);
});

