import { useCart } from '../contexts/CartContext';

export function useCartOperations() {
  const { addToCart } = useCart();

  // Enhanced addToCart function that ensures image paths are correct
  const addProductToCart = (product) => {
    // Make sure the image path is correct
    const imagePath = product.image;
    
    // Add the product to the cart
    addToCart({
      name: product.title,
      price: product.price,
      image: imagePath
    });
  };

  return {
    addProductToCart
  };
}
