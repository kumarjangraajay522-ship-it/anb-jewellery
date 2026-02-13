import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import './collectooion.css'; 
import { ShopContext } from '../context/ShopContext'; 

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
  
  const cursorDot = useRef(null);
  const cursorCircle = useRef(null);
  const messageTimeoutRef = useRef(null);

  useEffect(() => {
    if (location.state && location.state.category) {
        setFilter(location.state.category);
    }
  }, [location.state]);

  const showCharacterMessage = (message, mood = 'happy') => {
    if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
    setCharacterMessage(message); setCharacterMood(mood); setShowMessage(true);
    setIsJumping(true); setSparkleEffect(true);
    setTimeout(() => setIsJumping(false), 600);
    setTimeout(() => setSparkleEffect(false), 1000);
    messageTimeoutRef.current = setTimeout(() => setShowMessage(false), 4000);
  };

  const handleCharacterClick = () => { showCharacterMessage("You look stunning today! 👑", 'excited'); };

  const handleAddToCart = (productId, qty) => {
    addToCart(productId, qty);
    showCharacterMessage("Great choice! Added to bag 💎", 'love');
    closeModal();
  };

  const getMainImage = (item) => {
    if (!item || !item.image) return "https://placehold.co/400x400?text=No+Image";
    if (Array.isArray(item.image)) return item.image[0];
    try { return JSON.parse(item.image)[0]; } catch(e) { return item.image; }
  };
  const getAllImages = (item) => {
    if (!item || !item.image) return [];
    if (Array.isArray(item.image)) return item.image;
    try { return JSON.parse(item.image); } catch(e) { return [item.image]; }
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
    showCharacterMessage("Take a closer look! 👀", 'happy');
  };
  const closeModal = () => { setIsAnimating(false); setTimeout(() => setSelectedProduct(null), 400); };

  useEffect(() => {
    const moveCursor = (e) => {
      if(cursorDot.current) { cursorDot.current.style.left = `${e.clientX}px`; cursorDot.current.style.top = `${e.clientY}px`; }
      if(cursorCircle.current) { setTimeout(() => { if(cursorCircle.current) { cursorCircle.current.style.left = `${e.clientX}px`; cursorCircle.current.style.top = `${e.clientY}px`; } }, 80); }
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  useEffect(() => { setTimeout(() => showCharacterMessage("Welcome Beautiful! Ready to shine? ✨👑", 'happy'), 500); }, []);
  useEffect(() => { const interval = setInterval(() => setBannerAnimation((p) => (p + 1) % 5), 5000); return () => clearInterval(interval); }, []);

  return (
    <div className={`collection-page ${selectedProduct ? 'blur-bg' : ''}`}>
      <div className="noise-overlay"></div>
      <div className="cursor-dot" ref={cursorDot}></div>
      <div className="cursor-circle" ref={cursorCircle}></div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Jost:wght@300;400;600&family=Pinyon+Script&display=swap');
        * { box-sizing: border-box; }
        body, html { margin: 0; padding: 0; overflow-x: hidden; width: 100%; }
        .collection-page { width: 125%; min-height: 100vh; background: #fff; font-family: 'Jost', sans-serif; position: relative; margin-left: -138px; }
        .col-header-banner { width: 100%; padding: 120px 20px 80px; background: linear-gradient(180deg, #FDEBF3 0%, #F4C2D7 100%); display: flex; flex-direction: column; align-items: center; text-align: center; position: relative; overflow: hidden; }
        .title-reveal { font-family: 'Cinzel', serif; font-size: clamp(2.5rem, 6vw, 4rem); color: #222; letter-spacing: 0.1em; line-height: 1; position: relative; z-index: 10; }
        .gold-script { font-family: 'Pinyon Script', cursive; color: #fff; font-size: clamp(3.5rem, 7vw, 5.5rem); line-height: 1; text-shadow: 0 2px 5px rgba(0,0,0,0.05); }
        
        /* VFX CONTAINER */
        .vfx-container { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
        
        /* Animation 1: Diamond Particles */
        .diamond-particle {
          position: absolute; width: 0; height: 0;
          border-left: 25px solid transparent; border-right: 25px solid transparent; border-bottom: 43px solid #FFD700;
          filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.8));
          animation: luxuryFloat 12s ease-in-out infinite; opacity: 0;
        }
        .diamond-particle::after {
          content: ''; position: absolute; top: 43px; left: -25px; width: 0; height: 0;
          border-left: 25px solid transparent; border-right: 25px solid transparent; border-top: 20px solid #FFD700;
        }
        .dp-1 { top: 10%; left: 5%; animation-delay: 0s; }
        .dp-2 { top: 20%; right: 8%; animation-delay: 2.5s; }
        .dp-3 { bottom: 15%; left: 12%; animation-delay: 5s; }
        .dp-4 { top: 45%; right: 6%; animation-delay: 7.5s; }
        .dp-5 { bottom: 30%; right: 15%; animation-delay: 10s; }
        @keyframes luxuryFloat {
          0%, 100% { transform: translateY(0) rotate(0deg) scale(0); opacity: 0; }
          10% { opacity: 0.9; transform: translateY(-20px) rotate(45deg) scale(1); }
          50% { transform: translateY(-40px) rotate(180deg) scale(1.3); opacity: 1; filter: drop-shadow(0 0 35px rgba(255, 215, 0, 1)); }
          90% { opacity: 0.9; }
        }
        
        /* Animation 2: Aurora Waves */
        .aurora-wave {
          position: absolute; width: 120%; height: 400px;
          background: linear-gradient(90deg, transparent 0%, rgba(255, 182, 217, 0.4) 20%, rgba(138, 79, 255, 0.4) 40%, rgba(255, 215, 0, 0.4) 60%, rgba(255, 105, 180, 0.4) 80%, transparent 100%);
          filter: blur(50px); animation: auroraFlow 15s ease-in-out infinite; opacity: 0.5;
        }
        .aw-1 { top: 0%; animation-delay: 0s; }
        .aw-2 { top: 30%; animation-delay: 5s; transform: scaleY(-1); }
        .aw-3 { bottom: 0%; animation-delay: 10s; }
        @keyframes auroraFlow {
          0%, 100% { transform: translateX(-30%) skewX(-10deg); opacity: 0.3; }
          50% { transform: translateX(30%) skewX(10deg); opacity: 0.7; }
        }
        
        .glow-orb {
          position: absolute; width: 15px; height: 15px; border-radius: 50%;
          background: radial-gradient(circle, #FFF 0%, rgba(255, 182, 217, 0.8) 40%, transparent 70%);
          animation: orbRise 10s linear infinite; box-shadow: 0 0 30px rgba(255, 182, 217, 0.9); opacity: 0;
        }
        .go-1 { bottom: -10%; left: 10%; animation-delay: 0s; }
        .go-2 { bottom: -10%; left: 25%; animation-delay: 1.5s; }
        .go-3 { bottom: -10%; left: 40%; animation-delay: 0.8s; }
        .go-4 { bottom: -10%; left: 55%; animation-delay: 2.2s; }
        .go-5 { bottom: -10%; left: 70%; animation-delay: 1.2s; }
        .go-6 { bottom: -10%; left: 85%; animation-delay: 1.8s; }
        @keyframes orbRise {
          0% { bottom: -10%; opacity: 0; transform: scale(0.5); }
          15% { opacity: 1; transform: scale(1.2); }
          85% { opacity: 1; }
          100% { bottom: 110%; opacity: 0; transform: scale(0.8) translateX(40px); }
        }
        
        /* Animation 3: Crystals */
        .crystal {
          position: absolute; width: 100px; height: 140px;
          background: linear-gradient(145deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 182, 217, 0.7) 30%, rgba(138, 79, 255, 0.6) 70%, rgba(255, 105, 180, 0.5) 100%);
          clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
          animation: crystalEmerge 12s ease-in-out infinite;
          filter: drop-shadow(0 0 30px rgba(255, 182, 217, 0.7)); opacity: 0;
        }
        .cr-1 { top: 12%; left: 8%; animation-delay: 0s; }
        .cr-2 { top: 35%; right: 10%; animation-delay: 3s; transform: rotate(180deg); }
        .cr-3 { bottom: 20%; left: 15%; animation-delay: 6s; transform: rotate(90deg); }
        .cr-4 { bottom: 35%; right: 12%; animation-delay: 9s; transform: rotate(-90deg); }
        @keyframes crystalEmerge {
          0%, 100% { transform: translateY(50px) rotate(0deg) scale(0); opacity: 0; }
          20% { opacity: 0.9; transform: translateY(0) rotate(0deg) scale(1); }
          50% { transform: translateY(-15px) rotate(10deg) scale(1.1); opacity: 1; }
          80% { opacity: 0.9; transform: translateY(0) rotate(0deg) scale(1); }
        }
        
        .geo-hexagon {
          position: absolute; width: 120px; height: 138px;
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.2) 0%, rgba(255, 105, 180, 0.2) 100%);
          clip-path: polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%);
          border: 2px solid rgba(255, 255, 255, 0.4); backdrop-filter: blur(5px);
          animation: hexFloat 18s ease-in-out infinite; opacity: 0;
        }
        .hex-1 { top: 15%; left: 10%; animation-delay: 0s; }
        .hex-2 { top: 40%; right: 12%; animation-delay: 4s; }
        .hex-3 { bottom: 25%; left: 18%; animation-delay: 8s; }
        .hex-4 { bottom: 45%; right: 15%; animation-delay: 12s; }
        @keyframes hexFloat {
          0%, 100% { transform: translateY(0) rotate(0deg) scale(0); opacity: 0; }
          25% { opacity: 0.7; transform: translateY(-30px) rotate(120deg) scale(1); }
          50% { transform: translateY(-50px) rotate(240deg) scale(1.2); }
          75% { opacity: 0.7; transform: translateY(-30px) rotate(360deg) scale(1); }
        }
        
        /* Animation 4: Light Beams */
        .light-beam {
          position: absolute; width: 4px; height: 100%;
          background: linear-gradient(to bottom, transparent 0%, rgba(255, 255, 255, 0.5) 20%, rgba(255, 215, 0, 0.6) 50%, rgba(255, 255, 255, 0.5) 80%, transparent 100%);
          animation: beamSweep 10s ease-in-out infinite;
          box-shadow: 0 0 20px rgba(255, 215, 0, 0.8); opacity: 0;
        }
        .lb-1 { left: 12%; animation-delay: 0s; }
        .lb-2 { left: 28%; animation-delay: 2s; }
        .lb-3 { left: 44%; animation-delay: 4s; }
        .lb-4 { left: 60%; animation-delay: 6s; }
        .lb-5 { left: 76%; animation-delay: 8s; }
        @keyframes beamSweep {
          0%, 100% { opacity: 0; transform: translateY(-100%) scaleY(0.5); }
          50% { opacity: 1; transform: translateY(0%) scaleY(1); }
        }
        
        .magic-circle {
          position: absolute; width: 250px; height: 250px; border: 4px solid transparent; border-radius: 50%;
          background: linear-gradient(white, white) padding-box, linear-gradient(45deg, #FFD700, #FF69B4, #8A4FFF, #FFD700) border-box;
          animation: circleSpin 15s linear infinite; opacity: 0;
        }
        .mc-inner { position: absolute; inset: 20px; border: 2px solid rgba(255, 255, 255, 0.3); border-radius: 50%; animation: circleSpin 10s linear infinite reverse; }
        .mc-1 { top: 10%; left: 10%; animation-delay: 0s; }
        .mc-2 { top: 40%; right: 8%; animation-delay: 3.75s; }
        .mc-3 { bottom: 15%; left: 15%; animation-delay: 7.5s; }
        .mc-4 { bottom: 40%; right: 12%; animation-delay: 11.25s; }
        @keyframes circleSpin {
          0% { transform: rotate(0deg) scale(0); opacity: 0; }
          20% { opacity: 0.8; transform: rotate(72deg) scale(1); }
          80% { opacity: 0.8; transform: rotate(288deg) scale(1); }
          100% { transform: rotate(360deg) scale(0); opacity: 0; }
        }
        
        /* Animation 5: Energy Burst */
        .energy-particle { position: absolute; width: 6px; height: 6px; background: #FFF; border-radius: 50%; box-shadow: 0 0 15px 3px rgba(255, 215, 0, 1); }
        .energy-center { position: absolute; top: 50%; left: 50%; width: 50px; height: 50px; transform: translate(-50%, -50%); }
        .ep-1 { animation: burst 4s ease-out infinite; animation-delay: 0s; }
        .ep-2 { animation: burst 4s ease-out infinite; animation-delay: 0.2s; }
        .ep-3 { animation: burst 4s ease-out infinite; animation-delay: 0.4s; }
        .ep-4 { animation: burst 4s ease-out infinite; animation-delay: 0.6s; }
        .ep-5 { animation: burst 4s ease-out infinite; animation-delay: 0.8s; }
        .ep-6 { animation: burst 4s ease-out infinite; animation-delay: 1s; }
        .ep-7 { animation: burst 4s ease-out infinite; animation-delay: 1.2s; }
        .ep-8 { animation: burst 4s ease-out infinite; animation-delay: 1.4s; }
        @keyframes burst {
          0% { transform: translate(0, 0) scale(0); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) scale(2); opacity: 0; }
        }
        
        .glow-overlay {
          position: absolute; inset: 0;
          background: radial-gradient(circle at 30% 40%, rgba(255, 215, 0, 0.15) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(255, 105, 180, 0.15) 0%, transparent 50%);
          animation: glowPulse 8s ease-in-out infinite;
        }
        @keyframes glowPulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
        
        /* Hide/Show VFX */
        .vfx-container > * { display: none; }
        .vfx-container.vfx-0 .diamond-particle, .vfx-container.vfx-0 .glow-overlay { display: block; }
        .vfx-container.vfx-1 .aurora-wave, .vfx-container.vfx-1 .glow-orb { display: block; }
        .vfx-container.vfx-2 .crystal, .vfx-container.vfx-2 .geo-hexagon, .vfx-container.vfx-2 .glow-overlay { display: block; }
        .vfx-container.vfx-3 .light-beam, .vfx-container.vfx-3 .magic-circle { display: block; }
        .vfx-container.vfx-4 .energy-particle, .vfx-container.vfx-4 .diamond-particle, .vfx-container.vfx-4 .glow-overlay { display: block; }
        
        /* Character Bot (kept with emojis) */
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
        .eye { width: 14px; height: 18px; background: #333; border-radius: 50% 50% 50% 50%; position: relative; animation: naturalBlink 4s infinite; }
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
        @keyframes crownShine { 0%, 100% { transform: translateX(-50%) rotate(-5deg) scale(1); opacity: 1; } 50% { transform: translateX(-50%) rotate(5deg) scale(1.1); opacity: 0.9; } }
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
        .character-speech { position: absolute; top: -100px; left: 50%; transform: translateX(-50%); background: linear-gradient(135deg, #ffffff 0%, #ffe6f0 100%); padding: 15px 25px; border-radius: 20px; box-shadow: 0 8px 25px rgba(255, 105, 180, 0.3); font-family: 'Jost', sans-serif; font-size: 1rem; font-weight: 600; color: #FF1493; white-space: nowrap; max-width: 250px; white-space: normal; text-align: center; opacity: 0; pointer-events: none; transition: opacity 0.3s ease, transform 0.3s ease; border: 2px solid #FFB6D9; }
        .character-speech.show { opacity: 1; animation: bubblePopIn 0.4s ease-out; }
        .character-speech::after { content: ''; position: absolute; bottom: -12px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 12px solid transparent; border-right: 12px solid transparent; border-top: 15px solid #FFB6D9; }
        @keyframes bubblePopIn { 0% { transform: translateX(-50%) scale(0); opacity: 0; } 70% { transform: translateX(-50%) scale(1.1); } 100% { transform: translateX(-50%) scale(1); opacity: 1; } }

        /* Grid & Cards */
        .aesthetic-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; max-width: 1400px; margin: 0 auto; padding: 60px 40px 100px; }
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

        /* Modal */
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

        /* Footer */
        .luxury-footer { background: #fdfbf7; color: #333; padding: 80px 8vw 30px; font-family: 'Jost', sans-serif; border-top: 1px solid #eaeaea; width: 100%; }
        .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1.5fr; gap: 40px; margin-bottom: 60px; }
        .footer-brand h2 { font-family: 'Cinzel', serif; font-size: 2.2rem; color: #1a1a1a; margin-bottom: 20px; }
        .footer-brand p { color: #555; line-height: 1.6; max-width: 300px; font-size: 0.95rem; }
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
        .footer-bottom { border-top: 1px solid #eee; padding-top: 30px; display: flex; justify-content: space-between; align-items: center; color: #777; font-size: 0.8rem; }
        .payment-methods { display: flex; align-items: center; gap: 15px; }
        .payment-icon { width: 38px; height: auto; fill: #888; transition: 0.3s ease; opacity: 0.7; }
        .payment-icon:hover { fill: #d4af37; opacity: 1; transform: translateY(-1px); }

        @media (max-width: 1200px) {
            .collection-page { width: 100%; margin-left: 0; }
            .aesthetic-grid { grid-template-columns: 1fr; padding: 40px 20px; }
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

      {/* Character */}
      <div className="permanent-character" onClick={handleCharacterClick}>
        <div className={`character-container ${isJumping ? 'jumping' : ''}`}>
          <div className={`character-speech ${showMessage ? 'show' : ''}`}>{characterMessage}</div>
          <div className={`character-sparkles ${sparkleEffect ? 'active' : ''}`}>
            <div className="sparkle sparkle-1">✨</div><div className="sparkle sparkle-2">⭐</div><div className="sparkle sparkle-3">💫</div><div className="sparkle sparkle-4">✨</div>
          </div>
          <div className="floating-hearts"><div className="heart heart-1">💕</div><div className="heart heart-2">💖</div><div className="heart heart-3">💗</div></div>
          <div className="character-head">
            <div className="character-crown">👑</div>
            <div className="character-eyes"><div className={`eye ${characterMood==='excited'?'excited':''}`}></div><div className={`eye ${characterMood==='excited'?'excited':''}`}></div></div>
            <div className="cheek cheek-left"></div><div className="cheek cheek-right"></div>
            <div className={`character-smile ${characterMood!=='happy'?'big-smile':''}`}></div>
          </div>
          <div className="character-arm arm-left"></div><div className="character-arm arm-right"></div>
          <div className={`character-body mood-${characterMood}`}></div>
        </div>
      </div>

      <header className="col-header-banner">
        {/* VFX ANIMATIONS - NO EMOJIS */}
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
            {filter !== 'all' && <p style={{color:'#666', marginTop:'10px', textTransform:'uppercase', letterSpacing:'2px'}}>{filter} Collection</p>}
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
                  <div className="card-overlay"><span className="view-btn">Quick View</span></div>
                </div>
                <div className="card-details">
                  <h3>{product.name}</h3>
                  <div className="premium-price">
                      <div className="price-main"><span className="p-currency">₹</span><span className="p-whole">{p.whole}</span><span className="p-decimal">{p.decimal}</span></div>
                      {product.mrp && Number(product.mrp) > Number(product.price) && <span className="mrp-scratch">₹{product.mrp}</span>}
                  </div>
                </div>
              </div>
            );
        }) : (
            <div style={{gridColumn:'1/-1', textAlign:'center', padding:'50px', color:'#999'}}>
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

      {selectedProduct && (
        <div className={`modal-wrapper ${isAnimating ? 'active' : ''}`} onClick={closeModal}>
          <div className="clean-modal-card" onClick={e => e.stopPropagation()}>
            <button className="close-btn-clean" onClick={closeModal}>✕</button>
            <div className="clean-modal-left">
               <div className="clean-main-img">
                  {isVideo(activeImage) ? <video key={activeImage} src={activeImage} autoPlay muted loop controls /> : <img src={activeImage} alt="Product" />}
               </div>
               <div className="clean-thumbnails">
                  {getAllImages(selectedProduct).map((img, i) => (
                    <div key={i} className={`thumb-item ${activeImage === img ? 'active' : ''}`} onClick={() => setActiveImage(img)}>
                        {isVideo(img) ? <><video src={img} muted style={{width:'100%', height:'100%', objectFit:'cover'}} /><div className="v-badge">▶</div></> : <img src={img} alt="thumb" />}
                    </div>
                  ))}
               </div>
            </div>
            <div className="clean-modal-right">
               <div className="clean-tags">
                  {(selectedProduct.stock > 0 || selectedProduct.quantity > 0 || (!selectedProduct.stock && !selectedProduct.quantity)) ? <span className="tag-green">IN STOCK</span> : <span className="tag-yellow" style={{background:'#ffebee', color:'#c62828'}}>OUT OF STOCK</span>}
                  {selectedProduct.bestseller && <span className="tag-yellow">Best Seller</span>}
               </div>
               <h1 className="clean-title">{selectedProduct.name}</h1>
               <div className="modal-price-box">
                  <div className="clean-price"><span className="p-currency">₹</span><span className="p-whole">{formatPrice(selectedProduct.price).whole}</span><span className="p-decimal">{formatPrice(selectedProduct.price).decimal}</span></div>
                  {selectedProduct.mrp && Number(selectedProduct.mrp) > Number(selectedProduct.price) && <span className="mrp-scratch" style={{fontSize:'1rem', marginLeft:'10px'}}>₹{selectedProduct.mrp}</span>}
               </div>
               <div className="clean-desc-block">
                  <h4>Description</h4>
                  <p>{selectedProduct.description || "No description available."}</p>
               </div>
               <div className="clean-actions">
                  <div className="clean-qty">
                      <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button><span>{quantity}</span><button onClick={() => setQuantity(q => q + 1)}>+</button>
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