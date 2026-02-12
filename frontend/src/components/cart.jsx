import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import './Cart.css';

const Cart = () => {
    const { products, currency, cartItems, updateQuantity, navigate, getCartAmount, delivery_fee, shipping_threshold } = useContext(ShopContext);
    const [cartData, setCartData] = useState([]);

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
        <div className="cart-page">
            <div className="cart-title">
                <p>YOUR <span className="pink-text">BAG</span></p>
            </div>

            {cartData.length === 0 ? (
                <div className="empty-cart-box">
                    <div className="empty-icon">🛍️</div>
                    <h3>Your Bag is Empty</h3>
                    <button className="continue-btn" onClick={() => navigate('/collection')}>Shop Collection</button>
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
                                    {subtotal >= shipping_threshold ? "FREE" : `${currency}{delivery_fee}.00`}
                                </span>
                            </div>
                            <div className="total-row final">
                                <span>Total</span>
                                <span>{currency}{subtotal + delivery_fee}.00</span>
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