import React from 'react';
import '../../styles/components/Features.css';

const Features = () => {
  return (
    <section className="features-section">
      <div className="container">
        <div className="features-grid">
          <div className="feature-card">
            <img src="/images/deliver.png" alt="Fast Delivery" className="feature-icon" />
            <h3>Fast Delivery</h3>
            <p>Enjoy our speedy delivery service, bringing your favorite treats right to your doorstep in no time.</p>
          </div>
          
          <div className="feature-card">
            <img src="/images/clock.png" alt="Easy To Order" className="feature-icon" />
            <h3>Easy To Order</h3>
            <p>Ordering is simple and hassle-free. Just a few clicks and your delicious treats are on their way.</p>
          </div>
          
          <div className="feature-card">
            <img src="/images/lock.png" alt="Secure Checkout" className="feature-icon" />
            <h3>Secure Checkout</h3>
            <p>Shop with confidence knowing your payment information is protected with our secure checkout process.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
