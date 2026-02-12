import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios'; 
import { toast } from 'react-toastify';
import './login.css'; 
import { assets } from '../assets/assets';
import { ShopContext } from '../context/ShopContext'; 

const Login = () => {
  const [mode, setMode] = useState('Login'); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth(); 
  const { token, setToken, backendUrl } = useContext(ShopContext);

  useEffect(() => {
    if (token) {
      navigate('/', { replace: true }); 
    }
  }, [token, navigate]); 

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill all fields");
      return;
    }
    
    if (mode === 'Sign Up' && !name) {
      toast.error("Please enter your name");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    
    setLoading(true);
    
    try {
      let response;
      
      if (mode === 'Sign Up') {
        console.log("🔵 Registering user...");
        response = await axios.post(backendUrl + '/api/user/register', { 
          name, 
          email, 
          password 
        });
      } else {
        console.log("🔵 Logging in...");
        response = await axios.post(backendUrl + '/api/user/login', { 
          email, 
          password 
        });
      }
      
      console.log("📡 Response:", response.data);
      
      if (response.data.success) {
        // Store token
        localStorage.setItem('token', response.data.token);
        setToken(response.data.token);
        
        // Store user data
        localStorage.setItem('user', JSON.stringify(response.data.user));
        login(response.data.user);
        
        toast.success(mode === 'Sign Up' ? "Account Created!" : "Welcome Back!");
        setTimeout(() => navigate('/', { replace: true }), 300);
      } else {
        toast.error(response.data.message || "Authentication failed");
      }
      
    } catch (error) {
      console.error("❌ Error:", error);
      
      if (error.response) {
        toast.error(error.response.data.message || "Authentication failed");
      } else if (error.request) {
        toast.error("Cannot connect to server. Please check if backend is running.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    if (loading) return;
    setMode(prev => prev === 'Login' ? 'Sign Up' : 'Login');
    setEmail(''); 
    setPassword(''); 
    setName('');
  };

  return (
    <div className="login-container-fullscreen">
      <div className="aura-bg"></div>
      <button 
        className="back-home-pill" 
        onClick={() => navigate('/')}
        disabled={loading}
      >
        ← Back to Home
      </button>
      
      <div className={`auth-card-clean ${mode === 'Sign Up' ? 'right-panel-active' : ''}`}>
        <div className="auth-form-container">
          <form onSubmit={onSubmitHandler}>
            <h1 className="brand-title">AnB Jewels</h1>
            <p className="subtitle">{mode === 'Login' ? 'Welcome Back' : 'Join the Club'}</p>
            
            {mode === 'Sign Up' && (
              <input 
                type="text" 
                className="auth-input" 
                placeholder="Full Name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
                disabled={loading}
              />
            )}
            
            <input 
              type="email" 
              className="auth-input" 
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              disabled={loading}
            />
            
            <input 
              type="password" 
              className="auth-input" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              disabled={loading}
              minLength={6}
            />
            
            <button 
              type="submit" 
              className="auth-btn"
              disabled={loading}
              style={{ 
                opacity: loading ? 0.6 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Please wait...' : (mode === 'Login' ? 'Sign In' : 'Register')}
            </button>
            
            <div className="toggle-text">
              {mode === 'Login' ? "Not a member?" : "Have an account?"}
              <span 
                className="toggle-link" 
                onClick={toggleMode}
                style={{ 
                  opacity: loading ? 0.6 : 1, 
                  cursor: loading ? 'not-allowed' : 'pointer',
                  pointerEvents: loading ? 'none' : 'auto'
                }}
              >
                {mode === 'Login' ? "Create Account" : "Login"}
              </span>
            </div>
          </form>
        </div>
        
        <div className="auth-visual">
          <img src={assets.login} alt="Jewelry" className="auth-img" />
          <div className="visual-overlay">
            <div className="visual-text">
              <h2>{mode === 'Login' ? 'Royal Archive.' : 'New Legacy.'}</h2>
              <p>Begin your journey</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;