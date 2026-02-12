import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import './PlaceOrder.css';

const PlaceOrder = () => {
  const navigate = useNavigate();
  const { getCartAmount, delivery_fee, cartItems, products, backendUrl, token, setCartItems } = useContext(ShopContext);
  const [method, setMethod] = useState('cod');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', street: '',
    city: '', state: '', zipcode: '', country: '', phone: ''
  });

  useEffect(() => {
    if (!token) {
      toast.error("Please login to place an order");
      navigate('/login');
    }
  }, [token, navigate]);

  const subtotal = getCartAmount();
  const shipping = subtotal === 0 ? 0 : (subtotal >= 599 ? 0 : delivery_fee);
  const total = subtotal + shipping;

  const onChangeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    console.log("🔥 Button clicked!");
    console.log("🔑 Token:", token);
    
    if (!token) {
        toast.error("Please login to place an order");
        navigate('/login');
        return;
    }

    if (total === 0) {
        toast.error("Your cart is empty!");
        return;
    }

    setLoading(true);

    try {
      let orderItems = [];
      for (const itemId in cartItems) {
        if (cartItems[itemId] > 0) {
          const itemInfo = products.find(product => String(product._id) === String(itemId));
          if (itemInfo) {
            orderItems.push({
              _id: itemInfo._id,
              name: itemInfo.name,
              image: Array.isArray(itemInfo.image) ? itemInfo.image[0] : itemInfo.image,
              price: itemInfo.price,
              size: "Standard",
              quantity: cartItems[itemId]
            });
          }
        }
      }

      console.log("📦 Order Items:", orderItems);

      if (orderItems.length === 0) {
        toast.error("No items found in cart");
        setLoading(false);
        return;
      }

      let orderData = {
        address: formData,
        items: orderItems,
        amount: total,
        paymentMethod: method
      };

      console.log("🚀 Sending order with token:", token);

      const response = await axios.post(
        backendUrl + '/api/order/place', 
        orderData, 
        { headers: { token } }
      );

      console.log("✅ Response:", response.data);

      if (response.data.success) {
        setCartItems({});
        toast.success("Order Placed Successfully!");
        navigate('/orders');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
        console.log("❌ Error:", error.response?.data);
        if (error.response?.status === 401) {
          toast.error("Session expired. Please login again");
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          toast.error(error.response?.data?.message || "Failed to place order");
        }
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className='place-order-container'>
      <button className="back-cart-pill" onClick={() => navigate('/cart')}>
          <span>←</span> Back to Cart
      </button>
      
      <form onSubmit={handlePlaceOrder} className="delivery-form">
          <div className="title-text">
            <p>Delivery <span>Information</span></p>
          </div>
          
          <div className="multi-fields">
             <input type="text" name="firstName" value={formData.firstName} onChange={onChangeHandler} placeholder='First name' className="order-input" required />
             <input type="text" name="lastName" value={formData.lastName} onChange={onChangeHandler} placeholder='Last name' className="order-input" required />
          </div>
          <input type="email" name="email" value={formData.email} onChange={onChangeHandler} placeholder='Email address' className="order-input" required />
          <input type="text" name="street" value={formData.street} onChange={onChangeHandler} placeholder='Street Address' className="order-input" required />
          <div className="multi-fields">
             <input type="text" name="city" value={formData.city} onChange={onChangeHandler} placeholder='City' className="order-input" required />
             <input type="text" name="state" value={formData.state} onChange={onChangeHandler} placeholder='State' className="order-input" required />
          </div>
          <div className="multi-fields">
             <input type="text" name="zipcode" value={formData.zipcode} onChange={onChangeHandler} placeholder='Zip Code' className="order-input" required />
             <input type="text" name="country" value={formData.country} onChange={onChangeHandler} placeholder='Country' className="order-input" required />
          </div>
          <input type="tel" name="phone" value={formData.phone} onChange={onChangeHandler} placeholder='Phone Number' className="order-input" required />
      
          <div style={{marginTop: '25px'}}>
             <div style={{fontSize: '1rem', fontWeight:'600', marginBottom: '15px', color:'#333'}}>PAYMENT METHOD</div>
             <div className="payment-methods">
                <div onClick={() => setMethod('stripe')} className={`payment-option ${method === 'stripe' ? 'selected' : ''}`}>
                    <div className="dot"></div>
                    <p className='text-gray-500 text-sm font-medium mx-4'>Stripe</p>
                </div>
                <div onClick={() => setMethod('razorpay')} className={`payment-option ${method === 'razorpay' ? 'selected' : ''}`}>
                    <div className="dot"></div>
                    <p className='text-gray-500 text-sm font-medium mx-4'>Razorpay</p>
                </div>
                <div onClick={() => setMethod('cod')} className={`payment-option ${method === 'cod' ? 'selected' : ''}`}>
                    <div className="dot"></div>
                    <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
                </div>
             </div>
             
             <button 
                type="submit" 
                className='pay-btn' 
                disabled={loading}
                style={{
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.6 : 1
                }}
             >
                {loading ? 'PROCESSING...' : 'CONFIRM ORDER'}
             </button>
          </div>
      </form>

      <div className="cart-summary">
        <div className="cart-total-box">
          <div className="title-text" style={{fontSize: '1.8rem', marginBottom: '20px'}}><p>Cart <span>Total</span></p></div>
          <div className="summary-row"><p>Subtotal</p><p>₹{subtotal}</p></div>
          <div className="summary-row"><p>Shipping</p><p>₹{shipping}</p></div>
          <div className="summary-row total"><p>Total</p><p>₹{total}</p></div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;