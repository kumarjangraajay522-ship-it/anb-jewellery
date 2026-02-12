import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrderData = async () => {
    if (!token) return;
    try {
      const response = await axios.post(backendUrl + '/api/order/userorders', {}, { headers: { token } });
      
      if (response.data.success) {
        let allOrders = response.data.orders;
        
        // --- Parse SQL Data (Strings to Arrays) ---
        const cleanOrders = allOrders.map(order => {
            let parsedItems = order.items;
            let parsedAddress = order.address;

            // 1. Items: If it's a string, parse it to JSON
            if (typeof parsedItems === 'string') {
                try { parsedItems = JSON.parse(parsedItems); } catch(e) { parsedItems = []; }
            }
            if (!Array.isArray(parsedItems)) parsedItems = [];

            // 2. Address: If it's a string, parse it to JSON
            if (typeof parsedAddress === 'string') {
                try { parsedAddress = JSON.parse(parsedAddress); } catch(e) { parsedAddress = {}; }
            }

            // 3. Images: Check inside items for stringified image arrays
            parsedItems = parsedItems.map(item => {
               let img = item.image;
               if (typeof img === 'string' && img.startsWith('[')) {
                   try { img = JSON.parse(img); } catch(e) {}
               }
               return { ...item, image: img };
            });

            return { ...order, items: parsedItems, address: parsedAddress };
        });

        setOrderData(cleanOrders.reverse());
      }
    } catch (error) {
      console.log("Error loading orders:", error);
    } finally {
        setLoading(false);
    }
  }

  useEffect(() => {
    loadOrderData();
  }, [token]);

  // --- Helper to Safely Get First Image ---
  const getOrderImage = (order) => {
      if (!order.items || order.items.length === 0) return 'https://placehold.co/150x150?text=No+Img';
      const item = order.items[0];
      if (Array.isArray(item.image)) return item.image[0];
      return item.image || 'https://placehold.co/150x150?text=No+Img';
  };

  return (
    // UPDATED: Added mt-[150px] for top margin
    <div className='border-t mt-[150px] px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      <div className='text-2xl'>
        <div className='inline-flex gap-2 items-center mb-3'>
            <p className='text-gray-500'>MY <span className='text-gray-700 font-medium'>ORDERS</span></p>
            <p className='w-8 sm:w-12 h-[1px] sm:h-[2px] bg-gray-700'></p>
        </div>
      </div>

      <div className='flex flex-col gap-4'>
        {loading ? (
            <p>Loading orders...</p>
        ) : orderData.length === 0 ? (
            <p>You have no orders yet.</p>
        ) : (
            orderData.map((order, index) => (
                <div key={index} className='py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                    <div className='flex items-start gap-6 text-sm'>
                        <img className='w-16 sm:w-20 object-cover' src={getOrderImage(order)} alt="Product" />
                        <div>
                            <p className='sm:text-base font-medium'>{order.items?.[0]?.name || "Unknown Product"}</p>
                            <div className='flex items-center gap-3 mt-1 text-base text-gray-700'>
                                <p className='text-lg font-semibold'>{currency}{order.amount}</p>
                                <p>Items: {order.items?.length}</p>
                                <p>Method: {order.paymentMethod}</p>
                            </div>
                            <p className='mt-1'>Date: <span className='text-gray-400'>{new Date(order.date).toDateString()}</span></p>
                        </div>
                    </div>
                    
                    <div className='md:w-1/2 flex justify-between'>
                        <div className='flex items-center gap-2'>
                            <span className={`w-2 h-2 rounded-full ${order.status === 'Delivered' ? 'bg-green-500' : 'bg-green-500'}`}></span>
                            <p className='text-sm md:text-base font-medium'>{order.status}</p>
                        </div>
                        <button onClick={loadOrderData} className='border px-4 py-2 text-sm font-medium rounded-sm hover:bg-gray-50 transition-all'>
                            Track Order
                        </button>
                    </div>
                </div>
            ))
        )}
      </div>
    </div>
  )
}

export default Orders;