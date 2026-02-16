import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { StoreProvider, useStore } from './context/StoreContext.jsx';
import Navigation from './components/Navigation.jsx';
import Footer from './components/Footer.jsx';
import HomePage from './pages/HomePage.jsx';
import ProductsPage from './pages/ProductsPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import CartPage from './pages/CartPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import WishlistPage from './pages/WishlistPage.jsx';
import OrdersPage from './pages/OrdersPage.jsx';
import OrderDetailPage from './pages/OrderDetailPage.jsx';
import PaymentSuccessPage from './pages/PaymentSuccessPage.jsx';
import PaymentFailurePage from './pages/PaymentFailurePage.jsx';
import AddressesPage from './pages/AddressesPage.jsx';
import AddAddressPage from './pages/AddAddressPage.jsx';
import EditProfilePage from './pages/EditProfilePage.jsx';
import RewardsPage from './pages/RewardsPage.jsx';
import ReferEarnPage from './pages/ReferEarnPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import TermsPage from './pages/TermsPage.jsx';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage.jsx';
import { Toaster } from './components/ui/sonner.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';

function AppContent() {
  /* 
   * Navigation is now handled by react-router-dom <Routes>
   */

  const location = useLocation();
  const showNav = location.pathname !== '/login';
  const showFooter = location.pathname !== '/login';

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <ScrollToTop />
      {showNav && <Navigation />}
      <main className={showNav ? 'pt-36 md:pt-20' : ''}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/product/:productId" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/order/:orderId" element={<OrderDetailPage />} />
          <Route path="/payment-success" element={<PaymentSuccessPage />} />
          <Route path="/payment-failure" element={<PaymentFailurePage />} />
          <Route path="/addresses" element={<AddressesPage />} />
          <Route path="/add-address" element={<AddAddressPage />} />
          <Route path="/edit-profile" element={<EditProfilePage />} />
          <Route path="/rewards" element={<RewardsPage />} />
          <Route path="/refer-earn" element={<ReferEarnPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      {showFooter && <Footer />}
      <Toaster position="top-center" />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <StoreProvider>
        <AppContent />
      </StoreProvider>
    </BrowserRouter>
  );
}

export default App;
