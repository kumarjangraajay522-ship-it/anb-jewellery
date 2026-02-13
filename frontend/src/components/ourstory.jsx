import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom'; // Added for Footer Links
import { assets } from '../assets/assets'; 

const OurStory = () => {
  const cursorDot = useRef(null);
  const cursorCircle = useRef(null);

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

  return (
    <div className="story-container">
      
      {/* --- ATTRACTIVE LUXURY STYLES --- */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Dancing+Script:wght@600&family=Jost:wght@300;400;600&display=swap');

        /* RESET & BASE */
        * { box-sizing: border-box; }
        
        .story-container { 
          min-height: 100vh; 
          background: #fdfbf7; /* Original Cream Theme Kept */
          position: relative; 
          overflow-x: hidden;
          
          /* 1. DESKTOP: Wide Luxury Layout */
          width: 125%;
          margin-left: -13.9%;
        }

        /* --- LUXURY BACKGROUND LAYERS --- */
        .noise { 
          position: fixed; inset: 0; 
          background: url('https://grainy-gradients.vercel.app/noise.svg'); 
          opacity: 0.05; pointer-events: none; z-index: 5; 
        }

        /* Shimmering Aura Background */
        .aura-bg {
          position: fixed;
          top: 0; left: 0; width: 100%; height: 100%;
          background: radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.08) 0%, transparent 70%);
          z-index: 1;
          animation: auraPulse 12s infinite alternate ease-in-out;
        }

        @keyframes auraPulse {
          0% { transform: scale(1) translate(-5%, -5%); }
          100% { transform: scale(1.3) translate(5%, 5%); }
        }

        /* --- HERO SECTION --- */
        .story-hero {
          padding: 180px 20px 80px;
          text-align: center;
          position: relative;
          z-index: 10;
          max-width: 1200px;
          margin: 0 auto;
        }

        .script-title { 
          font-family: 'Dancing Script', cursive; 
          color: #d4af37; 
          font-size: 3rem;
          margin-bottom: 10px;
          display: block;
        }

        .hero-title { 
          font-family: 'Cinzel', serif; 
          font-size: clamp(2.5rem, 5vw, 4.5rem); 
          color: #1a1a1a;
          line-height: 1.1;
          letter-spacing: 2px;
        }

        .story-intro { 
          font-family: 'Jost', sans-serif; 
          max-width: 700px; 
          margin: 30px auto 0; 
          color: #555; 
          font-size: 1.1rem;
          line-height: 1.8;
          opacity: 0.9;
          padding: 0 20px;
        }

        /* --- CONTENT SECTIONS --- */
        .split-section { 
          display: flex; 
          align-items: center; 
          padding: 80px 10vw; 
          gap: 80px;
          position: relative;
          z-index: 10;
          max-width: 1600px;
          margin: 0 auto;
        }

        .split-section.reverse { flex-direction: row-reverse; }

        .text-panel { flex: 1; }
        .text-panel h3 { font-family: 'Cinzel', serif; font-size: 2.2rem; color: #1a1a1a; margin-bottom: 25px; }
        .text-panel p { font-family: 'Jost', sans-serif; font-size: 1.05rem; color: #444; line-height: 1.9; }

        .image-panel { flex: 1; position: relative; width: 100%; }
        .image-panel::after {
          content: '';
          position: absolute;
          inset: -15px;
          border: 1px solid rgba(212, 175, 55, 0.2);
          z-index: -1;
          border-radius: 4px;
          display: block;
        }

        .story-img { 
          width: 100%; 
          height: auto;
          border-radius: 2px; 
          box-shadow: 0 30px 60px rgba(0,0,0,0.08); 
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          display: block;
        }
        .story-img:hover { transform: scale(1.02); }

        /* --- QUOTE BLOCK --- */
        .centered-section { padding: 100px 20px; text-align: center; background: #fff; position: relative; z-index: 10; }
        .quote-block { 
          font-family: 'Cinzel', serif; 
          font-size: clamp(1.5rem, 3vw, 2.5rem); 
          color: #d4af37; 
          font-style: italic; 
          max-width: 900px; 
          margin: 0 auto;
          line-height: 1.4;
        }

        /* --- LIST STYLES --- */
        .story-list { list-style: none; margin-top: 30px; padding: 0; }
        .story-list li { 
          font-family: 'Jost', sans-serif;
          margin-bottom: 12px;
          display: flex;
          align-items: flex-start;
          gap: 15px;
          color: #1a1a1a;
          font-weight: 500;
        }
        .story-list li::before { content: '✦'; color: #d4af37; flex-shrink: 0; margin-top: 3px; }

        /* --- CUSTOM CURSOR (Hidden on touch) --- */
        .custom-cursor {
            position: fixed; pointer-events: none; z-index: 99999; border-radius: 50%; transform: translate(-50%, -50%);
            display: none;
        }
        @media (pointer: fine) {
            .custom-cursor { display: block; }
        }

        /* --- FOOTER STYLES (Light Theme) --- */
        .luxury-footer { background: #fdfbf7; color: #333; padding: 80px 8vw 30px; font-family: 'Jost', sans-serif; border-top: 1px solid #eaeaea; width: 100%; position: relative; z-index: 10; }
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

        /* --- RESPONSIVE MEDIA QUERIES --- */
        
        /* 2. TABLET/MOBILE FIX: Reset Width to 100% */
        @media (max-width: 1200px) {
            .story-container {
                width: 100%;
                margin-left: 0;
            }
            .footer-grid { grid-template-columns: 1fr; gap: 40px; }
            .footer-bottom { flex-direction: column; gap: 20px; text-align: center; }
        }

        @media (max-width: 1024px) {
           .split-section { gap: 50px; padding: 60px 5vw; }
        }

        @media (max-width: 768px) {
          /* Stack layout vertically on mobile */
          .split-section, .split-section.reverse { 
            flex-direction: column; 
            padding: 60px 20px; 
            gap: 40px; 
            text-align: left;
          }
          
          /* Adjust font sizes */
          .script-title { font-size: 2.5rem; }
          .hero-title { font-size: 2.5rem; }
          .story-intro { font-size: 1rem; }
          
          /* Adjust Image container */
          .image-panel::after { inset: -10px; }
          .text-panel h3 { font-size: 1.8rem; margin-bottom: 15px; }
          
          /* Hero padding */
          .story-hero { padding-top: 120px; }
        }
      `}</style>

      {/* --- CURSOR ELEMENTS --- */}
      <div ref={cursorDot} style={{
          position: 'fixed', top: 0, left: 0, width: '8px', height: '8px',
          backgroundColor: '#d4af37', borderRadius: '50%', pointerEvents: 'none',
          zIndex: 99999, transform: 'translate(-50%, -50%)', boxShadow: '0 0 10px #d4af37'
        }}></div>
      <div ref={cursorCircle} style={{
          position: 'fixed', top: 0, left: 0, width: '40px', height: '40px',
          border: '1px solid rgba(212, 175, 55, 0.8)', borderRadius: '50%', pointerEvents: 'none',
          zIndex: 99998, transform: 'translate(-50%, -50%)', transition: 'width 0.2s, height 0.2s'
        }}></div>

      {/* --- BACKGROUND ELEMENTS --- */}
      <div className="noise"></div>
      <div className="aura-bg"></div>

      {/* --- HERO SECTION --- */}
      <section className="story-hero">
        <span className="script-title">Our Legacy</span>
        <h1 className="hero-title">Crafting Jewellery for<br />Life's Eternal Moments.</h1>
        <p className="story-intro">
           Jewelry is the silent narrator of your most precious memories. At <b>AnB Jewels</b>, we create pieces that don't just sparkle for a day, but shine alongside you for a lifetime.
        </p>
      </section>

      {/* --- SECTION 1: THE ORIGIN --- */}
      <section className="split-section" >
        <div className="text-panel">
          <h3>The Origin</h3>
          <p>
            Our story began with a shared frustration: high-end designs that tarnished and faded under the pressure of daily wear. Jewelry meant for every day was often too fragile to handle real life.
          </p>
          <p style={{marginTop: '25px'}}>
            We redefined the standard by engineering <b>Anti-Tarnish Jewellery</b> that balances breathtaking elegance with industrial-strength durability.
          </p>
        </div>
        <div className="image-panel">
          <img src={assets.p_img31} alt="Jewelry Crafting" className="story-img" style={{height: '100%'}}/>
        </div>
      </section>

      {/* --- SECTION 2: WHY IT MATTERS --- */}
      <section className="split-section reverse">
        <div className="text-panel">
          <h3>Why Anti-Tarnish?</h3>
          <p>
            We believe your investment should be timeless. Our unique coating ensures that water, sweat, and time never dim your glow.
          </p>
          <ul className="story-list">
             <li>Everlasting Anti-Tarnish Durability</li>
             <li>Hypoallergenic & Skin-Safe Materials</li>
             <li>Effortless Luxury for Daily Routines</li>
          </ul>
        </div>
        <div className="image-panel">
          <img src={assets.p_img35} alt="Lifestyle Jewelry" className="story-img" style={{height: '100%'}}/>
        </div>
      </section>

      {/* --- SECTION 3: THE PROMISE --- */}
      <section className="centered-section">
         <div className="quote-block">
            "Because you deserve jewellery that remains as radiant as the spirit of the woman who wears it."
         </div>
      </section>

      {/* --- FOOTER ADDED HERE --- */}
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
                    <Link to="/ReturnsPolicy">Privacy Policy</Link>
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

    </div>
  );
};

export default OurStory;