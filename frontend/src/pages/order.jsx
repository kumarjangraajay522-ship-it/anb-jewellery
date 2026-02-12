import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);

  const loadOrderData = async () => {
    try {
      if (!token) return null;
      const response = await axios.post(backendUrl + '/api/order/userorders', {}, { headers: { token } });
      if (response.data.success) {
        setOrders(response.data.orders.reverse());
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  useEffect(() => {
    loadOrderData();
  }, [token]);

  return (
    <div className='p-5 max-w-6xl mx-auto'>
      <div className='text-2xl mb-6'>
        <p className='text-gray-500'>MY <span className='text-gray-900 font-medium'>ORDERS</span></p>
      </div>
      <div className='flex flex-col gap-4'>
        {orders.map((order, index) => (
          <div key={index} className='py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
            <div className='flex items-start gap-6 text-sm'>
              <img className='w-16 sm:w-20' src={assets.parcel_icon} alt="" />
              <div>
                <p className='sm:text-base font-medium'>
                  {order.items.map((item, idx) => (
                    <span key={idx}>{item.name} x {item.quantity}{idx !== order.items.length -1 ? ', ' : ''}</span>
                  ))}
                </p>
                <div className='flex items-center gap-3 mt-2 text-base text-gray-700'>
                  <p>{currency}{order.amount}</p>
                  <p>Items: {order.items.length}</p>
                  <p>Method: {order.paymentMethod}</p>
                </div>
                <p className='mt-2'>Date: <span className='text-gray-400'>{new Date(order.date).toDateString()}</span></p>
              </div>
            </div>
            <div className='md:w-1/2 flex justify-between'>
              <div className='flex items-center gap-2'>
                <p className='min-w-2 h-2 rounded-full bg-green-500'></p>
                <p className='text-sm md:text-base'>{order.status}</p>
              </div>
              <button onClick={loadOrderData} className='border px-4 py-2 text-sm font-medium rounded-sm'>Track Order</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Orders;