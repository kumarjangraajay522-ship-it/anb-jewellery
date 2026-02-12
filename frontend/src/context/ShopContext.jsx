import { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { assets } from '../assets/assets';
import { toast } from "react-toastify";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const navigate = useNavigate();
    const backendUrl = 'http://localhost:4000'; 
    const currency = "₹";
    
    const shipping_threshold = 599; 
    const standard_delivery_fee = 40; 

    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [token, setToken] = useState(localStorage.getItem('token') || '');

    // Helper: Fix media arrays
    const normalizeMedia = (items) => items.map(item => {
        let gallery = Array.isArray(item.image) ? [...item.image] : [item.image];
        if (item.video && Array.isArray(item.video)) {
            gallery = [...gallery, ...item.video];
        }
        return {
            ...item,
            _id: item._id || String(item.id),
            image: gallery 
        };
    });

    const fetchProducts = async () => {
        try {
            let dbProducts = [];
            const response = await axios.get(`${backendUrl}/api/product/list`);
            if (response.data.success) {
                dbProducts = normalizeMedia(response.data.products);
            }
            const formattedLocal = normalizeMedia(localProducts);
            setProducts([...dbProducts, ...formattedLocal]);
        } catch (error) {
            console.log("Backend offline. Loading local items.");
            setProducts(normalizeMedia(localProducts));
        }
    };

    // --- FIX 1: Parse Cart Data safely ---
    const getUserCart = async (token) => {
        try {
            const response = await axios.post(backendUrl + '/api/cart/get', {}, { headers: { token } });
            if (response.data.success) {
                // IMPORTANT: Check if data is a string and parse it to Object
                let dbCart = response.data.cartData;
                
                if (typeof dbCart === 'string') {
                    try {
                        dbCart = JSON.parse(dbCart);
                    } catch (e) {
                        console.error("Failed to parse cart JSON", e);
                        dbCart = {};
                    }
                }
                
                // Ensure it is not null
                setCartItems(dbCart || {});
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    // --- FIX 2: Ensure cart is an object before adding ---
    const addToCart = async (itemId, qty = 1) => {
        // Safety check: If cartItems is somehow a string, reset it to object
        let cartData = (typeof cartItems === 'string' || !cartItems) ? {} : structuredClone(cartItems);

        if (cartData[itemId]) {
            cartData[itemId] += qty;
        } else {
            cartData[itemId] = qty;
        }
        
        setCartItems(cartData);

        if (token) {
            try { await axios.post(backendUrl + '/api/cart/add', { itemId }, { headers: { token } }); } 
            catch (error) { toast.error(error.message); }
        }
    };

    // --- FIX 3: Ensure cart is an object before updating ---
    const updateQuantity = async (itemId, quantity) => {
        let cartData = (typeof cartItems === 'string' || !cartItems) ? {} : structuredClone(cartItems);
        
        if (quantity === 0) delete cartData[itemId];
        else cartData[itemId] = quantity;
        
        setCartItems(cartData);
        
        if (token) {
            try { await axios.post(backendUrl + '/api/cart/update', { itemId, quantity }, { headers: { token } }); } 
            catch (error) { toast.error(error.message); }
        }
    };

    const getCartAmount = useCallback(() => {
        let totalAmount = 0;
        // Safety check loop
        const safeCart = (typeof cartItems === 'string' || !cartItems) ? {} : cartItems;
        
        for (const items in safeCart) {
            let itemInfo = products.find((product) => String(product._id) === String(items));
            if (itemInfo && safeCart[items] > 0) {
                totalAmount += itemInfo.price * safeCart[items];
            }
        }
        return totalAmount;
    }, [cartItems, products]);

    useEffect(() => { fetchProducts(); }, []);

    // Load Cart on Token Change
    useEffect(() => {
        if (!token && localStorage.getItem('token')) {
            setToken(localStorage.getItem('token'));
            getUserCart(localStorage.getItem('token'));
        } else if (token) {
            getUserCart(token);
        }
    }, [token]);

    const current_delivery_fee = (getCartAmount() >= shipping_threshold || getCartAmount() === 0) ? 0 : standard_delivery_fee;

    const renderPrice = (price, mrp = null) => {
        const formattedPrice = Number(price).toFixed(2);
        const [whole, decimal] = formattedPrice.split('.');
        return (
            <div className="premium-price-container" style={{ display: 'flex', alignItems: 'baseline', gap: '10px', fontFamily: 'Jost, sans-serif' }}>
                <div className="price-main" style={{ display: 'flex', color: '#1a1a1a', fontWeight: '600' }}>
                    <span style={{ fontSize: '0.7em', marginTop: '0.3em' }}>{currency}</span>
                    <span style={{ fontSize: '1.5em', lineHeight: '1' }}>{whole}</span>
                    <span style={{ fontSize: '0.8em', marginTop: '0.2em', textDecoration: 'underline' }}>{decimal}</span>
                </div>
                {mrp && Number(mrp) > Number(price) && (
                    <span className="price-cut" style={{ textDecoration: 'line-through', color: '#999', fontSize: '1em' }}>
                        {currency}{mrp}
                    </span>
                )}
            </div>
        );
    };

    const localProducts = [
        { id: 1, category: "Necklace", name: "LV Pendant Chain", price: 169.00, mrp: 699.00, image: [assets.p_img1], video:[assets.p_img1_1, assets.p_img1_2], description: "Anti-tarnish gold finish..." },
        { id: 2, category: "Necklace", name: "Snake chain butterfly", price: 299.00, mrp: 999.00, image: [assets.p_img2], video:[assets.p_img2_1], description: "High-quality sterling silver." },
        { id: 3, category: "Necklace", name: "Double chain butterfly pendant", price: 199.00, mrp: 799.00, image: [assets.p_img3], video:[assets.p_img3_1], description: "Elegant rose gold plating." },
        { id: 4, category: "Necklace", name: "Double chain butterfly pendant design", price: 199.00, mrp: 799.00, image: [assets.p_img4], video:[assets.p_img4_1], description: "Sparkling diamond accents." },
        { id: 5, category: "Necklace", name: "Channel Chunks necklace", price: 249.00, mrp: 999.00, image: [assets.p_img5], video:[assets.p_img5_1], description: "Classic pearl pendant." },
        { id: 6, category: "Necklace", name: "Heart chunks", price: 249.00, mrp: 999.00, image: [assets.p_img6], video:[assets.p_img6_1], description: "Elevate your everyday look..." },
        { id: 7, category: "Necklace", name: "Channel necklace", price: 169.00, mrp: 699.00, image: [assets.p_img7], video:[assets.p_img7_1], description: "Anti-tarnish gold finish..." },
        { id: 8, category: "Nacklace", name: "Amethyst Drop Earrings", price: 249.00, mrp: 999.00, image: [assets.p_img8], video:[assets.p_img8_1], description: "Graceful amethyst drops." },
        { id: 9, category: "Necklace", name: "Snake chain flower", price: 199.00, mrp: 799.00, image: [assets.p_img9, assets.p_img9_1], video:[assets.p_img9_2], description: "Dazzling cubic zirconia stones." },
        { id: 10, category: "Necklace", name: "Double chain design", price: 249.00, mrp: 999.00, image: [assets.p_img10], video:[assets.p_img10_1], description: "Bohemian-inspired turquoise beads." },
        { id: 11, category: "Necklace", name: "Elegant Layered Clover Necklace", price: 129.00, mrp: 349.00, image: [assets.p_img57, assets.p_img57_1], video:[assets.p_img57_2], description: "Sophisticated clover pendant." },
        { id: 12, category: "Necklace", name: "Elegant Layered Clover Necklace", price: 159.00, mrp: 399.00, image: [assets.p_img58, assets.p_img58_1], video:[assets.p_img58_2], description: "Rich garnet gemstone." },
        { id: 13, category: "Necklace", name: "Layered Minimal Charm Necklace", price: 199.00, mrp: 499.00, image: [assets.p_img59, assets.p_img59_1], video:[assets.p_img59_2], description: "Bold statement design." },
        { id: 14, category: "Necklace", name: "Gold Heart Pendant Necklace", price: 99.00, mrp: 249.00, image: [assets.p_img60], video:[assets.p_img60_1], description: "Bright citrine stones." },
        { id: 15, category: "Necklace", name: "Gold Heart Drop Necklace", price: 179.00, mrp: 449.00, image: [assets.p_img61], video:[assets.p_img61_1], description: "Chic gold heart drop." },
        { id: 16, category: "Necklace", name: "Aquamarine Silver Necklace", price: 149.00, mrp: 399.00, image: [assets.p_img62, assets.p_img62_1, assets.p_img62_2], video:[assets.p_img62_1], description: "Serene aquamarine stones." },
        { id: 17, category: "Necklace", name: "Layered Gold Om Necklace", price: 219.00, mrp: 499.00, image: [assets.p_img63], video:[assets.p_img63_1], description: "Vibrant ruby stones." },
        { id: 18, category: "Bracelets", name: "Elegant Gold Bracelet with Diamond Accents", price: 350.00, mrp: 999.00, image: [assets.p_img11, assets.p_img12], description: "Interlocking logo design." },
        { id: 19, category: "Bracelets", name: "Timeless Gold Love Bracelets with Diamond Accents ✨", price: 199.00, mrp: 799.00, image: [assets.p_img13], description: "Elevate your jewelry collection..." },
        { id: 20, category: "Bracelets", name: "Regal Radiance", price: 350.00, mrp: 999.00, image: [assets.p_img14, assets.p_img15], description: "A statement of pure elegance..." },
        { id: 21, category: "Bracelets", name: "Elegant Gold Bracelet with Diamond Accents", price: 350.00, mrp: 999.00, image: [assets.p_img16,assets.p_img17], description: "Dazzling halo design." },
        { id: 22, category: "Bracelets", name: "Elegant infinity-design gold bracelet", price: 350.00, mrp: 999.00, image: [assets.p_img18, assets.p_img19], description: "Colorful tourmaline stones." },
        { id: 23, category: "Bracelets", name: "Floral Gold Harmony", price: 199.00, mrp: 799.00, image: [assets.p_img20,assets.p_img21], description: "Striking iolite gemstone." },
        { id: 24, category: "Bracelets", name: "Elegant Floral Charm", price: 350.00, mrp: 999.00, image: [assets.p_img23,assets.p_img24], description: "Add a floral touch to your jewelry collection..." },
        { id: 25, category: "Bracelets", name: "Timeless Gold Bangles Adorned with Sparkling Diamonds.", price: 399.00, mrp: 1250.00, image: [assets.p_img25,assets.p_img26], description: "These diamond studded golden bangles redefine sophistication..." },
        { id: 26, category: "Earrings", name: "Gold Teddy Bear Stud Earrings For Women & Girl", price: 40.00, mrp: 100.00, image: [assets.p_img29,assets.p_img30], description: "Add a cute and stylish touch..." },
        { id: 27, category: "Earrings", name: "Gold Bow Pearl Stud Earrings for Women", price: 40.00, mrp: 100.00, image: [assets.p_img31,assets.p_img32], description: "Stylish gold bow pearl earrings..." },
        { id: 28, category: "Earrings", name: "Gold Finish Teardrop Earrings for Women", price: 40.00, mrp: 100.00, image: [assets.p_img33, assets.p_img34], description: "Add effortless elegance..." },
        { id: 29, category: "Earrings", name: "Gold Triple Teardrop Earrings for Women", price: 40.00, mrp: 100.00, image: [assets.p_img35,assets.p_img36], description: "Add a touch of modern elegance..." },
        { id: 30, category: "Earrings", name:"Cherry Red Drop Earrings for Women", price: 40.00, mrp: 100.00, image: [assets.p_img37,assets.p_img38], description: "Make your outfit pop with these cute cherry-inspired earrings..." },
        { id: 31, category: "Earrings", name: "ChunkyHoops StatementJewelry", price: 40.00, mrp: 100.00, image:[assets.p_img39,assets.p_img40], description:"Turn heads with these trendy gold bubble hoops..." },
        { id: 32, category: "Earrings", name: "Antique Oxidized Silver Hoop Earrings for Women", price: 199.00, mrp: 799.00, image: [assets.p_img41], description: "Enhance your ethnic style..." },
        { id: 33, category: "Earrings", name: "Antique Finish Crystal Stud Earrings for Women", price: 199.00, mrp: 799.00, image: [assets.p_img42,assets.p_img43], description: "Add a touch of elegance..." },
        { id: 35, category: "Earrings", name: "Gold Plated Traditional Chandbali Earrings", price: 199.00, mrp: 799.00, image: [assets.p_img44,assets.p_img45], description: "Elevate your ethnic look..." },
        { id: 36, category: "Earrings", name: "Modern Gold Plated Square Hoop Earrings", price: 199.00, mrp: 799.00, image: [assets.p_img46], description: "Add a modern touch to your jewellery collection..." },
        { id: 37, category: "Earrings", name: "Handcrafted Oxidised Silver Teardrop Earrings", price: 199.00, mrp: 799.00, image: [assets.p_img47], description: "Add elegance to your jewellery collection..." },
        { id: 38, category: "Earrings", name: "Antique Finish White Stone Drop Earrings", price: 199.00, mrp: 799.00, image: [assets.p_img48,assets.p_img49], description: "Add timeless elegance..." },
        { id: 39, category: "Earrings", name: "Handcrafted Dual-Tone Beaded Hoop Earrings", price: 199.00, mrp: 799.00, image:[assets.p_img50], description:"Beautifully handcrafted silver & gold beaded hoop earrings..." },
        { id :40 ,category:"Earrings" ,name:"Gold Crescent Hoop Earrings",price :199.0 ,mrp :799.0 ,image:[assets.p_img51] ,description:"Make a bold yet elegant statement..."},
        { id :41 ,category:"Earrings" ,name:"Gold Floral Hoop Earrings",price :199.0 ,mrp :799.0 ,image:[assets.p_img52] ,description:"Add a touch of elegance..."},
        { id :42 ,category:"Earrings" ,name:"Royal Blue Enamel Statement Earrings" ,price :199.0 ,mrp :799.0 ,image:[assets.p_img53] ,description:"Bold. Elegant. Timeless..."},
        { id: 43, category: "Earrings", name: "Royal Blue Enamel Statement Earrings", price: 199.00, mrp: 799.00, image: [assets.p_img54], description: "These blue enamel statement earrings..." },
        { id: 44, category: "Earrings", name: "Elegant Dark Blue Crystal Drop Earrings", price: 179.00, mrp: 399.00, image: [assets.p_img55], description: "Add timeless elegance to your look..." },
        { id: 45, category: "Earrings", name: "TElegant Mother of Pearl Teardrop Earrings", price: 199.00, mrp: 349.00, image: [assets.p_img56], description: "Add a touch of timeless elegance..." },
    ];

    const value = {
        products, currency, search, setSearch, showSearch, setShowSearch,
        cartItems, setCartItems, addToCart, updateQuantity, getCartAmount, navigate, backendUrl,
        token, setToken, fetchProducts, renderPrice,
        delivery_fee: current_delivery_fee,
        shipping_threshold,
        getCartCount: () => Object.values((typeof cartItems === 'string') ? {} : cartItems).reduce((a, b) => a + b, 0),
    };

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;