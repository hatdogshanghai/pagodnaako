import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import '../styles/pages/InstallGuide.css';

const InstallGuide = () => {
  return (
    <>
      <Header />
      <main className="install-guide-page">
        <div className="container">
          <h1 className="page-title">Yogee Mobile App Installation Guide</h1>

          <section className="guide-section">
            <h2>App Overview</h2>
            <div className="text-center" style={{ marginBottom: '30px' }}>
              <img
                src="/images/yogee.png"
                alt="Yogee Logo"
                style={{ width: '150px', marginBottom: '20px' }}
              />
              <h3 style={{ color: 'var(--text-alter-color)', marginBottom: '10px' }}>Yogee App</h3>
              <p>Delicious treats, delivered to your doorstep</p>
            </div>

            <div className="benefits-grid">
              <div className="benefit-card">
                <i className='bx bx-food-menu'></i>
                <h3>Easy Ordering</h3>
                <p>Browse our menu and order with just a few taps</p>
              </div>

              <div className="benefit-card">
                <i className='bx bx-time'></i>
                <h3>Fast Delivery</h3>
                <p>Get your favorite treats delivered quickly</p>
              </div>

              <div className="benefit-card">
                <i className='bx bx-gift'></i>
                <h3>Special Offers</h3>
                <p>Exclusive deals and promotions for app users</p>
              </div>

              <div className="benefit-card">
                <i className='bx bx-star'></i>
                <h3>Loyalty Rewards</h3>
                <p>Earn points with every purchase</p>
              </div>
            </div>
          </section>

          <section className="guide-section">
            <h2>Installation Guide</h2>
            <div className="platform-guides">
              <div className="platform-guide">
                <h3><i className='bx bxl-android'></i> Android Installation</h3>
                <div className="method">
                  <h4>Method 1: Google Play Store</h4>
                  <ol>
                    <li>Open the Google Play Store on your device</li>
                    <li>Search for "Yogee App"</li>
                    <li>Tap "Install" to download and install the app</li>
                    <li>Once installed, open the app and create an account</li>
                  </ol>
                </div>
                <div className="method">
                  <h4>Method 2: Direct Download</h4>
                  <ol>
                    <li>Scan the QR code below or click the download button</li>
                    <li>Follow the on-screen instructions to install</li>
                    <li>You may need to enable "Install from Unknown Sources" in your settings</li>
                  </ol>
                  <button style={{
                    padding: '10px 20px',
                    backgroundColor: 'var(--container-color)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    marginTop: '10px'
                  }}>
                    Download for Android
                  </button>
                </div>
              </div>

              <div className="platform-guide">
                <h3><i className='bx bxl-apple'></i> iOS Installation</h3>
                <div className="method">
                  <h4>Method 1: App Store</h4>
                  <ol>
                    <li>Open the App Store on your iPhone or iPad</li>
                    <li>Search for "Yogee App"</li>
                    <li>Tap "Get" to download and install the app</li>
                    <li>Once installed, open the app and create an account</li>
                  </ol>
                </div>
                <div className="method">
                  <h4>Method 2: TestFlight (Beta)</h4>
                  <ol>
                    <li>Download TestFlight from the App Store</li>
                    <li>Scan the QR code below or click the invitation link</li>
                    <li>Follow the TestFlight instructions to install the beta version</li>
                  </ol>
                  <button style={{
                    padding: '10px 20px',
                    backgroundColor: 'var(--container-color)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    marginTop: '10px'
                  }}>
                    Download for iOS
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="guide-section">
            <h2>Getting Started</h2>
            <div className="usage-guide">
              <div className="usage-item">
                <h3>Creating an Account</h3>
                <ol>
                  <li>Open the Yogee App on your device</li>
                  <li>Tap "Sign Up" on the welcome screen</li>
                  <li>Enter your email address and create a password</li>
                  <li>Fill in your profile information</li>
                  <li>Verify your email address</li>
                  <li>Start exploring the app!</li>
                </ol>
              </div>

              <div className="usage-item">
                <h3>Placing Your First Order</h3>
                <ol>
                  <li>Browse the menu categories</li>
                  <li>Select items you want to order</li>
                  <li>Customize your order if needed</li>
                  <li>Add items to your cart</li>
                  <li>Review your order and proceed to checkout</li>
                  <li>Enter delivery address and payment information</li>
                  <li>Confirm your order and wait for delivery!</li>
                </ol>
              </div>
            </div>
          </section>

          <section className="guide-section">
            <h2>Frequently Asked Questions</h2>
            <div className="faq">
              <div className="faq-item">
                <h3>How do I track my order?</h3>
                <p>Once your order is confirmed, you can track its status in real-time from the "Orders" section in the app. You'll receive notifications when your order is being prepared, out for delivery, and delivered.</p>
              </div>

              <div className="faq-item">
                <h3>What payment methods are accepted?</h3>
                <p>We accept various payment methods including:</p>
                <ul>
                  <li>Credit/Debit Cards</li>
                  <li>PayMongo</li>
                  <li>GCash</li>
                  <li>Cash on Delivery</li>
                </ul>
              </div>

              <div className="faq-item">
                <h3>Is there a minimum order amount?</h3>
                <p>Yes, the minimum order amount is ₱150 for delivery orders. There is no minimum for pickup orders.</p>
              </div>

              <div className="faq-item">
                <h3>How do I contact customer support?</h3>
                <p>You can reach our customer support team through the "Help" section in the app, or by emailing support@yogeeapp.com.</p>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default InstallGuide;

