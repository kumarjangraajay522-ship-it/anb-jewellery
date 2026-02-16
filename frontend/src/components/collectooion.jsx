import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import './collectooion.css'; 
import { ShopContext } from '../context/ShopContext'; 
import { assets } from '../assets/assets';

function Collection() {
  const navigate = useNavigate();
  const location = useLocation();
  const { products, search, showSearch, addToCart } = useContext(ShopContext); 

  const [filter, setFilter] = useState('all');
  const [visibleItems, setVisibleItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(null);
  const [characterMessage, setCharacterMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [characterMood, setCharacterMood] = useState('happy');
  const [isJumping, setIsJumping] = useState(false);
  const [sparkleEffect, setSparkleEffect] = useState(false);
  const [bannerAnimation, setBannerAnimation] = useState(0);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  
  const cursorDot = useRef(null);
  const cursorCircle = useRef(null);
  const messageTimeoutRef = useRef(null);

  useEffect(() => {
    const prevBodyBg = document.body.style.backgroundColor;
    const prevHtmlBg = document.documentElement.style.backgroundColor;
    document.body.style.backgroundColor = '#fff5f8';
    document.documentElement.style.backgroundColor = '#fff5f8';
    return () => {
      document.body.style.backgroundColor = prevBodyBg;
      document.documentElement.style.backgroundColor = prevHtmlBg;
    };
  }, []);

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

  useEffect(() => {
    if (location.state && location.state.category) {
        setFilter(location.state.category);
    }
  }, [location.state]);

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

  const handleAddToCart = (productId, qty) => {
    addToCart(productId, qty);
    const randomMessage = addToCartMessages[Math.floor(Math.random() * addToCartMessages.length)];
    showCharacterMessage(randomMessage, 'love');
    closeModal();
  };

  const getMainImage = (item) => {
    if (!item || !item.image) return "https://placehold.co/400x400?text=No+Image";
    if (Array.isArray(item.image)) return item.image[0];
    if (typeof item.image === 'string' && item.image.startsWith('[')) {
        try { return JSON.parse(item.image)[0]; } catch(e) { return item.image; }
    }
    return item.image;
  };

  const getAllImages = (item) => {
    if (!item || !item.image) return [];
    if (Array.isArray(item.image)) return item.image;
    if (typeof item.image === 'string' && item.image.startsWith('[')) {
        try { return JSON.parse(item.image); } catch(e) { return [item.image]; }
    }
    return [item.image];
  };

  const isVideo = (url) => url && (url.toLowerCase().endsWith('.mp4') || url.toLowerCase().endsWith('.webm'));
  
  const formatPrice = (price) => {
    const formatted = Number(price || 0).toFixed(2);
    const [whole, decimal] = formatted.split('.');
    return { whole, decimal };
  };

  useEffect(() => {
    let filtered = products || [];
    if (filter !== 'all') {
      filtered = filtered.filter(item => item.category === filter);
    }
    if (showSearch && search) {
      filtered = filtered.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
    }
    setVisibleItems(filtered);
  }, [filter, products, search, showSearch]);

  const openModal = (product) => {
    setSelectedProduct(product);
    setActiveImage(getMainImage(product));
    setQuantity(1);
    setTimeout(() => setIsAnimating(true), 10);
    const randomHover = hoverMessages[Math.floor(Math.random() * hoverMessages.length)];
    showCharacterMessage(randomHover, 'happy');
  };

  const closeModal = () => { 
    setIsAnimating(false); 
    setTimeout(() => setSelectedProduct(null), 400); 
  };

  useEffect(() => {
    const moveCursor = (e) => {
      if(cursorDot.current) { cursorDot.current.style.left = `${e.clientX}px`; cursorDot.current.style.top = `${e.clientY}px`; }
      if(cursorCircle.current) { setTimeout(() => { if(cursorCircle.current) { cursorCircle.current.style.left = `${e.clientX}px`; cursorCircle.current.style.top = `${e.clientY}px`; } }, 80); }
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  useEffect(() => { 
    setTimeout(() => showCharacterMessage("Welcome Beautiful! Ready to shine? ✨👑", 'happy'), 500); 
  }, []);

  useEffect(() => { 
    const interval = setInterval(() => setBannerAnimation((p) => (p + 1) % 5), 5000); 
    return () => clearInterval(interval); 
  }, []);

  useEffect(() => {
    const bannerInterval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % 6);
    }, 6000); // Changed from 5000ms to 6000ms for better viewing time
    return () => clearInterval(bannerInterval);
  }, []);

  const bannerImages = [
    assets.a_img1,
    assets.a_img2,
    assets.a_img3,
    assets.a_img4,
    assets.a_img5,
    assets.a_img6
  ];

  return (
    <div className={`collection-page ${selectedProduct ? 'blur-bg' : ''}`}>
      <div className="noise-overlay"></div>
      <div className="cursor-dot" ref={cursorDot}></div>
      <div className="cursor-circle" ref={cursorCircle}></div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Jost:wght@300;400;500;600;700&family=Pinyon+Script&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap');
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body, html { overflow-x: hidden; width: 100%; }

        .collection-page { 
          width: 125%; 
          min-height: 100vh; 
          background: linear-gradient(180deg, #fff5f8 0%, #ffe8f0 50%, #ffd5e5 100%); 
          font-family: 'Jost', sans-serif; 
          position: relative; 
          margin-left: -138px; 
        }

        .noise-overlay {
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          opacity: 0.03;
          pointer-events: none;
          z-index: 1;
        }

        .cursor-dot {
          width: 8px;
          height: 8px;
          background: linear-gradient(135deg, #ff69b4, #d4af37);
          border-radius: 50%;
          position: fixed;
          pointer-events: none;
          z-index: 10000;
          transform: translate(-50%, -50%);
          transition: width 0.2s, height 0.2s;
          box-shadow: 0 0 20px rgba(255, 105, 180, 0.6);
        }

        .cursor-circle {
          width: 32px;
          height: 32px;
          border: 2px solid rgba(255, 105, 180, 0.5);
          border-radius: 50%;
          position: fixed;
          pointer-events: none;
          z-index: 10000;
          transform: translate(-50%, -50%);
          transition: width 0.3s, height 0.3s, border-color 0.3s;
        }

        .col-header-banner { 
          width: 100%; 
          padding: 110px 40px 70px; 
          background: linear-gradient(180deg, 
            rgba(255, 245, 248, 1) 0%, 
            rgba(255, 237, 245, 0.97) 25%,
            rgba(255, 225, 237, 0.94) 55%,
            rgba(250, 215, 230, 0.92) 80%,
            rgba(244, 200, 220, 0.9) 100%
          ); 
          display: flex; 
          flex-direction: column; 
          align-items: center; 
          text-align: center; 
          position: relative; 
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(201, 85, 122, 0.08);
        }

        .col-header-banner::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 20% 50%, rgba(255, 105, 180, 0.1) 0%, transparent 50%),
                      radial-gradient(circle at 80% 50%, rgba(212, 175, 55, 0.1) 0%, transparent 50%);
          animation: bgPulse 8s ease-in-out infinite;
        }

        @keyframes bgPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        .banner-content {
          position: relative;
          z-index: 10;
          margin-bottom: 40px;
          animation: fadeInDown 1s ease-out;
        }

        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-40px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .title-reveal { 
          font-family: 'Cinzel', serif; 
          font-size: clamp(2.2rem, 5.5vw, 4rem); 
          color: #2a2a2a; 
          letter-spacing: 0.16em; 
          line-height: 1.3; 
          margin-bottom: 0;
          text-shadow: 
            0 2px 12px rgba(255, 255, 255, 0.85),
            0 4px 20px rgba(255, 182, 217, 0.25);
          font-weight: 600;
        }

        .gold-script { 
          font-family: 'Pinyon Script', cursive; 
          color: #d4af37; 
          font-size: clamp(3.5rem, 7vw, 5.5rem); 
          line-height: 1.1; 
          text-shadow: 
            0 2px 12px rgba(212, 175, 55, 0.5),
            0 0 35px rgba(212, 175, 55, 0.25),
            2px 2px 4px rgba(0, 0, 0, 0.08);
          display: inline-block;
          animation: goldShimmer 4s ease-in-out infinite;
          position: relative;
        }

        .gold-script::before {
          content: attr(data-text);
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, transparent, rgba(255, 255, 255, 0.6), transparent);
          -webkit-background-clip: text;
          background-clip: text;
          animation: shimmerMove 3s infinite;
        }

        @keyframes goldShimmer {
          0%, 100% {
            filter: brightness(1) drop-shadow(0 0 15px rgba(212, 175, 55, 0.4));
          }
          50% {
            filter: brightness(1.3) drop-shadow(0 0 25px rgba(212, 175, 55, 0.6));
          }
        }

        @keyframes shimmerMove {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .banner-carousel-seamless {
          position: relative;
          width: 100%;
          max-width: 1400px;
          height: 750px;
          overflow: hidden;
          margin-top: 0;
          z-index: 5;
          border-radius: 20px;
          box-shadow: 
            0 25px 70px rgba(201, 85, 122, 0.28),
            0 15px 40px rgba(0, 0, 0, 0.15),
            inset 0 0 0 1px rgba(255, 255, 255, 0.65),
            inset 0 2px 3px rgba(255, 255, 255, 0.75);
          border: 3px solid rgba(255, 255, 255, 0.75);
          background: #fff;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .banner-carousel-seamless:hover {
          transform: translateY(-5px) scale(1.005);
          box-shadow: 
            0 30px 80px rgba(201, 85, 122, 0.32),
            0 18px 50px rgba(0, 0, 0, 0.18),
            inset 0 0 0 1px rgba(255, 255, 255, 0.8);
        }

        .banner-carousel-seamless::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 70px;
          background: linear-gradient(to bottom, 
            rgba(255, 255, 255, 0.5) 0%,
            rgba(255, 255, 255, 0.2) 45%,
            transparent 100%);
          z-index: 4;
          pointer-events: none;
        }

        .banner-carousel-seamless::after {
          content: '';
          position: absolute;
          inset: -3px;
          background: linear-gradient(135deg, 
            rgba(212, 175, 55, 0.25), 
            rgba(255, 105, 180, 0.25),
            rgba(138, 79, 255, 0.25),
            rgba(212, 175, 55, 0.25));
          border-radius: 20px;
          z-index: -1;
          opacity: 0.5;
          filter: blur(22px);
          animation: glowPulseCarousel 6s ease-in-out infinite;
        }

        @keyframes glowPulseCarousel {
          0%, 100% { 
            opacity: 0.45; 
            transform: scale(0.98); 
            filter: blur(22px) hue-rotate(0deg);
          }
          50% { 
            opacity: 0.7; 
            transform: scale(1.02); 
            filter: blur(26px) hue-rotate(10deg);
          }
        }

        .banner-slide-seamless {
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity 2.2s cubic-bezier(0.4, 0, 0.2, 1);
          will-change: opacity, transform;
        }

        .banner-slide-seamless.active {
          opacity: 1;
          z-index: 1;
          animation: kenBurnsEnhanced 28s ease-in-out infinite;
        }

        @keyframes kenBurnsEnhanced {
          0% { 
            transform: scale(1) translate(0, 0); 
            filter: brightness(1.05) contrast(1.08) saturate(1.12);
          }
          50% { 
            transform: scale(1.1) translate(-1.5%, -0.8%); 
            filter: brightness(1.08) contrast(1.1) saturate(1.15);
          }
          100% { 
            transform: scale(1) translate(0, 0); 
            filter: brightness(1.05) contrast(1.08) saturate(1.12);
          }
        }

        .banner-slide-seamless img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(1.08) contrast(1.1) saturate(1.15);
        }

        .banner-slide-seamless::before {
          content: '';
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(ellipse at center, transparent 35%, rgba(0, 0, 0, 0.06) 100%),
            linear-gradient(to bottom, rgba(255, 245, 248, 0.08) 0%, transparent 12%),
            linear-gradient(to top, rgba(244, 194, 215, 0.12) 0%, transparent 12%);
          pointer-events: none;
          z-index: 2;
        }

        .banner-slide-seamless::after {
          content: '';
          position: absolute;
          inset: 0;
          background: 
            linear-gradient(to right, rgba(255, 255, 255, 0.05) 0%, transparent 6%),
            linear-gradient(to left, rgba(255, 255, 255, 0.05) 0%, transparent 6%);
          pointer-events: none;
          z-index: 2;
        }

        .banner-indicators-seamless {
          position: absolute;
          bottom: 28px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 12px;
          z-index: 10;
          background: rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(15px) saturate(160%);
          padding: 12px 20px;
          border-radius: 50px;
          box-shadow: 
            0 8px 25px rgba(0, 0, 0, 0.15),
            inset 0 1px 3px rgba(255, 255, 255, 0.6);
          border: 1.5px solid rgba(255, 255, 255, 0.45);
        }

        .indicator-seamless {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.6);
          border: 1.5px solid rgba(255, 255, 255, 0.9);
          cursor: pointer;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        }

        .indicator-seamless::before {
          content: '';
          position: absolute;
          inset: -3px;
          border-radius: 50%;
          background: transparent;
          transition: all 0.3s ease;
        }

        .indicator-seamless::after {
          content: '';
          position: absolute;
          inset: -5px;
          border-radius: 50%;
          background: transparent;
          transition: all 0.3s ease;
        }

        .indicator-seamless.active {
          width: 40px;
          border-radius: 6px;
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 1) 0%, 
            rgba(255, 182, 217, 0.98) 50%,
            rgba(212, 175, 55, 0.95) 100%);
          box-shadow: 
            0 4px 16px rgba(255, 105, 180, 0.5),
            0 2px 8px rgba(212, 175, 55, 0.3),
            inset 0 1px 3px rgba(255, 255, 255, 0.9);
          transform: scale(1.08);
        }

        .indicator-seamless:hover:not(.active) {
          background: rgba(255, 255, 255, 0.85);
          transform: scale(1.35);
          box-shadow: 0 4px 12px rgba(255, 105, 180, 0.35);
        }

        .indicator-seamless:hover:not(.active)::before {
          background: rgba(255, 182, 217, 0.2);
          transform: scale(1.4);
        }

        .indicator-seamless:hover:not(.active)::after {
          background: rgba(255, 182, 217, 0.12);
          transform: scale(1.9);
        }

        .banner-particle {
          position: absolute;
          width: 5px;
          height: 5px;
          background: radial-gradient(circle, 
            rgba(255, 255, 255, 0.95) 0%, 
            rgba(255, 215, 0, 0.8) 60%,
            transparent 100%);
          border-radius: 50%;
          pointer-events: none;
          z-index: 3;
          box-shadow: 
            0 0 12px rgba(255, 255, 255, 0.8),
            0 0 20px rgba(255, 215, 0, 0.4);
          animation-timing-function: ease-in-out;
        }

        .bp-1 { top: 18%; left: 15%; animation: floatParticleLux 11s ease-in-out infinite; }
        .bp-2 { top: 28%; right: 20%; animation: floatParticleLux 13s ease-in-out infinite 3s; }
        .bp-3 { bottom: 30%; left: 18%; animation: floatParticleLux 12s ease-in-out infinite 5s; }
        .bp-4 { bottom: 35%; right: 22%; animation: floatParticleLux 14s ease-in-out infinite 2s; }
        .bp-5 { top: 50%; left: 12%; animation: floatParticleLux 10s ease-in-out infinite 4s; }
        .bp-6 { top: 60%; right: 16%; animation: floatParticleLux 12.5s ease-in-out infinite 6s; }

        @keyframes floatParticleLux {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.3;
          }
          25% {
            transform: translate(15px, -35px) scale(1.4);
            opacity: 0.85;
          }
          50% {
            transform: translate(5px, -60px) scale(1.8);
            opacity: 1;
          }
          75% {
            transform: translate(-12px, -40px) scale(1.5);
            opacity: 0.8;
          }
        }

        .vfx-container { position: absolute; inset: 0; pointer-events: none; overflow: hidden; z-index: 2; }
        
        .diamond-particle { 
          position: absolute; 
          width: 0; 
          height: 0; 
          border-left: 28px solid transparent; 
          border-right: 28px solid transparent; 
          border-bottom: 48px solid #FFD700; 
          filter: drop-shadow(0 0 25px rgba(255, 215, 0, 0.9)); 
          animation: luxuryFloat 14s ease-in-out infinite; 
          opacity: 0; 
        }
        
        .diamond-particle::after { 
          content: ''; 
          position: absolute; 
          top: 48px; 
          left: -28px; 
          width: 0; 
          height: 0; 
          border-left: 28px solid transparent; 
          border-right: 28px solid transparent; 
          border-top: 24px solid #FFD700; 
        }
        
        .dp-1 { top: 10%; left: 5%; animation-delay: 0s; }
        .dp-2 { top: 20%; right: 8%; animation-delay: 3s; }
        .dp-3 { bottom: 15%; left: 12%; animation-delay: 6s; }
        .dp-4 { top: 45%; right: 6%; animation-delay: 9s; }
        .dp-5 { bottom: 30%; right: 15%; animation-delay: 12s; }
        
        @keyframes luxuryFloat { 
          0%, 100% { transform: translateY(0) rotate(0deg) scale(0); opacity: 0; } 
          15% { opacity: 1; transform: translateY(-25px) rotate(60deg) scale(1); } 
          50% { transform: translateY(-50px) rotate(200deg) scale(1.4); opacity: 1; filter: drop-shadow(0 0 40px rgba(255, 215, 0, 1)); } 
          85% { opacity: 1; } 
        }
        
        .aurora-wave { 
          position: absolute; 
          width: 130%; 
          height: 500px; 
          background: linear-gradient(90deg, 
            transparent 0%, 
            rgba(255, 182, 217, 0.5) 20%, 
            rgba(138, 79, 255, 0.5) 40%, 
            rgba(255, 215, 0, 0.5) 60%, 
            rgba(255, 105, 180, 0.5) 80%, 
            transparent 100%
          ); 
          filter: blur(60px); 
          animation: auroraFlow 18s ease-in-out infinite; 
          opacity: 0.4; 
        }
        
        .aw-1 { top: 0%; animation-delay: 0s; }
        .aw-2 { top: 30%; animation-delay: 6s; transform: scaleY(-1); }
        .aw-3 { bottom: 0%; animation-delay: 12s; }
        
        @keyframes auroraFlow { 
          0%, 100% { transform: translateX(-35%) skewX(-12deg); opacity: 0.3; } 
          50% { transform: translateX(35%) skewX(12deg); opacity: 0.75; } 
        }
        
        .glow-orb { 
          position: absolute; 
          width: 18px; 
          height: 18px; 
          border-radius: 50%; 
          background: radial-gradient(circle, #FFF 0%, rgba(255, 182, 217, 0.9) 40%, transparent 70%); 
          animation: orbRise 12s linear infinite; 
          box-shadow: 0 0 35px rgba(255, 182, 217, 1); 
          opacity: 0; 
        }
        
        .go-1 { bottom: -10%; left: 10%; animation-delay: 0s; }
        .go-2 { bottom: -10%; left: 25%; animation-delay: 2s; }
        .go-3 { bottom: -10%; left: 40%; animation-delay: 1s; }
        .go-4 { bottom: -10%; left: 55%; animation-delay: 3s; }
        .go-5 { bottom: -10%; left: 70%; animation-delay: 1.5s; }
        .go-6 { bottom: -10%; left: 85%; animation-delay: 2.5s; }
        
        @keyframes orbRise { 
          0% { bottom: -10%; opacity: 0; transform: scale(0.5); } 
          18% { opacity: 1; transform: scale(1.3); } 
          82% { opacity: 1; } 
          100% { bottom: 115%; opacity: 0; transform: scale(0.9) translateX(50px); } 
        }
        
        .crystal { 
          position: absolute; 
          width: 110px; 
          height: 150px; 
          background: linear-gradient(145deg, 
            rgba(255, 255, 255, 0.95) 0%, 
            rgba(255, 182, 217, 0.8) 30%, 
            rgba(138, 79, 255, 0.7) 70%, 
            rgba(255, 105, 180, 0.6) 100%
          ); 
          clip-path: polygon(50% 0%, 100% 100%, 0% 100%); 
          animation: crystalEmerge 14s ease-in-out infinite; 
          filter: drop-shadow(0 0 35px rgba(255, 182, 217, 0.8)); 
          opacity: 0; 
        }
        
        .cr-1 { top: 12%; left: 8%; animation-delay: 0s; }
        .cr-2 { top: 35%; right: 10%; animation-delay: 3.5s; transform: rotate(180deg); }
        .cr-3 { bottom: 20%; left: 15%; animation-delay: 7s; transform: rotate(90deg); }
        .cr-4 { bottom: 35%; right: 12%; animation-delay: 10.5s; transform: rotate(-90deg); }
        
        @keyframes crystalEmerge { 
          0%, 100% { transform: translateY(60px) rotate(0deg) scale(0); opacity: 0; } 
          22% { opacity: 0.95; transform: translateY(0) rotate(0deg) scale(1); } 
          50% { transform: translateY(-20px) rotate(12deg) scale(1.15); opacity: 1; } 
          78% { opacity: 0.95; transform: translateY(0) rotate(0deg) scale(1); } 
        }
        
        .geo-hexagon { 
          position: absolute; 
          width: 130px; 
          height: 150px; 
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.25) 0%, rgba(255, 105, 180, 0.25) 100%); 
          clip-path: polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%); 
          border: 2.5px solid rgba(255, 255, 255, 0.5); 
          backdrop-filter: blur(8px); 
          animation: hexFloat 20s ease-in-out infinite; 
          opacity: 0; 
        }
        
        .hex-1 { top: 15%; left: 10%; animation-delay: 0s; }
        .hex-2 { top: 40%; right: 12%; animation-delay: 5s; }
        .hex-3 { bottom: 25%; left: 18%; animation-delay: 10s; }
        .hex-4 { bottom: 45%; right: 15%; animation-delay: 15s; }
        
        @keyframes hexFloat { 
          0%, 100% { transform: translateY(0) rotate(0deg) scale(0); opacity: 0; } 
          20% { opacity: 0.8; transform: translateY(-35px) rotate(120deg) scale(1); } 
          50% { transform: translateY(-60px) rotate(240deg) scale(1.25); } 
          80% { opacity: 0.8; transform: translateY(-35px) rotate(360deg) scale(1); } 
        }
        
        .light-beam { 
          position: absolute; 
          width: 5px; 
          height: 100%; 
          background: linear-gradient(to bottom, 
            transparent 0%, 
            rgba(255, 255, 255, 0.6) 20%, 
            rgba(255, 215, 0, 0.7) 50%, 
            rgba(255, 255, 255, 0.6) 80%, 
            transparent 100%
          ); 
          animation: beamSweep 12s ease-in-out infinite; 
          box-shadow: 0 0 25px rgba(255, 215, 0, 0.9); 
          opacity: 0; 
        }
        
        .lb-1 { left: 12%; animation-delay: 0s; }
        .lb-2 { left: 28%; animation-delay: 2.4s; }
        .lb-3 { left: 44%; animation-delay: 4.8s; }
        .lb-4 { left: 60%; animation-delay: 7.2s; }
        .lb-5 { left: 76%; animation-delay: 9.6s; }
        
        @keyframes beamSweep { 
          0%, 100% { opacity: 0; transform: translateY(-100%) scaleY(0.5); } 
          50% { opacity: 1; transform: translateY(0%) scaleY(1); } 
        }
        
        .magic-circle { 
          position: absolute; 
          width: 280px; 
          height: 280px; 
          border: 5px solid transparent; 
          border-radius: 50%; 
          background: linear-gradient(white, white) padding-box, 
                      linear-gradient(45deg, #FFD700, #FF69B4, #8A4FFF, #FFD700) border-box; 
          animation: circleSpin 18s linear infinite; 
          opacity: 0; 
        }
        
        .mc-inner { 
          position: absolute; 
          inset: 25px; 
          border: 2.5px solid rgba(255, 255, 255, 0.4); 
          border-radius: 50%; 
          animation: circleSpin 12s linear infinite reverse; 
        }
        
        .mc-1 { top: 10%; left: 10%; animation-delay: 0s; }
        .mc-2 { top: 40%; right: 8%; animation-delay: 4.5s; }
        .mc-3 { bottom: 15%; left: 15%; animation-delay: 9s; }
        .mc-4 { bottom: 40%; right: 12%; animation-delay: 13.5s; }
        
        @keyframes circleSpin { 
          0% { transform: rotate(0deg) scale(0); opacity: 0; } 
          25% { opacity: 0.85; transform: rotate(90deg) scale(1); } 
          75% { opacity: 0.85; transform: rotate(270deg) scale(1); } 
          100% { transform: rotate(360deg) scale(0); opacity: 0; } 
        }
        
        .energy-particle { 
          position: absolute; 
          width: 7px; 
          height: 7px; 
          background: #FFF; 
          border-radius: 50%; 
          box-shadow: 0 0 18px 4px rgba(255, 215, 0, 1); 
        }
        
        .energy-center { 
          position: absolute; 
          top: 50%; 
          left: 50%; 
          width: 60px; 
          height: 60px; 
          transform: translate(-50%, -50%); 
        }
        
        .ep-1 { animation: burst 5s ease-out infinite; animation-delay: 0s; }
        .ep-2 { animation: burst 5s ease-out infinite; animation-delay: 0.25s; }
        .ep-3 { animation: burst 5s ease-out infinite; animation-delay: 0.5s; }
        .ep-4 { animation: burst 5s ease-out infinite; animation-delay: 0.75s; }
        .ep-5 { animation: burst 5s ease-out infinite; animation-delay: 1s; }
        .ep-6 { animation: burst 5s ease-out infinite; animation-delay: 1.25s; }
        .ep-7 { animation: burst 5s ease-out infinite; animation-delay: 1.5s; }
        .ep-8 { animation: burst 5s ease-out infinite; animation-delay: 1.75s; }
        
        @keyframes burst { 
          0% { transform: translate(0, 0) scale(0); opacity: 0; } 
          12% { opacity: 1; } 
          100% { transform: translate(var(--tx), var(--ty)) scale(2.2); opacity: 0; } 
        }
        
        .glow-overlay { 
          position: absolute; 
          inset: 0; 
          background: radial-gradient(circle at 30% 40%, rgba(255, 215, 0, 0.18) 0%, transparent 50%), 
                      radial-gradient(circle at 70% 60%, rgba(255, 105, 180, 0.18) 0%, transparent 50%); 
          animation: glowPulse 10s ease-in-out infinite; 
        }
        
        @keyframes glowPulse { 
          0%, 100% { opacity: 0.6; } 
          50% { opacity: 1; } 
        }
        
        .vfx-container > * { display: none; }
        .vfx-container.vfx-0 .diamond-particle, .vfx-container.vfx-0 .glow-overlay { display: block; }
        .vfx-container.vfx-1 .aurora-wave, .vfx-container.vfx-1 .glow-orb { display: block; }
        .vfx-container.vfx-2 .crystal, .vfx-container.vfx-2 .geo-hexagon, .vfx-container.vfx-2 .glow-overlay { display: block; }
        .vfx-container.vfx-3 .light-beam, .vfx-container.vfx-3 .magic-circle { display: block; }
        .vfx-container.vfx-4 .energy-particle, .vfx-container.vfx-4 .diamond-particle, .vfx-container.vfx-4 .glow-overlay { display: block; }
        
        .permanent-character { 
          position: fixed; 
          bottom: 35px; 
          right: 35px; 
          z-index: 9998; 
          cursor: pointer; 
          transition: transform 0.4s ease, filter 0.3s ease; 
        }
        
        .permanent-character:hover { 
          transform: scale(1.08); 
          filter: drop-shadow(0 10px 25px rgba(255, 105, 180, 0.4));
        }
        
        .character-container { 
          position: relative; 
          width: 220px; 
          height: 250px; 
          animation: gentleFloat 4s ease-in-out infinite; 
        }
        
        .character-container.jumping { 
          animation: excitedJump 0.7s ease-out; 
        }
        
        @keyframes gentleFloat { 
          0%, 100% { transform: translateY(0px) rotate(0deg); } 
          50% { transform: translateY(-18px) rotate(3deg); } 
        }
        
        @keyframes excitedJump { 
          0% { transform: translateY(0) scale(1); } 
          35% { transform: translateY(-45px) scale(1.12) rotate(-6deg); } 
          50% { transform: translateY(-55px) scale(1.18) rotate(6deg); } 
          70% { transform: translateY(-35px) scale(1.12) rotate(-4deg); } 
          100% { transform: translateY(0) scale(1) rotate(0deg); } 
        }
        
        .character-body { 
          position: absolute; 
          bottom: 55px; 
          left: 50%; 
          transform: translateX(-50%); 
          width: 110px; 
          height: 130px; 
          background: linear-gradient(135deg, #FF6EC7 0%, #B06AB3 50%, #8A4FFF 100%); 
          border-radius: 55px 55px 65px 65px; 
          box-shadow: 
            0 18px 45px rgba(180, 106, 179, 0.6), 
            inset 0 -18px 35px rgba(255, 255, 255, 0.25), 
            inset 0 18px 35px rgba(138, 79, 255, 0.35); 
          animation: bodyPulse 2.5s ease-in-out infinite; 
        }
        
        @keyframes bodyPulse { 
          0%, 100% { transform: translateX(-50%) scale(1); } 
          50% { transform: translateX(-50%) scale(1.03); } 
        }
        
        .character-body.mood-excited { 
          background: linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF1493 100%); 
          box-shadow: 
            0 18px 45px rgba(255, 215, 0, 0.6), 
            inset 0 -18px 35px rgba(255, 255, 255, 0.25), 
            inset 0 18px 35px rgba(255, 69, 180, 0.35);
        }
        
        .character-body.mood-love { 
          background: linear-gradient(135deg, #FF69B4 0%, #FF1493 50%, #C71585 100%); 
          box-shadow: 
            0 18px 45px rgba(255, 20, 147, 0.6), 
            inset 0 -18px 35px rgba(255, 255, 255, 0.25), 
            inset 0 18px 35px rgba(199, 21, 133, 0.35);
        }
        
        .character-head { 
          position: absolute; 
          bottom: 158px; 
          left: 50%; 
          transform: translateX(-50%); 
          width: 88px; 
          height: 88px; 
          background: linear-gradient(135deg, #FFE4F0 0%, #FFB6D9 100%); 
          border-radius: 50%; 
          box-shadow: 
            0 12px 35px rgba(255, 182, 217, 0.7), 
            inset 0 -12px 25px rgba(255, 255, 255, 0.6); 
          animation: headTilt 2.5s ease-in-out infinite; 
        }
        
        @keyframes headTilt { 
          0%, 100% { transform: translateX(-50%) rotate(-3deg); } 
          50% { transform: translateX(-50%) rotate(3deg); } 
        }
        
        .character-eyes { 
          position: absolute; 
          top: 32px; 
          left: 50%; 
          transform: translateX(-50%); 
          width: 54px; 
          display: flex; 
          justify-content: space-between; 
        }
        
        .eye { 
          width: 16px; 
          height: 20px; 
          background: #333; 
          border-radius: 50% 50% 50% 50%; 
          position: relative; 
          animation: naturalBlink 5s infinite; 
        }
        
        .eye::after { 
          content: ''; 
          position: absolute; 
          top: 5px; 
          left: 5px; 
          width: 7px; 
          height: 7px; 
          background: white; 
          border-radius: 50%; 
          animation: eyeShine 2.5s ease-in-out infinite; 
        }
        
        @keyframes naturalBlink { 
          0%, 92%, 100% { height: 20px; } 
          94% { height: 2px; } 
        }
        
        @keyframes eyeShine { 
          0%, 100% { opacity: 1; } 
          50% { opacity: 0.75; } 
        }
        
        .eye.excited { 
          animation: excitedBlink 0.6s ease-in-out 3; 
        }
        
        @keyframes excitedBlink { 
          0%, 100% { transform: scale(1); } 
          50% { transform: scale(1.35); } 
        }
        
        .character-smile { 
          position: absolute; 
          top: 54px; 
          left: 50%; 
          transform: translateX(-50%); 
          width: 32px; 
          height: 16px; 
          border: 3px solid #FF1493; 
          border-top: none; 
          border-radius: 0 0 32px 32px; 
        }
        
        .character-smile.big-smile { 
          width: 38px; 
          height: 20px; 
          animation: smilePulse 0.6s ease-in-out 2; 
        }
        
        @keyframes smilePulse { 
          0%, 100% { transform: translateX(-50%) scale(1); } 
          50% { transform: translateX(-50%) scale(1.25); } 
        }
        
        .cheek { 
          position: absolute; 
          top: 43px; 
          width: 15px; 
          height: 13px; 
          background: rgba(255, 105, 180, 0.5); 
          border-radius: 50%; 
          animation: blush 2.5s ease-in-out infinite; 
        }
        
        .cheek-left { left: 11px; }
        .cheek-right { right: 11px; }
        
        @keyframes blush { 
          0%, 100% { opacity: 0.5; } 
          50% { opacity: 0.8; } 
        }
        
        .character-arm { 
          position: absolute; 
          width: 44px; 
          height: 44px; 
          background: linear-gradient(135deg, #FF6EC7 0%, #B06AB3 100%); 
          border-radius: 50%; 
          box-shadow: 0 6px 18px rgba(180, 106, 179, 0.5); 
        }
        
        .arm-left { 
          bottom: 98px; 
          left: 22px; 
          animation: waveLeftContinuous 2.5s ease-in-out infinite; 
        }
        
        .arm-right { 
          bottom: 98px; 
          right: 22px; 
          animation: waveRightContinuous 2.5s ease-in-out infinite; 
        }
        
        @keyframes waveLeftContinuous { 
          0%, 100% { transform: rotate(-18deg); } 
          50% { transform: rotate(-38deg); } 
        }
        
        @keyframes waveRightContinuous { 
          0%, 100% { transform: rotate(18deg); } 
          50% { transform: rotate(38deg); } 
        }
        
        .character-crown { 
          position: absolute; 
          top: -18px; 
          left: 50%; 
          transform: translateX(-50%); 
          font-size: 1.7rem; 
          animation: crownShine 2.5s ease-in-out infinite; 
        }
        
        @keyframes crownShine { 
          0%, 100% { transform: translateX(-50%) rotate(-6deg) scale(1); opacity: 1; } 
          50% { transform: translateX(-50%) rotate(6deg) scale(1.12); opacity: 0.92; } 
        }
        
        .character-sparkles { 
          position: absolute; 
          width: 100%; 
          height: 100%; 
          pointer-events: none; 
        }
        
        .sparkle { 
          position: absolute; 
          font-size: 1.3rem; 
          animation: sparkleOrbit 3.5s ease-in-out infinite; 
          opacity: 0; 
        }
        
        .sparkle-1 { top: 10%; left: 10%; animation-delay: 0s; }
        .sparkle-2 { top: 20%; right: 5%; animation-delay: 0.6s; }
        .sparkle-3 { bottom: 30%; left: 5%; animation-delay: 1.2s; }
        .sparkle-4 { bottom: 20%; right: 10%; animation-delay: 1.8s; }
        
        @keyframes sparkleOrbit { 
          0%, 100% { transform: scale(0) rotate(0deg); opacity: 0; } 
          50% { transform: scale(1.6) rotate(200deg); opacity: 1; } 
        }
        
        .character-sparkles.active .sparkle { 
          animation: sparkleExplosion 1.2s ease-out; 
        }
        
        @keyframes sparkleExplosion { 
          0% { transform: scale(0); opacity: 0; } 
          50% { transform: scale(2); opacity: 1; } 
          100% { transform: scale(0); opacity: 0; } 
        }
        
        .floating-hearts { 
          position: absolute; 
          width: 100%; 
          height: 100%; 
          pointer-events: none; 
        }
        
        .heart { 
          position: absolute; 
          font-size: 1.1rem; 
          animation: heartFloat 3.5s ease-in-out infinite; 
        }
        
        .heart-1 { top: 20%; left: -25px; animation-delay: 0s; }
        .heart-2 { top: 50%; right: -25px; animation-delay: 1.2s; }
        .heart-3 { bottom: 30%; left: -20px; animation-delay: 2.4s; }
        
        @keyframes heartFloat { 
          0%, 100% { transform: translateY(0) scale(0.9); opacity: 0; } 
          50% { transform: translateY(-35px) scale(1.3); opacity: 1; } 
        }
        
        .character-speech { 
          position: absolute; 
          top: -110px; 
          left: 50%; 
          transform: translateX(-50%); 
          background: linear-gradient(135deg, #ffffff 0%, #ffe6f0 100%); 
          padding: 18px 28px; 
          border-radius: 22px; 
          box-shadow: 
            0 10px 30px rgba(255, 105, 180, 0.35),
            0 5px 15px rgba(0, 0, 0, 0.1); 
          font-family: 'Jost', sans-serif; 
          font-size: 1.05rem; 
          font-weight: 600; 
          color: #FF1493; 
          max-width: 280px; 
          white-space: normal; 
          text-align: center; 
          opacity: 0; 
          pointer-events: none; 
          transition: opacity 0.4s ease, transform 0.4s ease; 
          border: 2.5px solid #FFB6D9; 
        }
        
        .character-speech.show { 
          opacity: 1; 
          animation: bubblePopIn 0.5s ease-out; 
        }
        
        .character-speech::after { 
          content: ''; 
          position: absolute; 
          bottom: -14px; 
          left: 50%; 
          transform: translateX(-50%); 
          width: 0; 
          height: 0; 
          border-left: 14px solid transparent; 
          border-right: 14px solid transparent; 
          border-top: 16px solid #FFB6D9; 
        }
        
        @keyframes bubblePopIn { 
          0% { transform: translateX(-50%) scale(0); opacity: 0; } 
          70% { transform: translateX(-50%) scale(1.12); } 
          100% { transform: translateX(-50%) scale(1); opacity: 1; } 
        }

        .aesthetic-grid { 
          display: grid; 
          grid-template-columns: repeat(3, 1fr); 
          gap: 40px; 
          max-width: 1500px; 
          margin: 0 auto; 
          padding: 80px 50px 120px; 
          background: transparent;
        }

        .glass-card { 
          background: rgba(255, 255, 255, 0.85); 
          border: 1.5px solid rgba(255, 200, 220, 0.7); 
          border-radius: 24px; 
          padding: 18px; 
          cursor: pointer; 
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1); 
          position: relative;
          overflow: hidden;
        }

        .glass-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, transparent 50%);
          opacity: 0;
          transition: opacity 0.5s ease;
        }

        .glass-card:hover::before {
          opacity: 1;
        }
        
        .glass-card:hover { 
          transform: translateY(-12px); 
          background: rgba(255, 255, 255, 0.98); 
          box-shadow: 
            0 25px 50px rgba(201, 85, 122, 0.18),
            0 15px 30px rgba(0, 0, 0, 0.1); 
          border-color: rgba(255, 105, 180, 0.5);
        }
        
        .card-img-container { 
          height: 380px; 
          border-radius: 18px; 
          overflow: hidden; 
          position: relative;
          background: linear-gradient(135deg, #f8f8f8 0%, #ffffff 100%);
        }
        
        .card-img-container img { 
          width: 100%; 
          height: 100%; 
          object-fit: cover; 
          transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1); 
        }
        
        .glass-card:hover img { 
          transform: scale(1.12); 
        }
        
        .card-overlay { 
          position: absolute; 
          inset: 0; 
          background: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.15) 100%); 
          display: flex; 
          justify-content: center; 
          align-items: center; 
          opacity: 0; 
          transition: opacity 0.4s ease; 
        }
        
        .view-btn { 
          background: linear-gradient(135deg, #ffffff 0%, #fff5f8 100%); 
          color: #c9557a;
          padding: 14px 35px; 
          border-radius: 35px; 
          font-family: 'Cinzel', serif; 
          font-size: 0.85rem; 
          letter-spacing: 1.5px; 
          font-weight: 600;
          transform: translateY(25px); 
          transition: all 0.4s ease; 
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
          border: 1.5px solid rgba(255, 105, 180, 0.3);
        }
        
        .glass-card:hover .card-overlay { 
          opacity: 1; 
        }
        
        .glass-card:hover .view-btn { 
          transform: translateY(0); 
        }

        .view-btn:hover {
          background: linear-gradient(135deg, #ff69b4 0%, #d4af37 100%);
          color: #ffffff;
          transform: scale(1.05);
        }
        
        .card-details { 
          padding: 25px 8px 8px; 
        }
        
        .card-details h3 { 
          font-family: 'Cinzel', serif; 
          font-size: 1.2rem; 
          margin-bottom: 8px; 
          color: #2a2a2a; 
          font-weight: 600;
          letter-spacing: 0.5px;
        }
        
        .premium-price { 
          display: flex; 
          align-items: baseline; 
          gap: 10px; 
          font-family: 'Jost', sans-serif; 
        }
        
        .price-main { 
          color: #1a1a1a; 
          font-weight: 700; 
          display: flex; 
          align-items: flex-start; 
        }
        
        .p-currency { 
          font-size: 0.65em; 
          margin-top: 5px; 
        }
        
        .p-whole { 
          font-size: 1.4em; 
        }
        
        .p-decimal { 
          font-size: 0.75em; 
          margin-top: 5px; 
        }
        
        .mrp-scratch { 
          font-size: 0.95rem; 
          color: #aaa; 
          text-decoration: line-through; 
        }

        .modal-wrapper { 
          position: fixed; 
          inset: 0; 
          z-index: 1000; 
          background: rgba(255, 200, 220, 0.4); 
          backdrop-filter: blur(8px); 
          display: flex; 
          justify-content: center; 
          align-items: center; 
          opacity: 0; 
          pointer-events: none; 
          transition: opacity 0.5s ease; 
        }
        
        .modal-wrapper.active { 
          opacity: 1; 
          pointer-events: auto; 
        }
        
        .clean-modal-card { 
          width: 950px; 
          height: 580px; 
          background: #fff; 
          display: flex; 
          box-shadow: 0 25px 60px rgba(201, 85, 122, 0.2); 
          position: relative; 
          overflow: hidden; 
          border-radius: 24px;
          border: 2px solid rgba(255, 182, 217, 0.3);
        }
        
        .close-btn-clean { 
          position: absolute; 
          top: 18px; 
          right: 18px; 
          background: linear-gradient(135deg, #ffe8f0 0%, #ffd5e5 100%); 
          border: 1.5px solid rgba(255, 105, 180, 0.3); 
          width: 35px; 
          height: 35px; 
          border-radius: 50%; 
          cursor: pointer; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          color: #c9557a; 
          z-index: 20; 
          font-size: 1.2rem;
          font-weight: bold;
          transition: all 0.3s ease;
        }

        .close-btn-clean:hover {
          background: linear-gradient(135deg, #ff69b4 0%, #d4af37 100%);
          color: #fff;
          transform: rotate(90deg);
        }
        
        .clean-modal-left { 
          width: 45%; 
          padding: 25px; 
          display: flex; 
          flex-direction: column; 
          gap: 12px; 
          background: #fffbfc; 
        }
        
        .clean-main-img { 
          width: 100%; 
          height: 420px; 
          overflow: hidden; 
          border: 2px solid #f8d7e3; 
          border-radius: 16px;
          display: flex; 
          align-items: center; 
          justify-content: center;
        }
        
        .clean-main-img img, .clean-main-img video { 
          width: 100%; 
          height: 100%; 
          object-fit: cover; 
        }
        
        .clean-thumbnails { 
          display: flex; 
          gap: 12px; 
          overflow-x: auto; 
          padding-bottom: 8px; 
        }
        
        .thumb-item { 
          min-width: 70px; 
          height: 70px; 
          position: relative; 
          cursor: pointer; 
          border: 2px solid #f0d0dc; 
          border-radius: 10px;
          opacity: 0.7; 
          transition: all 0.4s ease; 
        }
        
        .thumb-item.active { 
          border-color: #c9557a; 
          opacity: 1; 
          box-shadow: 0 4px 12px rgba(201, 85, 122, 0.3);
        }

        .thumb-item:hover {
          opacity: 1;
          transform: scale(1.05);
        }
        
        .thumb-item img, .thumb-item video { 
          width: 100%; 
          height: 100%; 
          object-fit: cover;
          border-radius: 8px;
        }
        
        .v-badge { 
          position: absolute; 
          inset: 0; 
          background: rgba(0, 0, 0, 0.15); 
          color: white; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          font-size: 0.9rem; 
        }
        
        .clean-modal-right { 
          width: 55%; 
          padding: 45px; 
          display: flex; 
          flex-direction: column; 
          overflow-y: auto; 
        }
        
        .clean-tags { 
          display: flex; 
          gap: 12px; 
          margin-bottom: 18px; 
        }
        
        .tag-green { 
          background: linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%); 
          color: #00695c; 
          font-size: 0.75rem; 
          font-weight: 800; 
          padding: 6px 14px; 
          border-radius: 6px; 
          letter-spacing: 0.5px;
        }
        
        .tag-yellow { 
          background: linear-gradient(135deg, #fffde7 0%, #fff9c4 100%); 
          color: #f57f17; 
          font-size: 0.75rem; 
          font-weight: 800; 
          padding: 6px 14px; 
          border-radius: 6px; 
          letter-spacing: 0.5px;
        }
        
        .clean-title { 
          font-family: 'Cinzel', serif; 
          font-size: 1.8rem; 
          color: #1a1a1a; 
          margin-bottom: 12px; 
          font-weight: 600;
          letter-spacing: 1px;
        }
        
        .modal-price-box { 
          display: flex; 
          align-items: baseline; 
          gap: 18px; 
          margin-bottom: 30px; 
        }
        
        .clean-price { 
          font-size: 2rem; 
          color: #1a1a1a; 
          font-weight: 800; 
          display: flex; 
          align-items: flex-start; 
        }
        
        .clean-desc-block { 
          margin-bottom: 30px;
        }

        .clean-desc-block h4 {
          font-family: 'Cinzel', serif;
          font-size: 1.1rem;
          color: #2a2a2a;
          margin-bottom: 12px;
          font-weight: 600;
        }

        .clean-desc-block p { 
          font-size: 1rem; 
          color: #666; 
          line-height: 1.8; 
        }
        
        .clean-actions { 
          margin-top: auto; 
          display: flex; 
          gap: 25px; 
          align-items: stretch; 
          padding-top: 25px; 
          border-top: 2px solid #f8d7e3; 
        }
        
        .clean-qty { 
          display: flex; 
          align-items: center; 
          justify-content: space-between; 
          border: 2px solid #f0c0d0; 
          width: 120px; 
          padding: 0 14px; 
          height: 55px; 
          border-radius: 12px;
          background: #fffbfc;
        }
        
        .clean-qty button { 
          background: none; 
          border: none; 
          font-size: 1.4rem; 
          cursor: pointer; 
          color: #c9557a; 
          font-weight: bold;
          transition: color 0.3s ease;
        }

        .clean-qty button:hover {
          color: #a03060;
        }

        .clean-qty span {
          font-size: 1.1rem;
          font-weight: 600;
          color: #2a2a2a;
        }
        
        .add-btn { 
          flex: 1; 
          background: linear-gradient(135deg, #c9557a 0%, #a03060 100%); 
          color: #fff; 
          border: none; 
          font-size: 0.95rem; 
          font-weight: 700; 
          cursor: pointer; 
          text-transform: uppercase; 
          height: 55px; 
          transition: all 0.4s ease; 
          border-radius: 12px;
          letter-spacing: 1px;
          box-shadow: 0 4px 15px rgba(201, 85, 122, 0.3);
        }
        
        .add-btn:hover { 
          background: linear-gradient(135deg, #a03060 0%, #7a1535 100%); 
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(201, 85, 122, 0.4);
        }

        .luxury-footer { 
          background: linear-gradient(180deg, #f2b8cc 0%, #e89ab4 100%);
          color: #1a1a1a; 
          padding: 90px 8vw 35px; 
          font-family: 'Jost', sans-serif; 
          border-top: 2px solid #e89ab4; 
          width: 100%; 
          box-shadow: 0 -10px 30px rgba(201, 85, 122, 0.1);
        }
        
        .footer-grid { 
          display: grid; 
          grid-template-columns: 2fr 1fr 1fr 1.5fr; 
          gap: 50px; 
          margin-bottom: 70px; 
        }
        
        .footer-brand h2 { 
          font-family: 'Cinzel', serif; 
          font-size: 2.4rem; 
          color: #1a1a1a; 
          margin-bottom: 22px; 
          font-weight: 700;
          letter-spacing: 1px;
        }
        
        .footer-brand p { 
          color: #2a2a2a; 
          line-height: 1.8; 
          max-width: 320px; 
          font-size: 0.98rem; 
        }
        
        .footer-col h3 { 
          font-family: 'Cinzel', serif; 
          font-size: 1.15rem; 
          color: #1a1a1a; 
          margin-bottom: 28px; 
          letter-spacing: 1.5px; 
          font-weight: 600;
        }
        
        .footer-links { 
          display: flex; 
          flex-direction: column; 
          gap: 14px; 
        }
        
        .footer-links a { 
          color: #2a2a2a; 
          text-decoration: none; 
          transition: all 0.4s ease; 
          font-size: 0.95rem; 
          display: flex; 
          align-items: center; 
          gap: 10px; 
          font-weight: 500;
        }
        
        .footer-links a:hover { 
          color: #7a1535; 
          transform: translateX(6px); 
        }
        
        .newsletter-text { 
          color: #2a2a2a; 
          margin-bottom: 22px; 
          font-size: 0.95rem; 
          line-height: 1.6;
        }
        
        .subscribe-box { 
          display: flex; 
          margin-bottom: 28px; 
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          border-radius: 8px;
          overflow: hidden;
        }
        
        .subscribe-input { 
          padding: 14px; 
          background: #fde8ef; 
          border: 1.5px solid #e89ab4; 
          color: #1a1a1a; 
          flex: 1; 
          outline: none; 
          font-size: 0.95rem;
          font-family: 'Jost', sans-serif;
        }

        .subscribe-input::placeholder {
          color: #999;
        }
        
        .subscribe-btn { 
          padding: 14px 24px; 
          background: linear-gradient(135deg, #7a1535 0%, #5a0f25 100%); 
          color: #fff; 
          border: none; 
          cursor: pointer; 
          font-weight: 700; 
          text-transform: uppercase; 
          transition: all 0.4s ease; 
          font-size: 0.9rem;
          letter-spacing: 1px;
        }
        
        .subscribe-btn:hover { 
          background: linear-gradient(135deg, #5a0f25 0%, #3a0515 100%); 
        }
        
        .social-icons { 
          display: flex; 
          gap: 18px; 
        }
        
        .social-icon { 
          width: 40px; 
          height: 40px; 
          border: 2px solid #c47090; 
          border-radius: 50%; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          color: #2a2a2a; 
          transition: all 0.5s ease; 
          cursor: pointer; 
          background: rgba(255, 255, 255, 0.4); 
        }
        
        .social-icon:hover { 
          transform: translateY(-4px) scale(1.1); 
          color: #fff; 
          border-color: transparent; 
        }
        
        .social-icon.instagram:hover { 
          background: radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%); 
          box-shadow: 0 6px 20px rgba(214, 36, 159, 0.4);
        }
        
        .social-icon.facebook:hover { 
          background: #1877F2; 
          box-shadow: 0 6px 20px rgba(24, 119, 242, 0.4);
        }
        
        .social-icon.whatsapp:hover { 
          background: #25D366; 
          box-shadow: 0 6px 20px rgba(37, 211, 102, 0.4);
        }
        
        .social-icon.youtube:hover { 
          background: #FF0000; 
          box-shadow: 0 6px 20px rgba(255, 0, 0, 0.4);
        }
        
        .social-icon.pinterest:hover { 
          background: #E60023; 
          box-shadow: 0 6px 20px rgba(230, 0, 35, 0.4);
        }
        
        .footer-bottom { 
          border-top: 2px solid #e89ab4; 
          padding-top: 35px; 
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
          color: #2a2a2a; 
          font-size: 0.85rem; 
          font-weight: 500;
        }
        
        .payment-methods { 
          display: flex; 
          align-items: center; 
          gap: 18px; 
        }
        
        .payment-icon { 
          width: 42px; 
          height: auto; 
          fill: #555; 
          transition: all 0.4s ease; 
          opacity: 0.85; 
        }
        
        .payment-icon:hover { 
          fill: #7a1535; 
          opacity: 1; 
          transform: translateY(-2px); 
        }

        @media (max-width: 1200px) {
          .collection-page { width: 100%; margin-left: 0; }
          .aesthetic-grid { grid-template-columns: repeat(2, 1fr); padding: 50px 30px; gap: 35px; }
          .footer-grid { grid-template-columns: 1fr; gap: 45px; }
          .footer-bottom { flex-direction: column; gap: 25px; text-align: center; }
          .banner-carousel-seamless { height: 400px; max-width: 95%; border-radius: 18px; }
          .col-header-banner { padding: 90px 30px 60px; }
          .title-reveal { font-size: clamp(2rem, 5vw, 3.5rem); }
          .gold-script { font-size: clamp(3rem, 6.5vw, 5rem); }
        }

        @media (max-width: 900px) {
          .aesthetic-grid { grid-template-columns: 1fr; }
          .clean-modal-card { flex-direction: column; width: 95%; height: 92vh; overflow-y: auto; }
          .clean-modal-left, .clean-modal-right { width: 100%; height: auto; }
          .permanent-character { bottom: 20px !important; right: 20px !important; }
          .character-container { width: 160px; height: 180px; }
          .character-body { width: 80px; height: 95px; bottom: 40px; }
          .character-head { width: 68px; height: 68px; bottom: 118px; }
          .character-speech { font-size: 0.85rem; padding: 12px 18px; max-width: 200px; top: -90px; }
          .banner-carousel-seamless { height: 340px; border-radius: 16px; max-width: 96%; }
          .col-header-banner { padding: 100px 20px 50px; }
          .banner-content { margin-bottom: 30px; }
          .banner-indicators-seamless { bottom: 20px; padding: 10px 16px; gap: 10px; }
          .indicator-seamless.active { width: 30px; }
          .card-img-container { height: 320px; }
          .title-reveal { font-size: clamp(1.8rem, 5vw, 3rem); }
          .gold-script { font-size: clamp(2.8rem, 6vw, 4.5rem); }
        }

        @media (max-width: 600px) {
          .banner-carousel-seamless { height: 280px; }
          .col-header-banner { padding: 90px 15px 40px; }
          .aesthetic-grid { padding: 40px 20px; }
          .title-reveal { font-size: clamp(1.6rem, 4.5vw, 2.5rem); letter-spacing: 0.12em; }
          .gold-script { font-size: clamp(2.5rem, 5.5vw, 4rem); }
          .banner-content { margin-bottom: 25px; }
        }
      `}</style>

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
              <div className={`eye ${characterMood==='excited'?'excited':''}`}></div>
              <div className={`eye ${characterMood==='excited'?'excited':''}`}></div>
            </div>
            <div className="cheek cheek-left"></div>
            <div className="cheek cheek-right"></div>
            <div className={`character-smile ${characterMood!=='happy'?'big-smile':''}`}></div>
          </div>
          <div className="character-arm arm-left"></div>
          <div className="character-arm arm-right"></div>
          <div className={`character-body mood-${characterMood}`}></div>
        </div>
      </div>

      <header className="col-header-banner">
        <div className={`vfx-container vfx-${bannerAnimation}`}>
          <div className="glow-overlay"></div>
          <div className="diamond-particle dp-1"></div>
          <div className="diamond-particle dp-2"></div>
          <div className="diamond-particle dp-3"></div>
          <div className="diamond-particle dp-4"></div>
          <div className="diamond-particle dp-5"></div>
          <div className="aurora-wave aw-1"></div>
          <div className="aurora-wave aw-2"></div>
          <div className="aurora-wave aw-3"></div>
          <div className="glow-orb go-1"></div>
          <div className="glow-orb go-2"></div>
          <div className="glow-orb go-3"></div>
          <div className="glow-orb go-4"></div>
          <div className="glow-orb go-5"></div>
          <div className="glow-orb go-6"></div>
          <div className="crystal cr-1"></div>
          <div className="crystal cr-2"></div>
          <div className="crystal cr-3"></div>
          <div className="crystal cr-4"></div>
          <div className="geo-hexagon hex-1"></div>
          <div className="geo-hexagon hex-2"></div>
          <div className="geo-hexagon hex-3"></div>
          <div className="geo-hexagon hex-4"></div>
          <div className="light-beam lb-1"></div>
          <div className="light-beam lb-2"></div>
          <div className="light-beam lb-3"></div>
          <div className="light-beam lb-4"></div>
          <div className="light-beam lb-5"></div>
          <div className="magic-circle mc-1"><div className="mc-inner"></div></div>
          <div className="magic-circle mc-2"><div className="mc-inner"></div></div>
          <div className="magic-circle mc-3"><div className="mc-inner"></div></div>
          <div className="magic-circle mc-4"><div className="mc-inner"></div></div>
          <div className="energy-center">
            <div className="energy-particle ep-1" style={{'--tx': '150px', '--ty': '0px'}}></div>
            <div className="energy-particle ep-2" style={{'--tx': '106px', '--ty': '106px'}}></div>
            <div className="energy-particle ep-3" style={{'--tx': '0px', '--ty': '150px'}}></div>
            <div className="energy-particle ep-4" style={{'--tx': '-106px', '--ty': '106px'}}></div>
            <div className="energy-particle ep-5" style={{'--tx': '-150px', '--ty': '0px'}}></div>
            <div className="energy-particle ep-6" style={{'--tx': '-106px', '--ty': '-106px'}}></div>
            <div className="energy-particle ep-7" style={{'--tx': '0px', '--ty': '-150px'}}></div>
            <div className="energy-particle ep-8" style={{'--tx': '106px', '--ty': '-106px'}}></div>
          </div>
        </div>
        
        <div className="banner-content">
          <h1 className="title-reveal">The <span className="gold-script">Archives</span></h1>
          {filter !== 'all' && <p style={{color:'#666', marginTop:'12px', textTransform:'uppercase', letterSpacing:'2.5px', fontSize:'0.9rem', fontWeight:'600'}}>{filter} Collection</p>}
        </div>

        <div className="banner-carousel-seamless">
          <div className="banner-particle bp-1"></div>
          <div className="banner-particle bp-2"></div>
          <div className="banner-particle bp-3"></div>
          <div className="banner-particle bp-4"></div>
          <div className="banner-particle bp-5"></div>
          <div className="banner-particle bp-6"></div>

          {bannerImages.map((img, index) => (
            <div 
              key={index}
              className={`banner-slide-seamless ${index === currentBannerIndex ? 'active' : ''}`}
            >
              <img src={img} alt={`Jewelry Collection ${index + 1}`} />
            </div>
          ))}

          <div className="banner-indicators-seamless">
            {bannerImages.map((_, index) => (
              <div 
                key={index}
                className={`indicator-seamless ${index === currentBannerIndex ? 'active' : ''}`}
                onClick={() => setCurrentBannerIndex(index)}
              />
            ))}
          </div>
        </div>
      </header>

      <section className="aesthetic-grid">
        {visibleItems.length > 0 ? visibleItems.map((product, index) => {
          const imgSrc = getMainImage(product);
          const p = formatPrice(product.price);
          return (
            <div key={product._id || product.id} className="glass-card" style={{ animationDelay: `${index * 0.1}s` }} onClick={() => openModal(product)}>
              <div className="card-img-container">
                <img src={imgSrc} alt={product.name} />
                <div className="card-overlay">
                  <span className="view-btn">Quick View</span>
                </div>
              </div>
              <div className="card-details">
                <h3>{product.name}</h3>
                <div className="premium-price">
                  <div className="price-main">
                    <span className="p-currency">₹</span>
                    <span className="p-whole">{p.whole}</span>
                    <span className="p-decimal">{p.decimal}</span>
                  </div>
                  {product.mrp && Number(product.mrp) > Number(product.price) && (
                    <span className="mrp-scratch">₹{product.mrp}</span>
                  )}
                </div>
              </div>
            </div>
          );
        }) : (
          <div style={{gridColumn:'1/-1', textAlign:'center', padding:'60px', color:'#999'}}>
            <h3>No products found in this category.</h3>
          </div>
        )}
      </section>

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
              <Link to="/collection" onClick={() => setFilter('Necklace')}>Necklaces</Link>
              <Link to="/collection" onClick={() => setFilter('Earrings')}>Earrings</Link>
              <Link to="/collection" onClick={() => setFilter('Bracelets')}>Bracelets</Link>
            </div>
          </div>
          <div className="footer-col">
            <h3>Information</h3>
            <div className="footer-links">
              <Link to="/about">About Us</Link>
              <Link to="/contact">Contact Us</Link>
              <Link to="/ShippingPolicy">Shipping Policy</Link>
              <Link to="/Policy">Returns & Exchange</Link>
              <Link to="/PrivacyPolicy">Privacy Policy</Link>
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
              <a href="https://www.instagram.com/anbjewels/" className="social-icon instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="https://www.facebook.com/profile.php?id=61585987086273" className="social-icon facebook">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="https://wa.me/919355366106" className="social-icon whatsapp">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
              </a>
              <a href="https://www.instagram.com/anbjewels/" className="social-icon youtube">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path>
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                </svg>
              </a>
              <a href="https://www.instagram.com/anbjewels/" className="social-icon pinterest">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8 12a4 4 0 1 1 8 0 4 4 0 0 1-8 0z"></path>
                  <path d="M12 2a10 10 0 0 0-10 10c0 4.2 2.6 7.8 6.4 9.3-.1-.8-.2-2 0-2.9l1.4-5.8c-.1-.4-.2-1-.2-1.5 0-1.4.8-2.5 1.8-2.5.9 0 1.3.7 1.3 1.5 0 .9-.6 2.3-.9 3.5-.2 1 .5 1.8 1.5 1.8 1.8 0 3.2-1.9 3.2-4.6 0-2.4-1.7-4.1-4.2-4.1-3 0-4.8 2.3-4.8 4.6 0 .9.3 1.9.8 2.5-.1.3-.2 1.2-.3 1.4-.8-.2-2.3-1.4-2.3-4.3 0-3.1 2.3-6 6.5-6 3.4 0 6 2.5 6 5.8 0 3.5-2.2 6.3-5.2 6.3-1 0-2-.5-2.3-1.1l-.6 2.4c-.2.9-1 2.6-1.5 3.5 1.1.3 2.3.5 3.5.5 5.5 0 10-4.5 10-10S17.5 2 12 2z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>Copyright © 2026 ANB Jewels. All rights reserved.</p>
          <div className="payment-methods">
            <svg className="payment-icon" viewBox="0 0 38 24">
              <path d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z" fillOpacity="0"/>
              <path d="M11.875 16.094l1.85-11.45h2.95l-1.85 11.45h-2.95zm9.525-11.225c-.35-.125-.9-.25-1.625-.25-1.775 0-3.025.95-3.05 2.3-.025 1 .9 1.55 1.575 1.875.7.35.925.575.925.875 0 .475-.575.7-1.1.7-.725 0-1.125-.1-1.725-.375l-.25-.125-.275 1.7c.475.225 1.325.425 2.225.425 2.1 0 3.475-1.025 3.5-2.6.025-.875-.525-1.525-1.675-2.075-.7-.35-1.125-.575-1.125-.9 0-.3.35-.6.1.1.1 1.325.125 1.575.125s1.25.25 1.5.3l-.225 1.375z"/>
            </svg>
            <svg className="payment-icon" viewBox="0 0 38 24">
              <path d="M22 12c0-2.8-1.6-5.2-4-6.3-2.4 1.1-4 3.5-4 6.3s1.6 5.2 4 6.3c2.4-1.1 4-3.5 4-6.3z"/>
              <circle cx="12" cy="12" r="7" fillOpacity="0" stroke="currentColor" strokeWidth="2"/>
              <circle cx="26" cy="12" r="7" fillOpacity="0" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <svg className="payment-icon" viewBox="0 0 24 24">
              <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
              <line x1="2" y1="10" x2="22" y2="10" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
        </div>
      </footer>

      {selectedProduct && (
        <div className={`modal-wrapper ${isAnimating ? 'active' : ''}`} onClick={closeModal}>
          <div className="clean-modal-card" onClick={e => e.stopPropagation()}>
            <button className="close-btn-clean" onClick={closeModal}>✕</button>
            <div className="clean-modal-left">
              <div className="clean-main-img">
                {isVideo(activeImage) ? (
                  <video key={activeImage} src={activeImage} autoPlay muted loop controls />
                ) : (
                  <img src={activeImage} alt="Product" />
                )}
              </div>
              <div className="clean-thumbnails">
                {getAllImages(selectedProduct).map((img, i) => (
                  <div 
                    key={i} 
                    className={`thumb-item ${activeImage === img ? 'active' : ''}`} 
                    onClick={() => setActiveImage(img)}
                  >
                    {isVideo(img) ? (
                      <>
                        <video src={img} muted style={{width:'100%', height:'100%', objectFit:'cover'}} />
                        <div className="v-badge">▶</div>
                      </>
                    ) : (
                      <img src={img} alt="thumb" />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="clean-modal-right">
              <div className="clean-tags">
                {(selectedProduct.stock > 0 || selectedProduct.quantity > 0 || (!selectedProduct.stock && !selectedProduct.quantity)) ? (
                  <span className="tag-green">IN STOCK</span>
                ) : (
                  <span className="tag-yellow" style={{background:'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)', color:'#c62828'}}>OUT OF STOCK</span>
                )}
                {selectedProduct.bestseller && <span className="tag-yellow">Best Seller</span>}
              </div>
              <h1 className="clean-title">{selectedProduct.name}</h1>
              <div className="modal-price-box">
                <div className="clean-price">
                  <span className="p-currency">₹</span>
                  <span className="p-whole">{formatPrice(selectedProduct.price).whole}</span>
                  <span className="p-decimal">{formatPrice(selectedProduct.price).decimal}</span>
                </div>
                {selectedProduct.mrp && Number(selectedProduct.mrp) > Number(selectedProduct.price) && (
                  <span className="mrp-scratch" style={{fontSize:'1.05rem', marginLeft:'12px'}}>₹{selectedProduct.mrp}</span>
                )}
              </div>
              <div className="clean-desc-block">
                <h4>Description</h4>
                <p>{selectedProduct.description || "No description available."}</p>
              </div>
              <div className="clean-actions">
                <div className="clean-qty">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                  <span>{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)}>+</button>
                </div>
                <button 
                  className="add-btn" 
                  onClick={() => handleAddToCart(selectedProduct._id || selectedProduct.id, quantity)}
                  disabled={selectedProduct.stock === 0 || selectedProduct.quantity === 0}
                  style={{
                    opacity: (selectedProduct.stock === 0 || selectedProduct.quantity === 0) ? 0.5 : 1,
                    cursor: (selectedProduct.stock === 0 || selectedProduct.quantity === 0) ? 'not-allowed' : 'pointer'
                  }}
                >
                  {(selectedProduct.stock === 0 || selectedProduct.quantity === 0) ? 'OUT OF STOCK' : 'ADD TO BAG'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Collection;
