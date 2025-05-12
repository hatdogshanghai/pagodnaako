import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/components/Footer.css';

const Footer = () => {
  return (
    <footer>
      <div className="footer-container container">
        <div className="footer-content">
          <div className="footer-box">
            <h2>Yogee</h2>
            <p>Delicious treats, waffles, frozen yogurt and more. Experience the taste of happiness with every bite.</p>
            <div className="social">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <i className='bx bxl-facebook'></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <i className='bx bxl-twitter'></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <i className='bx bxl-instagram'></i>
              </a>
            </div>
          </div>
          
          <div className="footer-box">
            <h3>Quick Links</h3>
            <div className="footer-links">
              <Link to="/">Home</Link>
              <Link to="/products">Menu</Link>
              <Link to="/testimonials">Testimonials</Link>
              <Link to="/profile">Profile</Link>
            </div>
          </div>
          
          <div className="footer-box">
            <h3>Contact</h3>
            <div className="contact">
              <span><i className='bx bxs-map'></i>123 Main Street, City, Country</span>
              <span><i className='bx bxs-phone'></i>+1 234 567 8901</span>
              <span><i className='bx bxs-envelope'></i>info@yogee.com</span>
            </div>
          </div>
          
          <div className="footer-box">
            <h3>Opening Hours</h3>
            <div className="opening-hours">
              <span>Monday - Friday: 9:00 AM - 10:00 PM</span>
              <span>Saturday - Sunday: 10:00 AM - 11:00 PM</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="copyright">
        <p>© {new Date().getFullYear()} Yogee. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
