import React from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../contexts/ProductContext';
import '../../styles/components/FeaturedProducts.css';

const FeaturedProducts = () => {
  const { products, loading } = useProducts();
  
  // Get featured products (first 3 products)
  const featuredProducts = products.slice(0, 3);

  return (
    <section className="featured-products" id="featured-products">
      <div className="container">
        <div className="section-header">
          <h2>Featured Items</h2>
          <Link to="/products" className="view-all-btn">View All</Link>
        </div>
        
        {loading ? (
          <div className="loading">Loading featured items...</div>
        ) : (
          <div className="products-grid">
            {featuredProducts.map((product) => (
              <div className="product-card" key={product.id}>
                <div className="product-image">
                  <img src={`/images/${product.image}`} alt={product.title} />
                </div>
                <div className="product-info">
                  <h3 className="product-title">{product.title}</h3>
                  <div className="product-rating">
                    <span className="stars">★★★★★</span>
                  </div>
                  <div className="product-price">₱{product.price.toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
