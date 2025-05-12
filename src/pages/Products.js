import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ProductGrid from '../components/products/ProductGrid';
import { useProducts } from '../contexts/ProductContext';
import '../styles/pages/Products.css';

const Products = () => {
  const { products, categories, loading } = useProducts();
  const [activeCategory, setActiveCategory] = useState('all');

  // Filter products by category
  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(product => product.category === activeCategory);

  return (
    <>
      <Header />
      
      <main className="products-page">
        <div className="container">
          <h1 className="page-title">Our Menu</h1>
          
          {/* Category Filter */}
          <div className="category-filter">
            <button 
              className={`category-btn ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              All
            </button>
            
            {categories.map((category, index) => (
              <button 
                key={index}
                className={`category-btn ${activeCategory === category ? 'active' : ''}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
          
          {/* Products Display */}
          {loading ? (
            <div className="loading">Loading products...</div>
          ) : (
            <>
              <h2 className="category-heading">
                {activeCategory === 'all' ? 'All Products' : activeCategory}
              </h2>
              
              {filteredProducts.length === 0 ? (
                <div className="no-products">
                  No products found in this category.
                </div>
              ) : (
                <ProductGrid products={filteredProducts} />
              )}
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default Products;
