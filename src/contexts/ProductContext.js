import React, { createContext, useContext, useState, useEffect } from 'react';
import { ref, get } from 'firebase/database';
import { database } from '../services/firebase';

const ProductContext = createContext();

export function useProducts() {
  return useContext(ProductContext);
}

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const productsRef = ref(database, 'items');
        const snapshot = await get(productsRef);

        if (snapshot.exists()) {
          const productsData = snapshot.val();
          const productsArray = Object.values(productsData);

      
          const uniqueCategories = [...new Set(productsArray.map(product => product.category))];

          setProducts(productsArray);
          setCategories(uniqueCategories);
        } else {
       
          const hardcodedProducts = getHardcodedProducts();
          const uniqueCategories = [...new Set(hardcodedProducts.map(product => product.category))];

          setProducts(hardcodedProducts);
          setCategories(uniqueCategories);
        }

        setError(null);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products. Please try again later.');

  
        const hardcodedProducts = getHardcodedProducts();
        const uniqueCategories = [...new Set(hardcodedProducts.map(product => product.category))];

        setProducts(hardcodedProducts);
        setCategories(uniqueCategories);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  function getProductsByCategory(category) {
    return products.filter(product => product.category === category);
  }


  function getProductById(id) {
    return products.find(product => product.id === id);
  }


  function searchProducts(query) {
    const searchTerm = query.toLowerCase();
    return products.filter(product =>
      product.title.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm)
    );
  }


  function getHardcodedProducts() {
    return [
      {
        id: '1',
        title: 'Cheesy Spam overload',
        description: 'Gooey Spam Waffles',
        price: 130.00,
        image: 'waffle1.jpg',
        category: 'Croffles'
      },
      {
        id: '2',
        title: 'Chic & Flakes',
        description: 'Where Style Meets Flavor.',
        price: 99.00,
        image: 'waffle3.jpg',
        category: 'Croffles'
      },
      {
        id: '3',
        title: 'Melted Cheese',
        description: 'Ultimate Cheesy Waffle',
        price: 125.00,
        image: 'waffle4.jpg',
        category: 'Croffles'
      },
      {
        id: '4',
        title: 'Yogu Overload',
        description: 'Drink the Overload, Feel the Rush!',
        price: 140.00,
        image: 'drinks.jpg',
        category: 'Yogu Yogu'
      },
      {
        id: '5',
        title: 'Kiwi Yogu',
        description: 'Refreshing Kiwi Sensation',
        price: 120.00,
        image: 'drink3.jpg',
        category: 'Yogu Yogu'
      },
      {
        id: '6',
        title: 'Tapioca Yogu',
        description: 'Creamy Tapioca Pearls Delight',
        price: 120.00,
        image: 'drinks2.jpg',
        category: 'Yogu Yogu'
      },
      {
        id: '7',
        title: 'Vanilla Ice Cream',
        description: 'Classic Vanilla Goodness',
        price: 85.00,
        image: 'ice.jpg',
        category: 'Ice Cream'
      },
      {
        id: '8',
        title: 'Matcha Ice Cream Shake',
        description: 'Refreshing Green Tea Matcha Blend',
        price: 85.00,
        image: 'ice2.jpg',
        category: 'Ice Cream'
      },
      {
        id: '9',
        title: 'Vanilla Ice Cream Shake',
        description: 'Smooth and Creamy Classic Vanilla Shake',
        price: 85.00,
        image: 'ice3.jpg',
        category: 'Ice Cream'
      }
    ];
  }

  const value = {
    products,
    categories,
    loading,
    error,
    getProductsByCategory,
    getProductById,
    searchProducts
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
}
