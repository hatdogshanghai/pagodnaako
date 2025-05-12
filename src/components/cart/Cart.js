import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import CartItem from './CartItem';
import '../../styles/components/Cart.css';

const Cart = () => {
  const { cart, cartOpen, toggleCart, getCartTotal } = useCart();

  return (
    <div className={`card ${cartOpen ? 'active' : ''}`}>
      <div className="cart-header">
        <h2>Your Cart</h2>
        <button className="closeshopping" onClick={toggleCart}>
          <i className='bx bx-x'></i>
        </button>
      </div>
      
      <div className="cart-items">
        {cart.length === 0 ? (
          <div className="empty-cart">
            <i className='bx bx-cart'></i>
            <p>Your cart is empty</p>
          </div>
        ) : (
          cart.map((item, index) => (
            <CartItem key={index} item={item} index={index} />
          ))
        )}
      </div>
      
      <div className="cart-footer">
        <div className="total">
          <span>Total:</span>
          <span>₱{getCartTotal().toFixed(2)}</span>
        </div>
        
        <div className="checkout">
          {cart.length > 0 && (
            <Link to="/checkout" className="checkout-btn" onClick={toggleCart}>
              Proceed to Checkout
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
