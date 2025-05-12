import React from 'react';
import { useCart } from '../../contexts/CartContext';
import { useCartOperations } from '../../hooks/useCartOperations';
import '../../styles/components/ProductCard.css';

const ProductCard = ({ product }) => {
  const { addProductToCart } = useCartOperations();

  const handleAddToCart = () => {
    addProductToCart(product);
  };

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={`/images/${product.image}`} alt={product.title} />
      </div>
      <div className="product-details">
        <h3 className="product-name">{product.title}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-price">₱{product.price.toFixed(2)}</div>
        <div className="product-actions">
          <button
            className="add-to-cart-button"
            onClick={handleAddToCart}
          >
            <i className='bx bx-cart-add'></i> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
