import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';

const PrivacyPolicy = () => {
    // --- CURSOR ANIMATION REFS ---
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
        <div className="policy-page">

            {/* --- INTERNAL STYLES --- */}
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Jost:wght@300;400;500;600&display=swap');

        * { box-sizing: border-box; }
        
        .policy-page { 
          min-height: 100vh; 
          background: #fdfbf7; /* Luxury Cream Background */
          color: #333;
          position: relative; 
          overflow-x: hidden;
          
          /* DESKTOP: Wide Layout */
          width: 125%;
          margin-left: -12.5%;
        }

        /* --- BACKGROUND EFFECTS --- */
        .noise-overlay { 
          position: fixed; inset: 0; 
          background: url('https://grainy-gradients.vercel.app/noise.svg'); 
          opacity: 0.04; pointer-events: none; z-index: 0; 
        }
        .aura-glow {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: radial-gradient(circle at 50% 30%, rgba(212, 175, 55, 0.05) 0%, transparent 60%);
          z-index: 0; pointer-events: none;
        }

        /* --- CONTENT CONTAINER --- */
        .policy-content {
          padding: 180px 20px 100px;
          max-width: 1000px;
          margin: 0 auto;
          position: relative;
          z-index: 10;
        }

        .policy-header { text-align: center; margin-bottom: 80px; }
        
        .policy-title { 
          font-family: 'Cinzel', serif; 
          font-size: clamp(2.5rem, 5vw, 4rem); 
          color: #1a1a1a;
          margin-bottom: 20px;
        }
        
        .policy-subtitle {
          font-family: 'Jost', sans-serif;
          color: #d4af37;
          text-transform: uppercase;
          letter-spacing: 3px;
          font-size: 0.9rem;
          font-weight: 600;
        }

        /* --- POLICY SECTIONS --- */
        .policy-section { margin-bottom: 50px; }
        
        .section-heading {
          font-family: 'Cinzel', serif;
          font-size: 1.5rem;
          color: #1a1a1a;
          margin-bottom: 20px;
          border-left: 3px solid #d4af37;
          padding-left: 20px;
        }

        .policy-text {
          font-family: 'Jost', sans-serif;
          font-size: 1.05rem;
          color: #555;
          line-height: 1.8;
          margin-bottom: 15px;
        }

        .highlight { font-weight: 600; color: #333; }

        /* --- FOOTER STYLES --- */
        .luxury-footer { 
            background: #fdfbf7; color: #333; 
            padding: 80px 8vw 30px; 
            font-family: 'Jost', sans-serif; 
            border-top: 1px solid #eaeaea; 
            width: 100%; 
            position: relative; 
            z-index: 10; 
        }
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

        /* --- CUSTOM CURSOR --- */
        .custom-cursor-dot { position: fixed; width: 8px; height: 8px; background-color: #d4af37; border-radius: 50%; pointer-events: none; z-index: 99999; transform: translate(-50%, -50%); box-shadow: 0 0 10px #d4af37; }
        .custom-cursor-circle { position: fixed; width: 40px; height: 40px; border: 1px solid rgba(212, 175, 55, 0.8); border-radius: 50%; pointer-events: none; z-index: 99998; transform: translate(-50%, -50%); transition: width 0.2s, height 0.2s; }
        @media (hover: none) { .custom-cursor-dot, .custom-cursor-circle { display: none; } }

        /* --- RESPONSIVE --- */
        @media (max-width: 1200px) {
            .policy-page { width: 100%; margin-left: 0; }
            .policy-content { padding: 140px 20px 60px; }
            .footer-grid { grid-template-columns: 1fr; gap: 40px; }
            .footer-bottom { flex-direction: column; gap: 20px; text-align: center; }
        }
      `}</style>

            {/* --- CURSOR --- */}
            <div ref={cursorDot} className="custom-cursor-dot"></div>
            <div ref={cursorCircle} className="custom-cursor-circle"></div>

            <div className="noise-overlay"></div>
            <div className="aura-glow"></div>

            {/* --- MAIN CONTENT --- */}
            <div className="policy-content">

                <div className="policy-header">
                    <span className="policy-subtitle">Security & Trust</span>
                    <h1 className="policy-title">Privacy Policy</h1>
                    <p className="policy-text" style={{ maxWidth: '700px', margin: '0 auto' }}>
                        At ANB Jewels, we are committed to protecting your privacy.  This policy explains how we collect, use, and safeguard your personal information when you visit our website or make a purchase. 
                    </p>
                </div>

                <div className="policy-section">
                    <h2 className="section-heading">1. Information We Collect</h2>
                    <p className="policy-text">
                        When you visit our site or make a purchase, we may gather personal information such as your name, email address, shipping address, payment details, and contact information. 
                    </p>
                </div>

                <div className="policy-section">
                    <h2 className="section-heading">2. Use of Personal Information</h2>
                    <p className="policy-text">
                        We use the personal information we collect to process orders, communicate with you, provide customer support, and deliver products. 
                    </p>
                    <p className="policy-text">
                        With your permission, we may also use your information to send promotional materials, newsletters, or updates about our products and offers. 
                    </p>
                </div>

                <div className="policy-section">
                    <h2 className="section-heading">3. Data Security</h2>
                    <p className="policy-text">
                        We implement reasonable measures to protect your personal information from unauthorized access, loss, misuse, or alteration.  We use industry-standard security technologies and practices to secure your data. 
                    </p>
                    <p className="policy-text">
                        However, no internet transmission or electronic storage method is entirely secure.  While we strive to protect your information, we cannot guarantee complete security. 
                    </p>
                </div>

                <div className="policy-section">
                    <h2 className="section-heading">4. Third-Party Services</h2>
                    <p className="policy-text">
                        We may work with trusted third-party service providers, such as payment processors and shipping partners, who have access to your personal information solely to perform their services on our behalf. 
                    </p>
                    <p className="policy-text">
                        Our website may include links to third-party sites.  We are not responsible for their privacy practices or content and recommend reviewing their policies before sharing personal information. 
                    </p>
                </div>

                <div className="policy-section">
                    <h2 className="section-heading">5. Cookies & Tracking</h2>
                    <p className="policy-text">
                        We use cookies and similar tracking technologies to improve your browsing experience, analyze trends, and collect demographic data.  You can disable cookies through your browser settings, though this may impact certain features of our website. 
                    </p>
                </div>

                <div className="policy-section">
                    <h2 className="section-heading">6. Children's Privacy</h2>
                    <p className="policy-text">
                        Our website and services are not designed for individuals under 16 years old. We do not knowingly collect personal information from children.  If we discover such information has been collected, we will take appropriate steps to remove it. 
                    </p>
                </div>

                <div className="policy-section">
                    <h2 className="section-heading">7. Your Rights</h2>
                    <p className="policy-text">
                        You have the right to access, update, or delete your personal information.  If you wish to exercise these rights or have concerns about the information we hold, please contact us using the details provided below. 
                    </p>
                </div>

                <div className="policy-section">
                    <h2 className="section-heading">8. Website Content</h2>
                    <p className="policy-text">
                        You are not permitted to copy, reproduce, distribute, republish, download, display, post, or transmit any part of our website without our written consent.  Unauthorized use may result in copyright infringement. 
                    </p>
                    <p className="policy-text">
                        While we strive for accuracy, we are not responsible for inaccuracies or errors beyond our control.  We also cannot guarantee the exact color representation of images on different monitors. 
                    </p>
                </div>

                <div className="policy-section" style={{ textAlign: 'center', marginTop: '60px', padding: '40px', background: '#fff', borderRadius: '8px', border: '1px solid #eee' }}>
                    <h2 className="section-heading" style={{ border: 'none', padding: 0, marginBottom: '15px' }}>Updates & Contact</h2>
                    <p className="policy-text">
                        We may update this privacy policy periodically to reflect changes in our practices or legal requirements.  Please review this policy regularly for updates. 
                    </p>
                    <p className="policy-text" style={{ marginBottom: 0 }}>
                        If you have any questions, comments, or concerns about our privacy policy or data practices, please contact us at:<br />
                        <a href="mailto:jewelsanb@gmail.com" style={{ color: '#d4af37', fontWeight: '600', textDecoration: 'none', fontSize: '1.2rem' }}>jewelsanb@gmail.com</a>
                    </p>
                </div>

            </div>

            {/* --- FOOTER --- */}
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
                        <svg className="payment-icon" viewBox="0 0 38 24"><path d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z" fillOpacity="0" /><path d="M11.875 16.094l1.85-11.45h2.95l-1.85 11.45h-2.95zm9.525-11.225c-.35-.125-.9-.25-1.625-.25-1.775 0-3.025.95-3.05 2.3-.025 1 .9 1.55 1.575 1.875.7.35.925.575.925.875 0 .475-.575.7-1.1.7-.725 0-1.125-.1-1.725-.375l-.25-.125-.275 1.7c.475.225 1.325.425 2.225.425 2.1 0 3.475-1.025 3.5-2.6.025-.875-.525-1.525-1.675-2.075-.7-.35-1.125-.575-1.125-.9 0-.3.35-.6.1.1.1 1.325.125 1.575.125s1.25.25 1.5.3l-.225 1.375zM15.5 8.169c.1.25.1.45.1.45L14.475 3.32c-.075-.15-.3-.225-.55-.25h-1.95c-.35 0-.675.25-.85.65l-2.4 5.75-.1.45h2.075l.425-1.175h2.525l.225 1.175h2.725l-1.1-5.75zM11.9 8.244l.75-2.025.425 2.025h-1.175zm12.925 3.3c.025 0 .025.025.025.025.325-1.65.65-3.325.65-3.325.1-.375.325-.575.725-.625h2.2l-3.6 8.475-.2.85c-.325 1.15-1.325 1.575-2.775 1.625l-.225-.025.075-1.55c.375.1.725.15 1.05.15.55 0 .9-.225 1.05-.625.025-.15.05-.275.05-.275l-2.85-6.65h2.15l1.6 4.3 2.1-4.3h-2.05z" /></svg>
                        <svg className="payment-icon" viewBox="0 0 38 24"><path d="M22 12c0-2.8-1.6-5.2-4-6.3-2.4 1.1-4 3.5-4 6.3s1.6 5.2 4 6.3c2.4-1.1 4-3.5 4-6.3z" /><circle cx="12" cy="12" r="7" fillOpacity="0" stroke="currentColor" strokeWidth="2" /><circle cx="26" cy="12" r="7" fillOpacity="0" stroke="currentColor" strokeWidth="2" /></svg>
                        <svg className="payment-icon" viewBox="0 0 38 24"><path d="M24 10.5c-.3 0-.6.1-.9.1h-4c-.3 0-.5.2-.6.5l-.2 1.3-.2 1.3c0 .2.1.3.3.3h2c.3 0 .5-.2.5-.5l.1-.9h.8c1.3 0 2.2-.6 2.4-1.7.1-.6 0-1.1-.3-1.4-.4-.3-1-.4-1.8-.4h1.9z" /><path d="M10.7 10.5c-.3 0-.6.1-.9.1H5.8c-.3 0-.5.2-.6.5l-.2 1.3-.2 1.3c0 .2.1.3.3.3h2c.3 0 .5-.2.5-.5l.1-.9h.8c1.3 0 2.2-.6 2.4-1.7.1-.6 0-1.1-.3-1.4-.4-.3-1-.4-1.8-.4H10.7z" /><path d="M19.8 13.5h-1.9l-.3 1.5c-.1.3-.3.5-.6.5h-1.1c-.2 0-.3-.2-.2-.4l1.1-6.9c0-.2.3-.4.5-.4h2.2c1.5 0 2.7.3 3 1.6.2 1.1-.2 2.4-1.6 3.4-.6.4-1.4.6-2.2.6z" /><path d="M18.6 13.5h-1.9l-.3 1.5c-.1.3-.3.5-.6.5h-1.1c-.2 0-.3-.2-.2-.4l1.1-6.9c0-.2.3-.4.5-.4h2.2c1.5 0 2.7.3 3 1.6.2 1.1-.2 2.4-1.6 3.4-.6.4-1.4.6-2.2.6z" /></svg>
                        <svg className="payment-icon" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" fill="none" /><line x1="2" y1="10" x2="22" y2="10" stroke="currentColor" strokeWidth="2" /></svg>
                    </div>
                </div>
            </footer>

        </div>
    );
};

export default PrivacyPolicy;