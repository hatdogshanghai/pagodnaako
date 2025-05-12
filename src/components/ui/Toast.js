import React, { useState, useEffect } from 'react';
import '../../styles/components/Toast.css';

/**
 * Toast notification component
 * @param {Object} props - Component props
 * @param {string} props.title - Toast title
 * @param {string} props.message - Toast message
 * @param {string} props.icon - Boxicons icon class
 * @param {string} props.type - Toast type (cart, success, error, etc.)
 * @param {number} props.duration - Duration to show toast in milliseconds
 * @param {Function} props.onClose - Function to call when toast is closed
 */
const Toast = ({ 
  title, 
  message, 
  icon = 'bx-cart-add', 
  type = 'cart', 
  duration = 3000, 
  onClose 
}) => {
  const [visible, setVisible] = useState(false);
  const [hiding, setHiding] = useState(false);

  useEffect(() => {
    // Show toast after a small delay
    const showTimeout = setTimeout(() => {
      setVisible(true);
    }, 10);

    // Auto-hide toast after duration
    const hideTimeout = setTimeout(() => {
      handleClose();
    }, duration);

    return () => {
      clearTimeout(showTimeout);
      clearTimeout(hideTimeout);
    };
  }, [duration]);

  const handleClose = () => {
    setHiding(true);
    setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, 300);
  };

  return (
    <div className={`toast ${type}-toast ${visible ? 'toast-visible' : ''} ${hiding ? 'toast-hiding' : ''}`}>
      <div className="toast-header">
        <i className={`bx ${icon}`}></i>
        <span className="toast-title">{title}</span>
        <button className="toast-close" onClick={handleClose}>&times;</button>
      </div>
      <div className="toast-body">
        {message}
      </div>
    </div>
  );
};

export default Toast;
