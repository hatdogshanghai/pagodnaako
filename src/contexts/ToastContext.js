import React, { createContext, useContext, useState, useCallback } from 'react';
import ToastContainer from '../components/ui/ToastContainer';

// Create context
const ToastContext = createContext();

// Generate unique ID for toasts
const generateId = () => Math.random().toString(36).substr(2, 9);

/**
 * Toast provider component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  // Add a new toast
  const addToast = useCallback((toast) => {
    const id = generateId();
    setToasts(prevToasts => [...prevToasts, { ...toast, id }]);
    return id;
  }, []);

  // Remove a toast by ID
  const removeToast = useCallback((id) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);

  // Show a cart notification
  const showCartNotification = useCallback((productName) => {
    addToast({
      title: 'Added to Cart',
      message: `${productName} has been added to your cart.`,
      icon: 'bx-cart-add',
      type: 'cart',
      duration: 3000
    });
  }, [addToast]);

  // Show a success notification
  const showSuccessNotification = useCallback((title, message) => {
    addToast({
      title,
      message,
      icon: 'bx-check',
      type: 'success',
      duration: 3000
    });
  }, [addToast]);

  // Show an error notification
  const showErrorNotification = useCallback((title, message) => {
    addToast({
      title,
      message,
      icon: 'bx-error',
      type: 'error',
      duration: 5000
    });
  }, [addToast]);

  // Context value
  const value = {
    addToast,
    removeToast,
    showCartNotification,
    showSuccessNotification,
    showErrorNotification
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

// Custom hook to use toast context
export function useToast() {
  return useContext(ToastContext);
}
