import React, { useState, useContext, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import "./FloatingNav.css";
import { assets } from '../assets/assets'; 
import { ShopContext } from '../context/ShopContext'; 

export default function FloatingNav() {
  const [visible, setVisible] = useState(false);
  
  // 1. Ensure token and setToken are pulled from ShopContext
  const { setShowSearch, getCartCount, token, setToken, setCartItems } = useContext(ShopContext); 
  const navigate = useNavigate(); 

  // 2. Logout function to clear session and update UI
  const logout = () => {
    localStorage.removeItem('token'); // Clear from browser storage
    setToken('');                     // Update global state
    setCartItems({});                 // Clear local cart
    navigate('/login');               // Send user back to login
  }

  return (
    <>
      <nav className="glass-nav">
        <div className="nav-container">
          
          <Link to='/' className="logo-section">
             <span className="brand-text-dark">AnB</span>
             <span className="brand-text-pink">jewels</span>
          </Link>

          <div className="nav-menu hidden md:flex">
            <NavLink to="/" className="nav-item">HOME</NavLink>
            <NavLink to="/collection" className="nav-item">COLLECTIONS</NavLink>
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
              {/* 3. Logic: Click icon to go to login IF NOT logged in */}
              <img 
                onClick={() => !token && navigate('/login')} 
                src={assets.profile_icon} 
                alt="Profile" 
                className='w-5 cursor-pointer icon-style' 
              />
              
              {/* 4. Dropdown Menu: Only appears if 'token' is true (Logged In) */}
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
                  <NavLink onClick={() => setVisible(false)} to='/collection' className="py-4 pl-6 border-b text-lg">COLLECTION</NavLink>
                  <NavLink onClick={() => setVisible(false)} to='/about' className="py-4 pl-6 border-b text-lg">ABOUT</NavLink>
                  <NavLink onClick={() => setVisible(false)} to='/contact' className="py-4 pl-6 border-b text-lg">CONTACT</NavLink>
                  
                  {/* Mobile Account Options */}
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