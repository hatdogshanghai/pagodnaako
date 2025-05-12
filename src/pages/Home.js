import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Features from '../components/layout/Features';
import FeaturedProducts from '../components/products/FeaturedProducts';
import ProductGrid from '../components/products/ProductGrid';
import { useProducts } from '../contexts/ProductContext';
import '../styles/pages/Home.css';

const Home = () => {
  const { products, categories, loading } = useProducts();

  return (
    <>
      <Header />

      <main>
        {/* Hero Section */}
        <section className="home" id="home">
          <div className="home-content container">
            <div className="home-text">
              <h1>Cheesy Spam overload</h1>
              <p>Indulge in the Ultimate Cheesy Spam Overload!</p>
              <h3>THE BEST SELLER!</h3>
              <Link to="/products" className="btn">Order Now</Link>
            </div>
            <div className="home-img-container">
              <img src="/images/waffle.png" alt="Cheesy Spam Overload" className="home-img" />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <Features />

        {/* Featured Items Section */}
        <FeaturedProducts />

        {/* Menu Section */}
        <section className="menu container" id="menu-container">
          <div className="heading">
            <h2>Our Menu</h2>
          </div>

          {loading ? (
            <div className="loading">Loading menu...</div>
          ) : (
            <div className="menu-content">
              {categories.map((category, index) => (
                <div className="menu-box" key={index}>
                  <h2>{category}</h2>
                  <ProductGrid
                    products={products.filter(product => product.category === category)}
                    limit={3}
                  />
                  <Link to="/products" className="view-more">View More</Link>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Home;
