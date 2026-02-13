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

  const heroImages = [
    assets.p_img1, assets.p_img2, assets.p_img3, assets.p_img4, assets.p_img5,
    assets.p_img6, assets.p_img7, assets.p_img8, assets.p_img9, assets.p_img10
  ];

  const moodboardImages = [
    assets.p_img1, assets.p_img2, assets.p_img11, assets.p_img16, assets.p_img14,
    assets.p_img18, assets.p_img20, assets.p_img25, assets.p_img23, assets.p_img10,
  ];

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
      <style>{`
        .App { 
            background: #f9f9f9;
            width: 125%;
            margin-left: -13.9%;
            overflow-x: hidden;
            position: relative;
        }

        .products-section {
            width: 100%;
            padding: 100px 5vw;
            box-sizing: border-box;
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
            border: 1px solid #eaeaea;
            background: #fff;
            cursor: pointer;
            transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
        }
        .product-card:hover {
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
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

        .shipping-bar {
            background: #d4af37;
            color: white;
            text-align: center;
            padding: 18px 0;
            font-family: 'Inter', sans-serif;
            font-size: 0.85rem;
            letter-spacing: 3px;
            text-transform: uppercase;
            width: 100%;
            font-weight: 600;
            box-shadow: 0 10px 30px rgba(212, 175, 55, 0.2);
        }

        .moodboard-section {
            padding: 80px 0;
            width: 100%;
            background: #fff;
        }

        .luxury-footer {
            background: #fdfbf7;
            color: #333;
            padding: 80px 8vw 30px;
            font-family: 'Jost', sans-serif;
            border-top: 1px solid #eaeaea;
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
            color: #1a1a1a;
            margin-bottom: 20px;
        }
        .footer-brand p {
            color: #555;
            line-height: 1.6;
            max-width: 300px;
            font-size: 0.95rem;
        }

        .footer-col h3 {
            font-family: 'Cinzel', serif;
            font-size: 1.1rem;
            color: #1a1a1a;
            margin-bottom: 25px;
            letter-spacing: 1px;
        }

        .footer-links {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .footer-links a {
            color: #666;
            text-decoration: none;
            transition: all 0.3s ease;
            font-size: 0.9rem;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .footer-links a:hover {
            color: #d4af37;
            transform: translateX(5px);
        }

        .newsletter-text {
            color: #666;
            margin-bottom: 20px;
            font-size: 0.9rem;
        }
        .subscribe-box {
            display: flex;
            margin-bottom: 25px;
        }
        .subscribe-input {
            padding: 12px;
            background: #fff;
            border: 1px solid #ddd;
            color: #333;
            flex: 1;
            outline: none;
        }
        .subscribe-input::placeholder { color: #aaa; }
        
        .subscribe-btn {
            padding: 12px 20px;
            background: #1a1a1a;
            color: #fff;
            border: none;
            cursor: pointer;
            font-weight: 600;
            text-transform: uppercase;
            transition: 0.3s;
        }
        .subscribe-btn:hover {
            background: #d4af37;
        }

        .social-icons {
            display: flex;
            gap: 15px;
        }
        .social-icon {
            width: 35px;
            height: 35px;
            border: 1px solid #ccc;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #555;
            transition: all 0.4s ease;
            cursor: pointer;
            background: #fff;
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
            border-top: 1px solid #eee;
            padding-top: 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: #777;
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
            fill: #888;
            transition: 0.3s ease;
            opacity: 0.7;
        }
        
        .payment-icon:hover {
            fill: #d4af37;
            opacity: 1;
            transform: translateY(-1px);
        }

        @media (max-width: 1200px) {
            .App {
                width: 100%;
                margin-left: 0;
            }
            
            .product-grid { grid-template-columns: 1fr; padding: 0; }
            .p-info { transform: translateY(0); opacity: 1; position: relative; background: #fff; }
            .product-card { height: auto; }
            .p-image { height: 400px; }
            
            .footer-grid {
                grid-template-columns: 1fr;
                gap: 40px;
            }
            .footer-bottom {
                flex-direction: column;
                gap: 15px;
                text-align: center;
            }
        }
      `}</style>

      <div className="noise"></div>
      <div className="cursor-dot" ref={cursorDot}></div>
      <div className="cursor-circle" ref={cursorCircle}></div>
      <div className="aura-bg"></div>

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

          <div className="hero-frame"style={{marginLeft:'-50px'}}>
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

      <div className="shipping-bar">
        ✨ Free Shipping on all orders above ₹599 — Limited Time ✨
      </div>

      <section className="moodboard-section">
        <div className="section-header">
          <span className="subtitle">INSTAGRAM @ANBJEWELLERY</span>
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
            <Link to={`/product/11`} className="p-image">
              <img src={assets.p_img11} alt="Elegant Gold Bracelet" />
            </Link>
            <div className="p-info">
              <h4>Elegant Gold Bracelet</h4>
              <span className="price">₹350.00</span>
              <p className="desc">Minimalist luxury designed for effortless daily elegance.</p>
            </div>
          </div>

          <div className="product-card">
            <Link to={`/product/35`} className="p-image">
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
                    <Link to="/policy">Shipping Policy</Link>
                    <Link to="/policy">Returns & Exchange</Link>
                    <Link to="/policy">Privacy Policy</Link>
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
                    <a href="https://instagram.com" className="social-icon instagram" aria-label="Instagram">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                    </a>
                    <a href="https://facebook.com" className="social-icon facebook" aria-label="Facebook">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                    </a>
                    <a href="https://whatsapp.com" className="social-icon whatsapp" aria-label="WhatsApp">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                    </a>
                    <a href="https://youtube.com" className="social-icon youtube" aria-label="YouTube">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
                    </a>
                    <a href="https://pinterest.com" className="social-icon pinterest" aria-label="Pinterest">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 12a4 4 0 1 1 8 0 4 4 0 0 1-8 0z"></path><path d="M12 2a10 10 0 0 0-10 10c0 4.2 2.6 7.8 6.4 9.3-.1-.8-.2-2 0-2.9l1.4-5.8c-.1-.4-.2-1-.2-1.5 0-1.4.8-2.5 1.8-2.5.9 0 1.3.7 1.3 1.5 0 .9-.6 2.3-.9 3.5-.2 1 .5 1.8 1.5 1.8 1.8 0 3.2-1.9 3.2-4.6 0-2.4-1.7-4.1-4.2-4.1-3 0-4.8 2.3-4.8 4.6 0 .9.3 1.9.8 2.5-.1.3-.2 1.2-.3 1.4-.8-.2-2.3-1.4-2.3-4.3 0-3.1 2.3-6 6.5-6 3.4 0 6 2.5 6 5.8 0 3.5-2.2 6.3-5.2 6.3-1 0-2-.5-2.3-1.1l-.6 2.4c-.2.9-1 2.6-1.5 3.5 1.1.3 2.3.5 3.5.5 5.5 0 10-4.5 10-10S17.5 2 12 2z"></path></svg>
                    </a>
                </div>
            </div>
        </div>

        <div className="footer-bottom">
            <p>Copyright © 2026 AnB Jewels. All rights reserved.</p>
            <div className="payment-methods">
               {/* Visa */}
               <svg className="payment-icon" viewBox="0 0 38 24">
                 <path d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z" fillOpacity="0"/>
                 <path d="M11.875 16.094l1.85-11.45h2.95l-1.85 11.45h-2.95zm9.525-11.225c-.35-.125-.9-.25-1.625-.25-1.775 0-3.025.95-3.05 2.3-.025 1 .9 1.55 1.575 1.875.7.35.925.575.925.875 0 .475-.575.7-1.1.7-.725 0-1.125-.1-1.725-.375l-.25-.125-.275 1.7c.475.225 1.325.425 2.225.425 2.1 0 3.475-1.025 3.5-2.6.025-.875-.525-1.525-1.675-2.075-.7-.35-1.125-.575-1.125-.9 0-.3.35-.6.1.1.1 1.325.125 1.575.125s1.25.25 1.5.3l-.225 1.375zM15.5 8.169c.1.25.1.45.1.45L14.475 3.32c-.075-.15-.3-.225-.55-.25h-1.95c-.35 0-.675.25-.85.65l-2.4 5.75-.1.45h2.075l.425-1.175h2.525l.225 1.175h2.725l-1.1-5.75zM11.9 8.244l.75-2.025.425 2.025h-1.175zm12.925 3.3c.025 0 .025.025.025.025.325-1.65.65-3.325.65-3.325.1-.375.325-.575.725-.625h2.2l-3.6 8.475-.2.85c-.325 1.15-1.325 1.575-2.775 1.625l-.225-.025.075-1.55c.375.1.725.15 1.05.15.55 0 .9-.225 1.05-.625.025-.15.05-.275.05-.275l-2.85-6.65h2.15l1.6 4.3 2.1-4.3h-2.05z"/>
               </svg>
               
               {/* Mastercard */}
               <svg className="payment-icon" viewBox="0 0 38 24">
                 <path d="M22 12c0-2.8-1.6-5.2-4-6.3-2.4 1.1-4 3.5-4 6.3s1.6 5.2 4 6.3c2.4-1.1 4-3.5 4-6.3z"/>
                 <circle cx="12" cy="12" r="7" fillOpacity="0" stroke="currentColor" strokeWidth="2"/>
                 <circle cx="26" cy="12" r="7" fillOpacity="0" stroke="currentColor" strokeWidth="2"/>
               </svg>
               
               {/* PayPal */}
               <svg className="payment-icon" viewBox="0 0 38 24">
                 <path d="M24 10.5c-.3 0-.6.1-.9.1h-4c-.3 0-.5.2-.6.5l-.2 1.3-.2 1.3c0 .2.1.3.3.3h2c.3 0 .5-.2.5-.5l.1-.9h.8c1.3 0 2.2-.6 2.4-1.7.1-.6 0-1.1-.3-1.4-.4-.3-1-.4-1.8-.4h1.9z"/>
                 <path d="M10.7 10.5c-.3 0-.6.1-.9.1H5.8c-.3 0-.5.2-.6.5l-.2 1.3-.2 1.3c0 .2.1.3.3.3h2c.3 0 .5-.2.5-.5l.1-.9h.8c1.3 0 2.2-.6 2.4-1.7.1-.6 0-1.1-.3-1.4-.4-.3-1-.4-1.8-.4H10.7z"/>
                 <path d="M19.8 13.5h-1.9l-.3 1.5c-.1.3-.3.5-.6.5h-1.1c-.2 0-.3-.2-.2-.4l1.1-6.9c0-.2.3-.4.5-.4h2.2c1.5 0 2.7.3 3 1.6.2 1.1-.2 2.4-1.6 3.4-.6.4-1.4.6-2.2.6z"/>
                 <path d="M18.6 13.5h-1.9l-.3 1.5c-.1.3-.3.5-.6.5h-1.1c-.2 0-.3-.2-.2-.4l1.1-6.9c0-.2.3-.4.5-.4h2.2c1.5 0 2.7.3 3 1.6.2 1.1-.2 2.4-1.6 3.4-.6.4-1.4.6-2.2.6z"/>
               </svg>
               
               {/* Generic Card */}
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