import React, { useState, useEffect, useRef } from 'react';
import './hero.css';
import { assets } from '../assets/assets';
import { Link } from 'react-router-dom';

function Hero() {
  // --- STATE FOR SLIDESHOW ---
  const [currentSlide, setCurrentSlide] = useState(0);

  // --- REFS FOR ANIMATIONS ---
  const cursorDot = useRef(null);
  const cursorCircle = useRef(null);
  const frameRef = useRef(null);
  const headerRef = useRef(null);

  // Images for Slideshow
  const heroImages = [
    assets.p_img1, assets.p_img2, assets.p_img3, assets.p_img4, assets.p_img5,
    assets.p_img6, assets.p_img7, assets.p_img8, assets.p_img9, assets.p_img10
  ];

  // Images for Moodboard
  const moodboardImages = [
    assets.p_img1, assets.p_img2, assets.p_img11, assets.p_img16, assets.p_img14,
    assets.p_img18, assets.p_img20, assets.p_img25, assets.p_img23, assets.p_img10,
  ];

  // Slideshow Logic
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Mouse Move Logic (Cursor + 3D Tilt)
  useEffect(() => {
    const handleMouseMove = (e) => {
      // Custom Cursor Movement
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

      // 3D Frame Tilt Effect
      if (frameRef.current) {
        const x = (window.innerWidth / 2 - e.pageX) / 40;
        const y = (window.innerHeight / 2 - e.pageY) / 40;
        frameRef.current.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Scroll Reveal Logic
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
      {/* --- INJECTED STYLES FOR HOVER EFFECT --- */}
      <style>{`
        /* Grid Layout */
        .product-grid {
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
            gap: 40px; 
            padding: 40px;
            width: 120%;
            margin-left: -10%;
        }

        /* Product Card - With Border */
        .product-card {
            position: relative;
            overflow: hidden;
            height: 600px;
            border-radius: 4px;
            border: 1px solid #eaeaea; /* The Frame Border */
            background: #fff;
            cursor: pointer;
            transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .product-card:hover {
          /* Gold border on hover */
            box-shadow: 0 10px 30px rgba(0,0,0,0.08);
        }

        /* Image - Zoom Effect */
        .p-image {
            display: block; width: 100%; height: 100%;
        }
        .p-image img {
            width: 100%; height: 100%; object-fit: cover;
            transition: transform 0.8s ease;
        }
        .product-card:hover .p-image img {
            transform: scale(1.08);
        }

        /* Info Panel - Slide Up Reveal */
        .p-info {
            position: absolute; 
            bottom: 0; 
            left: 0; 
            width: 100%;
            padding: 30px 20px;
            background: rgba(255, 255, 255, 0.95); /* Clean White Background */
            backdrop-filter: blur(5px);
            border-top: 1px solid rgba(0,0,0,0.05);
            
            /* Hidden State */
            transform: translateY(100%); 
            opacity: 0;
            transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
            
            display: flex; 
            flex-direction: column; 
            align-items: center; 
            text-align: center;
        }

        /* Reveal on Hover */
        .product-card:hover .p-info {
            transform: translateY(0);
            opacity: 1;
        }

        /* Typography inside Card */
        .p-info h4 {
            font-family: 'Cinzel', serif;
            font-size: 1.1rem;
            color: #1a1a1a;
            margin: 0 0 5px 0;
        }
        .p-info .price {
            font-family: 'Jost', sans-serif;
            color: #d4af37; /* Gold Price */
            font-weight: 600;
            font-size: 1rem;
            margin-bottom: 10px;
            display: block;
        }
        .p-info .desc {
            font-family: 'Jost', sans-serif;
            font-size: 0.9rem;
            color: #666;
            line-height: 1.5;
            max-width: 90%;
        }

        /* Shipping Bar Styles - Updated for Ribbon look after Header */
        .shipping-bar {
            background: #d4af37;
            color: white;
            text-align: center;
            padding: 15px 0;
            font-family: 'Jost', sans-serif;
            font-size: 0.9rem;
            letter-spacing: 2px;
            text-transform: uppercase;
            width: 100%;
            margin: 20px 0;
            box-shadow: 0 4px 10px rgba(0,0,0,0.05);
            position: relative;
            z-index: 10;
        }

        /* Mobile Fix: Always show details on touch devices */
        @media (max-width: 768px) {
            .p-info { transform: translateY(0) !important; opacity: 1 !important; }
            .product-grid { padding: 20px; gap: 20px; }
        }
      `}</style>

      <div className="noise"></div>
      <div className="cursor-dot" ref={cursorDot}></div>
      <div className="cursor-circle" ref={cursorCircle}></div>
      <div className="aura-bg"></div>

      {/* --- HERO HEADER --- */}
      <header ref={headerRef} style={{ paddingTop: '50px' }}>
        <div className="hero-split">
          <div className="hero-title">
            <h2>The Aesthetic of</h2>
            <h1>Timeless<br />Elegance.</h1>
            <p className="hero-desc">
              AnB Jewellery redefines wholesale luxury. Waterproof, Anti-Tarnish,
              and dripping in gold. <strong>Free delivery on orders over ₹599.</strong>
            </p>
            <Link to="/collection" className="btn-magic">
              Shop The Collection
            </Link>
          </div>

          <div className="hero-frame">
            <div className="float-badge">✨ New Drop Live</div>
            <div className="frame-arch" ref={frameRef}>
              {heroImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  className={`slide ${index === currentSlide ? 'active' : ''}`}
                  alt={`Jewellery ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* --- SHIPPING ANNOUNCEMENT RIBBON (Placed after Header) --- */}
      <div className="shipping-bar">
        ✨ Free Shipping on all orders above ₹599 — Shop Now ✨
      </div>

      {/* --- MOODBOARD SECTION --- */}
      <section className="moodboard-section">
        <div className="section-header">
          <span style={{ display: 'block', fontSize: '0.8rem', letterSpacing: '3px', marginBottom: '10px', color: '#d4af37' }}>
            INSTAGRAM @ANBJEWELLERY
          </span>
          <h3>The Moodboard</h3>
        </div>
        <div className="scrolling-track">
          {[...moodboardImages, ...moodboardImages].map((src, i) => (
            <div className="mood-card" key={i}>
              <img src={src} alt="Moodboard" />
            </div>
          ))}
        </div>
      </section>

      {/* --- PRODUCTS SECTION --- */}
      <section className="products-section">
        <div className="section-header">
          <h3>Trending Now</h3>
        </div>

        <div className="product-grid">
          {/* PRODUCT 1 */}
          <div className="product-card">
            <Link to={`/product/1`} className="p-image">
              <img src={assets.p_img1} alt="Anti Tarnish Gold Chain" />
            </Link>
            <div className="p-info">
              <h4>Anti Tarnish Gold Chain</h4>
              <span className="price">₹169.00</span>
              <p className="desc">
                Features a premium anti-tarnish coating. Perfect for daily wear.
              </p>
            </div>
          </div>

          {/* PRODUCT 2 */}
          <div className="product-card">
            <Link to={`/product/11`} className="p-image">
              <img src={assets.p_img11} alt="Elegant Gold Bracelet" />
            </Link>
            <div className="p-info">
              <h4>Elegant Gold Bracelet</h4>
              <span className="price">₹350.00</span>
              <p className="desc">
                A delicate bracelet with diamond accents. Hypoallergenic.
              </p>
            </div>
          </div>

          {/* PRODUCT 3 */}
          <div className="product-card">
            <Link to={`/product/35`} className="p-image">
              <img src={assets.p_img35} alt="Triple Teardrop Earrings" />
            </Link>
            <div className="p-info">
              <h4>Triple Teardrop Earrings</h4>
              <span className="price">₹40.00</span>
              <p className="desc">
                Lightweight statement earrings. The perfect finishing touch.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="footer" style={{ background: '#1a1a1a', color: 'white', padding: '80px 5vw', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Cinzel', fontSize: '2rem', marginBottom: '20px' }}>AnB Jewellery</h2>
        <p style={{ color: '#888', marginBottom: '40px' }}>Wholesale Luxury. Designed for the Bold.</p>
        <div style={{ fontSize: '0.8rem', letterSpacing: '2px' }}>© 2026 ALL RIGHTS RESERVED</div>
      </footer>
    </div>
  );
}

export default Hero;