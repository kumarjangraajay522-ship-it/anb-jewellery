import React, { useEffect, useRef } from 'react';
import './OurStory.css'; 
import { assets } from '../assets/assets'; //

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
          background: #fdfbf7; 
          position: relative; 
          overflow-x: hidden;
          width: 100%;
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

        /* --- RESPONSIVE MEDIA QUERIES --- */
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
      <section className="story-hero" style={{marginLeft: '10%'}}>
        <span className="script-title">Our Legacy</span>
        <h1 className="hero-title">Crafting Jewellery for<br />Life's Eternal Moments.</h1>
        <p className="story-intro">
           Jewelry is the silent narrator of your most precious memories. At <b>AnB Jewels</b>, we create pieces that don't just sparkle for a day, but shine alongside you for a lifetime.
        </p>
      </section>

      {/* --- SECTION 1: THE ORIGIN --- */}
      <section className="split-section" >
        <div className="text-panel" style={{marginLeft: '20%'}}>
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

    </div>
  );
};

export default OurStory;