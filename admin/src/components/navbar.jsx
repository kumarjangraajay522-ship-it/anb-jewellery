import React from 'react'
import { assets } from '../assets/assets'

const Navbar = ({ setToken }) => {
  return (
    <div className='flex items-center py-2 px-[4%] justify-between bg-white shadow-md rounded-full mx-4 my-2 border border-gray-100'>
        {/* Left: Logo */}
        <img className='w-[max(10%,80px)]' src={assets.logo} alt="Admin Logo" />
        
        {/* Right: Logout Button */}
        <button 
          onClick={() => setToken('')} 
          className='bg-[#1a1a1a] text-white px-6 py-2 rounded-full text-xs sm:text-sm hover:bg-[#D4AF37] transition-all duration-300 shadow-sm'
        >
          Logout
        </button>
    </div>
  )
}

export default Navbar