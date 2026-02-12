import React, { useState, useEffect, useRef } from 'react';
import { assets } from '../assets/assets';

const Contact = () => {
  const [btnText, setBtnText] = useState("Send Message");
  
  // --- CURSOR REFS ---
  const cursorDot = useRef(null);
  const cursorCircle = useRef(null);

  // --- MOUSE MOVEMENT LOGIC ---
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

  const handleSend = (e) => {
    e.preventDefault();
    setBtnText("Sending...");
    setTimeout(() => {
      setBtnText("Message Sent ✨");
      setTimeout(() => setBtnText("Send Message"), 2000);
      e.target.reset(); 
    }, 1500);
  };

  return (
    <>
      {/* =========================================================
          INTERNAL CSS (Forces Styles to Load) 
         ========================================================= */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;700&family=Jost:wght@300;400;500;600&family=Pinyon+Script&display=swap');

        /* RESET & BASE */
        * { box-sizing: border-box; }

        /* --- 1. CUSTOM CURSOR (Desktop Only) --- */
        .custom-cursor-dot, .custom-cursor-circle { display: none; }
        
        @media (pointer: fine) {
            .custom-cursor-dot {
              display: block; position: fixed; top: 0; left: 0; width: 8px; height: 8px;
              background-color: #D4AF37; border-radius: 50%; pointer-events: none; z-index: 99999;
              transform: translate(-50%, -50%); box-shadow: 0 0 10px #D4AF37;
            }
            .custom-cursor-circle {
              display: block; position: fixed; top: 0; left: 0; width: 40px; height: 40px;
              border: 1px solid rgba(212, 175, 55, 0.6); border-radius: 50%; pointer-events: none; z-index: 99998;
              transform: translate(-50%, -50%); transition: width 0.15s ease-out, height 0.15s ease-out;
            }
        }

        /* --- 2. PAGE LAYOUT --- */
        .contact-vogue-wrapper {
          width: 100%; 
          min-height: 100vh;
          padding-top: 140px; 
          padding-bottom: 80px;
          display: flex; justify-content: center; align-items: center;
          background-color: #fdfbf7; position: relative; overflow: hidden;
          padding-left: 20px; padding-right: 20px; /* Safe area padding */
        }

        /* Background Effects */
        .noise-layer {
          position: absolute; top: 0; left: 0; width: 100%; height: 100%;
          background: url("https://grainy-gradients.vercel.app/noise.svg");
          opacity: 0.05; pointer-events: none; z-index: 0;
        }
        .moving-aura {
          position: absolute; top: 50%; left: 50%; width: 100vw; height: 100vh;
          background: radial-gradient(circle, rgba(212, 175, 55, 0.08), transparent 70%);
          transform: translate(-50%, -50%);
          animation: pulseAura 8s infinite alternate ease-in-out;
          z-index: 0;
        }
        @keyframes pulseAura {
          0% { transform: translate(-50%, -50%) scale(0.9); opacity: 0.5; }
          100% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
        }

        /* --- 3. THE VOGUE CARD --- */
        .vogue-card {
          width: 100%; max-width: 1100px; /* Flexible width */
          min-height: 600px;
          background: #fff;
          box-shadow: 0 40px 100px rgba(0,0,0,0.1);
          display: flex; position: relative; z-index: 10;
          border-radius: 4px; overflow: hidden;
          opacity: 0; animation: fadeUp 1s ease forwards 0.2s;
        }
        @keyframes fadeUp { to { opacity: 1; transform: translateY(0); } from { transform: translateY(40px); }}

        /* LEFT: VISUAL SIDE */
        .vogue-visual {
          width: 42%; position: relative; background: #000;
        }
        .vogue-img {
          width: 100%; height: 100%; object-fit: cover; opacity: 0.75;
          transition: transform 10s ease; display: block;
        }
        .vogue-card:hover .vogue-img { transform: scale(1.05); }

        .vogue-overlay {
          position: absolute; top: 0; left: 0; width: 100%; height: 100%;
          background: linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.2));
          padding: 50px 40px; display: flex; flex-direction: column; justify-content: flex-end;
        }

        /* Typography */
        .cursive-tag { font-family: 'Pinyon Script', cursive; font-size: 2rem; color: #D4AF37; margin-bottom: 5px; }
        .serif-head { font-family: 'Cinzel', serif; font-size: 2.5rem; color: #fff; line-height: 1; margin-bottom: 20px; }
        .intro-text { font-family: 'Jost', sans-serif; font-size: 0.95rem; color: #ddd; line-height: 1.5; margin-bottom: 30px; }

        /* Data Stack */
        .info-stack { display: flex; flex-direction: column; gap: 20px; }
        .info-row { border-left: 2px solid rgba(212,175,55,0.5); padding-left: 15px; transition: 0.3s; }
        .info-row:hover { border-left-color: #D4AF37; padding-left: 20px; }
        .gold-label { display: block; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 2px; color: rgba(255,255,255,0.6); margin-bottom: 4px; }
        .val-text { font-family: 'Jost', sans-serif; font-size: 1.1rem; color: #fff; font-weight: 500; }
        .tiny-note { margin-top: 30px; font-size: 0.75rem; color: rgba(255,255,255,0.4); font-style: italic; }

        /* RIGHT: FORM SIDE */
        .vogue-form {
          width: 58%; padding: 60px 70px; display: flex; flex-direction: column; justify-content: center;
        }
        .form-titles h1 { font-family: 'Cinzel', serif; font-size: 2.2rem; color: #1a1a1a; margin-bottom: 8px; }
        .form-titles span { font-family: 'Jost', sans-serif; font-size: 0.85rem; color: #888; text-transform: uppercase; letter-spacing: 2px; }

        /* Animated Inputs */
        .luxury-form-stack { display: flex; flex-direction: column; gap: 35px; margin-top: 40px; }
        .input-animate { position: relative; }

        .input-animate input, .input-animate textarea {
          width: 100%; padding: 12px 0; font-family: 'Jost', sans-serif; font-size: 1.1rem; color: #1a1a1a;
          border: none; border-bottom: 1px solid #ddd; background: transparent; outline: none; resize: none;
        }
        .input-animate textarea { height: 40px; }

        .input-animate label {
          position: absolute; top: 12px; left: 0; font-family: 'Jost', sans-serif; font-size: 1rem; color: #aaa;
          pointer-events: none; transition: 0.3s ease;
        }

        /* Floating Label Logic */
        .input-animate input:focus ~ label, .input-animate input:not(:placeholder-shown) ~ label,
        .input-animate textarea:focus ~ label, .input-animate textarea:not(:placeholder-shown) ~ label {
          top: -12px; font-size: 0.75rem; color: #D4AF37; font-weight: 600;
        }

        .gold-line {
          position: absolute; bottom: 0; left: 0; width: 0; height: 1px; background: #D4AF37; transition: 0.4s;
        }
        .input-animate input:focus ~ .gold-line, .input-animate textarea:focus ~ .gold-line { width: 100%; }

        /* Button */
        .vogue-btn {
          width: 100%; padding: 18px; margin-top: 15px; background: #111; color: #fff; border: none;
          font-family: 'Cinzel', serif; font-size: 0.9rem; letter-spacing: 2px; cursor: pointer; transition: 0.3s;
        }
        .vogue-btn:hover { background: #D4AF37; transform: translateY(-3px); box-shadow: 0 10px 20px rgba(212,175,55,0.2); }

        .faq-hint { text-align: center; margin-top: 30px; font-size: 0.85rem; color: #aaa; }
        .link { text-decoration: underline; color: #1a1a1a; cursor: pointer; transition: 0.3s; }
        .link:hover { color: #D4AF37; }

        /* --- RESPONSIVE MEDIA QUERIES --- */
        
        /* Tablet & Small Desktop */
        @media (max-width: 1024px) {
          .vogue-card { 
            flex-direction: column; 
            max-width: 600px; /* Slimmer card for portrait */
          }
          .vogue-visual { 
            width: 100%; height: 350px; 
          }
          .vogue-form { 
            width: 100%; padding: 50px 40px; 
          }
          .contact-vogue-wrapper { padding-top: 100px; }
        }

        /* Mobile Phones */
        @media (max-width: 600px) {
          .contact-vogue-wrapper {
             padding-left: 10px; padding-right: 10px; padding-top: 80px;
          }
          
          .vogue-visual { height: 300px; }
          .vogue-overlay { padding: 30px 20px; }
          
          .serif-head { font-size: 1.8rem; }
          .val-text { font-size: 1rem; }
          
          .vogue-form { padding: 40px 20px; }
          .form-titles h1 { font-size: 1.8rem; }
          .form-titles span { font-size: 0.75rem; }
          
          /* Prevent zoom on inputs for iOS */
          .input-animate input, .input-animate textarea { font-size: 16px; }
        }
      `}</style>

      <div className="contact-vogue-wrapper" >
        
        {/* --- CUSTOM CURSOR ELEMENTS --- */}
        <div ref={cursorDot} className="custom-cursor-dot"></div>
        <div ref={cursorCircle} className="custom-cursor-circle"></div>

        {/* BACKGROUND AURA */}
        <div className="noise-layer"></div>
        <div className="moving-aura"></div>

        {/* THE LUXURY CARD */}
        <div className="vogue-card">
          
          {/* LEFT: VISUAL SIDE */}
          <div className="vogue-visual">
            <img 
              src={assets.p_img1}
              alt="Luxury Jewelry" 
              className="vogue-img" 
            />
            <div className="vogue-overlay">
              <div className="vogue-content">
                <p className="cursive-tag">Assistance</p>
                <h2 className="serif-head">Customer Support</h2>
                
                <p className="intro-text">
                  If you need help with our long-lasting, everyday anti-tarnish jewellery, we’re just a message away.
                </p>
                
                <div className="info-stack">
                  {/* EMAIL */}
                  <div className="info-row">
                     <span className="gold-label">Email Us</span>
                     <span className="val-text">jewelsanb@gmail.com</span>
                  </div>

                  {/* PHONE */}
                  <div className="info-row">
                     <span className="gold-label">Phone Support</span>
                     <span className="val-text">+91-9355366106</span>
                  </div>

                  {/* HOURS */}
                  <div className="info-row">
                     <span className="gold-label">Working Hours</span>
                     <span className="val-text">Mon - Sat |9:00 AM – 8:00 PM</span>
                  </div>
                </div>

                <div className="tiny-note">
                   Our support team typically responds within 24 business hours.
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: FORM SIDE */}
          <div className="vogue-form">
            <div className="form-titles">
              <h1>Get in Touch</h1>
              <span>We believe in transparent communication.</span>
            </div>

            <form onSubmit={handleSend} className="luxury-form-stack">
              
              <div className="input-animate">
                <input type="text" required placeholder=" " />
                <label>Your Name</label>
                <div className="gold-line"></div>
              </div>

              <div className="input-animate">
                <input type="email" required placeholder=" " />
                <label>Your Email</label>
                <div className="gold-line"></div>
              </div>

              <div className="input-animate">
                <textarea required placeholder=" " rows="3"></textarea>
                <label>How can we help?</label>
                <div className="gold-line"></div>
              </div>

              <button type="submit" className="vogue-btn">
                {btnText}
              </button>

            </form>

            <div className="faq-hint">
               Need immediate answers? <span className="link">Check FAQ</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;