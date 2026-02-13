import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext'; 
import { assets } from '../assets/assets';

function Sale() {
  const navigate = useNavigate();
  const { products, addToCart } = useContext(ShopContext); 
  
  // State
  const [saleItems, setSaleItems] = useState([]);
  const [timeLeft, setTimeLeft] = useState({ hours: 24, minutes: 0, seconds: 0 });
  const [activeImage, setActiveImage] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [quantity, setQuantity] = useState(1);
  
  // Refs for Cursor
  const cursorDot = useRef(null);
  const cursorCircle = useRef(null);

  // --- 1. FILTER SALE ITEMS LOGIC ---
  useEffect(() => {
    // Filter items that have an MRP (Discounted items)
    const discounted = products.filter(item => 
        item.mrp && Number(item.mrp) > Number(item.price)
    );
    setSaleItems(discounted.length > 0 ? discounted : products.slice(0, 8)); 
  }, [products]);

  // --- 2. COUNTDOWN TIMER LOGIC ---
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev; // Timer done
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // --- 3. CURSOR ANIMATION ---
  useEffect(() => {
    const moveCursor = (e) => {
      if(cursorDot.current) { cursorDot.current.style.left = `${e.clientX}px`; cursorDot.current.style.top = `${e.clientY}px`; }
      if(cursorCircle.current) { setTimeout(() => { if(cursorCircle.current) { cursorCircle.current.style.left = `${e.clientX}px`; cursorCircle.current.style.top = `${e.clientY}px`; } }, 80); }
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  // Helper Functions
  const getMainImage = (item) => {
    if (!item || !item.image) return "https://placehold.co/400x400?text=No+Image";
    if (Array.isArray(item.image)) return item.image[0];
    try { return JSON.parse(item.image)[0]; } catch(e) { return item.image; }
  };
  const isVideo = (url) => url && (url.toLowerCase().endsWith('.mp4') || url.toLowerCase().endsWith('.webm'));
  const calculateDiscount = (mrp, price) => {
    return Math.round(((mrp - price) / mrp) * 100);
  };
  const formatPrice = (price) => {
    const formatted = Number(price || 0).toFixed(2);
    const [whole, decimal] = formatted.split('.');
    return { whole, decimal };
  };

  // Modal Logic
  const openModal = (product) => {
    setSelectedProduct(product);
    setActiveImage(getMainImage(product));
    setQuantity(1);
    setTimeout(() => setIsAnimating(true), 10);
  };
  const closeModal = () => { setIsAnimating(false); setTimeout(() => setSelectedProduct(null), 400); };
  const handleAddToCart = (id, qty) => { addToCart(id, qty); closeModal(); };

  return (
    <div className={`sale-page ${selectedProduct ? 'blur-bg' : ''}`}>
      <div className="noise-overlay"></div>
      <div className="cursor-dot" ref={cursorDot}></div>
      <div className="cursor-circle" ref={cursorCircle}></div>

      {/* --- STYLES --- */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Jost:wght@300;400;600;700&family=Pinyon+Script&display=swap');
        * { box-sizing: border-box; }
        body, html { margin: 0; padding: 0; overflow-x: hidden; width: 100%; }

        /* --- THEME: BABY PINK + CHAMPAGNE/CREAM --- */
        
        .sale-page { 
            width: 125%; 
            min-height: 100vh; 
            background: #fff0f5; /* Light Baby Pink Base */
            font-family: 'Jost', sans-serif; 
            position: relative; 
            margin-left: -13.9%; 
        }

        /* --- HERO BANNER --- */
        .sale-hero {
            padding: 140px 20px 80px;
            /* Soft Pink to Cream Gradient */
            background: linear-gradient(180deg, #ffe4e1 0%, #fff0f5 50%, #fdfbf7 100%);
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        /* Floating background decoration */
        .sale-hero::before {
            content: '';
            position: absolute;
            top: -50%; left: -20%; width: 200%; height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 60%);
            animation: rotateAura 20s linear infinite;
            z-index: 0;
            pointer-events: none;
        }
        @keyframes rotateAura { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

        .sale-tag {
            font-family: 'Jost', sans-serif;
            color: #d4af37; /* Champagne Gold */
            font-weight: 700;
            letter-spacing: 4px;
            font-size: 1rem;
            margin-bottom: 15px;
            display: block;
            text-transform: uppercase;
            position: relative; 
            z-index: 1;
        }
        
        .sale-title {
            font-family: 'Cinzel', serif;
            font-size: clamp(3rem, 8vw, 6.5rem);
            /* Rose Gold Gradient Text */
            background: linear-gradient(45deg, #d4af37, #e6a4b4, #d4af37);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            line-height: 0.9;
            margin-bottom: 20px;
            position: relative;
            z-index: 1;
            text-shadow: 0 5px 15px rgba(212, 175, 55, 0.2);
        }
        
        .sale-subtitle {
            font-family: 'Pinyon Script', cursive;
            font-size: clamp(2rem, 5vw, 3.5rem);
            color: #b76e79; /* Soft Rose */
            margin-top: -5px;
            display: block;
            position: relative; 
            z-index: 1;
        }
        
        /* --- COUNTDOWN TIMER --- */
        .timer-container {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-top: 40px;
            position: relative; z-index: 1;
        }
        .time-box {
            background: rgba(255, 255, 255, 0.8);
            padding: 15px 25px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(212, 175, 55, 0.15); /* Gold Shadow */
            text-align: center;
            border: 1px solid rgba(212, 175, 55, 0.2); /* Champagne border */
            min-width: 90px;
        }
        .time-val {
            font-family: 'Cinzel', serif;
            font-size: 2rem;
            color: #d4af37; /* Gold Text */
            font-weight: 700;
            display: block;
            line-height: 1;
        }
        .time-label {
            font-size: 0.7rem;
            color: #b76e79; /* Rose Text */
            letter-spacing: 1px;
            text-transform: uppercase;
            margin-top: 5px;
        }

        /* --- PRODUCT GRID --- */
        .sale-grid-section {
            padding: 60px 5vw 100px;
            max-width: 1400px;
            margin: 0 auto;
            background: #fdfbf7; /* Cream background for products */
        }
        .sale-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 30px;
        }

        /* Card Styles */
        .sale-card {
            background: #fff;
            border: 1px solid #fff0f5; /* Very subtle pink border */
            border-radius: 16px;
            padding: 15px;
            position: relative;
            transition: 0.4s ease;
            cursor: pointer;
            box-shadow: 0 5px 15px rgba(212, 175, 55, 0.05);
        }
        .sale-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 40px rgba(212, 175, 55, 0.15); /* Gold glow */
            border-color: #f8c8dc; /* Pastel Pink border on hover */
        }
        
        /* Discount Badge - Rose & Gold */
        .discount-badge {
            position: absolute;
            top: 10px;
            left: 10px;
            background: linear-gradient(135deg, #d4af37, #b76e79);
            color: #fff;
            padding: 6px 12px;
            font-size: 0.8rem;
            font-weight: 600;
            border-radius: 20px;
            z-index: 10;
            letter-spacing: 1px;
            box-shadow: 0 4px 10px rgba(183, 110, 121, 0.3);
        }

        .card-img-container {
            height: 380px;
            overflow: hidden;
            border-radius: 12px;
            position: relative;
        }
        .card-img-container img {
            width: 100%; height: 100%; object-fit: cover;
            transition: 0.8s;
        }
        .sale-card:hover img { transform: scale(1.08); }

        .sale-details { padding: 20px 5px 5px; text-align: center; }
        .sale-details h3 { 
            font-family: 'Cinzel', serif; 
            font-size: 1.15rem; 
            margin-bottom: 8px; 
            color: #333; 
        }

        /* Price Styling */
        .price-row {
            display: flex;
            justify-content: center;
            align-items: baseline;
            gap: 12px;
        }
        .old-price {
            text-decoration: line-through;
            color: #aaa;
            font-size: 0.9rem;
        }
        .new-price {
            color: #b76e79; /* Deep Rose for price */
            font-weight: 700;
            font-size: 1.3rem;
            font-family: 'Jost', sans-serif;
        }

        /* --- MODAL (Matches Theme) --- */
        .modal-wrapper { position: fixed; inset: 0; z-index: 1000; background: rgba(255, 240, 245, 0.6); backdrop-filter: blur(8px); display: flex; justify-content: center; align-items: center; opacity: 0; pointer-events: none; transition: 0.4s; }
        .modal-wrapper.active { opacity: 1; pointer-events: auto; }
        .clean-modal-card { width: 900px; height: 550px; background: #fff; display: flex; box-shadow: 0 30px 60px rgba(212, 175, 55, 0.2); position: relative; overflow: hidden; border-radius: 20px; border: 1px solid #fff0f5; }
        .close-btn-clean { position: absolute; top: 15px; right: 15px; background: #fff0f5; border: none; width: 35px; height: 35px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #b76e79; z-index: 20; font-size: 1.1rem; transition: 0.3s; }
        .close-btn-clean:hover { background: #b76e79; color: #fff; }
        
        .clean-modal-left { width: 45%; padding: 20px; display: flex; flex-direction: column; gap: 10px; background: #fdfbf7; }
        .clean-main-img { width: 100%; height: 380px; overflow: hidden; border-radius: 12px; display: flex; align-items: center; justify-content: center;}
        .clean-main-img img, .clean-main-img video { width: 100%; height: 100%; object-fit: cover; }
        
        .clean-modal-right { width: 55%; padding: 40px; display: flex; flex-direction: column; overflow-y: auto; }
        .clean-title { font-family: 'Cinzel', serif; font-size: 1.8rem; color: #1a1a1a; margin-bottom: 10px; }
        .clean-price { font-size: 2rem; color: #d4af37; font-weight: 600; display: flex; align-items: flex-start; }
        
        .clean-actions { margin-top: auto; display: flex; gap: 20px; align-items: stretch; padding-top: 20px; border-top: 1px solid #f9f9f9; }
        .clean-qty { display: flex; align-items: center; justify-content: space-between; border: 1px solid #eee; width: 120px; padding: 0 15px; height: 50px; border-radius: 30px; }
        
        .add-btn { 
            flex: 1; 
            background: linear-gradient(135deg, #d4af37, #b76e79); /* Gold to Rose Gradient */
            color: #fff; 
            border: none; 
            font-size: 0.95rem; 
            font-weight: 600; 
            cursor: pointer; 
            text-transform: uppercase; 
            height: 50px; 
            border-radius: 30px; 
            letter-spacing: 1px;
            box-shadow: 0 10px 20px rgba(212, 175, 55, 0.2);
            transition: 0.3s;
        }
        .add-btn:hover { transform: translateY(-2px); box-shadow: 0 15px 30px rgba(212, 175, 55, 0.3); }

        /* --- FOOTER STYLES (Light Theme) --- */
        .luxury-footer { background: #fdfbf7; color: #333; padding: 80px 8vw 30px; font-family: 'Jost', sans-serif; border-top: 1px solid #f0e6e6; width: 100%; }
        .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1.5fr; gap: 40px; margin-bottom: 60px; }
        .footer-brand h2 { font-family: 'Cinzel', serif; font-size: 2.2rem; color: #1a1a1a; margin-bottom: 20px; }
        .footer-brand p { color: #666; line-height: 1.6; max-width: 300px; font-size: 0.95rem; }
        .footer-col h3 { font-family: 'Cinzel', serif; font-size: 1.1rem; color: #1a1a1a; margin-bottom: 25px; letter-spacing: 1px; }
        .footer-links { display: flex; flex-direction: column; gap: 12px; }
        .footer-links a { color: #666; text-decoration: none; transition: all 0.3s ease; font-size: 0.9rem; display: flex; align-items: center; gap: 8px; }
        .footer-links a:hover { color: #d4af37; transform: translateX(5px); }
        .newsletter-text { color: #666; margin-bottom: 20px; font-size: 0.9rem; }
        .subscribe-box { display: flex; margin-bottom: 25px; }
        .subscribe-input { padding: 12px; background: #fff; border: 1px solid #ddd; color: #333; flex: 1; outline: none; }
        .subscribe-btn { padding: 12px 20px; background: #1a1a1a; color: #fff; border: none; cursor: pointer; font-weight: 600; text-transform: uppercase; transition: 0.3s; }
        .subscribe-btn:hover { background: #d4af37; }
        .social-icons { display: flex; gap: 15px; }
        .social-icon { width: 35px; height: 35px; border: 1px solid #ccc; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #555; transition: all 0.4s ease; cursor: pointer; background: #fff; }
        .social-icon:hover { transform: translateY(-3px); color: #fff; border-color: transparent; }
        .social-icon.instagram:hover { background: radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%); }
        .social-icon.facebook:hover { background: #1877F2; }
        .social-icon.whatsapp:hover { background: #25D366; }
        .social-icon.youtube:hover { background: #FF0000; }
        .social-icon.pinterest:hover { background: #E60023; }
        .footer-bottom { border-top: 1px solid #f0e6e6; padding-top: 30px; display: flex; justify-content: space-between; align-items: center; color: #888; font-size: 0.8rem; }
        .payment-methods { display: flex; align-items: center; gap: 15px; }
        .payment-icon { width: 38px; height: auto; fill: #999; transition: 0.3s ease; opacity: 0.7; }
        .payment-icon:hover { fill: #d4af37; opacity: 1; transform: translateY(-1px); }

        /* --- RESPONSIVE --- */
        @media (max-width: 1200px) {
            .sale-page { width: 100%; margin-left: 0; }
            .sale-grid { grid-template-columns: 1fr; }
            .sale-hero { padding-top: 120px; }
            .sale-title { font-size: 3.5rem; }
            .footer-grid { grid-template-columns: 1fr; gap: 40px; }
            .footer-bottom { flex-direction: column; gap: 20px; text-align: center; }
        }
        @media (max-width: 900px) {
            .clean-modal-card { flex-direction: column; width: 95%; height: 90vh; overflow-y: auto; }
            .clean-modal-left, .clean-modal-right { width: 100%; height: auto; }
        }
      `}</style>

      {/* --- HERO SECTION --- */}
      <div className="sale-hero">
          <span className="sale-tag">Limited Time Only</span>
          <h1 className="sale-title">88% OFF</h1>
          <span className="sale-subtitle">The Royal Clearance</span>
          
          <div className="timer-container">
            <div className="time-box">
                <span className="time-val">{timeLeft.hours}</span>
                <span className="time-label">Hrs</span>
            </div>
            <div className="time-box">
                <span className="time-val">{timeLeft.minutes}</span>
                <span className="time-label">Mins</span>
            </div>
            <div className="time-box">
                <span className="time-val">{timeLeft.seconds}</span>
                <span className="time-label">Secs</span>
            </div>
          </div>
      </div>

      {/* --- PRODUCT GRID --- */}
      <section className="sale-grid-section">
        <div className="sale-grid">
            {saleItems.length > 0 ? saleItems.map((product, index) => {
                const imgSrc = getMainImage(product);
                const discount = product.mrp ? calculateDiscount(product.mrp, product.price) : 0;
                
                return (
                    <div key={index} className="sale-card" onClick={() => openModal(product)}>
                        {/* Only show badge if discount exists */}
                        {discount > 0 && <div className="discount-badge">-{discount}%</div>}
                        
                        <div className="card-img-container">
                            <img src={imgSrc} alt={product.name} />
                        </div>
                        <div className="sale-details">
                            <h3>{product.name}</h3>
                            <div className="price-row">
                                <span className="new-price">₹{formatPrice(product.price).whole}</span>
                                {product.mrp && Number(product.mrp) > Number(product.price) && (
                                    <span className="old-price">₹{product.mrp}</span>
                                )}
                            </div>
                        </div>
                    </div>
                )
            }) : (
                <div style={{textAlign:'center', gridColumn:'1/-1', color:'#888', padding:'50px'}}>
                    <h3>Loading Exclusive Offers...</h3>
                </div>
            )}
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="luxury-footer">
        <div className="footer-grid">
            <div className="footer-brand">
                <h2>AnB Jewels</h2>
                <p>Passion poured into every ornament. Our dedicated team of experts and designers collaborate meticulously to deliver unparalleled quality.</p>
            </div>
            <div className="footer-col">
                <h3>Quick Links</h3>
                <div className="footer-links">
                    <Link to="/">Home</Link>
                    <Link to="/collection">New Arrivals ✨</Link>
                    <Link to="/collection">Necklaces</Link>
                    <Link to="/collection">Earrings</Link>
                </div>
            </div>
            <div className="footer-col">
                <h3>Information</h3>
                <div className="footer-links">
                    <Link to="/about">About Us</Link>
                    <Link to="/contact">Contact Us</Link>
                    <Link to="/ShippingPolicy">Shipping Policy</Link>
                    <Link to="/Policy">Privacy Policy</Link>
                </div>
            </div>
            <div className="footer-col">
                <h3>Stay Connected</h3>
                <p className="newsletter-text">Subscribe to receive updates, access to exclusive deals, and more.</p>
                <div className="subscribe-box">
                    <input type="email" placeholder="Your Email Address" className="subscribe-input" />
                    <button className="subscribe-btn">JOIN</button>
                </div>
                <div className="social-icons">
                    <a href="https://www.instagram.com/anbjewels/" className="social-icon instagram"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></a>
                    <a href="https://www.facebook.com/profile.php?id=61585987086273" className="social-icon facebook"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg></a>
                    <a href="https://wa.me/919355366106" className="social-icon whatsapp"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg></a>
                    <a href="https://www.instagram.com/anbjewels/" className="social-icon youtube"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg></a>
                    <a href="https://www.instagram.com/anbjewels/" className="social-icon pinterest"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 12a4 4 0 1 1 8 0 4 4 0 0 1-8 0z"></path><path d="M12 2a10 10 0 0 0-10 10c0 4.2 2.6 7.8 6.4 9.3-.1-.8-.2-2 0-2.9l1.4-5.8c-.1-.4-.2-1-.2-1.5 0-1.4.8-2.5 1.8-2.5.9 0 1.3.7 1.3 1.5 0 .9-.6 2.3-.9 3.5-.2 1 .5 1.8 1.5 1.8 1.8 0 3.2-1.9 3.2-4.6 0-2.4-1.7-4.1-4.2-4.1-3 0-4.8 2.3-4.8 4.6 0 .9.3 1.9.8 2.5-.1.3-.2 1.2-.3 1.4-.8-.2-2.3-1.4-2.3-4.3 0-3.1 2.3-6 6.5-6 3.4 0 6 2.5 6 5.8 0 3.5-2.2 6.3-5.2 6.3-1 0-2-.5-2.3-1.1l-.6 2.4c-.2.9-1 2.6-1.5 3.5 1.1.3 2.3.5 3.5.5 5.5 0 10-4.5 10-10S17.5 2 12 2z"></path></svg></a>
                </div>
            </div>
        </div>
        <div className="footer-bottom">
            <p>Copyright © 2026 AnB Jewels. All rights reserved.</p>
            <div className="payment-methods">
               <svg className="payment-icon" viewBox="0 0 38 24"><path d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z" fillOpacity="0"/><path d="M11.875 16.094l1.85-11.45h2.95l-1.85 11.45h-2.95zm9.525-11.225c-.35-.125-.9-.25-1.625-.25-1.775 0-3.025.95-3.05 2.3-.025 1 .9 1.55 1.575 1.875.7.35.925.575.925.875 0 .475-.575.7-1.1.7-.725 0-1.125-.1-1.725-.375l-.25-.125-.275 1.7c.475.225 1.325.425 2.225.425 2.1 0 3.475-1.025 3.5-2.6.025-.875-.525-1.525-1.675-2.075-.7-.35-1.125-.575-1.125-.9 0-.3.35-.6.1.1.1 1.325.125 1.575.125s1.25.25 1.5.3l-.225 1.375zM15.5 8.169c.1.25.1.45.1.45L14.475 3.32c-.075-.15-.3-.225-.55-.25h-1.95c-.35 0-.675.25-.85.65l-2.4 5.75-.1.45h2.075l.425-1.175h2.525l.225 1.175h2.725l-1.1-5.75zM11.9 8.244l.75-2.025.425 2.025h-1.175zm12.925 3.3c.025 0 .025.025.025.025.325-1.65.65-3.325.65-3.325.1-.375.325-.575.725-.625h2.2l-3.6 8.475-.2.85c-.325 1.15-1.325 1.575-2.775 1.625l-.225-.025.075-1.55c.375.1.725.15 1.05.15.55 0 .9-.225 1.05-.625.025-.15.05-.275.05-.275l-2.85-6.65h2.15l1.6 4.3 2.1-4.3h-2.05z"/></svg>
               <svg className="payment-icon" viewBox="0 0 38 24"><path d="M22 12c0-2.8-1.6-5.2-4-6.3-2.4 1.1-4 3.5-4 6.3s1.6 5.2 4 6.3c2.4-1.1 4-3.5 4-6.3z"/><circle cx="12" cy="12" r="7" fillOpacity="0" stroke="currentColor" strokeWidth="2"/><circle cx="26" cy="12" r="7" fillOpacity="0" stroke="currentColor" strokeWidth="2"/></svg>
               <svg className="payment-icon" viewBox="0 0 38 24"><path d="M24 10.5c-.3 0-.6.1-.9.1h-4c-.3 0-.5.2-.6.5l-.2 1.3-.2 1.3c0 .2.1.3.3.3h2c.3 0 .5-.2.5-.5l.1-.9h.8c1.3 0 2.2-.6 2.4-1.7.1-.6 0-1.1-.3-1.4-.4-.3-1-.4-1.8-.4h1.9z"/><path d="M10.7 10.5c-.3 0-.6.1-.9.1H5.8c-.3 0-.5.2-.6.5l-.2 1.3-.2 1.3c0 .2.1.3.3.3h2c.3 0 .5-.2.5-.5l.1-.9h.8c1.3 0 2.2-.6 2.4-1.7.1-.6 0-1.1-.3-1.4-.4-.3-1-.4-1.8-.4H10.7z"/><path d="M19.8 13.5h-1.9l-.3 1.5c-.1.3-.3.5-.6.5h-1.1c-.2 0-.3-.2-.2-.4l1.1-6.9c0-.2.3-.4.5-.4h2.2c1.5 0 2.7.3 3 1.6.2 1.1-.2 2.4-1.6 3.4-.6.4-1.4.6-2.2.6z"/><path d="M18.6 13.5h-1.9l-.3 1.5c-.1.3-.3.5-.6.5h-1.1c-.2 0-.3-.2-.2-.4l1.1-6.9c0-.2.3-.4.5-.4h2.2c1.5 0 2.7.3 3 1.6.2 1.1-.2 2.4-1.6 3.4-.6.4-1.4.6-2.2.6z"/></svg>
               <svg className="payment-icon" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/><line x1="2" y1="10" x2="22" y2="10" stroke="currentColor" strokeWidth="2"/></svg>
            </div>
        </div>
      </footer>

      {/* --- MODAL (Copied) --- */}
      {selectedProduct && (
        <div className={`modal-wrapper ${isAnimating ? 'active' : ''}`} onClick={closeModal}>
          <div className="clean-modal-card" onClick={e => e.stopPropagation()}>
            <button className="close-btn-clean" onClick={closeModal}>✕</button>
            <div className="clean-modal-left">
               <div className="clean-main-img">{isVideo(activeImage) ? <video key={activeImage} src={activeImage} autoPlay muted loop controls /> : <img src={activeImage} alt="Product" />}</div>
            </div>
            <div className="clean-modal-right">
               <h1 className="clean-title">{selectedProduct.name}</h1>
               <div className="modal-price-box">
                  <div className="clean-price"><span className="p-currency">₹</span><span className="p-whole">{formatPrice(selectedProduct.price).whole}</span><span className="p-decimal">{formatPrice(selectedProduct.price).decimal}</span></div>
               </div>
               <div className="clean-actions">
                  <div className="clean-qty">
                      <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button><span>{quantity}</span><button onClick={() => setQuantity(q => q + 1)}>+</button>
                  </div>
                  <button className="add-btn" onClick={() => handleAddToCart(selectedProduct._id || selectedProduct.id, quantity)}>ADD TO BAG</button>
               </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Sale;