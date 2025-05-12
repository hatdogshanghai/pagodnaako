import React from 'react';
import { useCart } from '../../contexts/CartContext';

const CartDebug = () => {
  const { cart, clearCart } = useCart();

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      background: '#f0f0f0',
      padding: '10px',
      borderRadius: '5px',
      zIndex: 1000,
      maxWidth: '300px',
      maxHeight: '200px',
      overflow: 'auto',
      display: 'none' /* Always hidden */
    }}>
      <h4>Cart Debug</h4>
      <button onClick={clearCart} style={{ marginBottom: '10px' }}>Clear Cart</button>
      <pre style={{ fontSize: '10px' }}>
        {JSON.stringify(cart, null, 2)}
      </pre>
    </div>
  );
};

export default CartDebug;
