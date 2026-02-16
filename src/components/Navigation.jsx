import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  Heart,
  ShoppingCart,
  Bell,
  MapPin,
  ChevronDown,
  User,
  Menu,
  X
} from 'lucide-react';
import { getCurrentPosition, getAddressFromCoords } from '../services/locationService';
import { useStore } from '../context/StoreContext.jsx';
import { Input } from './ui/input.jsx';
import { Button } from './ui/button.jsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu.jsx';
import { searchProductsApi, fetchAllProductsApi } from '../services/productService';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ products: [], stores: [] });
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [allStores, setAllStores] = useState([]);
  const { logout, cartCount, wishlist, isLoggedIn, isRegistered, deliveryLocation, setDeliveryLocation } = useStore();
  const navigate = useNavigate();
  const location = useLocation();


  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Fetch all stores on mount for client-side search
    const fetchStores = async () => {
      try {
        const response = await fetchAllProductsApi();
        if (response?.filters?.stores) {
          setAllStores(response.filters.stores);
        }
      } catch (error) {
        console.error("Failed to load stores for search", error);
      }
    };
    fetchStores();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        try {
          // 1. Client-side store search
          const matchedStores = allStores.filter(store =>
            store.name.toLowerCase().includes(searchQuery.toLowerCase())
          ).slice(0, 3);

          // 2. Backend product search
          const productResponse = await searchProductsApi(searchQuery);
          const matchedProducts = productResponse?.data?.slice(0, 5) || [];

          setSearchResults({
            stores: matchedStores,
            products: matchedProducts
          });
          setShowSearchResults(true);
        } catch (error) {
          console.error("Search error:", error);
        }
      } else {
        setShowSearchResults(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, allStores]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchResults(false);
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleProductClick = (productId) => {
    setShowSearchResults(false);
    navigate(`/product/${productId}`);
  };

  const handleStoreClick = (storeId) => {
    setShowSearchResults(false);
    navigate(`/products?storeId=${storeId}`);
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Products', path: '/products' },
    { label: 'Orders', path: '/orders' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
        ? 'glass-nav shadow-lg shadow-black/5'
        : 'bg-white'
        }`}
    >
      <div className="section-container">
        <div className="flex items-center justify-between h-20">
          <Link
            to="/"
            className="flex items-center group h-12"
          >
            <img
              src="/thakkalies_horizontal_logo.svg"
              alt="Thakkalies"
              className="h-full w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          <div className="hidden lg:flex items-center gap-2 ml-8">
            <MapPin className="w-4 h-4 text-[#006A52]" />
            <span className="text-sm text-[#666666]">Deliver to</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 text-sm font-medium text-[#1A1A1A] hover:text-[#006A52] transition-colors">
                  {deliveryLocation}
                  <ChevronDown className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem
                  onClick={async () => {
                    try {
                      toast.info('Detecting location...', { duration: 1000 });
                      const coords = await getCurrentPosition();
                      const address = await getAddressFromCoords(coords.lat, coords.lng);
                      // Extract just the city/area for the navbar
                      const locationName = address.details.suburb || address.details.city || address.details.town || 'Current Location';
                      setDeliveryLocation(locationName);
                      toast.success('Location updated!');
                    } catch (error) {
                      console.error('Location error:', error);
                      // Handle GeolocationPositionError specifically or generic errors
                      let errorMessage = 'Could not detect location';
                      if (error.code === 1) errorMessage = 'Location permission denied';
                      else if (error.code === 2) errorMessage = 'Location unavailable';
                      else if (error.code === 3) errorMessage = 'Location request timed out';
                      else if (error.message) errorMessage = error.message;

                      toast.error(errorMessage);
                    }
                  }}
                  className="cursor-pointer text-[#006A52] font-medium"
                >
                  <MapPin className="w-3.5 h-3.5 mr-2" />
                  Detect Location
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-xl mx-8"
          >
            <div className="relative w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#999999] transition-colors group-focus-within:text-[#006A52]" />
              <Input
                type="text"
                placeholder="Search for pickles, chutneys, dry fruits..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (searchQuery.trim().length >= 2) setShowSearchResults(true);
                }}
                onBlur={() => {
                  // Delay hide to allow clicks on dropdown
                  setTimeout(() => setShowSearchResults(false), 200);
                }}
                className="w-full pl-12 pr-4 py-3 h-12 bg-[#F5F5F5] border-none rounded-xl focus:ring-2 focus:ring-[#006A52]/20 focus:bg-white transition-all duration-300"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#006A52] text-white rounded-lg hover:bg-[#00523F] transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Search Results Dropdown */}
              {showSearchResults && (searchResults.stores.length > 0 || searchResults.products.length > 0) && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-[#E5E5E5] overflow-hidden z-50 max-h-[400px] overflow-y-auto">
                  {searchResults.stores.length > 0 && (
                    <div className="p-2">
                      <h3 className="text-xs font-semibold text-[#666666] px-3 py-2 uppercase tracking-wider">Stores</h3>
                      {searchResults.stores.map(store => (
                        <div
                          key={store._id}
                          onClick={() => handleStoreClick(store._id)}
                          className="flex items-center gap-3 p-3 hover:bg-[#F5F5F5] rounded-lg cursor-pointer transition-colors"
                        >
                          <div className="w-8 h-8 bg-[#E8F5F1] rounded-full flex items-center justify-center text-[#006A52]">
                            <MapPin className="w-4 h-4" />
                          </div>
                          <span className="font-medium text-[#1A1A1A]">{store.name}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {searchResults.products.length > 0 && (
                    <div className="p-2 border-t border-[#E5E5E5]">
                      <h3 className="text-xs font-semibold text-[#666666] px-3 py-2 uppercase tracking-wider">Products</h3>
                      {searchResults.products.map(product => (
                        <div
                          key={product._id}
                          onClick={() => handleProductClick(product._id)}
                          className="flex items-center gap-3 p-3 hover:bg-[#F5F5F5] rounded-lg cursor-pointer transition-colors"
                        >
                          <img
                            src={product.image || '/product-placeholder.png'}
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover bg-[#F5F5F5]"
                            onError={(e) => { e.target.src = '/product-placeholder.png'; }}
                          />
                          <div>
                            <p className="font-medium text-[#1A1A1A] line-clamp-1">{product.name}</p>
                            <p className="text-xs text-[#666666]">{product.storeName}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </form>

          <div className="flex items-center gap-2 md:gap-4">
            <button className="relative p-2.5 text-[#666666] hover:text-[#006A52] hover:bg-[#E8F5F1] rounded-xl transition-all duration-300">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#E85A24] rounded-full"></span>
            </button>

            <button
              onClick={() => {
                if (!isRegistered) {
                  toast.error('Please login to view wishlist');
                  navigate('/login');
                  return;
                }
                navigate('/wishlist');
              }}
              className="relative p-2.5 text-[#666666] hover:text-[#006A52] hover:bg-[#E8F5F1] rounded-xl transition-all duration-300"
            >
              <Heart className="w-5 h-5" />
              {isRegistered && wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#006A52] text-white text-xs font-medium rounded-full flex items-center justify-center animate-scale-in">
                  {wishlist.length}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                if (!isRegistered) {
                  toast.error('Please login to view cart');
                  navigate('/login');
                  return;
                }
                navigate('/cart');
              }}
              className="relative p-2.5 text-[#666666] hover:text-[#006A52] hover:bg-[#E8F5F1] rounded-xl transition-all duration-300"
            >
              <ShoppingCart className="w-5 h-5" />
              {isRegistered && cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#006A52] text-white text-xs font-medium rounded-full flex items-center justify-center animate-scale-in">
                  {cartCount}
                </span>
              )}
            </button>

            {isRegistered ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="hidden md:flex items-center gap-2 p-2 hover:bg-[#c4d4a4] rounded-xl transition-colors">
                    <div className="w-9 h-9 bg-[#E8F5F1] rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-[#006A52]" />
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/orders')}>
                    My Orders
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/addresses')}>
                    Saved Addresses
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/rewards')}>
                    Rewards
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/refer-earn')}>
                    Refer & Earn
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      logout();
                      toast.success('Logged out successfully');
                      navigate('/');
                    }}
                    className="text-red-600 focus:text-red-700 font-medium"
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={() => navigate('/login')}
                className="btn-primary"
              >
                Login
              </Button>
            )}

            {isRegistered && (
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2.5 text-[#666666] hover:text-[#006A52] hover:bg-[#E8F5F1] rounded-xl transition-all duration-300"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>

        <form onSubmit={handleSearchSubmit} className="md:hidden pb-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#999999]" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 h-12 bg-[#F5F5F5] border-none rounded-xl"
            />
          </div>
        </form>
      </div>

      {
        isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-[#E5E5E5] animate-slide-up">
            <div className="section-container py-4">
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`px-4 py-3 text-left rounded-xl transition-colors ${location.pathname === link.path
                      ? 'bg-[#E8F5F1] text-[#006A52] font-medium'
                      : 'text-[#1A1A1A] hover:bg-[#F5F5F5]'
                      }`}
                  >
                    {link.label}
                  </Link>
                ))}
                {!isRegistered ? (
                  <Button
                    onClick={() => {
                      navigate('/login');
                      setIsMobileMenuOpen(false);
                    }}
                    className="btn-primary mt-2"
                  >
                    Login
                  </Button>
                ) : (
                  <>
                    <div className="h-px bg-[#E5E5E5] my-2"></div>
                    <Link
                      to="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="px-4 py-3 text-left text-[#1A1A1A] hover:bg-[#F5F5F5] rounded-xl transition-colors flex items-center gap-2"
                    >
                      <User className="w-4 h-4" /> Profile
                    </Link>
                    <Link
                      to="/addresses"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="px-4 py-3 text-left text-[#1A1A1A] hover:bg-[#F5F5F5] rounded-xl transition-colors flex items-center gap-2"
                    >
                      <MapPin className="w-4 h-4" /> Saved Addresses
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        toast.success('Logged out successfully');
                        navigate('/');
                        setIsMobileMenuOpen(false);
                      }}
                      className="px-4 py-3 text-left text-red-600 hover:bg-[#FFF3ED] rounded-xl transition-colors font-medium flex items-center gap-2"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )
      }
    </nav >
  );
}
