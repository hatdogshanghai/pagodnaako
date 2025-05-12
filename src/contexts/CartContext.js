import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const toast = useToast();
  const showCartNotification = toast?.showCartNotification || ((productName) => {
    console.log(`Added to cart: ${productName}`);
  });

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('yogeeCart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Error loading cart from localStorage', e);
        localStorage.removeItem('yogeeCart');
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('yogeeCart', JSON.stringify(cart));
  }, [cart]);

  // Add item to cart
  function addToCart(product) {
    setCart(prevCart => {
      // Check if product is already in cart
      const existingProductIndex = prevCart.findIndex(item => item.name === product.name);

      if (existingProductIndex !== -1) {
        // Increment quantity if product already exists
        const updatedCart = [...prevCart];
        updatedCart[existingProductIndex].quantity += 1;

        // Show toast notification
        showCartNotification(product.name);

        return updatedCart;
      } else {
        // Add new product to cart

        // Show toast notification
        showCartNotification(product.name);

        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  }

  // Remove item from cart
  function removeFromCart(index) {
    setCart(prevCart => {
      const updatedCart = [...prevCart];
      updatedCart.splice(index, 1);
      return updatedCart;
    });
  }

  // Update item quantity
  function updateQuantity(index, action) {
    setCart(prevCart => {
      const updatedCart = [...prevCart];

      if (action === 'increase') {
        updatedCart[index].quantity += 1;
      } else if (action === 'decrease') {
        if (updatedCart[index].quantity > 1) {
          updatedCart[index].quantity -= 1;
        } else {
          // Remove item if quantity would be 0
          updatedCart.splice(index, 1);
        }
      }

      return updatedCart;
    });
  }

  // Clear cart
  function clearCart() {
    setCart([]);
    localStorage.removeItem('yogeeCart');
  }

  // Calculate cart total
  function getCartTotal() {
    return cart.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }

  // Get cart count
  function getCartCount() {
    return cart.reduce((count, item) => {
      return count + item.quantity;
    }, 0);
  }

  // Toggle cart open/closed
  function toggleCart() {
    setCartOpen(prevState => !prevState);
  }

  const value = {
    cart,
    cartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    toggleCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}
