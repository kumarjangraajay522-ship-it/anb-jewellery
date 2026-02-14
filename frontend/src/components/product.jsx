import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext'; 

const Product = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  // Ensure we safely destructure even if context is missing during dev
  const { products, addToCart, renderPrice } = useContext(ShopContext) || { products: [], addToCart: () => {}, renderPrice: (p) => <p>₹{p}</p> }; 
  
  const [product, setProduct] = useState(null);
  const [activeMedia, setActiveMedia] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const cursorDot = useRef(null);
  const cursorCircle = useRef(null);

  const isVideo = (url) => {
    if (!url || typeof url !== 'string') return false;
    return url.toLowerCase().endsWith('.mp4') || url.toLowerCase().endsWith('.webm');
  };

  useEffect(() => {
    if (products && products.length > 0) {
        const found = products.find(p => String(p.id || p._id) === String(productId));
        if (found) {
            setProduct(found);
            setActiveMedia(Array.isArray(found.image) ? found.image[0] : found.image);
        }
    }
  }, [productId, products]);

  // Custom Cursor Logic
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (window.matchMedia("(pointer: fine)").matches) {
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
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (!product) return <div style={{height: '100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Cinzel', fontSize:'1.5rem', background: '#fff0f5'}}>Loading Archive...</div>;

  return (
    <div className="product-page-wrapper">
      <div className="noise-overlay"></div>
      <div ref={cursorDot} className="p-cursor-dot"></div>
      <div ref={cursorCircle} className="p-cursor-circle"></div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;700&family=Jost:wght@300;400;500;600&display=swap');
        
        * { box-sizing: border-box; }
        
        /* --- Base Layout --- */
        .product-page-wrapper { 
            width: 125%; 
            min-height: 100vh; 
            background-color: #fff0f5; /* Baby Pink Theme */
            padding: 140px 8vw 80px; 
            margin-left: -12.5%; /* Centering fix for wide layout */
            position: relative;
        }

        .noise-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: url('https://grainy-gradients.vercel.app/noise.svg');
            opacity: 0.05; pointer-events: none; z-index: 0;
        }

        /* --- Breadcrumbs --- */
        .breadcrumbs {
            font-family: 'Jost', sans-serif;
            font-size: 0.85rem;
            color: #888;
            margin-bottom: 30px;
            text-transform: uppercase;
            letter-spacing: 1px;
            z-index: 10; position: relative;
        }
        .breadcrumbs span { margin: 0 8px; color: #d4af37; }
        .breadcrumbs a { text-decoration: none; color: #555; transition: 0.3s; }
        .breadcrumbs a:hover { color: #d4af37; }

        /* --- Main Grid --- */
        .product-container { 
            display: grid;
            grid-template-columns: 1.2fr 1fr;
            gap: 60px;
            max-width: 1400px;
            margin: 0 auto;
            position: relative;
            z-index: 10;
        }

        /* --- Visual Section (Left) --- */
        .prod-visual { 
            display: flex; 
            flex-direction: column; 
            gap: 20px;
        }
        
        .main-img-frame { 
            width: 100%; 
            height: 600px; 
            background: #fff; 
            border-radius: 8px;
            display: flex; 
            align-items: center; 
            justify-content: center; 
            overflow: hidden; 
            box-shadow: 0 20px 40px rgba(212, 175, 55, 0.1);
            border: 1px solid rgba(255,255,255,0.5);
            transition: transform 0.3s ease;
        }
        
        .main-media { 
            width: 100%; height: 100%; object-fit: cover; 
            transition: transform 1s ease;
        }
        .main-img-frame:hover .main-media { transform: scale(1.05); }
        
        .thumb-row { 
            display: flex; gap: 15px; justify-content: center; 
        }
        
        .thumb-box { 
            width: 80px; height: 80px; 
            cursor: pointer; 
            border: 1px solid rgba(212, 175, 55, 0.2); 
            border-radius: 6px;
            overflow: hidden; 
            transition: 0.3s; 
            opacity: 0.7;
        }
        .thumb-box:hover, .thumb-box.active { 
            border-color: #d4af37; 
            opacity: 1; 
            transform: translateY(-3px);
            box-shadow: 0 5px 15px rgba(212, 175, 55, 0.2);
        }

        /* --- Info Section (Right) --- */
        .prod-info { 
            display: flex; 
            flex-direction: column; 
            justify-content: center;
        }

        .prod-tag {
            font-family: 'Jost', sans-serif;
            font-size: 0.75rem;
            letter-spacing: 2px;
            color: #d4af37;
            text-transform: uppercase;
            font-weight: 600;
            margin-bottom: 10px;
        }
        
        .prod-title { 
            font-family: 'Cinzel', serif; 
            font-size: 3rem; 
            color: #1a1a1a; 
            margin-bottom: 15px; 
            line-height: 1.1;
        }
        
        .rating-stars {
            color: #d4af37;
            font-size: 0.9rem;
            margin-bottom: 20px;
            letter-spacing: 2px;
        }

        .price-wrapper {
            margin-bottom: 30px;
            font-family: 'Cinzel', serif;
            font-size: 1.8rem;
            color: #b76e79; /* Rose Gold Price */
            font-weight: 600;
        }

        .prod-desc { 
            font-family: 'Jost', sans-serif; 
            color: #555; 
            line-height: 1.8; 
            margin-bottom: 40px; 
            font-size: 1.05rem;
            border-left: 2px solid #e89ab4;
            padding-left: 20px;
        }
        
        /* Action Buttons */
        .action-row { 
            display: flex; gap: 20px; margin-bottom: 40px;
        }
        
        .qty-box { 
            display: flex; align-items: center; justify-content: space-between;
            border: 1px solid #d4af37; 
            height: 55px; width: 120px; padding: 0 15px; 
            background: #fff;
        }
        .qty-btn { background: none; border: none; font-size: 1.2rem; cursor: pointer; color: #333; transition: 0.2s; }
        .qty-btn:hover { color: #d4af37; }
        
        .add-btn { 
            flex: 1; 
            background: #1a1a1a; 
            color: #fff; 
            border: none; 
            font-family: 'Cinzel', serif; 
            cursor: pointer; 
            transition: 0.3s; 
            height: 55px; 
            font-size: 1rem; 
            letter-spacing: 2px; 
            text-transform: uppercase;
        }
        .add-btn:hover { 
            background: #d4af37; 
            box-shadow: 0 10px 20px rgba(212, 175, 55, 0.25);
            transform: translateY(-2px);
        }

        /* --- Trust Badges (New) --- */
        .trust-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            padding-top: 30px;
            border-top: 1px solid rgba(0,0,0,0.05);
        }
        .trust-item {
            display: flex; align-items: center; gap: 15px;
        }
        .trust-icon {
            width: 40px; height: 40px;
            background: #fff;
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            font-size: 1.2rem;
            box-shadow: 0 5px 15px rgba(0,0,0,0.05);
            color: #d4af37;
        }
        .trust-text h5 { font-family: 'Cinzel', serif; margin: 0; font-size: 0.9rem; color: #333; }
        .trust-text p { font-family: 'Jost', sans-serif; margin: 0; font-size: 0.75rem; color: #777; }

        /* --- CURSOR --- */
        .p-cursor-dot, .p-cursor-circle {
            position: fixed; top: 0; left: 0; transform: translate(-50%, -50%);
            border-radius: 50%; z-index: 9999; pointer-events: none;
        }
        .p-cursor-dot { width: 8px; height: 8px; background-color: #d4af37; }
        .p-cursor-circle { width: 40px; height: 40px; border: 1px solid rgba(212, 175, 55, 0.8); transition: 0.1s; }
        @media (hover: none) { .p-cursor-dot, .p-cursor-circle { display: none; } }

        /* --- RESPONSIVE --- */
        @media (max-width: 1024px) {
            .product-page-wrapper { width: 100%; margin-left: 0; padding: 120px 20px 40px; }
            .product-container { grid-template-columns: 1fr; gap: 40px; max-width: 600px; }
            .main-img-frame { height: 450px; }
            .prod-title { font-size: 2.2rem; }
        }
      `}</style>

      {/* --- BREADCRUMBS --- */}
      <div className="breadcrumbs">
        <Link to="/">Home</Link> <span>/</span> 
        <Link to="/collection">Collection</Link> <span>/</span> 
        {product.name}
      </div>

      <div className="product-container">
        {/* Left Side: Visuals */}
        <div className="prod-visual">
          <div className="main-img-frame">
            {isVideo(activeMedia) ? (
              <video 
                key={activeMedia} 
                src={activeMedia} 
                className="main-media" 
                autoPlay muted loop playsInline 
              />
            ) : (
              <img src={activeMedia} alt={product.name} className="main-media" />
            )}
          </div>

          <div className="thumb-row">
            {product.image && product.image.map((item, i) => (
              <div 
                key={i} 
                className={`thumb-box ${activeMedia === item ? 'active' : ''}`}
                onClick={() => setActiveMedia(item)}
              >
                {isVideo(item) ? (
                  <video src={item} style={{width:'100%', height:'100%', objectFit:'cover'}} muted />
                ) : (
                  <img src={item} style={{width:'100%', height:'100%', objectFit:'cover'}} alt="thumb" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Information */}
        <div className="prod-info">
          <span className="prod-tag">Luxury Collection</span>
          <h1 className="prod-title">{product.name}</h1>
          <div className="rating-stars">★★★★★ (4.9/5)</div>
          
          <div className="price-wrapper">
             {renderPrice ? renderPrice(product.price, product.mrp) : <p>₹{product.price}</p>}
          </div>

          <p className="prod-desc">{product.description}</p>

          <div className="action-row">
            <div className="qty-box">
              <button className="qty-btn" onClick={() => setQuantity(q => Math.max(1, q-1))}>−</button>
              <span style={{fontFamily: 'Jost', fontSize:'1.1rem'}}>{quantity}</span>
              <button className="qty-btn" onClick={() => setQuantity(q => q+1)}>+</button>
            </div>
            <button className="add-btn" onClick={() => { addToCart(product.id || product._id, quantity); alert("Added to Bag!"); }}>
              ADD TO BAG
            </button>
          </div>

          {/* New Trust Badges Section */}
          <div className="trust-grid">
              <div className="trust-item">
                  <div className="trust-icon">💧</div>
                  <div className="trust-text">
                      <h5>Waterproof</h5>
                      <p>Shower safe technology</p>
                  </div>
              </div>
              <div className="trust-item">
                  <div className="trust-icon">✨</div>
                  <div className="trust-text">
                      <h5>18K Gold</h5>
                      <p>Premium plating</p>
                  </div>
              </div>
              <div className="trust-item">
                  <div className="trust-icon">🚚</div>
                  <div className="trust-text">
                      <h5>Free Shipping</h5>
                      <p>On orders above ₹599</p>
                  </div>
              </div>
              <div className="trust-item">
                  <div className="trust-icon">🛡️</div>
                  <div className="trust-text">
                      <h5>Warranty</h5>
                      <p>6-Month shine guarantee</p>
                  </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;