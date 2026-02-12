import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'
import { io } from 'socket.io-client'

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllOrders = async () => {
    const adminToken = token || localStorage.getItem('adminToken');
    
    if (!adminToken) {
        toast.error("No admin token found. Please login again.");
        setLoading(false);
        return;
    }

    try {
      const response = await axios.post('http://localhost:4000/api/order/list', {}, { 
        headers: { token: adminToken } 
      });
      
      if (response.data.success) {
        let allOrders = response.data.orders;
        
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
        toast.error("Failed: " + response.data.message);
      }
    } catch (error) {
      console.log("Error fetching orders:", error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
        setLoading(false);
    }
  }

  const statusHandler = async (event, orderId) => {
    const adminToken = token || localStorage.getItem('adminToken');
    
    try {
      const response = await axios.post('http://localhost:4000/api/order/status', {
        orderId,
        status: event.target.value
      }, { headers: { token: adminToken } })

      if (response.data.success) {
        toast.success("Status updated!");
        // No need to call fetchAllOrders here - socket will handle it
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  useEffect(() => { 
    fetchAllOrders(); 

    // Setup Socket.IO for real-time updates
    const socket = io('http://localhost:4000');

    // Listen for new orders
    socket.on('new_order', (data) => {
      console.log('New order received:', data);
      toast.info('New order received!');
      fetchAllOrders();
    });

    // Listen for status updates
    socket.on('order_status_updated', (data) => {
      console.log('Order status updated:', data);
      fetchAllOrders();
    });

    // Cleanup
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
        <p className='text-gray-500'>No orders found. Orders will appear here once customers place them.</p>
      ) : (
        <div className='flex flex-col gap-4'>
          {orders.map((order, index) => (
            <div key={index} className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700'>
              <img className='w-12' src={assets.parcel_icon} alt="icon" />
              
              <div>
                <p className='font-semibold'>
                  {order.items.map((item, i) => (
                      <span key={i}>
                          {item.name} x {item.quantity} ({item.size || 'Standard'})
                          {i < order.items.length - 1 ? ', ' : ''}
                      </span>
                  ))}
                </p>
                <p className='mt-3 font-medium'>
                  {order.address.firstName} {order.address.lastName}
                </p>
                <div>
                  <p>{order.address.street},</p>
                  <p>{order.address.city}, {order.address.state}, {order.address.country}, {order.address.zipcode}</p>
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
              
              <select 
                onChange={(event) => statusHandler(event, order.id)} 
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