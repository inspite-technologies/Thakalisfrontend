import { useState, useEffect } from 'react';
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
import OrderTrackingPage from './pages/OrderTrackingPage.jsx';
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

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedStoreId, setSelectedStoreId] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedSearchQuery, setSelectedSearchQuery] = useState('');
  const { isLoggedIn, isRegistered } = useStore();
  const navigateTo = (page, params) => {
    if (params?.productId) setSelectedProductId(params.productId);
    if (params?.orderId) setSelectedOrderId(params.orderId);
    if (params?.categoryId) setSelectedCategoryId(params.categoryId);
    if (params?.storeId) setSelectedStoreId(params.storeId);
    if (params?.searchQuery) setSelectedSearchQuery(params.searchQuery);

    if (page === 'products') {
      if (!params?.categoryId && !params?.storeId) {
        setSelectedCategoryId(null);
        setSelectedStoreId(null);
      }
      if (!params?.searchQuery) {
        setSelectedSearchQuery('');
      }
    }

    setCurrentPage(page);
    window.scrollTo(0, 0);
  };



  useEffect(() => {
    const protectedPages = ['profile', 'cart', 'orders', 'wishlist', 'addresses', 'rewards', 'refer-earn', 'checkout', 'add-address'];
    if (!isRegistered && protectedPages.includes(currentPage)) {
      setCurrentPage('login');
    }
  }, [isRegistered, currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={navigateTo} />;
      case 'products':
        return <ProductsPage
          key={`${selectedCategoryId}-${selectedStoreId}-${selectedSearchQuery}`}
          onNavigate={navigateTo}
          initialCategoryId={selectedCategoryId}
          initialStoreId={selectedStoreId}
          initialSearchQuery={selectedSearchQuery}
        />;
      case 'product-detail':
        return selectedProductId ? (
          <ProductDetailPage productId={selectedProductId} onNavigate={navigateTo} />
        ) : (
          <ProductsPage onNavigate={navigateTo} />
        );
      case 'cart':
        return <CartPage onNavigate={navigateTo} />;
      case 'profile':
        return <ProfilePage onNavigate={navigateTo} />;
      case 'wishlist':
        return <WishlistPage onNavigate={navigateTo} />;
      case 'orders':
        return <OrdersPage onNavigate={navigateTo} />;
      case 'order-detail':
        return selectedOrderId ? (
          <OrderDetailPage orderId={selectedOrderId} onNavigate={navigateTo} />
        ) : (
          <OrdersPage onNavigate={navigateTo} />
        );
      /* Order tracking page - commented out, using payment-success instead
      case 'order-tracking':
        return selectedOrderId ? (
          <OrderTrackingPage orderId={selectedOrderId} onNavigate={navigateTo} />
        ) : (
          <OrdersPage onNavigate={navigateTo} />
        );
      */
      case 'payment-success':
        return selectedOrderId ? (
          <PaymentSuccessPage orderId={selectedOrderId} onNavigate={navigateTo} />
        ) : (
          <OrdersPage onNavigate={navigateTo} />
        );
      case 'payment-failure':
        return <PaymentFailurePage onNavigate={navigateTo} />;
      case 'addresses':
        return <AddressesPage onNavigate={navigateTo} />;
      case 'add-address':
        return <AddAddressPage onNavigate={navigateTo} />;
      case 'edit-profile':
        return <EditProfilePage onNavigate={navigateTo} />;
      case 'rewards':
        return <RewardsPage onNavigate={navigateTo} />;
      case 'refer-earn':
        return <ReferEarnPage onNavigate={navigateTo} />;
      case 'login':
        return <LoginPage onNavigate={navigateTo} />;
      case 'terms':
        return <TermsPage onNavigate={navigateTo} />;
      case 'privacy-policy':
        return <PrivacyPolicyPage onNavigate={navigateTo} />;
      default:
        return <HomePage onNavigate={navigateTo} />;
    }
  };

  const showNav = currentPage !== 'login';
  const showFooter = currentPage !== 'login';

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {showNav && <Navigation onNavigate={navigateTo} currentPage={currentPage} />}
      <main className={showNav ? 'pt-36 md:pt-20' : ''}>
        {renderPage()}
      </main>
      {showFooter && <Footer onNavigate={navigateTo} />}
      <Toaster position="top-center" />
    </div>
  );
}

function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}

export default App;
