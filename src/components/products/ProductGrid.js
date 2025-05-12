import React from 'react';
import ProductCard from './ProductCard';
import '../../styles/components/ProductGrid.css';

const ProductGrid = ({ products, limit }) => {
  // If limit is provided, only show that many products
  const displayProducts = limit ? products.slice(0, limit) : products;

  return (
    <div className="products-grid">
      {displayProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
