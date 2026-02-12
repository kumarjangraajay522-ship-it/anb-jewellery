import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './collectooion.css'; 
import { ShopContext } from '../context/ShopContext'; 

function Collection() {
  const navigate = useNavigate();
  const { products, search, showSearch, addToCart, currency } = useContext(ShopContext); 

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
  
  const cursorDot = useRef(null);
  const cursorCircle = useRef(null);
  const messageTimeoutRef = useRef(null);

  // Cute messages for different interactions
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

  // --- HELPER: SAFELY GET IMAGE ---
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

  const isVideo = (url) => {
    if (!url || typeof url !== 'string') return false;
    return url.toLowerCase().endsWith('.mp4') || url.toLowerCase().endsWith('.webm');
  };

  const formatPrice = (price) => {
    const formatted = Number(price || 0).toFixed(2);
    const [whole, decimal] = formatted.split('.');
    return { whole, decimal };
  };

  // Show character message
  const showCharacterMessage = (message, mood = 'happy') => {
    if (messageTimeoutRef.current) {
      clearTimeout(messageTimeoutRef.current);
    }
    
    setCharacterMessage(message);
    setCharacterMood(mood);
    setShowMessage(true);
    setIsJumping(true);
    setSparkleEffect(true);

    setTimeout(() => setIsJumping(false), 600);
    setTimeout(() => setSparkleEffect(false), 1000);

    messageTimeoutRef.current = setTimeout(() => {
      setShowMessage(false);
    }, 4000);
  };

  // Handle character click
  const handleCharacterClick = () => {
    const randomMessage = touchMessages[Math.floor(Math.random() * touchMessages.length)];
    showCharacterMessage(randomMessage, 'excited');
  };

  // Modified addToCart function to trigger character message
  const handleAddToCart = (productId, qty) => {
    addToCart(productId, qty);
    const randomMessage = addToCartMessages[Math.floor(Math.random() * addToCartMessages.length)];
    showCharacterMessage(randomMessage, 'love');
    closeModal();
  };

  // FILTER LOGIC
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

  // OPEN MODAL
  const openModal = (product) => {
    setSelectedProduct(product);
    const mainImg = getMainImage(product);
    setActiveImage(mainImg);
    setQuantity(1);
    setTimeout(() => setIsAnimating(true), 10);
    
    // Show hover message when product is clicked
    const randomHover = hoverMessages[Math.floor(Math.random() * hoverMessages.length)];
    showCharacterMessage(randomHover, 'happy');
  };

  // CLOSE MODAL
  const closeModal = () => {
    setIsAnimating(false);
    setTimeout(() => setSelectedProduct(null), 400);
  };

  // CURSOR ANIMATION
  useEffect(() => {
    const moveCursor = (e) => {
      if(cursorDot.current) { cursorDot.current.style.left = `${e.clientX}px`; cursorDot.current.style.top = `${e.clientY}px`; }
      if(cursorCircle.current) { 
        setTimeout(() => { 
          if(cursorCircle.current) { cursorCircle.current.style.left = `${e.clientX}px`; cursorCircle.current.style.top = `${e.clientY}px`; } 
        }, 80); 
      }
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  // Welcome message on mount
  useEffect(() => {
    setTimeout(() => {
      showCharacterMessage("Welcome Beautiful! Ready to shine? ✨👑", 'happy');
    }, 500);
  }, []);

  // Rotate banner animations every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setBannerAnimation((prev) => (prev + 1) % 5);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`collection-page ${selectedProduct ? 'blur-bg' : ''}`}>
      <div className="noise-overlay"></div>
      <div className="cursor-dot" ref={cursorDot}></div>
      <div className="cursor-circle" ref={cursorCircle}></div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Jost:wght@300;400;600&family=Pinyon+Script&display=swap');
        * { box-sizing: border-box; }
        body, html { margin: 0; padding: 0; overflow-x: hidden; width: 100%; }
        .collection-page { width: 100%; min-height: 100vh; background: #fff; font-family: 'Jost', sans-serif; position: relative; }
        .col-header-banner { width: 100%; padding: 120px 20px 80px; background: linear-gradient(180deg, #FDEBF3 0%, #F4C2D7 100%); display: flex; flex-direction: column; align-items: center; text-align: center; position: relative; }
        .title-reveal { font-family: 'Cinzel', serif; font-size: clamp(2.5rem, 6vw, 4rem); color: #222; letter-spacing: 0.1em; line-height: 1; }
        .gold-script { font-family: 'Pinyon Script', cursive; color: #fff; font-size: clamp(3.5rem, 7vw, 5.5rem); line-height: 1; text-shadow: 0 2px 5px rgba(0,0,0,0.05); }
        
        /* CUTE BANNER ANIMATIONS */
        .banner-decorations {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }
        
        /* Large Animated Image Elements */
        .animated-image {
          position: absolute;
          width: 180px;
          height: 180px;
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
          filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.1));
          opacity: 0.85;
        }
        
        /* Animation 1: Rotating Jewelry Collection */
        .jewelry-circle {
          animation: jewelryRotate 15s linear infinite;
        }
        .jewelry-circle-1 {
          top: 15%;
          left: 8%;
          animation-delay: 0s;
        }
        .jewelry-circle-2 {
          top: 25%;
          right: 10%;
          animation-delay: 3s;
        }
        .jewelry-circle-3 {
          bottom: 15%;
          left: 12%;
          animation-delay: 6s;
        }
        .jewelry-circle-4 {
          bottom: 20%;
          right: 15%;
          animation-delay: 9s;
        }
        @keyframes jewelryRotate {
          0% { 
            transform: rotate(0deg) scale(0.8); 
            opacity: 0;
          }
          10% {
            opacity: 0.85;
            transform: rotate(20deg) scale(1);
          }
          90% {
            opacity: 0.85;
            transform: rotate(340deg) scale(1);
          }
          100% { 
            transform: rotate(360deg) scale(0.8); 
            opacity: 0;
          }
        }
        
        /* Animation 2: Floating Shine Effect */
        .shine-float {
          animation: shineFloat 8s ease-in-out infinite;
        }
        .shine-1 {
          top: 10%;
          left: 15%;
          width: 150px;
          height: 150px;
          animation-delay: 0s;
        }
        .shine-2 {
          top: 30%;
          right: 12%;
          width: 200px;
          height: 200px;
          animation-delay: 2s;
        }
        .shine-3 {
          bottom: 25%;
          left: 10%;
          width: 170px;
          height: 170px;
          animation-delay: 4s;
        }
        @keyframes shineFloat {
          0%, 100% { 
            transform: translateY(0px) translateX(0px) rotate(0deg) scale(0.9); 
            opacity: 0;
          }
          20% {
            opacity: 0.8;
            transform: translateY(-15px) translateX(10px) rotate(5deg) scale(1);
          }
          50% { 
            transform: translateY(-25px) translateX(-10px) rotate(-5deg) scale(1.05); 
            opacity: 0.9;
          }
          80% {
            opacity: 0.8;
            transform: translateY(-15px) translateX(10px) rotate(5deg) scale(1);
          }
        }
        
        /* Animation 3: Bouncing Crown */
        .crown-bounce {
          animation: crownBounce 6s ease-in-out infinite;
        }
        .crown-b-1 {
          top: 20%;
          left: 18%;
          width: 160px;
          height: 160px;
          animation-delay: 0s;
        }
        .crown-b-2 {
          top: 35%;
          right: 15%;
          width: 140px;
          height: 140px;
          animation-delay: 2s;
        }
        .crown-b-3 {
          bottom: 28%;
          left: 20%;
          width: 150px;
          height: 150px;
          animation-delay: 4s;
        }
        @keyframes crownBounce {
          0%, 100% { 
            transform: translateY(0) scale(0.8); 
            opacity: 0;
          }
          15% {
            opacity: 0.85;
            transform: translateY(-20px) scale(1);
          }
          30% { 
            transform: translateY(-40px) scale(1.1);
            opacity: 0.9;
          }
          45% {
            transform: translateY(-20px) scale(1);
          }
          60% {
            transform: translateY(-30px) scale(1.05);
          }
          75% {
            transform: translateY(-20px) scale(1);
            opacity: 0.85;
          }
          90% {
            opacity: 0;
            transform: translateY(0) scale(0.8);
          }
        }
        
        /* Animation 4: Heart Pulse Wave */
        .heart-pulse {
          animation: heartPulse 5s ease-in-out infinite;
        }
        .heart-p-1 {
          top: 18%;
          left: 12%;
          width: 190px;
          height: 190px;
          animation-delay: 0s;
        }
        .heart-p-2 {
          top: 40%;
          right: 10%;
          width: 170px;
          height: 170px;
          animation-delay: 1.5s;
        }
        .heart-p-3 {
          bottom: 22%;
          right: 20%;
          width: 180px;
          height: 180px;
          animation-delay: 3s;
        }
        @keyframes heartPulse {
          0%, 100% { 
            transform: scale(0); 
            opacity: 0;
            filter: drop-shadow(0 0 0px rgba(255, 105, 180, 0));
          }
          20% {
            transform: scale(0.8);
            opacity: 0.7;
            filter: drop-shadow(0 0 20px rgba(255, 105, 180, 0.4));
          }
          50% { 
            transform: scale(1.1); 
            opacity: 0.9;
            filter: drop-shadow(0 0 40px rgba(255, 105, 180, 0.6));
          }
          80% {
            transform: scale(0.9);
            opacity: 0.7;
            filter: drop-shadow(0 0 20px rgba(255, 105, 180, 0.4));
          }
        }
        
        /* Animation 5: Diamond Sparkle Dance */
        .diamond-dance {
          animation: diamondDance 7s ease-in-out infinite;
        }
        .diamond-d-1 {
          top: 15%;
          left: 15%;
          width: 140px;
          height: 140px;
          animation-delay: 0s;
        }
        .diamond-d-2 {
          top: 28%;
          right: 18%;
          width: 180px;
          height: 180px;
          animation-delay: 2s;
        }
        .diamond-d-3 {
          bottom: 20%;
          left: 18%;
          width: 160px;
          height: 160px;
          animation-delay: 4s;
        }
        .diamond-d-4 {
          bottom: 35%;
          right: 12%;
          width: 150px;
          height: 150px;
          animation-delay: 1s;
        }
        @keyframes diamondDance {
          0%, 100% { 
            transform: translateX(0) translateY(0) rotate(0deg) scale(0);
            opacity: 0;
            filter: brightness(1) drop-shadow(0 0 0px rgba(255, 215, 0, 0));
          }
          15% {
            transform: translateX(-10px) translateY(-10px) rotate(45deg) scale(1);
            opacity: 0.85;
            filter: brightness(1.2) drop-shadow(0 0 20px rgba(255, 215, 0, 0.5));
          }
          30% {
            transform: translateX(10px) translateY(-20px) rotate(90deg) scale(1.1);
            opacity: 0.9;
            filter: brightness(1.4) drop-shadow(0 0 30px rgba(255, 215, 0, 0.7));
          }
          45% {
            transform: translateX(-8px) translateY(-15px) rotate(135deg) scale(1.05);
            filter: brightness(1.3) drop-shadow(0 0 25px rgba(255, 215, 0, 0.6));
          }
          60% {
            transform: translateX(12px) translateY(-18px) rotate(180deg) scale(1.08);
            filter: brightness(1.3) drop-shadow(0 0 25px rgba(255, 215, 0, 0.6));
          }
          75% {
            transform: translateX(-5px) translateY(-10px) rotate(270deg) scale(1);
            opacity: 0.85;
            filter: brightness(1.2) drop-shadow(0 0 20px rgba(255, 215, 0, 0.5));
          }
          90% {
            opacity: 0;
            transform: translateX(0) translateY(0) rotate(315deg) scale(0.5);
            filter: brightness(1) drop-shadow(0 0 0px rgba(255, 215, 0, 0));
          }
        }
        
        /* SVG Jewelry illustrations */
        .jewelry-svg {
          position: absolute;
          width: 200px;
          height: 200px;
          opacity: 0.75;
        }
        
        .necklace-svg {
          animation: necklaceSwing 6s ease-in-out infinite;
        }
        .necklace-1 {
          top: 12%;
          left: 10%;
          animation-delay: 0s;
        }
        .necklace-2 {
          bottom: 18%;
          right: 12%;
          animation-delay: 3s;
        }
        @keyframes necklaceSwing {
          0%, 100% {
            transform: rotate(-5deg) scale(0.9);
            opacity: 0;
          }
          20% {
            opacity: 0.8;
            transform: rotate(0deg) scale(1);
          }
          50% {
            transform: rotate(5deg) scale(1.05);
            opacity: 0.85;
          }
          80% {
            opacity: 0.8;
            transform: rotate(0deg) scale(1);
          }
        }
        
        .ring-svg {
          animation: ringSpin 8s linear infinite;
        }
        .ring-1 {
          top: 25%;
          right: 15%;
          animation-delay: 0s;
        }
        .ring-2 {
          bottom: 30%;
          left: 15%;
          animation-delay: 4s;
        }
        @keyframes ringSpin {
          0% {
            transform: rotate(0deg) scale(0.8);
            opacity: 0;
          }
          15% {
            opacity: 0.8;
            transform: rotate(45deg) scale(1);
          }
          85% {
            opacity: 0.8;
            transform: rotate(315deg) scale(1);
          }
          100% {
            transform: rotate(360deg) scale(0.8);
            opacity: 0;
          }
        }
        
        /* Hide all animations by default */
        .banner-decorations .jewelry-circle,
        .banner-decorations .shine-float,
        .banner-decorations .crown-bounce,
        .banner-decorations .heart-pulse,
        .banner-decorations .diamond-dance,
        .banner-decorations .necklace-svg,
        .banner-decorations .ring-svg {
          display: none;
        }
        
        /* Show active animation set */
        .banner-decorations.anim-0 .jewelry-circle { display: block; }
        .banner-decorations.anim-1 .shine-float { display: block; }
        .banner-decorations.anim-2 .crown-bounce { display: block; }
        .banner-decorations.anim-3 .heart-pulse { display: block; }
        .banner-decorations.anim-4 .diamond-dance { display: block; }
        
        
        /* Original small animations */
        
        .jewelry-float {
          position: absolute;
          font-size: 3rem;
          animation: floatAround 8s ease-in-out infinite;
          opacity: 0.6;
        }
        .jewelry-1 { top: 15%; left: 10%; animation-delay: 0s; }
        .jewelry-2 { top: 25%; right: 15%; animation-delay: 2s; }
        .jewelry-3 { bottom: 20%; left: 20%; animation-delay: 4s; }
        .jewelry-4 { top: 60%; right: 8%; animation-delay: 1s; }
        .jewelry-5 { bottom: 35%; right: 25%; animation-delay: 3s; }
        @keyframes floatAround {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          25% { transform: translateY(-20px) translateX(10px) rotate(5deg); }
          50% { transform: translateY(-10px) translateX(-10px) rotate(-5deg); }
          75% { transform: translateY(-25px) translateX(5px) rotate(3deg); }
        }
        
        /* Animation 2: Sparkle Rain */
        .sparkle-rain {
          position: absolute;
          font-size: 1.5rem;
          animation: sparkleRain 6s linear infinite;
          opacity: 0;
        }
        .sparkle-rain:nth-child(1) { left: 10%; animation-delay: 0s; }
        .sparkle-rain:nth-child(2) { left: 25%; animation-delay: 1s; }
        .sparkle-rain:nth-child(3) { left: 40%; animation-delay: 2s; }
        .sparkle-rain:nth-child(4) { left: 55%; animation-delay: 0.5s; }
        .sparkle-rain:nth-child(5) { left: 70%; animation-delay: 1.5s; }
        .sparkle-rain:nth-child(6) { left: 85%; animation-delay: 2.5s; }
        @keyframes sparkleRain {
          0% { top: -10%; opacity: 0; transform: scale(0); }
          10% { opacity: 1; transform: scale(1); }
          90% { opacity: 1; }
          100% { top: 110%; opacity: 0; transform: scale(0.5) rotate(360deg); }
        }
        
        /* Animation 3: Heart Bubbles */
        .heart-bubble {
          position: absolute;
          font-size: 2rem;
          animation: heartBubble 8s ease-in-out infinite;
          opacity: 0;
        }
        .heart-bubble:nth-child(1) { bottom: -10%; left: 15%; animation-delay: 0s; }
        .heart-bubble:nth-child(2) { bottom: -10%; left: 35%; animation-delay: 2s; }
        .heart-bubble:nth-child(3) { bottom: -10%; right: 35%; animation-delay: 4s; }
        .heart-bubble:nth-child(4) { bottom: -10%; right: 15%; animation-delay: 1s; }
        @keyframes heartBubble {
          0% { bottom: -10%; opacity: 0; transform: scale(0.5); }
          10% { opacity: 0.8; transform: scale(1); }
          90% { opacity: 0.8; }
          100% { bottom: 110%; opacity: 0; transform: scale(1.5) rotate(-20deg); }
        }
        
        /* Animation 4: Glitter Stars */
        .glitter-star {
          position: absolute;
          font-size: 2.5rem;
          animation: glitterStar 4s ease-in-out infinite;
          opacity: 0;
        }
        .star-1 { top: 20%; left: 12%; animation-delay: 0s; }
        .star-2 { top: 35%; right: 18%; animation-delay: 0.8s; }
        .star-3 { bottom: 30%; left: 25%; animation-delay: 1.6s; }
        .star-4 { top: 50%; right: 10%; animation-delay: 2.4s; }
        .star-5 { bottom: 40%; right: 30%; animation-delay: 3.2s; }
        @keyframes glitterStar {
          0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.2) rotate(180deg); }
        }
        
        /* Animation 5: Crown Confetti */
        .crown-confetti {
          position: absolute;
          font-size: 2rem;
          animation: crownConfetti 5s ease-in-out infinite;
          opacity: 0;
        }
        .crown-1 { top: -5%; left: 20%; animation-delay: 0s; }
        .crown-2 { top: -5%; left: 40%; animation-delay: 1s; }
        .crown-3 { top: -5%; right: 40%; animation-delay: 2s; }
        .crown-4 { top: -5%; right: 20%; animation-delay: 0.5s; }
        .crown-5 { top: -5%; left: 60%; animation-delay: 1.5s; }
        @keyframes crownConfetti {
          0% { top: -5%; opacity: 0; transform: translateY(0) rotate(0deg) scale(0.5); }
          20% { opacity: 1; transform: scale(1); }
          80% { opacity: 1; }
          100% { top: 105%; opacity: 0; transform: translateY(0) rotate(720deg) scale(0.8); }
        }
        
        /* Cute rotating border decoration */
        .banner-border-decor {
          position: absolute;
          bottom: -2px;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, 
            transparent 0%, 
            #FFB6D9 10%, 
            #FF69B4 25%, 
            #FFB6D9 40%, 
            transparent 50%,
            #FFB6D9 60%,
            #FF69B4 75%,
            #FFB6D9 90%,
            transparent 100%
          );
          background-size: 200% 100%;
          animation: borderShimmer 3s linear infinite;
        }
        @keyframes borderShimmer {
          0% { background-position: 0% 0%; }
          100% { background-position: 200% 0%; }
        }
        
        /* Hide animations when not active */
        .banner-decorations .jewelry-float,
        .banner-decorations .sparkle-rain,
        .banner-decorations .heart-bubble,
        .banner-decorations .glitter-star,
        .banner-decorations .crown-confetti {
          display: block;
          opacity: 0.3;
        }
        
        /* Show active animation */
        .banner-decorations.anim-0 .jewelry-float { opacity: 0.6; }
        .banner-decorations.anim-1 .sparkle-rain { opacity: 1; }
        .banner-decorations.anim-2 .heart-bubble { opacity: 1; }
        .banner-decorations.anim-3 .glitter-star { opacity: 1; }
        .banner-decorations.anim-4 .crown-confetti { opacity: 1; }
        
        /* ENHANCED 3D CHARACTER - ALWAYS VISIBLE */
        .permanent-character {
          position: fixed;
          bottom: 30px;
          right: 30px;
          z-index: 9998;
          cursor: pointer;
          transition: transform 0.3s ease;
        }
        .permanent-character:hover {
          transform: scale(1.05);
        }
        
        .character-container {
          position: relative;
          width: 200px;
          height: 230px;
          animation: gentleFloat 3s ease-in-out infinite;
        }
        .character-container.jumping {
          animation: excitedJump 0.6s ease-out;
        }
        @keyframes gentleFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(2deg); }
        }
        @keyframes excitedJump {
          0% { transform: translateY(0) scale(1); }
          30% { transform: translateY(-40px) scale(1.1) rotate(-5deg); }
          50% { transform: translateY(-50px) scale(1.15) rotate(5deg); }
          70% { transform: translateY(-30px) scale(1.1) rotate(-3deg); }
          100% { transform: translateY(0) scale(1) rotate(0deg); }
        }
        
        /* Enhanced Character Body with gradient */
        .character-body {
          position: absolute;
          bottom: 50px;
          left: 50%;
          transform: translateX(-50%);
          width: 100px;
          height: 120px;
          background: linear-gradient(135deg, #FF6EC7 0%, #B06AB3 50%, #8A4FFF 100%);
          border-radius: 50px 50px 60px 60px;
          box-shadow: 0 15px 40px rgba(180, 106, 179, 0.5),
                      inset 0 -15px 30px rgba(255, 255, 255, 0.2),
                      inset 0 15px 30px rgba(138, 79, 255, 0.3);
          animation: bodyPulse 2s ease-in-out infinite;
        }
        @keyframes bodyPulse {
          0%, 100% { transform: translateX(-50%) scale(1); }
          50% { transform: translateX(-50%) scale(1.02); }
        }
        .character-body.mood-excited {
          background: linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF1493 100%);
        }
        .character-body.mood-love {
          background: linear-gradient(135deg, #FF69B4 0%, #FF1493 50%, #C71585 100%);
        }
        
        /* Enhanced Character Head */
        .character-head {
          position: absolute;
          bottom: 145px;
          left: 50%;
          transform: translateX(-50%);
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #FFE4F0 0%, #FFB6D9 100%);
          border-radius: 50%;
          box-shadow: 0 10px 30px rgba(255, 182, 217, 0.6),
                      inset 0 -10px 20px rgba(255, 255, 255, 0.5);
          animation: headTilt 2s ease-in-out infinite;
        }
        @keyframes headTilt {
          0%, 100% { transform: translateX(-50%) rotate(-2deg); }
          50% { transform: translateX(-50%) rotate(2deg); }
        }
        
        /* Eyes with different expressions */
        .character-eyes {
          position: absolute;
          top: 28px;
          left: 50%;
          transform: translateX(-50%);
          width: 50px;
          display: flex;
          justify-content: space-between;
        }
        .eye {
          width: 14px;
          height: 18px;
          background: #333;
          border-radius: 50% 50% 50% 50%;
          position: relative;
          animation: naturalBlink 4s infinite;
        }
        .eye::after {
          content: '';
          position: absolute;
          top: 4px;
          left: 4px;
          width: 6px;
          height: 6px;
          background: white;
          border-radius: 50%;
          animation: eyeShine 2s ease-in-out infinite;
        }
        @keyframes naturalBlink {
          0%, 94%, 100% { height: 18px; }
          96% { height: 2px; }
        }
        @keyframes eyeShine {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        /* Excited eyes */
        .eye.excited {
          animation: excitedBlink 0.5s ease-in-out 3;
        }
        @keyframes excitedBlink {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.3); }
        }
        
        /* Smile */
        .character-smile {
          position: absolute;
          top: 50px;
          left: 50%;
          transform: translateX(-50%);
          width: 30px;
          height: 15px;
          border: 2.5px solid #FF1493;
          border-top: none;
          border-radius: 0 0 30px 30px;
        }
        .character-smile.big-smile {
          width: 35px;
          height: 18px;
          animation: smilePulse 0.5s ease-in-out 2;
        }
        @keyframes smilePulse {
          0%, 100% { transform: translateX(-50%) scale(1); }
          50% { transform: translateX(-50%) scale(1.2); }
        }
        
        /* Rosy Cheeks with animation */
        .cheek {
          position: absolute;
          top: 40px;
          width: 14px;
          height: 12px;
          background: rgba(255, 105, 180, 0.4);
          border-radius: 50%;
          animation: blush 2s ease-in-out infinite;
        }
        .cheek-left { left: 10px; }
        .cheek-right { right: 10px; }
        @keyframes blush {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }
        
        /* Enhanced Arms with wave */
        .character-arm {
          position: absolute;
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #FF6EC7 0%, #B06AB3 100%);
          border-radius: 50%;
          box-shadow: 0 5px 15px rgba(180, 106, 179, 0.4);
        }
        .arm-left {
          bottom: 90px;
          left: 20px;
          animation: waveLeftContinuous 2s ease-in-out infinite;
        }
        .arm-right {
          bottom: 90px;
          right: 20px;
          animation: waveRightContinuous 2s ease-in-out infinite;
        }
        @keyframes waveLeftContinuous {
          0%, 100% { transform: rotate(-15deg); }
          50% { transform: rotate(-35deg); }
        }
        @keyframes waveRightContinuous {
          0%, 100% { transform: rotate(15deg); }
          50% { transform: rotate(35deg); }
        }
        
        /* Crown on head */
        .character-crown {
          position: absolute;
          top: -15px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 1.5rem;
          animation: crownShine 2s ease-in-out infinite;
        }
        @keyframes crownShine {
          0%, 100% { transform: translateX(-50%) rotate(-5deg) scale(1); opacity: 1; }
          50% { transform: translateX(-50%) rotate(5deg) scale(1.1); opacity: 0.9; }
        }
        
        /* Sparkles around character */
        .character-sparkles {
          position: absolute;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
        .sparkle {
          position: absolute;
          font-size: 1.2rem;
          animation: sparkleOrbit 3s ease-in-out infinite;
          opacity: 0;
        }
        .sparkle-1 { top: 10%; left: 10%; animation-delay: 0s; }
        .sparkle-2 { top: 20%; right: 5%; animation-delay: 0.5s; }
        .sparkle-3 { bottom: 30%; left: 5%; animation-delay: 1s; }
        .sparkle-4 { bottom: 20%; right: 10%; animation-delay: 1.5s; }
        @keyframes sparkleOrbit {
          0%, 100% { transform: scale(0) rotate(0deg); opacity: 0; }
          50% { transform: scale(1.5) rotate(180deg); opacity: 1; }
        }
        
        .character-sparkles.active .sparkle {
          animation: sparkleExplosion 1s ease-out;
        }
        @keyframes sparkleExplosion {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.8); opacity: 1; }
          100% { transform: scale(0); opacity: 0; }
        }
        
        /* Hearts floating */
        .floating-hearts {
          position: absolute;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
        .heart {
          position: absolute;
          font-size: 1rem;
          animation: heartFloat 3s ease-in-out infinite;
        }
        .heart-1 { top: 20%; left: -20px; animation-delay: 0s; }
        .heart-2 { top: 50%; right: -20px; animation-delay: 1s; }
        .heart-3 { bottom: 30%; left: -15px; animation-delay: 2s; }
        @keyframes heartFloat {
          0%, 100% { transform: translateY(0) scale(0.8); opacity: 0; }
          50% { transform: translateY(-30px) scale(1.2); opacity: 1; }
        }
        
        /* Speech Bubble - Enhanced */
        .character-speech {
          position: absolute;
          top: -100px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(135deg, #ffffff 0%, #ffe6f0 100%);
          padding: 15px 25px;
          border-radius: 20px;
          box-shadow: 0 8px 25px rgba(255, 105, 180, 0.3);
          font-family: 'Jost', sans-serif;
          font-size: 1rem;
          font-weight: 600;
          color: #FF1493;
          white-space: nowrap;
          max-width: 250px;
          white-space: normal;
          text-align: center;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease, transform 0.3s ease;
          border: 2px solid #FFB6D9;
        }
        .character-speech.show {
          opacity: 1;
          animation: bubblePopIn 0.4s ease-out;
        }
        .character-speech::after {
          content: '';
          position: absolute;
          bottom: -12px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 12px solid transparent;
          border-right: 12px solid transparent;
          border-top: 15px solid #FFB6D9;
        }
        @keyframes bubblePopIn {
          0% { transform: translateX(-50%) scale(0); opacity: 0; }
          70% { transform: translateX(-50%) scale(1.1); }
          100% { transform: translateX(-50%) scale(1); opacity: 1; }
        }
        
        .filter-marquee { position: relative; z-index: 2; margin-bottom: 80px; display: flex; justify-content: center; margin-top: 30px; }
        .filter-group { display: flex; gap: 20px; background: rgba(227, 192, 192, 0.5); padding: 10px 20px; border-radius: 50px; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.8); }
        .aesthetic-btn { background: none; border: none; padding: 10px 25px; font-family: 'Jost', sans-serif; text-transform: uppercase; letter-spacing: 2px; font-size: 0.75rem; cursor: pointer; border-radius: 30px; transition: 0.3s; opacity: 0.6; }
        .aesthetic-btn:hover, .aesthetic-btn.active { background: #111; color: #fff; opacity: 1; }
        
        .aesthetic-grid { 
            display: grid; 
            grid-template-columns: repeat(3, 1fr);
            gap: 30px; 
            max-width: 1400px; 
            margin: 0 auto; 
            padding: 0 40px 100px; 
        }

        .glass-card { background: rgba(255, 255, 255, 0.4); border: 1px solid rgba(255, 255, 255, 0.6); border-radius: 20px; padding: 15px; cursor: pointer; transition: 0.4s ease; }
        .glass-card:hover { transform: translateY(-10px); background: rgba(255,255,255,0.8); box-shadow: 0 20px 40px rgba(0,0,0,0.05); }
        .card-img-container { height: 350px; border-radius: 15px; overflow: hidden; position: relative; }
        .card-img-container img { width: 100%; height: 100%; object-fit: cover; transition: 0.8s; }
        .glass-card:hover img { transform: scale(1.1); }
        .card-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.1); display: flex; justify-content: center; align-items: center; opacity: 0; transition: 0.3s; }
        .view-btn { background: white; padding: 12px 30px; border-radius: 30px; font-family: 'Cinzel', serif; font-size: 0.8rem; letter-spacing: 1px; transform: translateY(20px); transition: 0.3s; }
        .glass-card:hover .card-overlay { opacity: 1; }
        .glass-card:hover .view-btn { transform: translateY(0); }
        
        .card-details { padding: 20px 5px 5px; }
        .card-details h3 { font-family: 'Cinzel', serif; font-size: 1.1rem; margin-bottom: 5px; color: #222; }
        
        .premium-price { display: flex; align-items: baseline; gap: 8px; font-family: 'Jost', sans-serif; }
        .price-main { color: #111; font-weight: 600; display: flex; align-items: flex-start; }
        .p-currency { font-size: 0.6em; margin-top: 4px; }
        .p-whole { font-size: 1.3em; }
        .p-decimal { font-size: 0.7em; margin-top: 4px; }
        .mrp-scratch { font-size: 0.9rem; color: #999; text-decoration: line-through; }
        
        /* Modal Styles */
        .modal-wrapper { position: fixed; inset: 0; z-index: 1000; background: rgba(0,0,0,0.4); backdrop-filter: blur(5px); display: flex; justify-content: center; align-items: center; opacity: 0; pointer-events: none; transition: 0.4s; }
        .modal-wrapper.active { opacity: 1; pointer-events: auto; }
        .clean-modal-card { width: 900px; height: 550px; background: #fff; display: flex; box-shadow: 0 20px 50px rgba(0,0,0,0.2); position: relative; overflow: hidden; }
        .close-btn-clean { position: absolute; top: 15px; right: 15px; background: #f5f5f5; border: none; width: 30px; height: 30px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #555; z-index: 20; }
        .clean-modal-left { width: 45%; padding: 20px; display: flex; flex-direction: column; gap: 10px; }
        .clean-main-img { width: 100%; height: 380px; overflow: hidden; border: 1px solid #f0f0f0; display: flex; align-items: center; justify-content: center;}
        .clean-main-img img, .clean-main-img video { width: 100%; height: 100%; object-fit: cover; }
        .clean-thumbnails { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 5px; }
        .thumb-item { min-width: 60px; height: 60px; position: relative; cursor: pointer; border: 1px solid #eee; opacity: 0.6; transition: 0.3s; }
        .thumb-item.active { border-color: #D4AF37; opacity: 1; }
        .v-badge { position: absolute; inset: 0; background: rgba(0,0,0,0.1); color: white; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; }
        
        .clean-modal-right { width: 55%; padding: 40px; display: flex; flex-direction: column; overflow-y: auto; }
        .clean-tags { display: flex; gap: 10px; margin-bottom: 15px; }
        .tag-green { background: #e0f7fa; color: #00695c; font-size: 0.7rem; font-weight: 700; padding: 5px 10px; border-radius: 4px; }
        .tag-yellow { background: #fffde7; color: #fbc02d; font-size: 0.7rem; font-weight: 700; padding: 5px 10px; border-radius: 4px; }
        .clean-title { font-family: 'Cinzel', serif; font-size: 1.6rem; color: #111; margin-bottom: 10px; }
        
        .modal-price-box { display: flex; align-items: baseline; gap: 15px; margin-bottom: 25px; }
        .clean-price { font-size: 1.8rem; color: #111; font-weight: 700; display: flex; align-items: flex-start; }

        .clean-desc-block p { font-size: 0.95rem; color: #666; line-height: 1.6; margin-bottom: 25px; }
        .clean-actions { margin-top: auto; display: flex; gap: 20px; align-items: stretch; padding-top: 20px; border-top: 1px solid #f0f0f0; }
        .clean-qty { display: flex; align-items: center; justify-content: space-between; border: 1px solid #ddd; width: 100px; padding: 0 10px; height: 50px; }
        .add-btn { flex: 1; background: #111; color: #fff; border: none; font-size: 0.9rem; font-weight: 600; cursor: pointer; text-transform: uppercase; height: 50px; }
        
        @media (max-width: 900px) {
           .aesthetic-grid { grid-template-columns: 1fr; } 
           .clean-modal-card { flex-direction: column; width: 95%; height: 90vh; overflow-y: auto; }
           .clean-modal-left { width: 100%; height: auto; }
           .clean-modal-right { width: 100%; height: auto; }
           .permanent-character { bottom: 15px; right: 15px; }
           .character-container { width: 140px; height: 160px; }
           .character-body { width: 70px; height: 85px; bottom: 35px; }
           .character-head { width: 60px; height: 60px; bottom: 105px; }
           .character-speech { font-size: 0.8rem; padding: 10px 15px; max-width: 180px; top: -80px; }
        }
      `}</style>

      {/* PERMANENT 3D CHARACTER */}
      <div className="permanent-character" onClick={handleCharacterClick}>
        <div className={`character-container ${isJumping ? 'jumping' : ''}`}>
          <div className={`character-speech ${showMessage ? 'show' : ''}`}>
            {characterMessage}
          </div>
          
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

      <header className="col-header-banner">
        {/* Cute Banner Animations */}
        <div className={`banner-decorations anim-${bannerAnimation}`}>
          {/* Large Animated Elements - Animation 1: Rotating Jewelry */}
          <div className="animated-image jewelry-circle jewelry-circle-1" style={{
            background: 'radial-gradient(circle, rgba(255,215,0,0.3) 0%, transparent 70%), url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Ccircle cx=\'50\' cy=\'50\' r=\'45\' fill=\'%23FFD700\' opacity=\'0.3\'/%3E%3Ctext x=\'50\' y=\'65\' font-size=\'50\' text-anchor=\'middle\' fill=\'%23FF69B4\'%3E💎%3C/text%3E%3C/svg%3E")'
          }}></div>
          <div className="animated-image jewelry-circle jewelry-circle-2" style={{
            background: 'radial-gradient(circle, rgba(255,105,180,0.3) 0%, transparent 70%), url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Ccircle cx=\'50\' cy=\'50\' r=\'45\' fill=\'%23FFB6D9\' opacity=\'0.3\'/%3E%3Ctext x=\'50\' y=\'65\' font-size=\'50\' text-anchor=\'middle\' fill=\'%23FFD700\'%3E👑%3C/text%3E%3C/svg%3E")'
          }}></div>
          <div className="animated-image jewelry-circle jewelry-circle-3" style={{
            background: 'radial-gradient(circle, rgba(138,79,255,0.3) 0%, transparent 70%), url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Ccircle cx=\'50\' cy=\'50\' r=\'45\' fill=\'%23E6D5FF\' opacity=\'0.3\'/%3E%3Ctext x=\'50\' y=\'65\' font-size=\'50\' text-anchor=\'middle\' fill=\'%23FF1493\'%3E💍%3C/text%3E%3C/svg%3E")'
          }}></div>
          <div className="animated-image jewelry-circle jewelry-circle-4" style={{
            background: 'radial-gradient(circle, rgba(255,182,193,0.3) 0%, transparent 70%), url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Ccircle cx=\'50\' cy=\'50\' r=\'45\' fill=\'%23FFE4E9\' opacity=\'0.3\'/%3E%3Ctext x=\'50\' y=\'65\' font-size=\'50\' text-anchor=\'middle\' fill=\'%238A4FFF\'%3E✨%3C/text%3E%3C/svg%3E")'
          }}></div>
          
          {/* Animation 2: Floating Shine */}
          <div className="animated-image shine-float shine-1" style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,215,0,0.4) 50%, transparent 70%), url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Ctext x=\'50\' y=\'65\' font-size=\'60\' text-anchor=\'middle\' fill=\'%23FFD700\'%3E✨%3C/text%3E%3C/svg%3E")'
          }}></div>
          <div className="animated-image shine-float shine-2" style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,182,217,0.4) 50%, transparent 70%), url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Ctext x=\'50\' y=\'70\' font-size=\'70\' text-anchor=\'middle\' fill=\'%23FF69B4\'%3E⭐%3C/text%3E%3C/svg%3E")'
          }}></div>
          <div className="animated-image shine-float shine-3" style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(138,79,255,0.4) 50%, transparent 70%), url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Ctext x=\'50\' y=\'65\' font-size=\'60\' text-anchor=\'middle\' fill=\'%238A4FFF\'%3E🌟%3C/text%3E%3C/svg%3E")'
          }}></div>
          
          {/* Animation 3: Bouncing Crown */}
          <div className="animated-image crown-bounce crown-b-1" style={{
            background: 'radial-gradient(circle, rgba(255,215,0,0.4) 0%, transparent 70%), url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Ccircle cx=\'50\' cy=\'50\' r=\'40\' fill=\'%23FFF8DC\' opacity=\'0.5\'/%3E%3Ctext x=\'50\' y=\'68\' font-size=\'55\' text-anchor=\'middle\' fill=\'%23FFD700\'%3E👑%3C/text%3E%3C/svg%3E")'
          }}></div>
          <div className="animated-image crown-bounce crown-b-2" style={{
            background: 'radial-gradient(circle, rgba(255,105,180,0.4) 0%, transparent 70%), url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Ccircle cx=\'50\' cy=\'50\' r=\'40\' fill=\'%23FFE4F0\' opacity=\'0.5\'/%3E%3Ctext x=\'50\' y=\'68\' font-size=\'55\' text-anchor=\'middle\' fill=\'%23FF69B4\'%3E👑%3C/text%3E%3C/svg%3E")'
          }}></div>
          <div className="animated-image crown-bounce crown-b-3" style={{
            background: 'radial-gradient(circle, rgba(138,79,255,0.4) 0%, transparent 70%), url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Ccircle cx=\'50\' cy=\'50\' r=\'40\' fill=\'%23E6D5FF\' opacity=\'0.5\'/%3E%3Ctext x=\'50\' y=\'68\' font-size=\'55\' text-anchor=\'middle\' fill=\'%238A4FFF\'%3E👑%3C/text%3E%3C/svg%3E")'
          }}></div>
          
          {/* Animation 4: Heart Pulse */}
          <div className="animated-image heart-pulse heart-p-1" style={{
            background: 'radial-gradient(circle, rgba(255,105,180,0.5) 0%, rgba(255,182,217,0.3) 50%, transparent 70%), url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Ctext x=\'50\' y=\'68\' font-size=\'65\' text-anchor=\'middle\' fill=\'%23FF1493\'%3E💕%3C/text%3E%3C/svg%3E")'
          }}></div>
          <div className="animated-image heart-pulse heart-p-2" style={{
            background: 'radial-gradient(circle, rgba(255,20,147,0.5) 0%, rgba(255,105,180,0.3) 50%, transparent 70%), url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Ctext x=\'50\' y=\'68\' font-size=\'65\' text-anchor=\'middle\' fill=\'%23FF69B4\'%3E💖%3C/text%3E%3C/svg%3E")'
          }}></div>
          <div className="animated-image heart-pulse heart-p-3" style={{
            background: 'radial-gradient(circle, rgba(199,21,133,0.5) 0%, rgba(255,105,180,0.3) 50%, transparent 70%), url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Ctext x=\'50\' y=\'68\' font-size=\'65\' text-anchor=\'middle\' fill=\'%23C71585\'%3E💗%3C/text%3E%3C/svg%3E")'
          }}></div>
          
          {/* Animation 5: Diamond Dance */}
          <div className="animated-image diamond-dance diamond-d-1" style={{
            background: 'radial-gradient(circle, rgba(255,215,0,0.6) 0%, rgba(255,255,255,0.4) 40%, transparent 70%), url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Ctext x=\'50\' y=\'65\' font-size=\'55\' text-anchor=\'middle\' fill=\'%23FFD700\'%3E💎%3C/text%3E%3C/svg%3E")'
          }}></div>
          <div className="animated-image diamond-dance diamond-d-2" style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,215,0,0.5) 40%, transparent 70%), url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Ctext x=\'50\' y=\'70\' font-size=\'70\' text-anchor=\'middle\' fill=\'%23FFD700\'%3E💎%3C/text%3E%3C/svg%3E")'
          }}></div>
          <div className="animated-image diamond-dance diamond-d-3" style={{
            background: 'radial-gradient(circle, rgba(255,215,0,0.7) 0%, rgba(255,182,217,0.4) 40%, transparent 70%), url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Ctext x=\'50\' y=\'68\' font-size=\'60\' text-anchor=\'middle\' fill=\'%23FFD700\'%3E💎%3C/text%3E%3C/svg%3E")'
          }}></div>
          <div className="animated-image diamond-dance diamond-d-4" style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,215,0,0.6) 40%, transparent 70%), url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Ctext x=\'50\' y=\'68\' font-size=\'60\' text-anchor=\'middle\' fill=\'%23FFD700\'%3E💎%3C/text%3E%3C/svg%3E")'
          }}></div>
          
          {/* Small emoji animations - kept for extra detail */}
          <div className="jewelry-float jewelry-1">💎</div>
          <div className="jewelry-float jewelry-2">👑</div>
          <div className="jewelry-float jewelry-3">💍</div>
          <div className="jewelry-float jewelry-4">✨</div>
          <div className="jewelry-float jewelry-5">🌟</div>
          
          {/* Animation 2: Sparkle Rain */}
          <div className="sparkle-rain">✨</div>
          <div className="sparkle-rain">⭐</div>
          <div className="sparkle-rain">💫</div>
          <div className="sparkle-rain">✨</div>
          <div className="sparkle-rain">⭐</div>
          <div className="sparkle-rain">💫</div>
          
          {/* Animation 3: Heart Bubbles */}
          <div className="heart-bubble">💕</div>
          <div className="heart-bubble">💖</div>
          <div className="heart-bubble">💗</div>
          <div className="heart-bubble">💝</div>
          
          {/* Animation 4: Glitter Stars */}
          <div className="glitter-star star-1">⭐</div>
          <div className="glitter-star star-2">✨</div>
          <div className="glitter-star star-3">🌟</div>
          <div className="glitter-star star-4">💫</div>
          <div className="glitter-star star-5">⭐</div>
          
          {/* Animation 5: Crown Confetti */}
          <div className="crown-confetti crown-1">👑</div>
          <div className="crown-confetti crown-2">💎</div>
          <div className="crown-confetti crown-3">👑</div>
          <div className="crown-confetti crown-4">💎</div>
          <div className="crown-confetti crown-5">👑</div>
        </div>
        
        <div className="banner-border-decor"></div>
        
        <div className="banner-content">
            <h1 className="title-reveal">The <span className="gold-script">Archives</span></h1>
        </div>
      </header>

      <div className="filter-marquee">
        <div className="marquee-track">
           <div className="filter-group">
              {['all', 'Necklace', 'Earrings', 'Bracelets'].map(cat => (
                <button key={cat} className={`aesthetic-btn ${filter === cat ? 'active' : ''}`} onClick={() => setFilter(cat)}>{cat}</button>
              ))}
           </div>
        </div>
      </div>

      <section className="aesthetic-grid">
        {visibleItems.map((product, index) => {
            const imgSrc = getMainImage(product);
            const p = formatPrice(product.price);
            
            return (
              <div key={product._id || product.id} className="glass-card" style={{ animationDelay: `${index * 0.1}s` }} onClick={() => openModal(product)}>
                <div className="card-img-container">
                  <img src={imgSrc} alt={product.name} />
                  <div className="card-overlay"><span className="view-btn">Quick View</span></div>
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
        })}
      </section>

      {/* --- MODAL POPUP --- */}
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
                    <div key={i} className={`thumb-item ${activeImage === img ? 'active' : ''}`} onClick={() => setActiveImage(img)}>
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
                  {selectedProduct.quantity > 0 ? (
                      <span className="tag-green">IN STOCK</span>
                  ) : (
                      <span className="tag-yellow" style={{background:'#ffebee', color:'#c62828'}}>OUT OF STOCK</span>
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
                      <span className="mrp-scratch" style={{fontSize:'1rem', marginLeft:'10px'}}>₹{selectedProduct.mrp}</span>
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
                  <button className="add-btn" onClick={() => handleAddToCart(selectedProduct._id || selectedProduct.id, quantity)}>
                    ADD TO BAG
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
