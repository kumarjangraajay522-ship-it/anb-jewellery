import React, { useState, useEffect, useRef, useContext } from 'react';
import { assets } from '../assets/assets';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ShopContext } from '../context/ShopContext';

const Contact = () => {
  const [btnText, setBtnText] = useState("Send Message");
  const { backendUrl } = useContext(ShopContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  
  const cursorDot = useRef(null);
  const cursorCircle = useRef(null);

  // Character state
  const [characterMessage, setCharacterMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [characterMood, setCharacterMood] = useState('happy');
  const [isJumping, setIsJumping] = useState(false);
  const [sparkleEffect, setSparkleEffect] = useState(false);
  const messageTimeoutRef = useRef(null);

  const touchMessages = [
    "Ohhh I got touched by a Queen! 👑✨",
    "Your Majesty touched me! 💕",
    "A Queen's touch! I'm blessed! 🌟",
    "Royal vibes detected! 👑💖",
    "Feeling royal now! ✨👑",
    "Queen energy is real! 💅✨"
  ];

  const formMessages = [
    "Ohhh nice message Beautiful! 💎",
    "Yasss Queen! We'll get back to you! 👑",
    "You've got amazing communication skills! ✨",
    "That's a lovely message! 💕",
    "We're honored by your message! 🌟",
    "Your words are precious! 💖"
  ];

  const hoverMessages = [
    "Ooh, writing something? Love it! 👀✨",
    "Your message matters! 💎",
    "Great thoughts, gorgeous! 👑",
    "We're listening, Queen! 💕",
    "Your voice is important! 🔥",
    "Speak your mind, Beautiful! 💅"
  ];

  // KEY FIX: Set body/html background to baby pink on mount, restore on unmount
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
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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

  useEffect(() => { 
    setTimeout(() => showCharacterMessage("Welcome Beautiful! Need help? 💕", 'happy'), 500); 
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    setBtnText("Sending...");
    
    // Show character message on form submit
    const randomMessage = formMessages[Math.floor(Math.random() * formMessages.length)];
    showCharacterMessage(randomMessage, 'love');
    
    try {
        const response = await axios.post(backendUrl + '/api/contact/add', { name, email, message });
        if (response.data.success) {
            setBtnText("Message Sent ✨");
            toast.success("Message sent successfully!");
            setName("");
            setEmail("");
            setMessage("");
        } else {
            toast.error(response.data.message);
            setBtnText("Try Again");
        }
    } catch (error) {
        console.log(error);
        toast.error("Something went wrong");
        setBtnText("Error");
    }
    setTimeout(() => setBtnText("Send Message"), 3000);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;700&family=Jost:wght@300;400;500;600&family=Pinyon+Script&display=swap');

        * { box-sizing: border-box; }

        .custom-cursor-dot, .custom-cursor-circle { display: none; }
        
        @media (pointer: fine) {
            .custom-cursor-dot {
              display: block; position: fixed; top: 0; left: 0; width: 8px; height: 8px;
              background-color: #c9557a; border-radius: 50%; pointer-events: none; z-index: 99999;
              transform: translate(-50%, -50%); box-shadow: 0 0 10px #c9557a;
            }
            .custom-cursor-circle {
              display: block; position: fixed; top: 0; left: 0; width: 40px; height: 40px;
              border: 1px solid rgba(201, 85, 122, 0.6); border-radius: 50%; pointer-events: none; z-index: 99998;
              transform: translate(-50%, -50%); transition: width 0.15s ease-out, height 0.15s ease-out;
            }
        }

        /* PAGE WRAPPER — baby pink instead of grey/taupe */
        .contact-page-wrapper {
          width: 125%; 
          margin-left: -13.9%;
          background-color: #ffe8f0;
          position: relative;
          overflow: hidden;
        }

        .contact-vogue-wrapper {
          width: 100%;
          min-height: 100vh;
          padding-top: 140px;
          padding-bottom: 80px;
          display: flex; 
          justify-content: center; 
          align-items: center;
          position: relative;
        }

        .noise-layer {
          position: absolute; top: 0; left: 0; width: 100%; height: 100%;
          background: url("https://grainy-gradients.vercel.app/noise.svg");
          opacity: 0.05; pointer-events: none; z-index: 0;
        }
        .moving-aura {
          position: absolute; top: 50%; left: 50%; width: 100vw; height: 100vh;
          background: radial-gradient(circle, rgba(201, 85, 122, 0.06), transparent 70%);
          transform: translate(-50%, -50%);
          animation: pulseAura 8s infinite alternate ease-in-out;
          z-index: 0;
        }
        @keyframes pulseAura {
          0% { transform: translate(-50%, -50%) scale(0.9); opacity: 0.5; }
          100% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
        }

        /* CARD — cream color that blends but slightly different from page */
        .vogue-card {
          width: 100%; max-width: 1100px;
          min-height: 600px;
          background: #fff5f0;
          box-shadow: 0 40px 100px rgba(0,0,0,0.5);
          display: flex; position: relative; z-index: 10;
          border-radius: 4px; overflow: hidden;
          opacity: 0; animation: fadeUp 1s ease forwards 0.2s;
        }
        @keyframes fadeUp { to { opacity: 1; transform: translateY(0); } from { transform: translateY(40px); }}

        .vogue-visual {
          width: 42%; position: relative; background: #c1adadff;
        }
        .vogue-img {
          width: 100%; height: 100%; object-fit: cover; opacity: 0.6;
          transition: transform 10s ease; display: block;
        }
        .vogue-card:hover .vogue-img { transform: scale(1.05); }

        .vogue-overlay {
          position: absolute; top: 0; left: 0; width: 100%; height: 100%;
          background: transparent;
          padding: 50px 40px; display: flex; flex-direction: column; justify-content: flex-end;
        }

        .cursive-tag { font-family: 'Pinyon Script', cursive; font-size: 2rem; color: #D4AF37; margin-bottom: 5px; }
        .serif-head { font-family: 'Cinzel', serif; font-size: 2.5rem; color: #fff; line-height: 1; margin-bottom: 20px; }
        .intro-text { font-family: 'Jost', sans-serif; font-size: 1.1rem; color: #000; line-height: 1.5; margin-bottom: 30px; font-weight: 500; }

        .info-stack { display: flex; flex-direction: column; gap: 20px; }
        .info-row { border-left: 2px solid #444; padding-left: 15px; transition: 0.3s; }
        .info-row:hover { border-left-color: #fff; padding-left: 20px; }
        .gold-label { display: block; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 2px; color: #b8860b; margin-bottom: 4px; font-weight: 600; }
        .val-text { font-family: 'Jost', sans-serif; font-size: 1.3rem; color: #000; font-weight: 500; }
        .tiny-note { margin-top: 30px; font-size: 0.9rem; color: #000; font-style: italic; font-weight: 500; }

        .vogue-form {
          width: 58%; padding: 60px 70px; display: flex; flex-direction: column; justify-content: center;
        }
        .form-titles h1 { font-family: 'Cinzel', serif; font-size: 2.6rem; color: #b8860b; margin-bottom: 8px; }
        .form-titles span { font-family: 'Jost', sans-serif; font-size: 1rem; color: #000; text-transform: uppercase; letter-spacing: 2px; }

        .luxury-form-stack { display: flex; flex-direction: column; gap: 35px; margin-top: 40px; }
        .input-animate { position: relative; }

        .input-animate input, .input-animate textarea {
          width: 100%; padding: 12px 0; font-family: 'Jost', sans-serif; font-size: 1.2rem; color: #000;
          border: none; border-bottom: 1px solid #444; background: transparent; outline: none; resize: none;
        }
        .input-animate textarea { height: 40px; }

        .input-animate label {
          position: absolute; top: 12px; left: 0; font-family: 'Jost', sans-serif; font-size: 1.1rem; color: #666;
          pointer-events: none; transition: 0.3s ease;
        }

        .input-animate input:focus ~ label, .input-animate input:not(:placeholder-shown) ~ label,
        .input-animate textarea:focus ~ label, .input-animate textarea:not(:placeholder-shown) ~ label {
          top: -12px; font-size: 0.75rem; color: #b8860b; font-weight: 600;
        }

        .gold-line {
          position: absolute; bottom: 0; left: 0; width: 0; height: 1px; background: #b8860b; transition: 0.4s;
        }
        .input-animate input:focus ~ .gold-line, .input-animate textarea:focus ~ .gold-line { width: 100%; }

        .vogue-btn {
          width: 100%; padding: 18px; margin-top: 15px; background: #fff; color: #000; border: none;
          font-family: 'Cinzel', serif; font-size: 1rem; letter-spacing: 2px; cursor: pointer; transition: 0.3s;
        }
        .vogue-btn:hover { background: #ccc; transform: translateY(-3px); box-shadow: 0 10px 20px rgba(255,255,255,0.1); }

        .faq-hint { text-align: center; margin-top: 30px; font-size: 1rem; color: #000; }
        .link { text-decoration: underline; color: #b8860b; cursor: pointer; transition: 0.3s; }
        .link:hover { color: #8b6508; }

        /* ============================================
           CHARACTER STYLES FROM COLLECTION PAGE
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

        /* ============================================
           FOOTER — same dark pink as all other pages
           ============================================ */
        .luxury-footer {
            background: #f2b8cc;
            color: #111;
            padding: 80px 8vw 30px;
            font-family: 'Jost', sans-serif;
            border-top: 1px solid #e89ab4;
            width: 100%;
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
            .contact-page-wrapper {
                width: 100%;
                margin-left: 0;
            }
            .footer-grid { grid-template-columns: 1fr; gap: 40px; }
            .footer-bottom { flex-direction: column; gap: 20px; text-align: center; }
        }

        @media (max-width: 1024px) {
          .vogue-card { flex-direction: column; max-width: 600px; }
          .vogue-visual { width: 100%; height: 350px; }
          .vogue-form { width: 100%; padding: 50px 40px; }
          .contact-vogue-wrapper { padding-top: 100px; }
        }

        @media (max-width: 600px) {
          .contact-vogue-wrapper { padding-left: 10px; padding-right: 10px; padding-top: 80px; }
          .vogue-visual { height: 300px; }
          .vogue-overlay { padding: 30px 20px; }
          .serif-head { font-size: 1.8rem; }
          .val-text { font-size: 1rem; }
          .vogue-form { padding: 40px 20px; }
          .form-titles h1 { font-size: 1.8rem; }
          .form-titles span { font-size: 0.75rem; }
          .input-animate input, .input-animate textarea { font-size: 16px; }
          .permanent-character { bottom: 15px; right: 15px; }
          .character-container { width: 140px; height: 160px; }
          .character-body { width: 70px; height: 85px; bottom: 35px; }
          .character-head { width: 60px; height: 60px; bottom: 105px; }
          .character-speech { font-size: 0.8rem; padding: 10px 15px; max-width: 180px; top: -80px; }
        }
      `}</style>

      <div className="contact-page-wrapper">
        {/* Cursor elements added back here */}
        <div ref={cursorDot} className="custom-cursor-dot"></div>
        <div ref={cursorCircle} className="custom-cursor-circle"></div>

        {/* Character Component */}
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

        <div className="contact-vogue-wrapper">
          <div className="noise-layer"></div>
          <div className="moving-aura"></div>

          <div className="vogue-card">
            <div className="vogue-visual">
              <img src={assets.p_img1} alt="Luxury Jewelry" className="vogue-img" />
              <div className="vogue-overlay">
                <div className="vogue-content">
                  <p className="cursive-tag">Assistance</p>
                  <h2 className="serif-head">Customer Support</h2>
                  <p className="intro-text">
                    If you need help with our long-lasting, everyday anti-tarnish jewellery, we're just a message away.
                  </p>
                  <div className="info-stack">
                    <div className="info-row">
                        <span className="gold-label">Email Us</span>
                        <span className="val-text">jewelsanb@gmail.com</span>
                    </div>
                    <div className="info-row">
                        <span className="gold-label">Phone Support</span>
                        <span className="val-text">+91-9355366106</span>
                    </div>
                    <div className="info-row">
                        <span className="gold-label">Working Hours</span>
                        <span className="val-text">Mon - Sat | 9:00 AM – 8:00 PM</span>
                    </div>
                  </div>
                  <div className="tiny-note">
                      Our support team typically responds within 24 business hours.
                  </div>
                </div>
              </div>
            </div>

            <div className="vogue-form">
              <div className="form-titles">
                <h1>Get in Touch</h1>
                <span>We believe in transparent communication.</span>
              </div>

              <form onSubmit={handleSend} className="luxury-form-stack">
                <div className="input-animate">
                  <input type="text" required placeholder=" " value={name} onChange={(e) => setName(e.target.value)} />
                  <label>Your Name</label>
                  <div className="gold-line"></div>
                </div>
                <div className="input-animate">
                  <input type="email" required placeholder=" " value={email} onChange={(e) => setEmail(e.target.value)} />
                  <label>Your Email</label>
                  <div className="gold-line"></div>
                </div>
                <div className="input-animate">
                  <textarea required placeholder=" " rows="3" value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
                  <label>How can we help?</label>
                  <div className="gold-line"></div>
                </div>
                <button type="submit" className="vogue-btn">{btnText}</button>
              </form>

              <div className="faq-hint">
                 Need immediate answers? <span className="link">Check FAQ</span>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
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
                 <svg className="payment-icon" viewBox="0 0 38 24"><path d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z" fillOpacity="0"/><path d="M11.875 16.094l1.85-11.45h2.95l-1.85 11.45h-2.95zm9.525-11.225c-.35-.125-.9-.25-1.625-.25-1.775 0-3.025.95-3.05 2.3-.025 1 .9 1.55 1.575 1.875.7.35.925.575.925.875 0 .475-.575.7-1.1.7-.725 0-1.125-.1-1.725-.375l-.25-.125-.275 1.7c.475.225 1.325.425 2.225.425 2.1 0 3.475-1.025 3.5-2.6.025-.875-.525-1.525-1.675-2.075-.7-.35-1.125-.575-1.125-.9 0-.3.35-.6.1.1.1 1.325.125 1.575.125s1.25.25 1.5.3l-.225 1.375zM15.5 8.169c.1.25.1.45.1.45L14.475 3.32c-.075-.15-.3-.225-.55-.25h-1.95c-.35 0-.675.25-.85.65l-2.4 5.75-.1.45h2.075l.425-1.175h2.525l.225 1.175h2.725l-1.1-5.75zM11.9 8.244l.75-2.025.425 2.025h-1.175zm12.925 3.3c.025 0 .025.025.025.025.325-1.65.65-3.325.65-3.325.1-.375.325-.575.725-.625h2.2l-3.6 8.475-.2.85c-.325 1.15-1.325 1.575-2.775 1.625l-.225-.025.075-1.55c.375.1.725.15 1.05.15.55 0 .9-.225 1.05-.625.025-.15.05-.275.05-.275l-2.85-6.65h2.15l1.6 4.3 2.1-4.3h-2.05z"/></svg>
                 <svg className="payment-icon" viewBox="0 0 38 24"><path d="M22 12c0-2.8-1.6-5.2-4-6.3-2.4 1.1-4 3.5-4 6.3s1.6 5.2 4 6.3c2.4-1.1 4-3.5 4-6.3z"/><circle cx="12" cy="12" r="7" fillOpacity="0" stroke="currentColor" strokeWidth="2"/><circle cx="26" cy="12" r="7" fillOpacity="0" stroke="currentColor" strokeWidth="2"/></svg>
                 <svg className="payment-icon" viewBox="0 0 38 24"><path d="M24 10.5c-.3 0-.6.1-.9.1h-4c-.3 0-.5.2-.6.5l-.2 1.3-.2 1.3c0 .2.1.3.3.3h2c.3 0 .5-.2.5-.5l.1-.9h.8c1.3 0 2.2-.6 2.4-1.7.1-.6 0-1.1-.3-1.4-.4-.3-1-.4-1.8-.4h1.9z"/><path d="M10.7 10.5c-.3 0-.6.1-.9.1H5.8c-.3 0-.5.2-.6.5l-.2 1.3-.2 1.3c0 .2.1.3.3.3h2c.3 0 .5-.2.5-.5l.1-.9h.8c1.3 0 2.2-.6 2.4-1.7.1-.6 0-1.1-.3-1.4-.4-.3-1-.4-1.8-.4H10.7z"/><path d="M19.8 13.5h-1.9l-.3 1.5c-.1.3-.3.5-.6.5h-1.1c-.2 0-.3-.2-.2-.4l1.1-6.9c0-.2.3-.4.5-.4h2.2c1.5 0 2.7.3 3 1.6.2 1.1-.2 2.4-1.6 3.4-.6.4-1.4.6-2.2.6z"/><path d="M18.6 13.5h-1.9l-.3 1.5c-.1.3-.3.5-.6.5h-1.1c-.2 0-.3-.2-.2-.4l1.1-6.9c0-.2.3-.4.5-.4h2.2c1.5 0 2.7.3 3 1.6.2 1.1-.2 2.4-1.6 3.4-.6.4-1.4.6-2.2.6z"/></svg>
                 <svg className="payment-icon" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/><line x1="2" y1="10" x2="22" y2="10" stroke="currentColor" strokeWidth="2"/></svg>
              </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Contact;
