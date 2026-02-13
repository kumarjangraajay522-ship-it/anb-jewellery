import React, { useState, useContext } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import "./FloatingNav.css";
import { assets } from '../assets/assets'; 
import { ShopContext } from '../context/ShopContext'; 

export default function FloatingNav() {
  const [visible, setVisible] = useState(false);
  
  // 1. Ensure token and setToken are pulled from ShopContext
  const { setShowSearch, getCartCount, token, setToken, setCartItems } = useContext(ShopContext); 
  const navigate = useNavigate(); 

  // 2. Logout function
  const logout = () => {
    localStorage.removeItem('token'); 
    setToken('');                   
    setCartItems({});               
    navigate('/login');             
  }

  // 3. Handle Navigation with Category State
  const handleCollectionClick = (category) => {
    setVisible(false); // Close mobile menu if open
    // Navigate to collection page with the category state
    navigate('/collection', { state: { category: category } });
  };

  return (
    <>
      <style>{`
        /* --- DROPDOWN CSS FIX --- */
        .nav-item-wrapper {
            position: relative;
            height: 100%;
            display: flex;
            align-items: center;
            cursor: pointer;
        }

        /* The Dropdown Container */
        .collection-dropdown {
            position: absolute;
            top: 100%; /* Position right below the nav item */
            left: 50%;
            transform: translateX(-50%);
            
            /* CRITICAL FIX: Padding top creates an invisible bridge so cursor doesn't lose focus */
            padding-top: 20px; 
            
            /* Hide by default */
            visibility: hidden;
            opacity: 0;
            transition: all 0.2s ease-in-out;
            z-index: 1000;
        }

        /* Show on Hover of the WRAPPER, not just the link */
        .nav-item-wrapper:hover .collection-dropdown {
            visibility: visible;
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }

        /* The actual white box inside the padding container */
        .dropdown-inner {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            min-width: 180px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            border: 1px solid rgba(0,0,0,0.05);
            border-radius: 8px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        /* Dropdown Links */
        .dd-link {
            padding: 12px 20px;
            font-family: 'Jost', sans-serif;
            font-size: 0.9rem;
            color: #444;
            text-decoration: none;
            transition: 0.2s;
            text-align: center;
            border-bottom: 1px solid #f9f9f9;
            white-space: nowrap;
        }
        .dd-link:last-child { border-bottom: none; }
        
        .dd-link:hover {
            background: #fdfbf7;
            color: #d4af37;
            letter-spacing: 1px;
        }
      `}</style>

      <nav className="glass-nav">
        <div className="nav-container">
          
          <Link to='/' className="logo-section">
             <span className="brand-text-dark">AnB</span>
             <span className="brand-text-pink">Jewels</span>
          </Link>

          <div className="nav-menu hidden md:flex">
            <NavLink to="/" className="nav-item">HOME</NavLink>
            
            {/* COLLECTIONS DROPDOWN WRAPPER */}
            <div className="nav-item-wrapper">
                <NavLink 
                    to="/collection" 
                    className="nav-item"
                    onClick={() => handleCollectionClick('all')}
                >
                    COLLECTIONS
                </NavLink>
                
                <div className="collection-dropdown">
                    <div className="dropdown-inner">
                        <span onClick={() => handleCollectionClick('all')} className="dd-link">All Jewellery</span>
                        <span onClick={() => handleCollectionClick('Necklace')} className="dd-link">Necklaces</span>
                        <span onClick={() => handleCollectionClick('Earrings')} className="dd-link">Earrings</span>
                        <span onClick={() => handleCollectionClick('Bracelets')} className="dd-link">Bracelets</span>
                    </div>
                </div>
            </div>

            {/* --- 88% OFF LINK ADDED HERE --- */}
            <NavLink to="/sale" className="nav-item" style={{color: '#e53935', fontWeight: 'bold'}}>
                88% OFF
            </NavLink>

            <NavLink to="/about" className="nav-item">OUR STORY</NavLink>
            <NavLink to="/contact" className="nav-item">CONTACT</NavLink>
          </div>

          <div className='flex items-center gap-5 right-icons'>
            <img 
                onClick={() => {
                  setShowSearch(true);     
                  navigate('/collection'); 
                }}
                src={assets.search_icon} 
                className='w-5 cursor-pointer icon-style' 
                alt="Search" 
            />
            
            <div className='group relative'>
              <img 
                onClick={() => !token && navigate('/login')} 
                src={assets.profile_icon} 
                alt="Profile" 
                className='w-5 cursor-pointer icon-style' 
              />
              
              {token && (
                <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4 z-50'>
                    <div className='flex flex-col gap-2 w-40 py-3 px-5 glass-dropdown-content rounded-lg bg-white shadow-xl'>
                        <p onClick={() => navigate('/Account')} className='cursor-pointer hover:text-[#d4af37] text-sm text-gray-700'>My Profile</p>
                        <p onClick={() => navigate('/orders')} className='cursor-pointer hover:text-[#d4af37] text-sm text-gray-700'>My Orders</p>
                        <hr className="border-gray-100" />
                        <p onClick={logout} className='cursor-pointer hover:text-red-500 text-sm font-semibold'>Logout</p>
                    </div>
                </div>
              )}
            </div>  

            <Link to='/cart' className='relative'>
               <img src={assets.cart_icon} alt="Cart" className='w-5 cursor-pointer icon-style' />
               <p className='cart-badge'>{getCartCount()}</p>
            </Link>

            <img 
              onClick={() => setVisible(true)} 
              src={assets.menu_icon} 
              alt="Menu" 
              className='w-6 cursor-pointer md:hidden icon-style ml-1' 
            />
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed top-0 right-0 bottom-0 z-[99999] bg-white transition-all duration-300 ease-in-out overflow-hidden ${visible ? 'w-full' : 'w-0'}`}>
          <div className='flex flex-col text-gray-700 h-full w-full'>
              <div onClick={() => setVisible(false)} className="flex items-center gap-4 p-6 cursor-pointer border-b">
                  <div className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-100 rotate-180">
                    <img src={assets.dropdown_icon} className="h-4" alt="back" />
                  </div>
                  <p className="text-lg font-medium">Back</p>
              </div>
              <div className="flex flex-col">
                  <NavLink onClick={() => setVisible(false)} to='/' className="py-4 pl-6 border-b text-lg">HOME</NavLink>
                  
                  {/* Mobile Collection Links */}
                  <div className="py-4 pl-6 border-b text-lg font-bold text-gray-400 bg-gray-50">COLLECTIONS</div>
                  <span onClick={() => handleCollectionClick('Necklace')} className="py-3 pl-10 border-b text-base text-gray-600">Necklaces</span>
                  <span onClick={() => handleCollectionClick('Earrings')} className="py-3 pl-10 border-b text-base text-gray-600">Earrings</span>
                  <span onClick={() => handleCollectionClick('Bracelets')} className="py-3 pl-10 border-b text-base text-gray-600">Bracelets</span>
                  
                  {/* --- MOBILE 88% OFF LINK ADDED HERE --- */}
                  <NavLink onClick={() => setVisible(false)} to='/sale' className="py-4 pl-6 border-b text-lg" style={{color: '#e53935', fontWeight: 'bold'}}>88% OFF</NavLink>

                  <NavLink onClick={() => setVisible(false)} to='/about' className="py-4 pl-6 border-b text-lg">OUR STORY</NavLink>
                  <NavLink onClick={() => setVisible(false)} to='/contact' className="py-4 pl-6 border-b text-lg">CONTACT</NavLink>
                  
                  {token ? (
                    <p onClick={() => {logout(); setVisible(false);}} className="py-4 pl-6 border-b text-lg text-red-500 font-bold">LOGOUT</p>
                  ) : (
                    <NavLink onClick={() => setVisible(false)} to='/login' className="py-4 pl-6 border-b text-lg">LOGIN</NavLink>
                  )}
              </div>
          </div>
      </div>
    </>
  );
}