import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

const List = () => {
  const [list, setList] = useState([]);
  const token = localStorage.getItem('token');
  const currency = "₹";

  // --- Fetch Data ---
  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list');
      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error("Failed to load products");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error connecting to Backend");
    }
  };

  // --- Logic: Toggle Stock Status ---
  const handleStatusChange = async (id, status, currentPrice) => {
    let newStock = 0;
    
    // Logic: If Admin selects "In Stock", give 10 items. If "Out of Stock", give 0.
    if (status === "in_stock") {
        newStock = 10; // Default restock amount
    } else {
        newStock = 0; // Force Out of Stock
    }

    // Optimistic Update (Update UI immediately)
    const updatedList = list.map((item) => 
      (item._id === id || item.id === id) ? { ...item, stock: newStock } : item
    );
    setList(updatedList);

    // Call Backend to Save (If backend supports update)
    // await updateProductInDB(id, currentPrice, newStock); 
  };

  const removeProduct = async (id) => {
    try {
      if (!token) {
        toast.error("Please Login Again");
        return;
      }
      const response = await axios.post(backendUrl + '/api/product/remove', { id }, { headers: { token } });
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className='p-5 w-full'>
      <p className='mb-4 text-xl font-bold text-gray-700'>Product Inventory</p>
      
      <div className='bg-white rounded-lg shadow-md overflow-hidden'>
        <div className='hidden md:grid grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr] items-center bg-gray-100 py-3 px-4 text-sm font-bold text-gray-600 border-b'>
          <span>Image</span>
          <span>Name</span>
          <span>Category</span>
          <span>Price</span>
          <span className='text-center'>Status</span>
          <span className='text-center'>Action</span>
        </div>

        <div className='flex flex-col'>
          {list.map((item, index) => {
            let imageSrc = "https://placehold.co/50x50?text=No+Img";
            if (item.image) {
                if (Array.isArray(item.image)) imageSrc = item.image[0];
                else imageSrc = item.image;
            }

            // Logic: Calculate status based on stock
            const isOutOfStock = !item.stock || item.stock <= 0;

            return (
              <div key={index} className='grid grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr] items-center py-4 px-4 border-b hover:bg-gray-50 transition-colors'>
                <img className='w-12 h-12 object-cover rounded border' src={imageSrc} alt="" />
                <p className='text-sm font-medium text-gray-800 truncate pr-4'>{item.name}</p>
                <p className='text-sm text-gray-500'>{item.category}</p>
                <p className='text-sm font-bold'>{currency}{item.price}</p>

                {/* --- NEW STATUS TOGGLE LOGIC --- */}
                <div className='text-center'>
                    <select 
                        value={isOutOfStock ? "out_of_stock" : "in_stock"} 
                        onChange={(e) => handleStatusChange(item._id, e.target.value, item.price)}
                        className={`p-1 border rounded text-xs font-bold outline-none cursor-pointer ${isOutOfStock ? 'text-red-500 border-red-200 bg-red-50' : 'text-green-600 border-green-200 bg-green-50'}`}
                    >
                        <option value="in_stock">✅ IN STOCK</option>
                        <option value="out_of_stock">❌ OUT OF STOCK</option>
                    </select>
                    {/* Show actual number below for reference */}
                    <p className='text-xs text-gray-400 mt-1'>Qty: {item.stock || 0}</p>
                </div>

                <div className='flex justify-center'>
                  <button onClick={() => removeProduct(item._id)} className='text-red-500 hover:text-red-700 text-lg font-bold'>×</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default List;