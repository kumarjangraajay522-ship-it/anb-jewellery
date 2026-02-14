import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'

const Sidebar = () => {
  return (
    <div className='w-[18%] min-h-screen border-r-2 border-gray-200'>
        <div className='flex flex-col gap-4 pt-6 pl-[20%] text-[15px]'>

            {/* 1. ADD ITEMS TAB */}
            <NavLink 
              to='/add' 
              className={({isActive})=> `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l cursor-pointer transition-all duration-300 ${isActive ? 'bg-[#fdfbf7] border-[#D4AF37] border-r-0' : 'hover:bg-[#ffe4e6]'}`}
            >
                <img className='w-5 h-5' src={assets.add_icon} alt="Add" />
                <p className='hidden md:block font-medium'>Add Items</p>
            </NavLink>

            {/* 2. LIST ITEMS TAB */}
            <NavLink 
              to='/list' 
              className={({isActive})=> `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l cursor-pointer transition-all duration-300 ${isActive ? 'bg-[#fdfbf7] border-[#D4AF37] border-r-0' : 'hover:bg-[#ffe4e6]'}`}
            >
                <img className='w-5 h-5' src={assets.order_icon} alt="List" />
                <p className='hidden md:block font-medium'>List Items</p>
            </NavLink>

            {/* 3. ORDERS TAB */}
            <NavLink 
              to='/orders' 
              className={({isActive})=> `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l cursor-pointer transition-all duration-300 ${isActive ? 'bg-[#fdfbf7] border-[#D4AF37] border-r-0' : 'hover:bg-[#ffe4e6]'}`}
            >
                <img className='w-5 h-5' src={assets.order_icon} alt="Orders" />
                <p className='hidden md:block font-medium'>Orders</p>
            </NavLink>

            {/* 4. QUERIES TAB (New) */}
            <NavLink 
              to='/queries' 
              className={({isActive})=> `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l cursor-pointer transition-all duration-300 ${isActive ? 'bg-[#fdfbf7] border-[#D4AF37] border-r-0' : 'hover:bg-[#ffe4e6]'}`}
            >
                {/* Note: Update icon if you have a specific query_icon in assets */}
                <img className='w-5 h-5' src={assets.order_icon} alt="Queries" />
                <p className='hidden md:block font-medium'>Queries</p>
            </NavLink>

            {/* 5. NEWS/UPDATES TAB (New) */}
            <NavLink 
              to='/updates' 
              className={({isActive})=> `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l cursor-pointer transition-all duration-300 ${isActive ? 'bg-[#fdfbf7] border-[#D4AF37] border-r-0' : 'hover:bg-[#ffe4e6]'}`}
            >
                <img className='w-5 h-5' src={assets.add_icon} alt="Updates" />
                <p className='hidden md:block font-medium'>News & Updates</p>
            </NavLink>

            {/* 6. SALES TAB (New) */}
            <NavLink 
              to='/sales' 
              className={({isActive})=> `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l cursor-pointer transition-all duration-300 ${isActive ? 'bg-[#fdfbf7] border-[#D4AF37] border-r-0' : 'hover:bg-[#ffe4e6]'}`}
            >
                <img className='w-5 h-5' src={assets.order_icon} alt="Sales" />
                <p className='hidden md:block font-medium'>Sales Report</p>
            </NavLink>
            <NavLink 
              to='/offers' 
              className={({isActive})=> `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l cursor-pointer transition-all duration-300 ${isActive ? 'bg-[#fdfbf7] border-[#D4AF37] border-r-0' : 'hover:bg-[#ffe4e6]'}`}
            >
                {/* Use a discount/tag icon if available */}
                <img className='w-5 h-5' src={assets.add_icon} alt="Offers" />
                <p className='hidden md:block font-medium'>Manage Offers</p>
            </NavLink>

        </div>
    </div>
  )
}

export default Sidebar