import React, { useContext, useEffect, useState, useRef } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import './cart.css';

const Cart = () => {
    const { products, currency, cartItems, updateQuantity, navigate, getCartAmount, delivery_fee, shipping_threshold } = useContext(ShopContext);
    const [cartData, setCartData] = useState([]);
    
    // Cursor Refs
    const cursorDot = useRef(null);
    const cursorCircle = useRef(null);

    // --- CURSOR LOGIC ---
    useEffect(() => {
        const handleMouseMove = (e) => {
            if (cursorDot.current && cursorCircle.current) {
                cursorDot.current.style.left = `${e.clientX}px`;
                cursorDot.current.style.top = `${e.clientY}px`;
                
                // Add slight delay for the circle
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

    useEffect(() => {
        const tempData = [];
        for (const items in cartItems) {
            if (cartItems[items] > 0) {
                tempData.push({ _id: items, quantity: cartItems[items] });
            }
        }
        setCartData(tempData);
    }, [cartItems]);

    const subtotal = getCartAmount();
    const progress = Math.min((subtotal / shipping_threshold) * 100, 100);

    return (
        <div className="cart-page" >
            
            {/* --- CUSTOM CURSOR ELEMENTS --- */}
            <div ref={cursorDot} className="custom-cursor-dot"></div>
            <div ref={cursorCircle} className="custom-cursor-circle"></div>

            <style>{`
                /* Ensure cursor elements are visible */
                .custom-cursor-dot {
                    position: fixed; top: 0; left: 0; width: 8px; height: 8px;
                    background-color: #d4af37; border-radius: 50%; pointer-events: none; z-index: 99999;
                    transform: translate(-50%, -50%); box-shadow: 0 0 10px #d4af37;
                }
                .custom-cursor-circle {
                    position: fixed; top: 0; left: 0; width: 40px; height: 40px;
                    border: 1px solid rgba(212, 175, 55, 0.6); border-radius: 50%; pointer-events: none; z-index: 99998;
                    transform: translate(-50%, -50%); transition: width 0.15s ease-out, height 0.15s ease-out;
                }
                
                /* Hide default cursor on page */
                .cart-page { cursor: none; }
                
                /* Cursor Expansion on Hover */
                button:hover ~ .custom-cursor-circle,
                a:hover ~ .custom-cursor-circle,
                .cart-item:hover ~ .custom-cursor-circle {
                    width: 60px; height: 60px;
                    background-color: rgba(212, 175, 55, 0.05);
                    border-color: transparent;
                }

                /* Mobile: Hide custom cursor */
                @media (hover: none) and (pointer: coarse) {
                    .custom-cursor-dot, .custom-cursor-circle { display: none; }
                    .cart-page { cursor: auto; }
                }
            `}</style>

            <div className="cart-title">
                <p>YOUR BAG</p>
            </div>

            {cartData.length === 0 ? (
                <div className="empty-cart-box">
                    <div className="empty-icon">🛍️</div>
                    <h3>Your Bag is Empty</h3>
                    <button className="continue-btn" onClick={() => navigate('/collection')}>
                        <div className="liquid"></div>
                        <span>Shop Collection</span>
                    </button>
                </div>
            ) : (
                <>
                    <div className="shipping-goal-container">
                        <p className="goal-text">
                            {subtotal >= shipping_threshold 
                                ? "✨ Luxury Shipping Unlocked!" 
                                : `Add ${currency}${shipping_threshold - subtotal} for FREE Delivery`}
                        </p>
                        <div className="progress-track">
                            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>

                    <div className="cart-items-container">
                        {cartData.map((item, index) => {
                            const productData = products.find((p) => String(p._id) === String(item._id));
                            if (!productData) return null;

                            return (
                                <div key={index} className="cart-item">
                                    <div className="item-info">
                                        <img src={productData.image[0]} className="item-img" alt="" />
                                        <div>
                                            <p className="item-name">{productData.name}</p>
                                            <p className="item-price">{currency}{productData.price}</p>
                                        </div>
                                    </div>
                                    <input 
                                        className="quantity-input" 
                                        type="number" min={1} 
                                        defaultValue={item.quantity} 
                                        onChange={(e) => e.target.value > 0 && updateQuantity(item._id, Number(e.target.value))} 
                                    />
                                    <p className="item-total-price">{currency}{productData.price * item.quantity}</p>
                                    <img onClick={() => updateQuantity(item._id, 0)} className="delete-icon" src={assets.bin_icon} alt="" />
                                </div>
                            );
                        })}
                    </div>

                    <div className="cart-bottom">
                        <div className="cart-total">
                            <h2 className="total-title">Order Summary</h2>
                            <div className="total-row">
                                <span>Subtotal</span>
                                <span>{currency}{subtotal}.00</span>
                            </div>
                            <div className="total-row">
                                <span>Shipping</span>
                                <span className={subtotal >= shipping_threshold ? "free-text" : ""}>
                                    {subtotal >= shipping_threshold ? "FREE" : `${currency}60.00`}
                                </span>
                            </div>
                            <div className="total-row final">
                                <span>Total</span>
                                <span>{currency}{subtotal + (subtotal >= shipping_threshold ? 0 : delivery_fee)}.00</span>
                            </div>
                            <button onClick={() => navigate('/place-order')} className="checkout-btn">CHECKOUT NOW</button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;