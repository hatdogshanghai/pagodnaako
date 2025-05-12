import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ProductGrid from '../components/products/ProductGrid';
import { useProducts } from '../contexts/ProductContext';
import '../styles/pages/SearchResults.css';

const SearchResults = () => {
  const location = useLocation();
  const { searchProducts } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);

  // Extract search query from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('query') || '';
    setSearchQuery(query);
    
    if (query) {
      const searchResults = searchProducts(query);
      setResults(searchResults);
    } else {
      setResults([]);
    }
  }, [location.search, searchProducts]);

  return (
    <>
      <Header />
      
      <main className="search-results-page">
        <div className="container">
          <h1 className="page-title">
            {searchQuery ? `Search Results for "${searchQuery}"` : 'Search Results'}
          </h1>
          
          {results.length === 0 ? (
            <div className="no-results">
              <i className='bx bx-search-alt'></i>
              <h2>No results found</h2>
              <p>
                We couldn't find any products matching "{searchQuery}".
                Try checking your spelling or using different keywords.
              </p>
            </div>
          ) : (
            <>
              <p className="results-count">
                Found {results.length} {results.length === 1 ? 'product' : 'products'}
              </p>
              
              <ProductGrid products={results} />
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default SearchResults;
