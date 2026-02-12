import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

const List = () => { // Removed 'token' prop to force manual fetch
  const [list, setList] = useState([]);
  const url = backendUrl || 'http://localhost:4000'; 

  // Helper to safely get the fresh token
  const getToken = () => localStorage.getItem('token');

  // Helper to handle image data safely
  const getFirstImage = (imageField) => {
    if (!imageField) return "https://placehold.co/50x50?text=No+Img";
    if (Array.isArray(imageField)) return imageField[0];
    if (typeof imageField === 'string' && imageField.startsWith('[')) {
      try {
        const parsed = JSON.parse(imageField);
        return parsed[0];
      } catch (e) {
        return imageField;
      }
    }
    return imageField;
  };

  const fetchList = async () => {
    try {
      const response = await axios.get(url + '/api/product/list');
      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error fetching data");
    }
  };

  const removeProduct = async (id) => {
    try {
      // CRITICAL FIX: Get the token directly from storage right before the request
      const currentToken = getToken();

      if (!currentToken) {
         toast.error("Please Login Again");
         return;
      }

      const response = await axios.post(
        url + '/api/product/remove', 
        { id }, 
        { headers: { token: currentToken } } // Use the fresh token
      );
      
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className='flex flex-col gap-2 p-5'>
      <p className='mb-2 text-lg font-medium'>All Products List</p>
      
      <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm font-semibold'>
        <b>Image</b>
        <b>Name</b>
        <b>Category</b>
        <b>Price</b>
        <b className='text-center'>Action</b>
      </div>

      <div className='flex flex-col gap-2'>
        {list.map((item, index) => (
          <div 
            key={index} 
            className='grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm'
          >
            <img 
              className='w-12 h-12 object-cover rounded' 
              src={getFirstImage(item.image)} 
              alt={item.name} 
            />
            
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>₹{item.price}</p>
            
            <p 
              onClick={() => removeProduct(item.id)} 
              className='text-right md:text-center cursor-pointer text-lg font-bold hover:text-red-500'
            >
              X
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;