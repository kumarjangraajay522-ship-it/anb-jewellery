import React, { useState, useEffect, useRef } from 'react';
import './hero.css';
import { assets } from '../assets/assets';
import { Link } from 'react-router-dom';

function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const cursorDot = useRef(null);
  const cursorCircle = useRef(null);
  const frameRef = useRef(null);
  const headerRef = useRef(null);

  // ── CHARACTER STATE (same as Collection page) ──
  const [characterMessage, setCharacterMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [characterMood, setCharacterMood] = useState('happy');
  const [isJumping, setIsJumping] = useState(false);
  const [sparkleEffect, setSparkleEffect] = useState(false);
  const messageTimeoutRef = useRef(null);

  // ── POPUP ANNOUNCEMENT STATE ──
  const [showPopup, setShowPopup] = useState(false);
  const [popupDismissed, setPopupDismissed] = useState(false);

  const heroImages = [
    assets.p_img1, assets.p_img2, assets.p_img3, assets.p_img4, assets.p_img5,
    assets.p_img6, assets.p_img7, assets.p_img8, assets.p_img9, assets.p_img10
  ];

  const moodboardImages = [
    assets.p_img1, assets.p_img2, assets.p_img11, assets.p_img16, assets.p_img14,
    assets.p_img18, assets.p_img20, assets.p_img25, assets.p_img23, assets.p_img10,
  ];

  // ── CHARACTER MESSAGES ──
  const touchMessages = [
    "Ohhh I got touched by a Queen! 👑✨",
    "Your Majesty touched me! 💕",
    "A Queen's touch! I'm blessed! 🌟",
    "Royal vibes detected! 👑💖",
    "Feeling royal now! ✨👑",
    "Queen energy is real! 💅✨"
  ];

  const hoverMessages = [
    "Welcome to AnB Jewels, gorgeous! ✨",
    "You deserve all the sparkle! 💎",
    "Royalty has arrived! 👑",
    "Ready to shine today? 💕",
    "Best jewels, just for you! 🌟",
    "Treat yourself, Queen! 💅"
  ];

  const idleMessages = [
    "Pssst! Free delivery above ₹599 👀✨",
    "Did you know? Anti-tarnish = forever shine! 💎",
    "Shop more, save more! You're worth it! 👑",
    "New arrivals just dropped! Go check! 🔥",
    "Our jewels are waterproof! Yes, really! 💦✨",
    "Your dream piece is waiting... 💖",
    "Premium gold, budget prices! 👑💛"
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
    messageTimeoutRef.current = setTimeout(() => setShowMessage(false), 4500);
  };

  const handleCharacterClick = () => {
    const randomMessage = touchMessages[Math.floor(Math.random() * touchMessages.length)];
    showCharacterMessage(randomMessage, 'excited');
  };

  // ── SHOW POPUP ON MOUNT ──
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // ── IDLE CHARACTER MESSAGES ──
  useEffect(() => {
    const idleInterval = setInterval(() => {
      if (!showMessage) {
        const msg = idleMessages[Math.floor(Math.random() * idleMessages.length)];
        showCharacterMessage(msg, 'happy');
      }
    }, 12000);
    return () => clearInterval(idleInterval);
  }, [showMessage]);

  // ── WELCOME MESSAGE ──
  useEffect(() => {
    setTimeout(() => showCharacterMessage("Welcome to AnB Jewels! ✨👑", 'happy'), 2000);
  }, []);

  // --- NEW FIX: Force Scroll to Top on Page Load ---
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Tab Switch hone par wapis top par lane ka logic
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Background Color Logic
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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (cursorDot.current && cursorCircle.current) {
        cursorDot.current.style.left = `${e.clientX}px`;
        cursorDot.current.style.top = `${e.clientY}px`;
        setTimeout(() => {
          if (cursorCircle.current) {
            cursorCircle.current.style.left = `${e.clientX}px`;
            cursorCircle.current.style.top = `${e.clientY}px`;
          }
        }, 80);
      }

      if (frameRef.current) {
        const x = (window.innerWidth / 2 - e.pageX) / 40;
        const y = (window.innerHeight / 2 - e.pageY) / 40;
        frameRef.current.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal');
        }
      });
    }, { threshold: 0.1 });

    const products = document.querySelectorAll('.product-card');
    products.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="App">

      {/* --- CURSOR ELEMENTS --- */}
      <div ref={cursorDot} className="custom-cursor-dot" style={{
          position: 'fixed', top: 0, left: 0, width: '8px', height: '8px',
          backgroundColor: '#d4af37', borderRadius: '50%', pointerEvents: 'none',
          zIndex: 99999, transform: 'translate(-50%, -50%)', boxShadow: '0 0 10px #d4af37'
      }}></div>
      <div ref={cursorCircle} className="custom-cursor-circle" style={{
          position: 'fixed', top: 0, left: 0, width: '40px', height: '40px',
          border: '1px solid rgba(212, 175, 55, 0.8)', borderRadius: '50%', pointerEvents: 'none',
          zIndex: 99998, transform: 'translate(-50%, -50%)', transition: 'width 0.2s, height 0.2s'
      }}></div>

      <style>{`
        /* --- GLOBAL & UTILS --- */
        .App { 
            background: #ffe8f0;
            width: 125%;
            margin-left: -13.9%;
            overflow-x: hidden;
            position: relative;
            cursor: none; 
        }
        
        a:hover ~ .custom-cursor-circle, 
        button:hover ~ .custom-cursor-circle,
        .product-card:hover ~ .custom-cursor-circle,
        .btn-magic:hover ~ .custom-cursor-circle {
            width: 60px;
            height: 60px;
            background-color: rgba(212, 175, 55, 0.1);
            border-color: transparent;
        }

        /* --- FUTURISTIC GLASS & LASER BUTTON --- */
        .btn-magic {
            position: relative;
            display: inline-block;
            margin-top: 35px;
            padding: 18px 50px;
            font-family: 'Jost', sans-serif;
            font-size: 0.95rem;
            font-weight: 600;
            letter-spacing: 4px;
            text-transform: uppercase;
            text-decoration: none;
            background: rgba(255, 255, 255, 0.3);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            color: #5a4a2a; 
            border: 1px solid rgba(255, 255, 255, 0.6);
            border-radius: 50px;
            overflow: hidden;
            transition: all 0.4s ease;
            cursor: none;
            z-index: 1;
        }

        .btn-magic::before {
            content: "";
            position: absolute;
            top: 0;
            left: -100%;
            width: 50%;
            height: 100%;
            background: linear-gradient(120deg, transparent, rgba(255, 255, 255, 0.8), transparent);
            transform: skewX(-25deg);
            transition: 0s;
        }

        .btn-magic:hover {
            color: #fff;
            background: #d4af37;
            border-color: #d4af37;
            box-shadow: 
                0 0 10px rgba(212, 175, 55, 0.5),
                0 0 30px rgba(212, 175, 55, 0.3),
                0 0 60px rgba(212, 175, 55, 0.2);
            transform: scale(1.05);
            text-shadow: 0 0 5px rgba(255,255,255,0.5);
        }

        .btn-magic:hover::before {
            left: 200%;
            transition: 0.6s ease-in-out;
        }

        .btn-magic:active {
            transform: scale(0.95);
            box-shadow: 0 0 15px rgba(212, 175, 55, 0.4);
        }

        /* --- FEATURES BAND --- */
        .features-band {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            padding: 60px 5vw;
            background: #fff0f5;
            text-align: center;
            border-bottom: 1px solid rgba(212, 175, 55, 0.2);
        }
        .feature-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 15px;
        }
        .feature-icon {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            color: #d4af37;
            box-shadow: 0 5px 15px rgba(212, 175, 55, 0.15);
            transition: 0.3s;
        }
        .feature-item:hover .feature-icon {
            transform: translateY(-5px) rotate(10deg);
            background: #d4af37;
            color: #fff;
        }
        .feature-text h4 {
            font-family: 'Cinzel', serif;
            font-size: 1rem;
            color: #333;
            margin: 0 0 5px 0;
        }
        .feature-text p {
            font-family: 'Jost', sans-serif;
            font-size: 0.85rem;
            color: #666;
            margin: 0;
        }

        /* --- EDITORIAL SPOTLIGHT --- */
        .editorial-section {
            padding: 80px 5vw;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
        }
        .editorial-card {
            position: relative;
            height: 600px;
            border-radius: 8px;
            overflow: hidden;
            cursor: none; 
        }
        .editorial-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 1.5s ease;
        }
        .editorial-card:hover .editorial-img {
            transform: scale(1.1);
        }
        .editorial-overlay {
            position: absolute;
            inset: 0;
            background: rgba(0,0,0,0.2);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            transition: 0.3s;
        }
        .editorial-card:hover .editorial-overlay {
            background: rgba(0,0,0,0.4);
        }
        .ed-subtitle {
            font-family: 'Pinyon Script', cursive;
            color: #fff;
            font-size: 2.5rem;
            margin-bottom: 5px;
            transform: translateY(20px);
            opacity: 0;
            transition: 0.5s;
        }
        .ed-title {
            font-family: 'Cinzel', serif;
            color: #fff;
            font-size: 2.8rem;
            text-transform: uppercase;
            letter-spacing: 5px;
            margin-bottom: 20px;
            transform: translateY(20px);
            opacity: 0;
            transition: 0.5s 0.1s;
        }
        .ed-btn {
            padding: 12px 30px;
            background: #fff;
            color: #000;
            text-decoration: none;
            font-family: 'Jost', sans-serif;
            font-weight: 600;
            letter-spacing: 2px;
            transform: translateY(20px);
            opacity: 0;
            transition: 0.5s 0.2s;
        }
        .editorial-card:hover .ed-subtitle,
        .editorial-card:hover .ed-title,
        .editorial-card:hover .ed-btn {
            transform: translateY(0);
            opacity: 1;
        }

        /* --- PRODUCTS SECTION --- */
        .products-section {
            width: 100%;
            padding: 100px 5vw;
            box-sizing: border-box;
            background: #ffe8f0;
        }

        .product-grid {
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); 
            gap: 30px; 
            width: 100%;
            margin: 0 auto;
        }

        .product-card {
            position: relative;
            overflow: hidden;
            height: 550px;
            border-radius: 4px;
            border: 1px solid #f5c8d8;
            background: #fff;
            cursor: none; 
            transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
        }
        .product-card:hover {
            box-shadow: 0 20px 40px rgba(201, 85, 122, 0.12);
            border-color: #d4af37;
        }

        .p-image {
            display: block; width: 100%; height: 100%;
        }
        .p-image img {
            width: 100%; height: 100%; object-fit: cover;
            transition: transform 1.2s ease;
        }
        .product-card:hover .p-image img {
            transform: scale(1.1);
        }

        .p-info {
            position: absolute; 
            bottom: 0; left: 0; width: 100%;
            padding: 30px 20px;
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(10px);
            border-top: 1px solid rgba(212, 175, 55, 0.2);
            transform: translateY(101%); 
            opacity: 0;
            transition: all 0.6s cubic-bezier(0.19, 1, 0.22, 1);
            display: flex; flex-direction: column; align-items: center; text-align: center;
        }

        .product-card:hover .p-info {
            transform: translateY(0);
            opacity: 1;
        }

        .p-info h4 { font-family: 'Cinzel', serif; font-size: 1.1rem; color: #1a1a1a; margin-bottom: 5px; }
        .p-info .price { font-family: 'Inter', sans-serif; color: #d4af37; font-weight: 700; font-size: 1.1rem; margin-bottom: 10px; }
        .p-info .desc { font-family: 'Inter', sans-serif; font-size: 0.85rem; color: #666; line-height: 1.5; max-width: 85%; }

        /* MOODBOARD */
        .moodboard-section {
            padding: 80px 0;
            width: 100%;
            background: #ffe8f0;
        }

        /* ══════════════════════════════════════════════════════════
           CHARACTER — Exact copy from Collection page
        ══════════════════════════════════════════════════════════ */
        .permanent-character {
            position: fixed;
            bottom: 30px;
            right: 30px;
            z-index: 9998;
            cursor: pointer;
            transition: transform 0.3s ease;
        }
        .permanent-character:hover { transform: scale(1.05); }

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

        .character-body {
            position: absolute;
            bottom: 50px;
            left: 50%;
            transform: translateX(-50%);
            width: 100px;
            height: 120px;
            background: linear-gradient(135deg, #FF6EC7 0%, #B06AB3 50%, #8A4FFF 100%);
            border-radius: 50px 50px 60px 60px;
            box-shadow:
                0 15px 40px rgba(180, 106, 179, 0.5),
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

        .character-head {
            position: absolute;
            bottom: 145px;
            left: 50%;
            transform: translateX(-50%);
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #FFE4F0 0%, #FFB6D9 100%);
            border-radius: 50%;
            box-shadow:
                0 10px 30px rgba(255, 182, 217, 0.6),
                inset 0 -10px 20px rgba(255, 255, 255, 0.5);
            animation: headTilt 2s ease-in-out infinite;
        }
        @keyframes headTilt {
            0%, 100% { transform: translateX(-50%) rotate(-2deg); }
            50% { transform: translateX(-50%) rotate(2deg); }
        }

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
            top: 4px; left: 4px;
            width: 6px; height: 6px;
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
        .eye.excited { animation: excitedBlink 0.5s ease-in-out 3; }
        @keyframes excitedBlink {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.3); }
        }

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

        .cheek {
            position: absolute;
            top: 40px;
            width: 14px; height: 12px;
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

        .character-arm {
            position: absolute;
            width: 40px; height: 40px;
            background: linear-gradient(135deg, #FF6EC7 0%, #B06AB3 100%);
            border-radius: 50%;
            box-shadow: 0 5px 15px rgba(180, 106, 179, 0.4);
        }
        .arm-left {
            bottom: 90px; left: 20px;
            animation: waveLeftContinuous 2s ease-in-out infinite;
        }
        .arm-right {
            bottom: 90px; right: 20px;
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

        .character-crown {
            position: absolute;
            top: -15px; left: 50%;
            transform: translateX(-50%);
            font-size: 1.5rem;
            animation: crownShine 2s ease-in-out infinite;
        }
        @keyframes crownShine {
            0%, 100% { transform: translateX(-50%) rotate(-5deg) scale(1); opacity: 1; }
            50% { transform: translateX(-50%) rotate(5deg) scale(1.1); opacity: 0.9; }
        }

        .character-sparkles {
            position: absolute;
            width: 100%; height: 100%;
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

        .floating-hearts {
            position: absolute;
            width: 100%; height: 100%;
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

        /* ── SPEECH BUBBLE — wider, clearly visible ── */
        .character-speech {
            position: absolute;
            bottom: 240px;
            right: 0;
            background: linear-gradient(135deg, #ffffff 0%, #ffe6f0 100%);
            padding: 16px 22px;
            border-radius: 20px 20px 4px 20px;
            box-shadow: 0 10px 35px rgba(255, 105, 180, 0.35), 0 2px 8px rgba(0,0,0,0.08);
            font-family: 'Jost', sans-serif;
            font-size: 1rem;
            font-weight: 700;
            color: #c9336a;
            white-space: normal;
            max-width: 270px;
            min-width: 180px;
            text-align: center;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.35s ease, transform 0.35s ease;
            border: 2.5px solid #FFB6D9;
            transform: translateY(8px) scale(0.95);
            z-index: 10000;
            line-height: 1.45;
        }
        .character-speech.show {
            opacity: 1;
            transform: translateY(0) scale(1);
            animation: bubblePopIn 0.4s ease-out;
        }
        .character-speech::after {
            content: '';
            position: absolute;
            bottom: -13px;
            right: 28px;
            width: 0; height: 0;
            border-left: 12px solid transparent;
            border-right: 6px solid transparent;
            border-top: 15px solid #FFB6D9;
        }
        @keyframes bubblePopIn {
            0% { transform: scale(0.5) translateY(10px); opacity: 0; }
            70% { transform: scale(1.05) translateY(-2px); }
            100% { transform: scale(1) translateY(0); opacity: 1; }
        }

        /* ══════════════════════════════════════════════════════════
           POPUP ANNOUNCEMENT OVERLAY
        ══════════════════════════════════════════════════════════ */
        .popup-overlay {
            position: fixed;
            inset: 0;
            z-index: 99997;
            background: rgba(255, 182, 210, 0.45);
            backdrop-filter: blur(6px);
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.5s ease;
        }
        .popup-overlay.visible {
            opacity: 1;
            pointer-events: auto;
        }
        .popup-card {
            position: relative;
            background: linear-gradient(145deg, #fff 0%, #fff0f7 60%, #ffe6f0 100%);
            border: 2.5px solid #FFB6D9;
            border-radius: 28px;
            padding: 48px 44px 40px;
            max-width: 460px;
            width: 90%;
            text-align: center;
            box-shadow: 0 30px 80px rgba(201, 85, 122, 0.25), 0 0 0 8px rgba(255, 182, 217, 0.15);
            transform: scale(0.7) translateY(40px);
            transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.4s ease;
            opacity: 0;
            overflow: hidden;
        }
        .popup-overlay.visible .popup-card {
            transform: scale(1) translateY(0);
            opacity: 1;
        }

        /* Shimmer strip on top of popup */
        .popup-card::before {
            content: '';
            position: absolute;
            top: 0; left: -60%;
            width: 50%; height: 4px;
            background: linear-gradient(90deg, transparent, #FFD700, #FF69B4, transparent);
            border-radius: 0 0 4px 4px;
            animation: popupShimmer 2.5s ease-in-out infinite;
        }
        @keyframes popupShimmer {
            0% { left: -60%; }
            100% { left: 120%; }
        }

        /* Sparkle decorations */
        .popup-sparkle {
            position: absolute;
            font-size: 1.4rem;
            animation: floatSparkle 3s ease-in-out infinite;
            opacity: 0.7;
        }
        .ps-1 { top: 12px; left: 16px; animation-delay: 0s; }
        .ps-2 { top: 12px; right: 16px; animation-delay: 0.6s; }
        .ps-3 { bottom: 50px; left: 14px; animation-delay: 1.2s; }
        .ps-4 { bottom: 50px; right: 14px; animation-delay: 1.8s; }
        @keyframes floatSparkle {
            0%, 100% { transform: translateY(0) rotate(0deg) scale(1); }
            50% { transform: translateY(-6px) rotate(15deg) scale(1.2); }
        }

        .popup-emoji {
            font-size: 3.5rem;
            margin-bottom: 8px;
            display: block;
            animation: emojiPop 0.6s ease-out 0.5s both;
        }
        @keyframes emojiPop {
            0% { transform: scale(0) rotate(-20deg); }
            70% { transform: scale(1.2) rotate(5deg); }
            100% { transform: scale(1) rotate(0deg); }
        }

        .popup-tag {
            display: inline-block;
            background: linear-gradient(90deg, #FF69B4, #c9336a);
            color: #fff;
            font-family: 'Jost', sans-serif;
            font-size: 0.7rem;
            font-weight: 800;
            letter-spacing: 3px;
            text-transform: uppercase;
            padding: 5px 16px;
            border-radius: 30px;
            margin-bottom: 18px;
            box-shadow: 0 4px 15px rgba(201, 85, 122, 0.3);
        }

        .popup-headline {
            font-family: 'Cinzel', serif;
            font-size: 1.7rem;
            color: #111;
            line-height: 1.25;
            margin: 0 0 10px;
            letter-spacing: 0.03em;
        }
        .popup-headline span {
            color: #c9336a;
        }

        .popup-amount {
            display: inline-block;
            font-family: 'Cinzel', serif;
            font-size: 3rem;
            font-weight: 700;
            color: #c9336a;
            line-height: 1;
            margin: 8px 0 4px;
            text-shadow: 0 2px 12px rgba(201, 85, 122, 0.25);
            position: relative;
        }
        .popup-amount::after {
            content: '';
            position: absolute;
            bottom: 0; left: 0; right: 0;
            height: 3px;
            background: linear-gradient(90deg, #FF69B4, #FFD700, #FF69B4);
            border-radius: 2px;
            animation: underlinePulse 2s ease-in-out infinite;
        }
        @keyframes underlinePulse {
            0%, 100% { opacity: 0.5; transform: scaleX(0.8); }
            50% { opacity: 1; transform: scaleX(1); }
        }

        .popup-sub {
            font-family: 'Jost', sans-serif;
            font-size: 1rem;
            color: #555;
            margin: 14px 0 0;
            line-height: 1.5;
        }
        .popup-sub strong {
            color: #c9336a;
            font-weight: 700;
        }

        .popup-divider {
            width: 60px;
            height: 2px;
            background: linear-gradient(90deg, #FF69B4, #FFD700);
            margin: 20px auto;
            border-radius: 2px;
        }

        .popup-perks {
            display: flex;
            justify-content: center;
            gap: 18px;
            margin-bottom: 28px;
            flex-wrap: wrap;
        }
        .popup-perk {
            display: flex;
            align-items: center;
            gap: 6px;
            font-family: 'Jost', sans-serif;
            font-size: 0.82rem;
            color: #444;
            background: #fff;
            border: 1px solid #f0c0d8;
            padding: 6px 14px;
            border-radius: 30px;
            box-shadow: 0 2px 8px rgba(201, 85, 122, 0.08);
        }
        .popup-perk span:first-child {
            font-size: 1rem;
        }

        .popup-actions {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .popup-btn-shop {
            display: block;
            width: 100%;
            padding: 16px;
            background: linear-gradient(135deg, #FF6EC7 0%, #c9336a 100%);
            color: #fff;
            border: none;
            border-radius: 50px;
            font-family: 'Cinzel', serif;
            font-size: 0.95rem;
            letter-spacing: 2px;
            text-transform: uppercase;
            text-decoration: none;
            cursor: pointer;
            font-weight: 600;
            box-shadow: 0 8px 25px rgba(201, 85, 122, 0.35);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        .popup-btn-shop::before {
            content: '';
            position: absolute;
            top: 0; left: -100%;
            width: 50%; height: 100%;
            background: linear-gradient(120deg, transparent, rgba(255,255,255,0.4), transparent);
            transform: skewX(-25deg);
            transition: 0s;
        }
        .popup-btn-shop:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 35px rgba(201, 85, 122, 0.45);
        }
        .popup-btn-shop:hover::before {
            left: 200%;
            transition: 0.6s ease-in-out;
        }

        .popup-btn-close {
            background: none;
            border: none;
            font-family: 'Jost', sans-serif;
            font-size: 0.88rem;
            color: #aaa;
            cursor: pointer;
            letter-spacing: 1px;
            transition: color 0.3s ease;
            padding: 4px;
        }
        .popup-btn-close:hover {
            color: #c9336a;
        }

        .popup-x {
            position: absolute;
            top: 16px; right: 18px;
            background: none;
            border: none;
            font-size: 1.4rem;
            color: #ccc;
            cursor: pointer;
            transition: color 0.3s ease, transform 0.3s ease;
            line-height: 1;
            padding: 0;
        }
        .popup-x:hover {
            color: #c9336a;
            transform: rotate(90deg);
        }

        /* --- FOOTER --- */
        .luxury-footer {
            background: #f2b8cc;
            color: #111;
            padding: 80px 8vw 30px;
            font-family: 'Jost', sans-serif;
            border-top: 1px solid #e89ab4;
            cursor: auto; 
        }
        
        .footer-grid {
            display: grid;
            grid-template-columns: 2fr 1fr 1fr 1.5fr;
            gap: 40px;
            margin-bottom: 60px;
        }

        .footer-brand h2 {
            font-family: 'Cinzel', serif;
            font-size: 2.2rem;
            color: #111;
            margin-bottom: 20px;
        }
        .footer-brand p {
            color: #222;
            line-height: 1.6;
            max-width: 300px;
            font-size: 0.95rem;
        }

        .footer-col h3 {
            font-family: 'Cinzel', serif;
            font-size: 1.1rem;
            color: #111;
            margin-bottom: 25px;
            letter-spacing: 1px;
        }

        .footer-links {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .footer-links a {
            color: #222;
            text-decoration: none;
            transition: all 0.3s ease;
            font-size: 0.9rem;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .footer-links a:hover {
            color: #7a1535;
            transform: translateX(5px);
        }

        .newsletter-text {
            color: #222;
            margin-bottom: 20px;
            font-size: 0.9rem;
        }
        .subscribe-box {
            display: flex;
            margin-bottom: 25px;
        }
        .subscribe-input {
            padding: 12px;
            background: #fde8ef;
            border: 1px solid #e89ab4;
            color: #111;
            flex: 1;
            outline: none;
        }
        .subscribe-input::placeholder { color: #a06070; }
        
        .subscribe-btn {
            padding: 12px 20px;
            background: #7a1535;
            color: #fff;
            border: none;
            cursor: pointer;
            font-weight: 600;
            text-transform: uppercase;
            transition: 0.3s;
        }
        .subscribe-btn:hover {
            background: #1a1a1a;
        }

        .social-icons {
            display: flex;
            gap: 15px;
        }
        .social-icon {
            width: 35px;
            height: 35px;
            border: 1px solid #c47090;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #333;
            transition: all 0.4s ease;
            cursor: pointer;
            background: rgba(255,255,255,0.3);
        }
        .social-icon:hover {
            transform: translateY(-3px);
            color: #fff;
            border-color: transparent;
        }
        .social-icon.instagram:hover {
            background: radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%);
            box-shadow: 0 5px 15px rgba(214, 36, 159, 0.3);
        }
        .social-icon.facebook:hover {
            background: #1877F2;
            box-shadow: 0 5px 15px rgba(24, 119, 242, 0.3);
        }
        .social-icon.whatsapp:hover {
            background: #25D366;
            box-shadow: 0 5px 15px rgba(37, 211, 102, 0.3);
        }
        .social-icon.youtube:hover {
            background: #FF0000;
            box-shadow: 0 5px 15px rgba(255, 0, 0, 0.3);
        }
        .social-icon.pinterest:hover {
            background: #E60023;
            box-shadow: 0 5px 15px rgba(230, 0, 35, 0.3);
        }

        .footer-bottom {
            border-top: 1px solid #e89ab4;
            padding-top: 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: #333;
            font-size: 0.8rem;
        }
        
        .payment-methods {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        
        .payment-icon {
            width: 38px;
            height: auto;
            fill: #555;
            transition: 0.3s ease;
            opacity: 0.8;
        }
        
        .payment-icon:hover {
            fill: #7a1535;
            opacity: 1;
            transform: translateY(-1px);
        }

        @media (max-width: 1200px) {
            .App {
                width: 100%;
                margin-left: 0;
                cursor: auto; 
            }
            .hero-split{
            margin-left:-100px;
            }
            .custom-cursor-dot, .custom-cursor-circle { display: none; }
            .features-band {
                grid-template-columns: repeat(2, 1fr);
                gap: 40px;
            }
            .editorial-section {
                grid-template-columns: 1fr;
            }
            .editorial-card {
                height: 450px;
            }
            .product-grid { grid-template-columns: 1fr; padding: 0; }
            .p-info { transform: translateY(0); opacity: 1; position: relative; background: #fff; }
            .product-card { height: auto; }
            .p-image { height: 400px; }
            .footer-grid { grid-template-columns: 1fr; gap: 40px; }
            .footer-bottom { flex-direction: column; gap: 15px; text-align: center; }
            .permanent-character { bottom: 15px; right: 15px; }
            .character-container { width: 140px; height: 160px; }
            .character-body { width: 70px; height: 85px; bottom: 35px; }
            .character-head { width: 60px; height: 60px; bottom: 105px; }
            .character-speech { font-size: 0.82rem; padding: 12px 16px; max-width: 200px; bottom: 170px; }
        }
      `}</style>

      {/* ═══════════════════════════════════════════════════════════
          POPUP ANNOUNCEMENT
      ═══════════════════════════════════════════════════════════ */}
      {!popupDismissed && (
        <div className={`popup-overlay ${showPopup ? 'visible' : ''}`}>
          <div className="popup-card">
            {/* Decorative sparkles */}
            <span className="popup-sparkle ps-1">✨</span>
            <span className="popup-sparkle ps-2">💎</span>
            <span className="popup-sparkle ps-3">💖</span>
            <span className="popup-sparkle ps-4">⭐</span>

            {/* X close */}
            <button
              className="popup-x"
              onClick={() => { setShowPopup(false); setTimeout(() => setPopupDismissed(true), 500); }}
            >✕</button>

            <span className="popup-emoji">🛍️</span>
            <div className="popup-tag">Limited Time Offer</div>

            <h2 className="popup-headline">
              FREE Delivery on orders<br />
              <span>above</span>
            </h2>
            <div className="popup-amount">₹599</div>

            <p className="popup-sub">
              Shop our stunning collection and get <strong>zero delivery charges</strong> on every order above ₹599! ✨
            </p>

            <div className="popup-divider"></div>

            <div className="popup-perks">
              <div className="popup-perk"><span>💦</span><span>Waterproof</span></div>
              <div className="popup-perk"><span>✨</span><span>Anti-Tarnish</span></div>
              <div className="popup-perk"><span>🚚</span><span>Free Shipping</span></div>
            </div>

            <div className="popup-actions">
              <Link
                to="/collection"
                className="popup-btn-shop"
                onClick={() => { setShowPopup(false); setTimeout(() => setPopupDismissed(true), 500); }}
              >
                👑 Shop Now & Save!
              </Link>
              <button
                className="popup-btn-close"
                onClick={() => { setShowPopup(false); setTimeout(() => setPopupDismissed(true), 500); }}
              >
                No thanks, maybe later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          PERSISTENT CHARACTER (same as Collection page)
      ═══════════════════════════════════════════════════════════ */}
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

      {/* --- HERO HEADER --- */}
      <header ref={headerRef} style={{ paddingTop: '120px', minHeight: '90vh', marginLeft:'120px'}}>
        <div className="hero-split">
          <div className="hero-title">
            <h2>The Aesthetic of</h2>
            <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 5.5rem)' }}>Timeless<br />Elegance.</h1>
            <p className="hero-desc">
              AnB Jewellery redefines wholesale luxury. Waterproof, Anti-Tarnish,
              and dripping in gold. <strong>Free delivery on orders over ₹599.</strong>
            </p>
            <Link to="/collection" className="btn-magic">
              Shop The Collection
            </Link>
          </div>

          <div className="hero-frame" style={{marginLeft:'-50px'}}>
            <div className="float-badge">✨ New Drop Live</div>
            <div className="frame-arch" ref={frameRef}>
              {heroImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  className={`slide ${index === currentSlide ? 'active' : ''}`}
                  alt="Jewellery Slide"
                />
              ))}
            </div>
          </div>
        </div>
      </header>
      
      <section className="moodboard-section">
        <div className="section-header">
          <h3>The Moodboard</h3>
        </div>
        <div className="scrolling-track">
          {[...moodboardImages, ...moodboardImages].map((src, i) => (
            <div className="mood-card" key={i}>
              <img src={src} alt="Moodboard Aesthetic" />
            </div>
          ))}
        </div>
      </section>

      <section className="editorial-section">
          <div className="editorial-card">
              <img src={assets.p_img14} alt="Day Edit" className="editorial-img" />
              <div className="editorial-overlay">
                  <span className="ed-subtitle">The Minimalist</span>
                  <h2 className="ed-title">Day Edit</h2>
                  <Link to="/collection" className="ed-btn">SHOP NOW</Link>
              </div>
          </div>
          <div className="editorial-card">
              <img src={assets.p_img18} alt="Night Edit" className="editorial-img" />
              <div className="editorial-overlay">
                  <span className="ed-subtitle">The Statement</span>
                  <h2 className="ed-title">Night Luxe</h2>
                  <Link to="/collection" className="ed-btn">SHOP NOW</Link>
              </div>
          </div>
      </section>

      <section className="products-section">
        <div className="section-header">
          <span className="subtitle">COLLECTION 2026</span>
          <h3>Trending Now</h3>
        </div>

        <div className="product-grid">
          <div className="product-card">
            <Link to={`/product/1`} className="p-image">
              <img src={assets.p_img1} alt="Anti Tarnish Gold Chain" />
            </Link>
            <div className="p-info">
              <h4>Anti Tarnish Gold Chain</h4>
              <span className="price">₹169.00</span>
              <p className="desc">Premium 18K gold plating with advanced anti-tarnish shield.</p>
            </div>
          </div>

          <div className="product-card">
            <Link to={`/product/18`} className="p-image">
              <img src={assets.p_img11} alt="Elegant Gold Bracelet" />
            </Link>
            <div className="p-info">
              <h4>Elegant Gold Bracelet</h4>
              <span className="price">₹350.00</span>
              <p className="desc">Minimalist luxury designed for effortless daily elegance.</p>
            </div>
          </div>

          <div className="product-card">
            <Link to={`/product/29`} className="p-image">
              <img src={assets.p_img35} alt="Triple Teardrop Earrings" />
            </Link>
            <div className="p-info">
              <h4>Triple Teardrop Earrings</h4>
              <span className="price">₹40.00</span>
              <p className="desc">Lightweight statements that capture the essence of gold.</p>
            </div>
          </div>
        </div>
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
                    <Link to="/collection">Necklaces</Link>
                    <Link to="/collection">Earrings</Link>
                    <Link to="/collection">Bracelets</Link>
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
                    <a href="https://www.instagram.com/anbjewels/" className="social-icon instagram" aria-label="Instagram">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                    </a>
                    <a href="https://www.facebook.com/profile.php?id=61585987086273" className="social-icon facebook" aria-label="Facebook">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                    </a>
                    <a href="https://wa.me/919355366106" className="social-icon whatsapp" aria-label="WhatsApp">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                    </a>
                    <a href="https://www.instagram.com/anbjewels/" className="social-icon youtube" aria-label="YouTube">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
                    </a>
                    <a href="https://www.instagram.com/anbjewels/" className="social-icon pinterest" aria-label="Pinterest">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 12a4 4 0 1 1 8 0 4 4 0 0 1-8 0z"></path><path d="M12 2a10 10 0 0 0-10 10c0 4.2 2.6 7.8 6.4 9.3-.1-.8-.2-2 0-2.9l1.4-5.8c-.1-.4-.2-1-.2-1.5 0-1.4.8-2.5 1.8-2.5.9 0 1.3.7 1.3 1.5 0 .9-.6 2.3-.9 3.5-.2 1 .5 1.8 1.5 1.8 1.8 0 3.2-1.9 3.2-4.6 0-2.4-1.7-4.1-4.2-4.1-3 0-4.8 2.3-4.8 4.6 0 .9.3 1.9.8 2.5-.1.3-.2 1.2-.3 1.4-.8-.2-2.3-1.4-2.3-4.3 0-3.1 2.3-6 6.5-6 3.4 0 6 2.5 6 5.8 0 3.5-2.2 6.3-5.2 6.3-1 0-2-.5-2.3-1.1l-.6 2.4c-.2.9-1 2.6-1.5 3.5 1.1.3 2.3.5 3.5.5 5.5 0 10-4.5 10-10S17.5 2 12 2z"></path></svg>
                    </a>
                </div>
            </div>
        </div>

        <div className="footer-bottom">
            <p>Copyright © 2026 AnB Jewels. All rights reserved.</p>
            <div className="payment-methods">
               <svg className="payment-icon" viewBox="0 0 38 24">
                 <path d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z" fillOpacity="0"/>
                 <path d="M11.875 16.094l1.85-11.45h2.95l-1.85 11.45h-2.95zm9.525-11.225c-.35-.125-.9-.25-1.625-.25-1.775 0-3.025.95-3.05 2.3-.025 1 .9 1.55 1.575 1.875.7.35.925.575.925.875 0 .475-.575.7-1.1.7-.725 0-1.125-.1-1.725-.375l-.25-.125-.275 1.7c.475.225 1.325.425 2.225.425 2.1 0 3.475-1.025 3.5-2.6.025-.875-.525-1.525-1.675-2.075-.7-.35-1.125-.575-1.125-.9 0-.3.35-.6.1.1.1 1.325.125 1.575.125s1.25.25 1.5.3l-.225 1.375zM15.5 8.169c.1.25.1.45.1.45L14.475 3.32c-.075-.15-.3-.225-.55-.25h-1.95c-.35 0-.675.25-.85.65l-2.4 5.75-.1.45h2.075l.425-1.175h2.525l.225 1.175h2.725l-1.1-5.75zM11.9 8.244l.75-2.025.425 2.025h-1.175zm12.925 3.3c.025 0 .025.025.025.025.325-1.65.65-3.325.65-3.325.1-.375.325-.575.725-.625h2.2l-3.6 8.475-.2.85c-.325 1.15-1.325 1.575-2.775 1.625l-.225-.025.075-1.55c.375.1.725.15 1.05.15.55 0 .9-.225 1.05-.625.025-.15.05-.275.05-.275l-2.85-6.65h2.15l1.6 4.3 2.1-4.3h-2.05z"/>
               </svg>
               <svg className="payment-icon" viewBox="0 0 38 24">
                 <path d="M22 12c0-2.8-1.6-5.2-4-6.3-2.4 1.1-4 3.5-4 6.3s1.6 5.2 4 6.3c2.4-1.1 4-3.5 4-6.3z"/>
                 <circle cx="12" cy="12" r="7" fillOpacity="0" stroke="currentColor" strokeWidth="2"/>
                 <circle cx="26" cy="12" r="7" fillOpacity="0" stroke="currentColor" strokeWidth="2"/>
               </svg>
               <svg className="payment-icon" viewBox="0 0 38 24">
                 <path d="M24 10.5c-.3 0-.6.1-.9.1h-4c-.3 0-.5.2-.6.5l-.2 1.3-.2 1.3c0 .2.1.3.3.3h2c.3 0 .5-.2.5-.5l.1-.9h.8c1.3 0 2.2-.6 2.4-1.7.1-.6 0-1.1-.3-1.4-.4-.3-1-.4-1.8-.4h1.9z"/>
                 <path d="M10.7 10.5c-.3 0-.6.1-.9.1H5.8c-.3 0-.5.2-.6.5l-.2 1.3-.2 1.3c0 .2.1.3.3.3h2c.3 0 .5-.2.5-.5l.1-.9h.8c1.3 0 2.2-.6 2.4-1.7.1-.6 0-1.1-.3-1.4-.4-.3-1-.4-1.8-.4H10.7z"/>
                 <path d="M19.8 13.5h-1.9l-.3 1.5c-.1.3-.3.5-.6.5h-1.1c-.2 0-.3-.2-.2-.4l1.1-6.9c0-.2.3-.4.5-.4h2.2c1.5 0 2.7.3 3 1.6.2 1.1-.2 2.4-1.6 3.4-.6.4-1.4.6-2.2.6z"/>
                 <path d="M18.6 13.5h-1.9l-.3 1.5c-.1.3-.3.5-.6.5h-1.1c-.2 0-.3-.2-.2-.4l1.1-6.9c0-.2.3-.4.5-.4h2.2c1.5 0 2.7.3 3 1.6.2 1.1-.2 2.4-1.6 3.4-.6.4-1.4.6-2.2.6z"/>
               </svg>
               <svg className="payment-icon" viewBox="0 0 24 24">
                 <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                 <line x1="2" y1="10" x2="22" y2="10" stroke="currentColor" strokeWidth="2"/>
               </svg>
            </div>
        </div>
      </footer>
    </div>
  );
}

export default Hero;
