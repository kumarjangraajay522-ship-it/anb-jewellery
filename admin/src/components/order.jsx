import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'
import { io } from 'socket.io-client'

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Admin Backend URL
  const backendUrl = 'http://localhost:4000'; 

  const fetchAllOrders = async () => {
    // 1. Get Token (Props -> LocalStorage)
    const adminToken = token || localStorage.getItem('token'); 

    if (!adminToken) {
        setLoading(false);
        return;
    }

    try {
      // 2. API Call to 'api/order/list' (Admin Route)
      const response = await axios.post(`${backendUrl}/api/order/list`, {}, { 
        headers: { token: adminToken } 
      });
      
      if (response.data.success) {
        let allOrders = response.data.orders;
        
        // 3. Data Parsing (Handle SQL JSON Strings)
        const cleanOrders = allOrders.map(order => {
            let parsedItems = order.items;
            let parsedAddress = order.address;

            if (typeof parsedItems === 'string') {
                try { parsedItems = JSON.parse(parsedItems); } catch(e) { parsedItems = []; }
            }
            if (typeof parsedAddress === 'string') {
                try { parsedAddress = JSON.parse(parsedAddress); } catch(e) { parsedAddress = {}; }
            }

            return { 
              ...order, 
              items: Array.isArray(parsedItems) ? parsedItems : [], 
              address: parsedAddress || {} 
            };
        });

        setOrders(cleanOrders.reverse());
      } else {
        toast.error("Error: " + response.data.message);
      }
    } catch (error) {
       // Silent fail for auth errors to prevent spam
       if(error.response?.status !== 401) toast.error(error.message);
    } finally {
        setLoading(false);
    }
  }

  const statusHandler = async (event, orderId) => {
    const adminToken = token || localStorage.getItem('token');
    try {
      const response = await axios.post(`${backendUrl}/api/order/status`, {
        orderId,
        status: event.target.value
      }, { headers: { token: adminToken } })

      if (response.data.success) {
        toast.success("Status updated!");
        fetchAllOrders();
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => { 
    fetchAllOrders(); 

    // 4. Socket Connection for Real-time Updates
    // using 'websocket' transport avoids CORS polling errors
    const socket = io(backendUrl, { transports: ['websocket'] });

    socket.on('new_order', () => {
      toast.info('New order received!');
      fetchAllOrders();
    });

    socket.on('order_status_updated', () => {
      fetchAllOrders();
    });

    return () => {
      socket.disconnect();
    };
  }, [token]);

  return (
    <div className='p-5'>
      <h3 className='text-lg font-bold mb-4'>Order Management</h3>
      
      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className='text-gray-500'>No orders found.</p>
      ) : (
        <div className='flex flex-col gap-4'>
          {orders.map((order, index) => (
            <div key={index} className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700'>
              <img className='w-12' src={assets.parcel_icon} alt="icon" />
              <div>
                <p className='font-semibold'>
                  {order.items.map((item, i) => (
                      <span key={i}>
                          {item.name} x {item.quantity} ({item.size})
                          {i < order.items.length - 1 ? ', ' : ''}
                      </span>
                  ))}
                </p>
                <p className='mt-3 font-medium'>{order.address.firstName} {order.address.lastName}</p>
                <div>
                  <p>{order.address.street},</p>
                  <p>{order.address.city}, {order.address.state}, {order.address.zipcode}</p>
                </div>
                <p className='mt-1'>{order.address.phone}</p>
              </div>
              <div>
                <p className='text-sm sm:text-[15px]'>Items: {order.items.length}</p>
                <p className='mt-3'>Method: {order.paymentMethod}</p>
                <p>Payment: {order.payment ? 'Done' : 'Pending'}</p>
                <p>Date: {new Date(order.date).toLocaleDateString()}</p>
              </div>
              <p className='text-sm sm:text-[15px] font-bold'>₹{order.amount}</p>
              
              {/* STATUS DROPDOWN (Admin Only) */}
              <select 
                onChange={(event) => statusHandler(event, order._id || order.id)} 
                value={order.status} 
                className='p-2 font-semibold border border-gray-300 rounded bg-gray-50 max-w-[150px]'
              >
                <option value="Order Placed">Order Placed</option>
                <option value="Packing">Packing</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for delivery">Out for delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Orders