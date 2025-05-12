import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, set, update } from 'firebase/database';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { database } from '../services/firebase';
import paymongoService from '../services/paymongoService';
import '../styles/pages/Checkout.css';
import '../styles/components/ShippingAddress.css';

const Checkout = () => {
  const { currentUser, userDetails } = useAuth();
  const { cart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: userDetails?.username || currentUser?.displayName || '',
    email: currentUser?.email || '',
    phone: '',
    addressStreet: '123 Tastemaker Street',
    addressCity: 'Makati City',
    addressRegion: 'Metro Manila',
    addressZip: '1200',
    addressCountry: 'Philippines',
    paymentMethod: 'cash'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [paymentLink, setPaymentLink] = useState(null);
  const [paymentId, setPaymentId] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('pending');

  // Check payment status periodically if payment is in progress
  useEffect(() => {
    let intervalId;

    if (success && paymentId && orderId && formData.paymentMethod === 'paymongo') {
      // Check payment status every 5 seconds
      intervalId = setInterval(async () => {
        try {
          const paymentData = await paymongoService.checkPaymentStatus(paymentId);
          const paymentStatus = paymentData.attributes.status;

          // Update local payment status
          setPaymentStatus(paymentStatus);

          if (paymentStatus === 'paid') {
            // Update order status in Firebase
            await update(ref(database, `users/${currentUser.uid}/orders/${orderId}`), {
              paymentStatus: 'paid'
            });

            await update(ref(database, `centralOrders/${orderId}`), {
              paymentStatus: 'paid'
            });

            // Clear the interval
            clearInterval(intervalId);
          }
        } catch (error) {
          console.error('Error checking payment status:', error);
        }
      }, 5000);
    }

    // Clean up interval on component unmount
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [success, paymentId, orderId, formData.paymentMethod, currentUser]);

  // Calculate totals
  const subtotal = getCartTotal();
  const shipping = 50; // Fixed shipping cost
  const total = subtotal + shipping;

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // Generate a random order ID
  const generateOrderId = () => {
    const prefix = "ORD-";
    const randomNum = Math.floor(1000 + Math.random() * 9000); // 4-digit number
    return prefix + randomNum;
  };

  // Handle payment method selection
  const handlePaymentMethodChange = async (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));

    // If online payment is selected, immediately start the payment process
    if (value === 'paymongo' && cart.length > 0) {
      try {
        setLoading(true);
        setError('');

        // Create order ID
        const orderId = generateOrderId();

        // Convert total to smallest currency unit (centavos)
        const amountInCentavos = Math.round(total * 100);

        console.log('Creating payment link with amount:', amountInCentavos);

        // Create payment link
        const paymentData = await paymongoService.createPaymentLink(
          amountInCentavos,
          `Order ${orderId} - Tastemakers`,
          `Order for ${formData.name}`,
          orderId
        );

        console.log('Payment link created successfully:', paymentData);

        if (!paymentData || !paymentData.attributes || !paymentData.attributes.checkout_url) {
          throw new Error('Invalid payment data received');
        }

        // Store payment link and ID for later use
        setPaymentLink(paymentData.attributes.checkout_url);
        setPaymentId(paymentData.id);
        setOrderId(orderId);

        // Open payment page in a new tab
        window.open(paymentData.attributes.checkout_url, '_blank');

        // Note: We don't save the order to the database yet - that happens on form submission

      } catch (error) {
        console.error('Error creating payment link:', error);
        setError('Failed to create payment link. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      setError('Your cart is empty. Please add items to your cart before checkout.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Create order object
      const orderId = paymentId ? orderId : generateOrderId();
      const order = {
        id: orderId,
        customerName: formData.name,
        email: formData.email,
        phone: formData.phone,
        shippingAddress: {
          street: formData.addressStreet,
          city: formData.addressCity,
          state: formData.addressRegion,
          zip: formData.addressZip,
          country: formData.addressCountry
        },
        paymentMethod: formData.paymentMethod,
        date: new Date().toISOString(),
        items: cart,
        subtotal: subtotal,
        shipping: shipping,
        total: total,
        status: "Pending",
        userId: currentUser.uid
      };

      // If payment method is PayMongo and we don't have a payment link yet
      if (formData.paymentMethod === 'paymongo' && !paymentLink) {
        try {
          setError(''); // Clear any previous errors

          // Convert total to smallest currency unit (centavos)
          const amountInCentavos = Math.round(total * 100);

          console.log('Creating payment link with amount:', amountInCentavos);

          // Create payment link
          const paymentData = await paymongoService.createPaymentLink(
            amountInCentavos,
            `Order ${orderId} - Tastemakers`,
            `Order for ${formData.name}`,
            orderId
          );

          console.log('Payment link created successfully:', paymentData);

          if (!paymentData || !paymentData.attributes || !paymentData.attributes.checkout_url) {
            throw new Error('Invalid payment data received');
          }

          order.paymentId = paymentData.id;
          order.paymentStatus = 'pending';
          order.paymentLink = paymentData.attributes.checkout_url;

          setPaymentLink(paymentData.attributes.checkout_url);
          setPaymentId(paymentData.id);
          setOrderId(orderId);

          // Open payment page in a new tab
          window.open(paymentData.attributes.checkout_url, '_blank');
        } catch (paymentError) {
          console.error('Error creating payment link:', paymentError);
          setError('Failed to create payment link. Please try another payment method.');
          setLoading(false);
          return;
        }
      } else if (formData.paymentMethod === 'paymongo' && paymentLink) {
        // If we already have a payment link, use it
        order.paymentId = paymentId;
        order.paymentStatus = 'pending';
        order.paymentLink = paymentLink;
      }


      await set(ref(database, `users/${currentUser.uid}/orders/${orderId}`), order);


      await set(ref(database, `centralOrders/${orderId}`), order);


      clearCart();

      setSuccess(true);


      setTimeout(() => {
        navigate('/profile');
      }, 3000);
    } catch (error) {
      console.error('Error placing order:', error);
      setError('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <>
        <Header />

        <main className="checkout-page">
          <div className="container">
            <div className="success-message">
              <i className='bx bx-check-circle'></i>
              <h2>Order Placed Successfully!</h2>
              <p>Thank you for your order. We'll process it right away.</p>

              {formData.paymentMethod === 'paymongo' && paymentLink && (
                <div className="payment-info">
                  {paymentStatus === 'paid' ? (
                    <div className="payment-success">
                      <i className='bx bx-check-circle'></i>
                      <p>Payment completed successfully!</p>
                    </div>
                  ) : (
                    <>
                      <div className="payment-processing">
                        <i className='bx bx-credit-card'></i>
                        <h3>Payment Processing</h3>
                        <p>Your order has been placed and a payment page will open in a new tab.</p>
                        <p>If the payment page doesn't open automatically, please click the button below:</p>
                      </div>
                      <a
                        href={paymentLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="payment-link-btn"
                      >
                        <i className='bx bx-credit-card-front'></i> Complete Payment
                      </a>
                      <div className="payment-notes">
                        <p><i className='bx bx-info-circle'></i> Your order will be processed once payment is complete.</p>
                        <p><i className='bx bx-time'></i> This payment link will remain active for 24 hours.</p>
                        <p className="payment-status">Current Status: <span className="status-badge">{paymentStatus}</span></p>
                      </div>
                    </>
                  )}
                </div>
              )}

              <p>You will be redirected to your profile page shortly...</p>
            </div>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="checkout-page">
        <div className="container">
          <h1 className="page-title">Checkout</h1>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="checkout-container">
            <div className="checkout-form-container">
              <h2>Shipping Information</h2>

              <form onSubmit={handleSubmit} className="checkout-form">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="shipping-address-container">
                  <div className="shipping-address-header">
                    <i className='bx bx-map'></i>
                    <h3>Shipping Address</h3>
                  </div>

                  <div className="address-form-container">
                    <div className="form-group">
                      <label htmlFor="addressStreet"><i className='bx bx-home'></i>Street Address</label>
                      <input
                        type="text"
                        id="addressStreet"
                        name="addressStreet"
                        value={formData.addressStreet}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="addressCity"><i className='bx bx-buildings'></i>City</label>
                      <input
                        type="text"
                        id="addressCity"
                        name="addressCity"
                        value={formData.addressCity}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="addressRegion"><i className='bx bx-map-pin'></i>Region/State</label>
                      <input
                        type="text"
                        id="addressRegion"
                        name="addressRegion"
                        value={formData.addressRegion}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="addressZip"><i className='bx bx-envelope'></i>Postal Code</label>
                      <input
                        type="text"
                        id="addressZip"
                        name="addressZip"
                        value={formData.addressZip}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="addressCountry"><i className='bx bx-globe'></i>Country</label>
                      <input
                        type="text"
                        id="addressCountry"
                        name="addressCountry"
                        value={formData.addressCountry}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label>Payment Method</label>
                  <div className="payment-methods">
                    <div className="payment-method">
                      <input
                        type="radio"
                        id="cash"
                        name="paymentMethod"
                        value="cash"
                        checked={formData.paymentMethod === 'cash'}
                        onChange={handleChange}
                      />
                      <label htmlFor="cash">
                        <span className="payment-method-title">
                          <i className='bx bx-money'></i> Cash on Delivery
                        </span>
                        <div className="payment-method-description">
                          Pay when you receive your order
                        </div>
                      </label>
                    </div>

                    <div className="payment-method">
                      <input
                        type="radio"
                        id="paymongo"
                        name="paymentMethod"
                        value="paymongo"
                        checked={formData.paymentMethod === 'paymongo'}
                        onChange={handlePaymentMethodChange}
                        disabled={loading}
                      />
                      <label htmlFor="paymongo" className={loading ? 'disabled' : ''}>
                        <span className="payment-method-title">
                          <i className='bx bx-credit-card-front'></i> Online Payment
                        </span>
                        <div className="payment-method-description">
                          Pay securely with credit/debit cards
                        </div>
                        {loading && formData.paymentMethod === 'paymongo' && (
                          <div className="payment-loading">
                            <i className='bx bx-loader-alt bx-spin'></i> Preparing payment...
                          </div>
                        )}
                      </label>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="place-order-btn"
                  disabled={loading || cart.length === 0}
                >
                  {loading ? 'Processing...' : 'Place Order'}
                </button>
              </form>
            </div>

            <div className="order-summary">
              <h2>Order Summary</h2>

              {cart.length === 0 ? (
                <div className="empty-cart-message">
                  <i className='bx bx-cart'></i>
                  <p>Your cart is empty</p>
                </div>
              ) : (
                <>
                  <div className="cart-items">
                    {cart.map((item, index) => (
                      <div className="cart-item" key={index}>
                        <div className="item-info">
                          <h3>{item.name}</h3>
                          <p>₱{item.price.toFixed(2)} x {item.quantity}</p>
                        </div>
                        <div className="item-total">
                          ₱{(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="shipping-address-container" style={{marginTop: '20px', marginBottom: '20px'}}>
                    <div className="shipping-address-header">
                      <i className='bx bx-map'></i>
                      <h3>Shipping Address</h3>
                    </div>
                    <div className="shipping-address-card">
                      <div className="address-line name">{formData.name}</div>
                      <div className="address-line"><i className='bx bx-home'></i>{formData.addressStreet}</div>
                      <div className="address-line"><i className='bx bx-buildings'></i>{formData.addressCity}, {formData.addressRegion} {formData.addressZip}</div>
                      <div className="address-line"><i className='bx bx-globe'></i>{formData.addressCountry}</div>
                      <div className="address-line"><i className='bx bx-phone'></i>{formData.phone || '+63 945 123 4567'}</div>
                    </div>
                  </div>

                  <div className="order-totals">
                    <div className="total-row">
                      <span>Subtotal:</span>
                      <span>₱{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="total-row">
                      <span>Shipping:</span>
                      <span>₱{shipping.toFixed(2)}</span>
                    </div>
                    <div className="total-row grand-total">
                      <span>Total:</span>
                      <span>₱{total.toFixed(2)}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Checkout;
