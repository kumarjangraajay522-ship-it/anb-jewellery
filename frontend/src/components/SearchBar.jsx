import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import { useLocation } from 'react-router-dom';

const SearchBar = () => {
  const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Logic: Only show if showSearch is TRUE and we are on Collection page
    if (location.pathname.includes('collection') && showSearch) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [location, showSearch]);

  if (!visible) return null;

  return (
    <div className="search-bar-container">
      <div className="search-input-wrapper">
        <input 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          className="search-input" 
          type="text" 
          placeholder="Search products..." 
        />
        <img className="search-icon" src={assets.search_icon} alt="Search" />
      </div>
      <img 
        onClick={() => setShowSearch(false)} 
        className="close-icon" 
        src={assets.cross_icon} 
        alt="Close" 
      />

      {/* Styles to ensure it appears ON TOP */}
      <style>{`
        .search-bar-container {
          position: fixed; top: 0; left: 0; width: 100%; 
          padding: 20px; padding-top: 100px; /* Space for Navbar */
          background: #fdfbf7; border-bottom: 1px solid #ddd;
          display: flex; justify-content: center; align-items: center;
          z-index: 999; /* High z-index to sit on top */
        }
        .search-input-wrapper {
          display: flex; align-items: center; width: 60%; 
          border: 1px solid #ccc; padding: 10px 20px; border-radius: 50px;
          background: white;
        }
        .search-input { flex: 1; border: none; outline: none; font-size: 1rem; }
        .search-icon { width: 18px; opacity: 0.6; }
        .close-icon { width: 14px; margin-left: 15px; cursor: pointer; }
      `}</style>
    </div>
  );
};

export default SearchBar;