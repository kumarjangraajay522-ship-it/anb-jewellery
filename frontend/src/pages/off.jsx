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

  // Character State (from Collection)
  const [characterMessage, setCharacterMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [characterMood, setCharacterMood] = useState('happy');
  const [isJumping, setIsJumping] = useState(false);
  const [sparkleEffect, setSparkleEffect] = useState(false);
  
  // Refs for Cursor
  const cursorDot = useRef(null);
  const cursorCircle = useRef(null);
  const messageTimeoutRef = useRef(null);

  // KEY FIX: Set body/html background to page pink on mount
  useEffect(() => {
    const prevBodyBg = document.body.style.backgroundColor;
    const prevHtmlBg = document.documentElement.style.backgroundColor;
    document.body.style.backgroundColor = '#ffe8f0';
    document.documentElement.style.backgroundColor = '#ffe8f0';
    return () => {
      document.body.style.backgroundColor = prevBodyBg;
      document.documentElement.style.backgroundColor = prevHtmlBg;
    };
  }, []);

  // --- CHARACTER MESSAGES (same as Collection) ---
  const touchMessages = [
    "Ohhh I got touched by a Queen! 👑✨",
    "Your Majesty touched me! 💕",
    "A Queen's touch! I'm blessed! 🌟",
    "Royal vibes detected! 👑💖",
    "Feeling royal now! ✨👑",
    "Queen energy is real! 💅✨"
  ];
  const addToCartMessages = [
    "Ohhh nice choice Beautiful! 💎",
    "Yasss Queen! Perfect pick! 👑",
    "You've got amazing taste! ✨",
    "That's gonna look stunning on you! 💕",
    "Absolutely gorgeous choice! 🌟",
    "Your style is impeccable! 💖",
    "This piece was made for you! ✨",
    "Can't wait to see you shine! 💎"
  ];
  const hoverMessages = [
    "Ooh, exploring? Love it! 👀✨",
    "That one's a beauty! 💎",
    "Great eye, gorgeous! 👑",
    "You're gonna look amazing! 💕",
    "This collection is fire! 🔥",
    "Treat yourself, Queen! 💅"
  ];

  const showCharacterMessage = (message, mood = 'happy') => {
    if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
    setCharacterMessage(message);
    setCharacterMood(mood);
    setShowMessage(true);
    setIsJumping(true);
    setSparkleEffect(true);
    setTimeout(() => setIsJumping(false), 600);
    setTimeout(() => setSparkleEffect(false), 1000);
    messageTimeoutRef.current = setTimeout(() => setShowMessage(false), 4000);
  };

  const handleCharacterClick = () => {
    const randomMessage = touchMessages[Math.floor(Math.random() * touchMessages.length)];
    showCharacterMessage(randomMessage, 'excited');
  };

  // --- 1. FILTER SALE ITEMS LOGIC ---
  useEffect(() => {
    const prods = products || [];
    const discounted = prods.filter(item => 
        item.mrp && Number(item.mrp) > Number(item.price)
    );
    setSaleItems(discounted.length > 0 ? discounted : prods.slice(0, 8)); 
  }, [products]);

  // Welcome message on mount
  useEffect(() => {
    setTimeout(() => showCharacterMessage("Welcome to the Sale! Grab a deal, Queen! 🛍️👑", 'happy'), 500);
  }, []);

  // --- 2. COUNTDOWN TIMER LOGIC ---
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
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
  const calculateDiscount = (mrp, price) => Math.round(((mrp - price) / mrp) * 100);
  
  // --- UPDATED PRICE FORMATTER (Solves the "19900" issue) ---
  const formatPrice = (price) => {
    const num = Number(price || 0);
    // Formats to Indian Standard (e.g., 19,900.00)
    const formatted = num.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    const [whole, decimal] = formatted.split('.');
    return { whole, decimal };
  };

  const getAllImages = (item) => {
    if (!item || !item.image) return [];
    if (Array.isArray(item.image)) return item.image;
    try { 
        const parsed = JSON.parse(item.image);
        return Array.isArray(parsed) ? parsed : [item.image];
    } catch(e) { return [item.image]; }
  };

  // Modal Logic
  const openModal = (product) => {
    setSelectedProduct(product);
    setActiveImage(getMainImage(product));
    setQuantity(1);
    setTimeout(() => setIsAnimating(true), 10);
    const randomHover = hoverMessages[Math.floor(Math.random() * hoverMessages.length)];
    showCharacterMessage(randomHover, 'happy');
  };
  const closeModal = () => { setIsAnimating(false); setTimeout(() => setSelectedProduct(null), 400); };
  const handleAddToCart = (id, qty) => {
    addToCart(id, qty);
    const randomMessage = addToCartMessages[Math.floor(Math.random() * addToCartMessages.length)];
    showCharacterMessage(randomMessage, 'love');
    closeModal();
  };

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

        .sale-page { 
            width: 125%; 
            min-height: 100vh; 
            background: #ffe8f0;
            font-family: 'Jost', sans-serif; 
            position: relative; 
            margin-left: -13.9%;
        }

        /* --- CUSTOM CURSOR --- */
        .cursor-dot { position: fixed; width: 9px; height: 9px; background: #c9557a; border-radius: 50%; pointer-events: none; z-index: 99999; transform: translate(-50%, -50%); }
        .cursor-circle { position: fixed; width: 38px; height: 38px; border: 2px solid rgba(201, 85, 122, 0.55); border-radius: 50%; pointer-events: none; z-index: 99998; transform: translate(-50%, -50%); background: rgba(255, 182, 205, 0.07); }

        /* ============================================
           CHARACTER
           ============================================ */
        .permanent-character { position: fixed; bottom: 30px; right: 30px; z-index: 9998; cursor: pointer; transition: transform 0.3s ease; }
        .permanent-character:hover { transform: scale(1.05); }
        .character-container { position: relative; width: 200px; height: 230px; animation: gentleFloat 3s ease-in-out infinite; }
        .character-container.jumping { animation: excitedJump 0.6s ease-out; }
        @keyframes gentleFloat { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-15px) rotate(2deg); } }
        @keyframes excitedJump { 0% { transform: translateY(0) scale(1); } 30% { transform: translateY(-40px) scale(1.1) rotate(-5deg); } 50% { transform: translateY(-50px) scale(1.15) rotate(5deg); } 70% { transform: translateY(-30px) scale(1.1) rotate(-3deg); } 100% { transform: translateY(0) scale(1) rotate(0deg); } }

        .character-body { position: absolute; bottom: 50px; left: 50%; transform: translateX(-50%); width: 100px; height: 120px; background: linear-gradient(135deg, #FF6EC7 0%, #B06AB3 50%, #8A4FFF 100%); border-radius: 50px 50px 60px 60px; box-shadow: 0 15px 40px rgba(180, 106, 179, 0.5), inset 0 -15px 30px rgba(255, 255, 255, 0.2), inset 0 15px 30px rgba(138, 79, 255, 0.3); animation: bodyPulse 2s ease-in-out infinite; }
        @keyframes bodyPulse { 0%, 100% { transform: translateX(-50%) scale(1); } 50% { transform: translateX(-50%) scale(1.02); } }
        .character-body.mood-excited { background: linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF1493 100%); }
        .character-body.mood-love { background: linear-gradient(135deg, #FF69B4 0%, #FF1493 50%, #C71585 100%); }

        .character-head { position: absolute; bottom: 145px; left: 50%; transform: translateX(-50%); width: 80px; height: 80px; background: linear-gradient(135deg, #FFE4F0 0%, #FFB6D9 100%); border-radius: 50%; box-shadow: 0 10px 30px rgba(255, 182, 217, 0.6), inset 0 -10px 20px rgba(255, 255, 255, 0.5); animation: headTilt 2s ease-in-out infinite; }
        @keyframes headTilt { 0%, 100% { transform: translateX(-50%) rotate(-2deg); } 50% { transform: translateX(-50%) rotate(2deg); } }

        .character-eyes { position: absolute; top: 28px; left: 50%; transform: translateX(-50%); width: 50px; display: flex; justify-content: space-between; }
        .eye { width: 14px; height: 18px; background: #333; border-radius: 50%; position: relative; animation: naturalBlink 4s infinite; }
        .eye::after { content: ''; position: absolute; top: 4px; left: 4px; width: 6px; height: 6px; background: white; border-radius: 50%; animation: eyeShine 2s ease-in-out infinite; }
        @keyframes naturalBlink { 0%, 94%, 100% { height: 18px; } 96% { height: 2px; } }
        @keyframes eyeShine { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
        .eye.excited { animation: excitedBlink 0.5s ease-in-out 3; }
        @keyframes excitedBlink { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.3); } }

        .character-smile { position: absolute; top: 50px; left: 50%; transform: translateX(-50%); width: 30px; height: 15px; border: 2.5px solid #FF1493; border-top: none; border-radius: 0 0 30px 30px; }
        .character-smile.big-smile { width: 35px; height: 18px; animation: smilePulse 0.5s ease-in-out 2; }
        @keyframes smilePulse { 0%, 100% { transform: translateX(-50%) scale(1); } 50% { transform: translateX(-50%) scale(1.2); } }

        .cheek { position: absolute; top: 40px; width: 14px; height: 12px; background: rgba(255, 105, 180, 0.4); border-radius: 50%; animation: blush 2s ease-in-out infinite; }
        .cheek-left { left: 10px; }
        .cheek-right { right: 10px; }
        @keyframes blush { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.7; } }

        .character-arm { position: absolute; width: 40px; height: 40px; background: linear-gradient(135deg, #FF6EC7 0%, #B06AB3 100%); border-radius: 50%; box-shadow: 0 5px 15px rgba(180, 106, 179, 0.4); }
        .arm-left { bottom: 90px; left: 20px; animation: waveLeftContinuous 2s ease-in-out infinite; }
        .arm-right { bottom: 90px; right: 20px; animation: waveRightContinuous 2s ease-in-out infinite; }
        @keyframes waveLeftContinuous { 0%, 100% { transform: rotate(-15deg); } 50% { transform: rotate(-35deg); } }
        @keyframes waveRightContinuous { 0%, 100% { transform: rotate(15deg); } 50% { transform: rotate(35deg); } }

        .character-crown { position: absolute; top: -15px; left: 50%; transform: translateX(-50%); font-size: 1.5rem; animation: crownShine 2s ease-in-out infinite; }
        @keyframes crownShine { 0%, 100% { transform: translateX(-50%) rotate(-5deg) scale(1); } 50% { transform: translateX(-50%) rotate(5deg) scale(1.1); } }

        .character-sparkles { position: absolute; width: 100%; height: 100%; pointer-events: none; }
        .sparkle { position: absolute; font-size: 1.2rem; animation: sparkleOrbit 3s ease-in-out infinite; opacity: 0; }
        .sparkle-1 { top: 10%; left: 10%; animation-delay: 0s; }
        .sparkle-2 { top: 20%; right: 5%; animation-delay: 0.5s; }
        .sparkle-3 { bottom: 30%; left: 5%; animation-delay: 1s; }
        .sparkle-4 { bottom: 20%; right: 10%; animation-delay: 1.5s; }
        @keyframes sparkleOrbit { 0%, 100% { transform: scale(0) rotate(0deg); opacity: 0; } 50% { transform: scale(1.5) rotate(180deg); opacity: 1; } }
        .character-sparkles.active .sparkle { animation: sparkleExplosion 1s ease-out; }
        @keyframes sparkleExplosion { 0% { transform: scale(0); opacity: 0; } 50% { transform: scale(1.8); opacity: 1; } 100% { transform: scale(0); opacity: 0; } }

        .floating-hearts { position: absolute; width: 100%; height: 100%; pointer-events: none; }
        .heart { position: absolute; font-size: 1rem; animation: heartFloat 3s ease-in-out infinite; }
        .heart-1 { top: 20%; left: -20px; animation-delay: 0s; }
        .heart-2 { top: 50%; right: -20px; animation-delay: 1s; }
        .heart-3 { bottom: 30%; left: -15px; animation-delay: 2s; }
        @keyframes heartFloat { 0%, 100% { transform: translateY(0) scale(0.8); opacity: 0; } 50% { transform: translateY(-30px) scale(1.2); opacity: 1; } }

        .character-speech { position: absolute; top: -100px; left: 50%; transform: translateX(-50%); background: linear-gradient(135deg, #ffffff 0%, #ffe6f0 100%); padding: 15px 25px; border-radius: 20px; box-shadow: 0 8px 25px rgba(255, 105, 180, 0.3); font-family: 'Jost', sans-serif; font-size: 1rem; font-weight: 600; color: #FF1493; max-width: 250px; white-space: normal; text-align: center; opacity: 0; pointer-events: none; transition: opacity 0.3s ease, transform 0.3s ease; border: 2px solid #FFB6D9; }
        .character-speech.show { opacity: 1; animation: bubblePopIn 0.4s ease-out; }
        .character-speech::after { content: ''; position: absolute; bottom: -12px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 12px solid transparent; border-right: 12px solid transparent; border-top: 15px solid #FFB6D9; }
        @keyframes bubblePopIn { 0% { transform: translateX(-50%) scale(0); opacity: 0; } 70% { transform: translateX(-50%) scale(1.1); } 100% { transform: translateX(-50%) scale(1); opacity: 1; } }

        /* --- HERO BANNER --- */
        .sale-hero {
            padding: 140px 20px 80px;
            background: linear-gradient(180deg, #ffd6e4 0%, #ffe8f0 60%, #ffe8f0 100%);
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        .sale-hero::before { content: ''; position: absolute; top: -50%; left: -20%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 60%); animation: rotateAura 20s linear infinite; z-index: 0; pointer-events: none; }
        @keyframes rotateAura { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

        .sale-tag { font-family: 'Jost', sans-serif; color: #d4af37; font-weight: 700; letter-spacing: 4px; font-size: 1rem; margin-bottom: 15px; display: block; text-transform: uppercase; position: relative; z-index: 1; }
        .sale-title { font-family: 'Cinzel', serif; font-size: clamp(3rem, 8vw, 6.5rem); background: linear-gradient(45deg, #d4af37, #e6a4b4, #d4af37); -webkit-background-clip: text; -webkit-text-fill-color: transparent; line-height: 0.9; margin-bottom: 20px; position: relative; z-index: 1; }
        .sale-subtitle { font-family: 'Pinyon Script', cursive; font-size: clamp(2rem, 5vw, 3.5rem); color: #b76e79; margin-top: -5px; display: block; position: relative; z-index: 1; }

        /* --- COUNTDOWN TIMER --- */
        .timer-container { display: flex; justify-content: center; gap: 20px; margin-top: 40px; position: relative; z-index: 1; }
        .time-box { background: rgba(255, 255, 255, 0.8); padding: 15px 25px; border-radius: 12px; box-shadow: 0 10px 30px rgba(212, 175, 55, 0.15); text-align: center; border: 1px solid rgba(212, 175, 55, 0.2); min-width: 90px; }
        .time-val { font-family: 'Cinzel', serif; font-size: 2rem; color: #d4af37; font-weight: 700; display: block; line-height: 1; }
        .time-label { font-size: 0.7rem; color: #b76e79; letter-spacing: 1px; text-transform: uppercase; margin-top: 5px; }

        /* --- PRODUCT GRID --- */
        .sale-grid-section { padding: 60px 5vw 100px; max-width: 1400px; margin: 0 auto; background: #ffe8f0; }
        .sale-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; }

        .sale-card { background: #fff; border: 1px solid #ffe8f0; border-radius: 16px; padding: 15px; position: relative; transition: 0.4s ease; cursor: pointer; box-shadow: 0 5px 15px rgba(212, 175, 55, 0.05); }
        .sale-card:hover { transform: translateY(-10px); box-shadow: 0 20px 40px rgba(212, 175, 55, 0.15); border-color: #f8c8dc; }
        .discount-badge { position: absolute; top: 10px; left: 10px; background: linear-gradient(135deg, #d4af37, #b76e79); color: #fff; padding: 6px 12px; font-size: 0.8rem; font-weight: 600; border-radius: 20px; z-index: 10; letter-spacing: 1px; box-shadow: 0 4px 10px rgba(183, 110, 121, 0.3); }
        .card-img-container { height: 380px; overflow: hidden; border-radius: 12px; position: relative; }
        .card-img-container img { width: 100%; height: 100%; object-fit: cover; transition: 0.8s; }
        .sale-card:hover img { transform: scale(1.08); }
        .sale-details { padding: 20px 5px 5px; text-align: center; }
        .sale-details h3 { font-family: 'Cinzel', serif; font-size: 1.15rem; margin-bottom: 8px; color: #333; }
        .price-row { display: flex; justify-content: center; align-items: baseline; gap: 12px; }
        .old-price { text-decoration: line-through; color: #aaa; font-size: 0.9rem; font-family: 'Jost', sans-serif; }
        
        /* NEW ATTRACTIVE PRICE */
        .new-price { color: #d4af37; font-weight: 700; font-size: 1.3rem; font-family: 'Cinzel', serif; display: flex; align-items: flex-start; }
        .p-whole { font-size: 1.3rem; }
        .p-decimal { font-size: 0.8rem; margin-top: 2px; opacity: 0.8; }

        /* --- MODAL --- */
        .modal-wrapper { position: fixed; inset: 0; z-index: 1000; background: rgba(255, 240, 245, 0.6); backdrop-filter: blur(8px); display: flex; justify-content: center; align-items: center; opacity: 0; pointer-events: none; transition: 0.4s; }
        .modal-wrapper.active { opacity: 1; pointer-events: auto; }
        .clean-modal-card { width: 900px; height: 550px; background: #fff; display: flex; box-shadow: 0 30px 60px rgba(212, 175, 55, 0.2); position: relative; overflow: hidden; border-radius: 20px; border: 1px solid #ffe8f0; }
        .close-btn-clean { position: absolute; top: 15px; right: 15px; background: #ffe8f0; border: none; width: 35px; height: 35px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #b76e79; z-index: 20; font-size: 1.1rem; transition: 0.3s; }
        .close-btn-clean:hover { background: #b76e79; color: #fff; }
        .clean-modal-left { width: 45%; padding: 20px; display: flex; flex-direction: column; gap: 10px; background: #fdfbf7; }
        .clean-main-img { width: 100%; height: 380px; overflow: hidden; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
        .clean-main-img img, .clean-main-img video { width: 100%; height: 100%; object-fit: cover; }
        .clean-modal-right { width: 55%; padding: 40px; display: flex; flex-direction: column; overflow-y: auto; }
        .clean-title { font-family: 'Cinzel', serif; font-size: 1.8rem; color: #1a1a1a; margin-bottom: 10px; }
        
        .clean-price { font-size: 2rem; color: #d4af37; font-weight: 600; display: flex; align-items: flex-start; font-family: 'Cinzel', serif; }
        
        .clean-actions { margin-top: auto; display: flex; gap: 20px; align-items: stretch; padding-top: 20px; border-top: 1px solid #f9f9f9; }
        .clean-qty { display: flex; align-items: center; justify-content: space-between; border: 1px solid #eee; width: 120px; padding: 0 15px; height: 50px; border-radius: 30px; }
        .add-btn { flex: 1; background: linear-gradient(135deg, #d4af37, #b76e79); color: #fff; border: none; font-size: 0.95rem; font-weight: 600; cursor: pointer; text-transform: uppercase; height: 50px; border-radius: 30px; letter-spacing: 1px; box-shadow: 0 10px 20px rgba(212, 175, 55, 0.2); transition: 0.3s; }
        .add-btn:hover { transform: translateY(-2px); box-shadow: 0 15px 30px rgba(212, 175, 55, 0.3); }
        
        /* Thumbnails for Modal */
        .clean-thumbnails { display: flex; gap: 10px; justify-content: center; }
        .thumb-item { width: 60px; height: 60px; border: 1px solid #ddd; cursor: pointer; opacity: 0.6; transition: 0.3s; border-radius: 8px; overflow: hidden; }
        .thumb-item:hover, .thumb-item.active { opacity: 1; border-color: #d4af37; transform: scale(1.05); }
        .thumb-item img { width: 100%; height: 100%; object-fit: cover; }

        /* ============================================
           FOOTER
           ============================================ */
        .luxury-footer { background: #f2b8cc; color: #111; padding: 80px 8vw 30px; font-family: 'Jost', sans-serif; border-top: 1px solid #e89ab4; width: 100%; }
        .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1.5fr; gap: 40px; margin-bottom: 60px; }
        .footer-brand h2 { font-family: 'Cinzel', serif; font-size: 2.2rem; margin-bottom: 20px; }
        .footer-brand p { color: #222; line-height: 1.6; max-width: 300px; font-size: 0.95rem; }
        .footer-col h3 { font-family: 'Cinzel', serif; font-size: 1.1rem; color: #111; margin-bottom: 25px; letter-spacing: 1px; }
        .footer-links { display: flex; flex-direction: column; gap: 12px; }
        .footer-links a { color: #222; text-decoration: none; transition: all 0.3s ease; font-size: 0.9rem; display: flex; align-items: center; gap: 8px; }
        .footer-links a:hover { color: #7a1535; transform: translateX(5px); }
        .newsletter-text { color: #222; margin-bottom: 20px; font-size: 0.9rem; }
        .subscribe-box { display: flex; margin-bottom: 25px; }
        .subscribe-input { padding: 12px; background: #fde8ef; border: 1px solid #e89ab4; color: #111; flex: 1; outline: none; }
        .subscribe-btn { padding: 12px 20px; background: #7a1535; color: #fff; border: none; cursor: pointer; font-weight: 600; text-transform: uppercase; transition: 0.3s; }
        .subscribe-btn:hover { background: #1a1a1a; }
        .social-icons { display: flex; gap: 15px; }
        .social-icon { width: 35px; height: 35px; border: 1px solid #c47090; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #333; transition: all 0.4s ease; cursor: pointer; background: rgba(255,255,255,0.3); }
        .social-icon:hover { transform: translateY(-3px); color: #fff; border-color: transparent; }
        .social-icon.instagram:hover { background: radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%); }
        .social-icon.facebook:hover { background: #1877F2; }
        .social-icon.whatsapp:hover { background: #25D366; }
        .social-icon.youtube:hover { background: #FF0000; }
        .social-icon.pinterest:hover { background: #E60023; }
        .footer-bottom { border-top: 1px solid #e89ab4; padding-top: 30px; display: flex; justify-content: space-between; align-items: center; color: #333; font-size: 0.8rem; }
        .payment-methods { display: flex; align-items: center; gap: 15px; }
        .payment-icon { width: 38px; height: auto; fill: #555; transition: 0.3s ease; opacity: 0.8; }
        .payment-icon:hover { fill: #7a1535; opacity: 1; transform: translateY(-1px); }

        /* --- RESPONSIVE --- */
        @media (max-width: 1200px) {
            .sale-page { width: 100%; margin-left: 0; }
            .sale-grid { grid-template-columns: 1fr; }
            .sale-hero { padding-top: 120px; }
            .footer-grid { grid-template-columns: 1fr; gap: 40px; }
            .footer-bottom { flex-direction: column; gap: 20px; text-align: center; }
        }
        @media (max-width: 900px) {
            .clean-modal-card { flex-direction: column; width: 95%; height: 90vh; overflow-y: auto; }
            .clean-modal-left, .clean-modal-right { width: 100%; height: auto; }
            .permanent-character { bottom: 15px; right: 15px; }
            .character-container { width: 140px; height: 160px; }
            .character-body { width: 70px; height: 85px; bottom: 35px; }
            .character-head { width: 60px; height: 60px; bottom: 105px; }
            .character-speech { font-size: 0.8rem; padding: 10px 15px; max-width: 180px; top: -80px; }
        }
      `}</style>

      {/* ============================================
          CHARACTER
          ============================================ */}
      <div className="permanent-character" onClick={handleCharacterClick}>
        <div className={`character-container ${isJumping ? 'jumping' : ''}`}>
          <div className={`character-speech ${showMessage ? 'show' : ''}`}>{characterMessage}</div>
          <div className={`character-sparkles ${sparkleEffect ? 'active' : ''}`}>
            <div className="sparkle sparkle-1">✨</div>
            <div className="sparkle sparkle-2">⭐</div>
            <div className="sparkle sparkle-3">💫</div>
            <div className="sparkle sparkle-4">✨</div>
          </div>
          <div className="floating-hearts">
            <div className="heart heart-1">💕</div>
            <div className="heart heart-2">💖</div>
            <div className="heart heart-3">💗</div>
          </div>
          <div className="character-head">
            <div className="character-crown">👑</div>
            <div className="character-eyes">
              <div className={`eye ${characterMood === 'excited' ? 'excited' : ''}`}></div>
              <div className={`eye ${characterMood === 'excited' ? 'excited' : ''}`}></div>
            </div>
            <div className="cheek cheek-left"></div>
            <div className="cheek cheek-right"></div>
            <div className={`character-smile ${characterMood !== 'happy' ? 'big-smile' : ''}`}></div>
          </div>
          <div className="character-arm arm-left"></div>
          <div className="character-arm arm-right"></div>
          <div className={`character-body mood-${characterMood}`}></div>
        </div>
      </div>

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
                const { whole, decimal } = formatPrice(product.price);
                const oldPriceFormatted = product.mrp ? formatPrice(product.mrp).whole : '';

                return (
                    <div key={index} className="sale-card" onClick={() => openModal(product)}>
                        {discount > 0 && <div className="discount-badge">-{discount}%</div>}
                        <div className="card-img-container">
                            <img src={imgSrc} alt={product.name} />
                        </div>
                        <div className="sale-details">
                            <h3>{product.name}</h3>
                            <div className="price-row">
                                {/* Attractive Price Display */}
                                <span className="new-price">
                                    ₹{whole}<span className="p-decimal">.{decimal}</span>
                                </span>
                                {product.mrp && Number(product.mrp) > Number(product.price) && (
                                    <span className="old-price">₹{oldPriceFormatted}</span>
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

      {/* --- MODAL --- */}
      {selectedProduct && (
        <div className={`modal-wrapper ${isAnimating ? 'active' : ''}`} onClick={closeModal}>
          <div className="clean-modal-card" onClick={e => e.stopPropagation()}>
            <button className="close-btn-clean" onClick={closeModal}>✕</button>
            <div className="clean-modal-left">
               <div className="clean-main-img">
                  {isVideo(activeImage) ? <video key={activeImage} src={activeImage} autoPlay muted loop controls /> : <img src={activeImage} alt="Product" />}
               </div>
               {/* Modal Thumbnails added to match Collection feature */}
               <div className="clean-thumbnails">
                  {getAllImages(selectedProduct).map((img, i) => (
                    <div key={i} className={`thumb-item ${activeImage === img ? 'active' : ''}`} onClick={() => setActiveImage(img)}>
                        {isVideo(img) ? <video src={img} muted /> : <img src={img} alt="thumb" />}
                    </div>
                  ))}
               </div>
            </div>
            <div className="clean-modal-right">
               <h1 className="clean-title">{selectedProduct.name}</h1>
               <div className="modal-price-box">
                  <div className="clean-price"><span className="p-currency">₹</span><span className="p-whole">{formatPrice(selectedProduct.price).whole}</span><span className="p-decimal">.{formatPrice(selectedProduct.price).decimal}</span></div>
                  {selectedProduct.mrp && Number(selectedProduct.mrp) > Number(selectedProduct.price) && <span className="mrp-scratch" style={{fontSize:'1rem', marginLeft:'10px'}}>₹{selectedProduct.mrp}</span>}
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