import React from 'react';
import { useCart } from '../../contexts/CartContext';

const CartItem = ({ item, index }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const itemTotal = item.price * item.quantity;

  return (
    <div className="cart-item">
      <img src={`/images/${item.image}`} alt={item.name} />
      <div className="cart-item-details">
        <h3>{item.name}</h3>
        <p>₱{item.price.toFixed(2)} x {item.quantity}</p>
        <p>Total: ₱{itemTotal.toFixed(2)}</p>
      </div>
      <div className="cart-item-actions">
        <button
          className="quantity-btn"
          onClick={() => updateQuantity(index, 'decrease')}
        >
          -
        </button>
        <span>{item.quantity}</span>
        <button
          className="quantity-btn"
          onClick={() => updateQuantity(index, 'increase')}
        >
          +
        </button>
        <button
          className="remove-btn"
          onClick={() => removeFromCart(index)}
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default CartItem;
