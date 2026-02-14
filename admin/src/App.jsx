import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/sidebar'
import { Routes, Route } from 'react-router-dom'
import Login from './components/Login'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import Add from './pages/Add'
import List from './pages/List'
import Orders from './pages/Order'
import Queries from './components/Queries'
import Updates from './components/Updates'
import Sales from './components/Sales'
import Offers from './components/Offers' // <--- IMPORT THIS

export const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
export const currency = '₹'

const App = () => {

  const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '');

  useEffect(() => {
    localStorage.setItem('token', token);
  }, [token])

  return (
    <div className='bg-gray-50 min-h-screen'>
      <ToastContainer />
      {token === ""
        ? <Login setToken={setToken} />
        : <>
          <Navbar setToken={setToken} />
          <hr />
          <div className='flex w-full'>
            <Sidebar />
            <div className='w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base'>
              <Routes>
                {/* Existing Routes */}
                <Route path='/add' element={<Add token={token} />} />
                <Route path='/list' element={<List token={token} />} />
                <Route path='/orders' element={<Orders token={token} />} />
                <Route path='/queries' element={<Queries token={token} />} />
                <Route path='/updates' element={<Updates token={token} />} />
                <Route path='/sales' element={<Sales token={token} />} />

                {/* NEW ROUTE FOR OFFERS */}
                <Route path='/offers' element={<Offers token={token} />} />
                
              </Routes>
            </div>
          </div>
        </>
      }
    </div>
  )
}

export default App