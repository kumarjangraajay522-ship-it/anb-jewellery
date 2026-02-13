import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios'; 
import { toast } from 'react-toastify';
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
        localStorage.setItem('token', response.data.token);
        setToken(response.data.token);
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
      
      {/* =========================================================
          INTERNAL CSS (Baby Pink Theme + Responsive Margin Fix + Hidden Scroll) 
         ========================================================= */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Montserrat:wght@300;400;500;600&display=swap');

        /* RESET */
        * { cursor: auto; box-sizing: border-box; }
        
        /* Hide Scrollbar Globally for this component */
        ::-webkit-scrollbar { display: none; }

        /* --- MAIN CONTAINER (Wide Luxury Layout - Pink Theme) --- */
        .login-container-fullscreen {
          /* 1. Desktop: Wide 125% Layout with Negative Margin */
          width: 125%;
          margin-left: -12.5%;
          
          /* Fixed Height + Overflow Hidden to remove scroll */
          height: 100vh;
          overflow: hidden; 
          
          display: flex; align-items: center; justify-content: center;
          
          /* Soft Baby Pink Gradient Background */
          background: radial-gradient(circle at center, #fff0f5 0%, #fde2e4 100%);
          
          font-family: 'Montserrat', sans-serif;
          position: relative;
          padding: 20px;
        }

        /* Gold Aura Background (Subtle Warmth) */
        .aura-bg {
          position: absolute; width: 150%; height: 150%;
          background: radial-gradient(circle, rgba(255, 182, 193, 0.2) 0%, transparent 60%);
          animation: rotateAura 40s linear infinite; pointer-events: none; z-index: 0;
        }
        @keyframes rotateAura { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

        /* --- AUTH CARD --- */
        .auth-card-clean {
          width: 900px; height: 550px;
          
          /* Glassmorphism White */
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
          border: 1px solid rgba(255, 255, 255, 0.4);
          
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(255, 182, 193, 0.3); /* Pink shadow */
          display: flex; overflow: hidden; position: relative; z-index: 10;
        }

        /* Panels */
        .auth-form-container { 
            padding: 50px; 
            background: #ffffff; 
            color: #333; /* Dark text */
            flex: 1; 
            order: 1; 
            display: flex; flex-direction: column; justify-content: center;
        }
        .auth-visual { 
            position: relative; overflow: hidden; 
            order: 2; 
            background-color: #ffe4e1; 
            flex: 1; 
        }

        /* Image & Overlay */
        .auth-img { 
            width: 100%; height: 100%; object-fit: cover; 
            transition: transform 1.5s ease; 
            filter: brightness(1.05);
        }
        .auth-card-clean:hover .auth-img { transform: scale(1.05); }
        
        .visual-overlay {
          position: absolute; inset: 0;
          /* Pink-tinted overlay */
          background: linear-gradient(to top, rgba(219, 112, 147, 0.6), transparent);
          display: flex; align-items: flex-end; padding: 30px;
        }
        .visual-text h2 { 
            font-family: 'Playfair Display', serif; font-size: 2rem;
            color: white; margin-bottom: 5px; text-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .visual-text p { 
            color: #fff0f5; letter-spacing: 2px; text-transform: uppercase; font-size: 0.8rem; font-weight: 500;
        }

        /* Swap Logic for Sign Up */
        .auth-card-clean.right-panel-active .auth-form-container { order: 2; }
        .auth-card-clean.right-panel-active .auth-visual { order: 1; }

        /* Inputs & Text */
        .brand-title { 
            font-family: 'Playfair Display', serif; color: #d87093; /* Pale Violet Red */
            font-size: 2.2rem; margin-bottom: 5px; text-align: center; 
        }
        .subtitle { 
            color: #999; margin-bottom: 30px; text-align: center; 
            text-transform: uppercase; letter-spacing: 1.5px; font-size: 0.85rem;
        }

        .auth-input {
          width: 100%; padding: 12px 0; margin-bottom: 15px;
          background: transparent; border: none; border-bottom: 1px solid #e0e0e0;
          color: #333; font-family: 'Montserrat', sans-serif; font-size: 0.95rem;
          outline: none; transition: 0.3s;
        }
        .auth-input:focus { border-bottom-color: #ffb6c1; /* Light Pink focus */ }
        .auth-input::placeholder { color: #aaa; }

        /* Buttons */
        .auth-btn {
          width: 100%; padding: 14px; margin-top: 10px;
          /* Baby Pink Gradient */
          background: linear-gradient(135deg, #ffb6c1 0%, #ff69b4 100%);
          color: white; border: none; border-radius: 8px;
          font-size: 0.9rem; font-weight: 600; letter-spacing: 1px; text-transform: uppercase;
          cursor: pointer !important; transition: 0.3s;
          box-shadow: 0 4px 15px rgba(255, 105, 180, 0.3);
        }
        .auth-btn:hover { 
            transform: translateY(-2px); 
            box-shadow: 0 6px 20px rgba(255, 105, 180, 0.4);
        }

        .toggle-text { margin-top: 25px; text-align: center; font-size: 0.85rem; color: #666; }
        .toggle-link { color: #d87093; font-weight: 600; cursor: pointer !important; margin-left: 5px; transition: 0.2s; }
        .toggle-link:hover { text-decoration: underline; color: #c71585; }

        .back-home-pill {
          position: absolute; top: 30px; left: 30px;
          background: rgba(255, 255, 255, 0.6); border: 1px solid #fff; color: #d87093;
          padding: 10px 20px; border-radius: 50px; cursor: pointer !important; 
          font-size: 0.85rem; font-weight: 500; transition: 0.3s; z-index: 20;
        }
        .back-home-pill:hover { 
            background: #fff; 
            box-shadow: 0 5px 15px rgba(216, 112, 147, 0.2);
            transform: translateX(-3px);
        }

        /* --- RESPONSIVE MEDIA QUERIES --- */
        
        /* 1. RESET MARGINS FOR TABLET/MOBILE */
        @media (max-width: 1200px) {
            .login-container-fullscreen {
                width: 100%;      /* Reset width to normal */
                margin-left: 0;   /* Remove negative margin */
            }
        }

        /* Mobile Adjustments */
        @media (max-width: 768px) {
            .login-container-fullscreen { 
                padding-top: 80px; 
                align-items: flex-start; 
                height: auto; /* Allow height to grow on mobile to avoid cutoff */
                overflow-y: auto; /* Enable vertical scroll on mobile only */
            }
            .auth-card-clean { flex-direction: column; width: 100%; height: auto; border-radius: 16px; }
            
            /* Ensure visual stays on top or bottom based on mode */
            .auth-visual { height: 200px; flex: none; order: 1 !important; }
            .auth-form-container { order: 2 !important; padding: 40px 25px; }
            
            .auth-card-clean.right-panel-active .auth-visual { order: 1 !important; }
            .auth-card-clean.right-panel-active .auth-form-container { order: 2 !important; }
            
            .back-home-pill { top: 20px; left: 20px; }
        }
      `}</style>

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