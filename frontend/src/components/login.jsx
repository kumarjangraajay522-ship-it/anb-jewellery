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
  const [animating, setAnimating] = useState(false); // For smooth transition
  
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
    setAnimating(true); // Start transition animation
    setTimeout(() => {
        setMode(prev => prev === 'Login' ? 'Sign Up' : 'Login');
        setEmail(''); 
        setPassword(''); 
        setName('');
        setAnimating(false); // End animation
    }, 400); // Matches CSS transition duration
  };

  return (
    <div className="login-container-fullscreen">
      
      {/* =========================================================
          INTERNAL CSS (Baby Pink Theme + Responsive Margin Fix + Hidden Scroll) 
         ========================================================= */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Jost:wght@300;400;500;600&display=swap');

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
          background: linear-gradient(135deg, #fff0f5 0%, #ffe4e1 50%, #fdfbf7 100%);
          
          font-family: 'Jost', sans-serif;
          position: relative;
          padding: 20px;
        }

        /* Gold Aura Background (Subtle Warmth) */
        .aura-bg {
          position: absolute; width: 120%; height: 120%;
          background: radial-gradient(circle, rgba(255, 182, 193, 0.15) 0%, transparent 70%);
          animation: rotateAura 60s linear infinite; pointer-events: none; z-index: 0;
        }
        @keyframes rotateAura { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

        /* Floating particles */
        .particle {
            position: absolute; width: 6px; height: 6px; background: rgba(212, 175, 55, 0.3);
            border-radius: 50%; animation: floatParticle 8s infinite ease-in-out;
        }
        .p1 { top: 20%; left: 20%; animation-delay: 0s; }
        .p2 { bottom: 30%; right: 25%; animation-delay: 2s; width: 10px; height: 10px; background: rgba(255,192,203,0.4); }
        .p3 { top: 40%; right: 10%; animation-delay: 4s; }
        
        @keyframes floatParticle {
            0%, 100% { transform: translateY(0); opacity: 0.5; }
            50% { transform: translateY(-20px); opacity: 1; }
        }

        /* --- AUTH CARD --- */
        .auth-card-clean {
          width: 950px; height: 600px;
          
          /* Glassmorphism White */
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
          border: 1px solid rgba(255, 255, 255, 0.6);
          
          border-radius: 24px;
          box-shadow: 0 30px 80px rgba(212, 175, 55, 0.15); /* Gold tinted shadow */
          display: flex; overflow: hidden; position: relative; z-index: 10;
          transition: all 0.5s ease;
        }

        /* Panels */
        .auth-form-container { 
            padding: 60px; 
            background: #ffffff; 
            color: #333; /* Dark text */
            flex: 1; 
            order: 1; 
            display: flex; flex-direction: column; justify-content: center;
            transition: opacity 0.4s ease, transform 0.4s ease;
        }
        .auth-visual { 
            position: relative; overflow: hidden; 
            order: 2; 
            background-color: #ffe4e1; 
            flex: 1.2; 
            transition: all 0.6s ease-in-out;
        }

        /* Image & Overlay */
        .auth-img { 
            width: 100%; height: 100%; object-fit: cover; 
            transition: transform 3s ease; 
            filter: brightness(0.95);
        }
        .auth-card-clean:hover .auth-img { transform: scale(1.1); }
        
        .visual-overlay {
          position: absolute; inset: 0;
          /* Luxurious Gradient Overlay */
          background: linear-gradient(to top, rgba(160, 82, 45, 0.4), transparent);
          display: flex; align-items: flex-end; padding: 40px;
        }
        .visual-text h2 { 
            font-family: 'Cinzel', serif; font-size: 2.5rem;
            color: white; margin-bottom: 8px; text-shadow: 0 5px 15px rgba(0,0,0,0.2);
            opacity: 0; animation: slideUp 0.8s forwards 0.2s;
        }
        .visual-text p { 
            color: #fff0f5; letter-spacing: 3px; text-transform: uppercase; font-size: 0.85rem; font-weight: 500;
            opacity: 0; animation: slideUp 0.8s forwards 0.4s;
        }
        
        @keyframes slideUp { from { opacity:0; transform: translateY(20px); } to { opacity:1; transform: translateY(0); } }

        /* Animation State */
        .fade-out { opacity: 0; transform: scale(0.98); }
        .fade-in { opacity: 1; transform: scale(1); }

        /* Swap Logic for Sign Up */
        .auth-card-clean.right-panel-active .auth-form-container { order: 2; }
        .auth-card-clean.right-panel-active .auth-visual { order: 1; }

        /* Inputs & Text */
        .brand-title { 
            font-family: 'Cinzel', serif; color: #1a1a1a; 
            font-size: 2.5rem; margin-bottom: 5px; text-align: center; 
        }
        .subtitle { 
            color: #888; margin-bottom: 40px; text-align: center; 
            text-transform: uppercase; letter-spacing: 2px; font-size: 0.8rem;
        }

        .input-group { position: relative; margin-bottom: 25px; }

        .auth-input {
          width: 100%; padding: 14px 0; 
          background: transparent; border: none; border-bottom: 1px solid #ddd;
          color: #333; font-family: 'Jost', sans-serif; font-size: 1rem;
          outline: none; transition: 0.4s;
        }
        .auth-input:focus { border-bottom-color: #d4af37; /* Gold focus */ }
        .auth-input::placeholder { color: #aaa; font-weight: 300; transition: 0.3s; }
        .auth-input:focus::placeholder { transform: translateY(-10px); font-size: 0.8rem; color: #d4af37; }

        /* Buttons */
        .auth-btn {
          width: 100%; padding: 16px; margin-top: 20px;
          /* Luxurious Gradient */
          background: linear-gradient(135deg, #1a1a1a 0%, #333 100%);
          color: white; border: none; border-radius: 50px;
          font-size: 0.95rem; font-weight: 600; letter-spacing: 2px; text-transform: uppercase;
          cursor: pointer !important; transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
        .auth-btn:hover { 
            transform: translateY(-3px); 
            background: linear-gradient(135deg, #d4af37 0%, #c5a028 100%); /* Gold on hover */
            box-shadow: 0 15px 30px rgba(212, 175, 55, 0.3);
            color: #fff;
        }

        .toggle-text { margin-top: 30px; text-align: center; font-size: 0.9rem; color: #666; }
        .toggle-link { 
            color: #d4af37; font-weight: 600; cursor: pointer !important; margin-left: 8px; transition: 0.3s; 
            text-transform: uppercase; letter-spacing: 1px; font-size: 0.85rem;
        }
        .toggle-link:hover { color: #1a1a1a; text-decoration: none; }

        .back-home-pill {
          position: absolute; top: 40px; left: 40px;
          background: rgba(255, 255, 255, 0.8); border: 1px solid #fff; color: #555;
          padding: 12px 25px; border-radius: 50px; cursor: pointer !important; 
          font-size: 0.85rem; font-weight: 500; transition: 0.3s; z-index: 20;
          backdrop-filter: blur(5px);
        }
        .back-home-pill:hover { 
            background: #fff; color: #d4af37;
            box-shadow: 0 5px 15px rgba(212, 175, 55, 0.15);
            transform: translateX(-5px);
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
                padding: 0;
                align-items: flex-start; 
                height: 100vh; 
                overflow-y: auto; 
                background: #fff; /* Simplify mobile bg */
            }
            .auth-card-clean { 
                width: 100%; height: 100%; border-radius: 0; border: none; box-shadow: none;
                flex-direction: column; 
            }
            
            /* Visual Section on top for mobile */
            .auth-visual { height: 35vh; flex: none; order: 1 !important; border-radius: 0 0 30px 30px; }
            .auth-form-container { order: 2 !important; padding: 40px 30px; border-radius: 30px 30px 0 0; margin-top: -30px; position: relative; z-index: 20; }
            
            /* Override order swapping on mobile to keep consistency */
            .auth-card-clean.right-panel-active .auth-visual { order: 1 !important; }
            .auth-card-clean.right-panel-active .auth-form-container { order: 2 !important; }
            
            .back-home-pill { top: 20px; left: 20px; background: rgba(0,0,0,0.1); color: #fff; border: 1px solid rgba(255,255,255,0.3); }
        }
      `}</style>

      <div className="aura-bg"></div>
      <div className="particle p1"></div>
      <div className="particle p2"></div>
      <div className="particle p3"></div>
      
      <button 
        className="back-home-pill" 
        onClick={() => navigate('/')}
        disabled={loading}
      >
        ← Back to Home
      </button>
      
      <div className={`auth-card-clean ${mode === 'Sign Up' ? 'right-panel-active' : ''}`}>
        
        {/* Form Side */}
        <div className={`auth-form-container ${animating ? 'fade-out' : 'fade-in'}`}>
          <form onSubmit={onSubmitHandler}>
            <h1 className="brand-title">AnB Jewels</h1>
            <p className="subtitle">{mode === 'Login' ? 'Access your personal collection' : 'Begin your journey with us'}</p>
            
            {mode === 'Sign Up' && (
              <div className="input-group">
                  <input 
                    type="text" 
                    className="auth-input" 
                    placeholder="Full Name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required 
                    disabled={loading}
                  />
              </div>
            )}
            
            <div className="input-group">
                <input 
                  type="email" 
                  className="auth-input" 
                  placeholder="Email Address" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  disabled={loading}
                />
            </div>
            
            <div className="input-group">
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
            </div>
            
            <button 
              type="submit" 
              className="auth-btn"
              disabled={loading}
              style={{ 
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Processing...' : (mode === 'Login' ? 'Sign In' : 'Create Account')}
            </button>
            
            <div className="toggle-text">
              {mode === 'Login' ? "New to AnB Jewels?" : "Already a member?"}
              <span 
                className="toggle-link" 
                onClick={toggleMode}
                style={{ pointerEvents: loading ? 'none' : 'auto' }}
              >
                {mode === 'Login' ? "Register Now" : "Sign In"}
              </span>
            </div>
          </form>
        </div>
        
        {/* Visual Side */}
        <div className="auth-visual">
          <img src={assets.login} alt="Jewelry Aesthetic" className="auth-img" />
          <div className="visual-overlay">
            <div className="visual-text">
              <h2>{mode === 'Login' ? 'Timeless Elegance.' : 'Unveil Luxury.'}</h2>
              <p>{mode === 'Login' ? 'Welcome back to your world.' : 'Join our exclusive community.'}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;