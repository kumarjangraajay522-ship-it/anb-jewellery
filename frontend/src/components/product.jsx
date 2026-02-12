import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

  // Custom Cursor Logic (Only active on devices with a mouse/fine pointer)
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

  if (!product) return <div style={{padding:'200px', textAlign:'center', fontFamily:'Cinzel', fontSize:'1.5rem'}}>Loading Archive...</div>;

  return (
    <div className="product-page-wrapper">
      <div ref={cursorDot} className="p-cursor-dot"></div>
      <div ref={cursorCircle} className="p-cursor-circle"></div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Jost:wght@300;400;600&display=swap');
        
        * { box-sizing: border-box; }
        
        /* --- Base Layout --- */
        .product-page-wrapper { 
            width: 100%; 
            min-height: 100vh; 
            background-color: #fdfbf7; 
            padding: 140px 20px 80px; /* Desktop Padding */
            display: flex; 
            justify-content: center; 
        }

        .product-container { 
            width: 100%; 
            max-width: 1100px; 
            background: #fff; 
            display: flex; 
            flex-direction: row; /* Default: Side by Side */
            border-radius: 4px; 
            overflow: hidden; 
            box-shadow: 0 20px 60px rgba(0,0,0,0.05); 
        }

        /* --- Visual Section (Left) --- */
        .prod-visual { 
            width: 50%; 
            padding: 40px; 
            background: #fafafa; 
            display: flex; 
            flex-direction: column; 
            align-items: center; 
        }
        
        .main-img-frame { 
            width: 100%; 
            height: 500px; 
            background: #fff; 
            border: 1px solid #eee; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            overflow: hidden; 
        }
        
        .main-media { 
            width: 100%; 
            height: 100%; 
            object-fit: cover; 
        }
        
        .thumb-row { 
            display: flex; 
            gap: 10px; 
            margin-top: 20px; 
            flex-wrap: wrap; 
            justify-content: center; 
        }
        
        .thumb-box { 
            width: 70px; 
            height: 70px; 
            cursor: pointer; 
            border: 1px solid #ddd; 
            position: relative; 
            overflow: hidden; 
            transition: 0.3s; 
        }
        
        .thumb-box:hover { border-color: #D4AF37; }

        /* --- Info Section (Right) --- */
        .prod-info { 
            width: 50%; 
            padding: 60px 50px; 
            display: flex; 
            flex-direction: column; 
            justify-content: center;
        }
        
        .prod-title { 
            font-family: 'Cinzel', serif; 
            font-size: 2.2rem; 
            color: #1a1a1a; 
            margin-bottom: 10px; 
            text-transform: uppercase; 
            line-height: 1.2;
        }
        
        .prod-desc { 
            font-family: 'Jost', sans-serif; 
            color: #555; 
            line-height: 1.8; 
            margin-bottom: 40px; 
            font-size: 1rem;
        }
        
        .action-row { 
            display: flex; 
            gap: 15px; 
            flex-wrap: wrap;
        }
        
        .qty-box { 
            display: flex; 
            align-items: center; 
            border: 1px solid #ddd; 
            height: 50px; 
            padding: 0 15px; 
            gap: 15px; 
        }

        .qty-btn {
            background: none;
            border: none;
            font-size: 1.2rem;
            cursor: pointer;
            color: #333;
        }
        
        .add-btn { 
            flex: 1; 
            min-width: 160px;
            background: #1a1a1a; 
            color: #fff; 
            border: none; 
            font-family: 'Cinzel', serif; 
            cursor: pointer; 
            transition: 0.3s; 
            height: 50px; 
            font-size: 1rem;
            letter-spacing: 1px;
        }
        
        .add-btn:hover { background: #D4AF37; }

        /* --- RESPONSIVE MEDIA QUERIES --- */
        
        /* Tablet & Mobile (Width < 900px) */
        @media (max-width: 900px) {
            .product-page-wrapper {
                padding: 100px 15px 40px; /* Reduce padding */
            }

            .product-container {
                flex-direction: column; /* Stack vertically */
                max-width: 500px; /* Constrain width for better look */
            }

            .prod-visual, .prod-info {
                width: 100%; /* Full width */
            }

            .prod-visual {
                padding: 20px;
            }

            .main-img-frame {
                height: 400px; /* Reduce image height */
            }

            .prod-info {
                padding: 30px 25px;
            }

            .prod-title {
                font-size: 1.8rem;
            }
        }

        /* Small Mobile (Width < 480px) */
        @media (max-width: 480px) {
            .product-page-wrapper {
                padding: 85px 10px 20px;
            }

            .main-img-frame {
                height: 350px;
            }

            .thumb-box {
                width: 50px;
                height: 50px;
            }

            .prod-title {
                font-size: 1.5rem;
            }

            .action-row {
                flex-direction: column; /* Stack buttons */
            }

            .qty-box, .add-btn {
                width: 100%;
                justify-content: center;
            }
        }

        /* Cursor styles (Hidden on touch devices automatically via JS logic, but css backup) */
        .p-cursor-dot, .p-cursor-circle {
            position: fixed;
            top: 0;
            left: 0;
            transform: translate(-50%, -50%);
            border-radius: 50%;
            z-index: 9999;
            pointer-events: none;
        }
        .p-cursor-dot { width: 8px; height: 8px; background-color: #1a1a1a; }
        .p-cursor-circle { width: 40px; height: 40px; border: 1px solid #1a1a1a; transition: 0.1s; }
        
        /* Hide custom cursor on touch devices to prevent lag/visual bugs */
        @media (hover: none) and (pointer: coarse) {
            .p-cursor-dot, .p-cursor-circle { display: none; }
        }

      `}</style>

      <div className="product-container">
        {/* Left Side: Visuals */}
        <div className="prod-visual">
          <div className="main-img-frame">
            {isVideo(activeMedia) ? (
              <video 
                key={activeMedia} 
                src={activeMedia} 
                className="main-media" 
                autoPlay 
                muted 
                loop 
                playsInline 
              />
            ) : (
              <img src={activeMedia} alt={product.name} className="main-media" />
            )}
          </div>

          <div className="thumb-row">
            {product.image && product.image.map((item, i) => (
              <div key={i} className="thumb-box" style={{borderColor: activeMedia === item ? '#D4AF37' : '#ddd', borderWidth: activeMedia === item ? '2px' : '1px'}} onClick={() => setActiveMedia(item)}>
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
          <h1 className="prod-title">{product.name}</h1>
          
          {/* Price Rendering */}
          <div style={{marginBottom: '20px'}}>
             {renderPrice ? renderPrice(product.price, product.mrp) : <p style={{fontFamily:'Jost', fontSize:'1.3rem'}}>₹{product.price}</p>}
          </div>

          <p className="prod-desc">{product.description}</p>

          <div className="action-row">
            <div className="qty-box">
              <button className="qty-btn" onClick={() => setQuantity(q => Math.max(1, q-1))}>−</button>
              <span style={{fontFamily: 'Jost', fontSize:'1.1rem'}}>{quantity}</span>
              <button className="qty-btn" onClick={() => setQuantity(q => q+1)}>+</button>
            </div>
            <button className="add-btn" onClick={() => { addToCart(product.id || product._id, quantity); toast.success ? toast.success("Added to Bag!") : alert("Added to Bag!"); }}>
              ADD TO BAG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;