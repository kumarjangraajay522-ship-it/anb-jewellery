import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx'; 
import ShopContextProvider from './context/ShopContext.jsx'; 
// ... keep your page imports
import Login from './pages/login.jsx';
import About from './pages/about.jsx';
// ⚠️ DOUBLE CHECK: Is your file named Placeoder.jsx or PlaceOrder.jsx?
import PlaceOrder from './pages/Placeoder.jsx'; 
import Home from './pages/home.jsx';
import Collection from './pages/collection.jsx';
import Contact from './pages/contact.jsx';
import Cart from './pages/cart.jsx';
import SearchBar from './components/SearchBar';
import FloatingNav from './components/FloatingNav.jsx';
import Product from './pages/product.jsx';
import Account from './pages/Account.jsx';
import Orders from './pages/orderr.jsx'
import Sale from './pages/off.jsx';
import ShippingPolicy from './pages/ShippingPolicy.jsx';
import PrivacyPolicy from './pages/PrivacyPolicy.jsx';
import ReturnsPolicy from './pages/Policy.jsx';
// At the top of App.jsx (outside the component)
export const backendUrl = import.meta.env.VITE_BACKEND_URL;
const AppContent = () => {
  const location = useLocation();
  const showNav = location.pathname !== '/login' && location.pathname !== '/place-order';

  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      {showNav && <FloatingNav />}
      <SearchBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<Cart />} />
        <Route path='/place-order' element={<PlaceOrder />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/account" element={<Account />} />
        <Route path='/orders' element={<Orders />} />
        <Route path='/sale'element={<Sale/>}/>
        <Route path='/ShippingPolicy'element={<ShippingPolicy/>}/>
        <Route path='/PrivacyPolicy'element={<PrivacyPolicy/>}/>
        <Route path='/Policy'element={<ReturnsPolicy/>}/>
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <ShopContextProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ShopContextProvider>
  );
};

export default App;