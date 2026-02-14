import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

const Offers = ({ token }) => {
  
  const [loading, setLoading] = useState(false);
  
  // State for Sale Configuration
  const [saleConfig, setSaleConfig] = useState({
    title: "88% OFF",
    subtitle: "The Royal Clearance",
    targetDate: "", // Format: YYYY-MM-DDTHH:MM
    isActive: true
  });

  // Fetch existing sale settings on load
  useEffect(() => {
    if (token) {
        // Uncomment below when backend API is ready
        // fetchSaleSettings();
    }
  }, [token]);

  const fetchSaleSettings = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/sale/get', { headers: { token } });
      if (response.data.success) {
        setSaleConfig(response.data.saleConfig);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load sale settings");
    }
  };

  const onChangeHandler = (e) => {
    const { name, value, type, checked } = e.target;
    setSaleConfig(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
    }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Send data to backend to update the frontend sale page
      // const response = await axios.post(backendUrl + '/api/sale/update', saleConfig, { headers: { token } });
      
      // Simulating success for now
      setTimeout(() => {
          toast.success("Sale Settings Updated Successfully! ✨");
          setLoading(false);
      }, 1000);

      // if (response.data.success) ...

    } catch (error) {
      console.log(error);
      toast.error("Error updating sale");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl">
      <h3 className="text-xl font-bold mb-6">Manage Offers & Flash Sale</h3>

      <form onSubmit={onSubmitHandler} className="flex flex-col gap-6 bg-white p-8 rounded-lg shadow-sm border border-gray-100">
        
        {/* Toggle Sale Status */}
        <div className="flex items-center gap-3 mb-2">
            <input 
                type="checkbox" 
                id="isActive" 
                name="isActive" 
                checked={saleConfig.isActive} 
                onChange={onChangeHandler}
                className="w-5 h-5 accent-[#D4AF37] cursor-pointer"
            />
            <label htmlFor="isActive" className="text-gray-700 font-medium cursor-pointer">Activate Sale Banner on Website</label>
        </div>

        <hr className="border-gray-100"/>

        {/* Banner Text Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-600">Sale Title (e.g., 50% OFF)</label>
                <input 
                    type="text" 
                    name="title"
                    value={saleConfig.title} 
                    onChange={onChangeHandler}
                    className="px-3 py-2 border border-gray-300 rounded outline-[#D4AF37]"
                    placeholder="Enter main title"
                    required
                />
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-600">Subtitle (e.g., Monsoon Sale)</label>
                <input 
                    type="text" 
                    name="subtitle"
                    value={saleConfig.subtitle} 
                    onChange={onChangeHandler}
                    className="px-3 py-2 border border-gray-300 rounded outline-[#D4AF37]"
                    placeholder="Enter subtitle"
                    required
                />
            </div>
        </div>

        {/* Timer Settings */}
        <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-600">Sale End Date & Time</label>
            <input 
                type="datetime-local" 
                name="targetDate"
                value={saleConfig.targetDate} 
                onChange={onChangeHandler}
                className="px-3 py-2 border border-gray-300 rounded outline-[#D4AF37] max-w-xs"
                required
            />
            <p className="text-xs text-gray-400 mt-1">The countdown on the website will calculate time remaining until this date.</p>
        </div>

        {/* Submit Button */}
        <button 
            type="submit" 
            disabled={loading}
            className={`mt-4 bg-black text-white px-8 py-3 rounded text-sm font-medium hover:bg-gray-800 transition-all ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            {loading ? "SAVING..." : "UPDATE SALE SETTINGS"}
        </button>

      </form>
    </div>
  )
}

export default Offers