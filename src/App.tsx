
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Index from './pages/Index';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import Search from './pages/Search';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Orders from './pages/Orders';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import ShippingPolicy from './pages/ShippingPolicy';
import ReturnPolicy from './pages/ReturnPolicy';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminCategories from './pages/admin/Categories';
import AdminCarousel from './pages/admin/Carousel';
import AdminUsers from './pages/admin/Users';
import AdminDelivery from './pages/admin/Delivery';
import AdminChats from './pages/admin/Chats';
import ChatWidget from './components/chat/ChatWidget';
import WhatsAppButton from './components/chat/WhatsAppButton';
import { useAuth } from './hooks/useAuth';
import { Toaster } from './components/ui/toaster';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import StripeProvider from './components/stripe/StripeProvider';
import "./App.css";

// ScrollToTop component to ensure page scrolls to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    console.log('Route changed, scrolling to top:', pathname);
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  const { isAdmin } = useAuth();
  
  useEffect(() => {
    console.log('App component mounted');
  }, []);
  
  return (
    <Router>
      <StripeProvider>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/search" element={<Search />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/login" element={<Login />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/shipping-policy" element={<ShippingPolicy />} />
              <Route path="/return-policy" element={<ReturnPolicy />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={isAdmin ? <AdminDashboard /> : <Login />} />
              <Route path="/admin/products" element={isAdmin ? <AdminProducts /> : <Login />} />
              <Route path="/admin/categories" element={isAdmin ? <AdminCategories /> : <Login />} />
              <Route path="/admin/carousel" element={isAdmin ? <AdminCarousel /> : <Login />} />
              <Route path="/admin/users" element={isAdmin ? <AdminUsers /> : <Login />} />
              <Route path="/admin/delivery" element={isAdmin ? <AdminDelivery /> : <Login />} />
              <Route path="/admin/chats" element={isAdmin ? <AdminChats /> : <Login />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          {/* Ensure unique key props for these components */}
          <ChatWidget key="chat-widget-component" />
          <WhatsAppButton key="whatsapp-button-component" />
          <Toaster />
        </div>
      </StripeProvider>
    </Router>
  );
}

export default App;
