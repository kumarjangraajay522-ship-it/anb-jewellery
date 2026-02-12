import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Account.css';

const Account = () => {
  const navigate = useNavigate();
  const { token, backendUrl, currency } = useContext(ShopContext);
  const { user, logout, updateUser } = useAuth();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  
  const [userInfo, setUserInfo] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || {
      street: '',
      city: '',
      state: '',
      zipcode: '',
      country: ''
    }
  });

  // Update userInfo when user context changes
  useEffect(() => {
    if (user) {
      setUserInfo({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || {
          street: '',
          city: '',
          state: '',
          zipcode: '',
          country: ''
        }
      });
    }
  }, [user]);

  // Redirect if not logged in
  useEffect(() => {
    if (!token) {
      toast.error("Please login to view your account");
      navigate('/login');
    }
  }, [token, navigate]);

  // Fetch orders when Orders tab is clicked
  useEffect(() => {
    if (!token || activeTab !== 'orders') return;

    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await axios.post(
          backendUrl + '/api/order/userorders', 
          {}, 
          { headers: { token } }
        );
        if (response.data.success) {
          setOrders(response.data.orders.reverse());
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [activeTab, token, backendUrl]);

  const handleSaveProfile = async () => {
    setSaveLoading(true);
    try {
      const response = await axios.post(
        backendUrl + '/api/user/update-profile',
        {
          name: userInfo.name,
          phone: userInfo.phone,
          address: userInfo.address
        },
        { headers: { token } }
      );

      if (response.data.success) {
        updateUser(response.data.user);
        toast.success("Profile updated successfully!");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate('/');
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Delivered': return '#10b981';
      case 'Shipped': return '#3b82f6';
      case 'Out for delivery': return '#f59e0b';
      case 'Packing': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  return (
    <div className="account-container">
      <div className="account-header">
        <div className="user-welcome">
          <div className="avatar-circle">
            {userInfo.name ? userInfo.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h1>Hello, {userInfo.name || 'User'}</h1>
            <p>{userInfo.email}</p>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="account-tabs">
        <button 
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
        <button 
          className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
      </div>

      <div className="account-content">
        
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="profile-section">
            <h2>Profile Information</h2>
            <div className="profile-grid">
              <div className="profile-field">
                <label>Full Name</label>
                <input 
                  type="text" 
                  value={userInfo.name}
                  onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
                  placeholder="Your name"
                />
              </div>
              <div className="profile-field">
                <label>Email</label>
                <input 
                  type="email" 
                  value={userInfo.email}
                  disabled
                  className="disabled-input"
                />
              </div>
              <div className="profile-field">
                <label>Phone Number</label>
                <input 
                  type="tel" 
                  value={userInfo.phone}
                  onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})}
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
            </div>

            <h3 style={{ marginTop: '30px', marginBottom: '15px', fontSize: '18px' }}>Address</h3>
            <div className="profile-grid">
              <div className="profile-field">
                <label>Street Address</label>
                <input 
                  type="text" 
                  value={userInfo.address.street}
                  onChange={(e) => setUserInfo({
                    ...userInfo, 
                    address: {...userInfo.address, street: e.target.value}
                  })}
                  placeholder="Street address"
                />
              </div>
              <div className="profile-field">
                <label>City</label>
                <input 
                  type="text" 
                  value={userInfo.address.city}
                  onChange={(e) => setUserInfo({
                    ...userInfo, 
                    address: {...userInfo.address, city: e.target.value}
                  })}
                  placeholder="City"
                />
              </div>
              <div className="profile-field">
                <label>State</label>
                <input 
                  type="text" 
                  value={userInfo.address.state}
                  onChange={(e) => setUserInfo({
                    ...userInfo, 
                    address: {...userInfo.address, state: e.target.value}
                  })}
                  placeholder="State"
                />
              </div>
              <div className="profile-field">
                <label>ZIP Code</label>
                <input 
                  type="text" 
                  value={userInfo.address.zipcode}
                  onChange={(e) => setUserInfo({
                    ...userInfo, 
                    address: {...userInfo.address, zipcode: e.target.value}
                  })}
                  placeholder="ZIP Code"
                />
              </div>
              <div className="profile-field">
                <label>Country</label>
                <input 
                  type="text" 
                  value={userInfo.address.country}
                  onChange={(e) => setUserInfo({
                    ...userInfo, 
                    address: {...userInfo.address, country: e.target.value}
                  })}
                  placeholder="Country"
                />
              </div>
            </div>

            <button 
              className="save-btn" 
              onClick={handleSaveProfile}
              disabled={saveLoading}
              style={{ opacity: saveLoading ? 0.6 : 1 }}
            >
              {saveLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="orders-section">
            <h2>Order History</h2>
            {loading ? (
              <div className="loading-state">Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="empty-state">
                <p>No orders yet</p>
                <button onClick={() => navigate('/collection')}>Start Shopping</button>
              </div>
            ) : (
              <div className="orders-list">
                {orders.map((order, index) => (
                  <div key={index} className="order-card">
                    <div className="order-header">
                      <div>
                        <h3>Order #{order.id}</h3>
                        <p className="order-date">
                          {new Date(order.date).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="order-status" style={{ color: getStatusColor(order.status) }}>
                        <div className="status-dot" style={{ backgroundColor: getStatusColor(order.status) }}></div>
                        {order.status}
                      </div>
                    </div>
                    
                    <div className="order-items">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="order-item">
                          <span>{item.name} × {item.quantity}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="order-footer">
                      <div className="order-total">
                        <span>Total:</span>
                        <strong>{currency}{order.amount}</strong>
                      </div>
                      <div className="order-meta">
                        <span>Items: {order.items.length}</span>
                        <span>•</span>
                        <span>{order.paymentMethod}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Account;