import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'

const Orders = () => {
  // 1. Use Context for Global Data (Token, Currency, Backend URL)
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrderData = async () => {
    if (!token) return; // Wait for user to login
    
    try {
      // 2. API Call to 'api/order/userorders' (User Route)
      const response = await axios.post(backendUrl + '/api/order/userorders', {}, { headers: { token } });
      
      if (response.data.success) {
        let allOrders = response.data.orders;
        
        // 3. Data Parsing (Handle SQL JSON Strings + Images)
        const cleanOrders = allOrders.map(order => {
            let parsedItems = order.items;
            let parsedAddress = order.address;

            // Parse Items String
            if (typeof parsedItems === 'string') {
                try { parsedItems = JSON.parse(parsedItems); } catch(e) { parsedItems = []; }
            }
            if (!Array.isArray(parsedItems)) parsedItems = [];

            // Parse Address String
            if (typeof parsedAddress === 'string') {
                try { parsedAddress = JSON.parse(parsedAddress); } catch(e) { parsedAddress = {}; }
            }

            // Fix Image Paths inside items
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

  // Helper: Get first image safely
  const getOrderImage = (order) => {
      if (!order.items || order.items.length === 0) return 'https://placehold.co/150';
      const item = order.items[0];
      if (Array.isArray(item.image)) return item.image[0];
      return item.image || 'https://placehold.co/150';
  };

  return (
    <div className='border-t pt-16 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
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
                        {/* Display Product Image */}
                        <img className='w-16 sm:w-20 object-cover' src={getOrderImage(order)} alt="Product" />
                        <div>
                            <p className='sm:text-base font-medium'>{order.items?.[0]?.name || "Product"}</p>
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
                            {/* Status Indicator Dot */}
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