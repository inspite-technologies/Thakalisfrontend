import { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Plus,
  Minus,
  Heart,
  ArrowRight,
  Clock,
  ShoppingBag,
  Cake,
  Cherry,
  Home,
  Flame,
  Coffee
} from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';
import { Button } from '../components/ui/button.jsx';
import { toast } from '../components/ui/sonner';
import { normalizeImageUrl } from '../utils/utils.js';
import api from '../api/axios';

export default function HomePage({ onNavigate }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [banners, setBanners] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, toggleWishlist, isInWishlist, cart, updateQuantity, isLoggedIn, isRegistered } = useStore();

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        let token = localStorage.getItem('token');

        // If no token exists, get a guest token
        if (!token) {
          try {
            const guestResponse = await api.post('/user/guest');
            const guestResult = guestResponse.data;

            if (guestResult.success && guestResult.token) {
              token = guestResult.token;
              localStorage.setItem('token', token);
              localStorage.setItem('tokenType', 'guest');
            }
          } catch (guestError) {
            console.error('Error fetching guest token:', guestError);
          }
        }

        const response = await api.post('/stores/home', {});
        const result = response.data;
        if (result.success) {
          setBanners(result.data.banners || []);
          setCategoriesData(result.data.categories || []);
          // Normalize featured products to ensure we have consistent access to IDs
          const normalizedFeatured = (result.data.products || []).slice(0, 4).map(p => ({
            ...p,
            id: p._id || p.id,
            name: p.name || p.productName || 'Unnamed Product',
            image: normalizeImageUrl(p.image || (p.images && p.images.length > 0 ? p.images[0] : null)),
            category: p.categoryName || p.category?.name || p.category?.categoryName || p.category || 'Uncategorized',
            shop: p.storeName || p.storeId?.storeName || p.storeId?.businessName || p.storeDetails?.storeName || p.shop || 'Unknown Store',
            stock: p.quantity !== undefined ? p.quantity : 0
          }));
          setFeaturedProducts(normalizedFeatured);
        }
      } catch (error) {
        console.error('Error fetching home data:', error);
        toast.error('Failed to load home page content');
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  useEffect(() => {
    if (banners.length > 0) {
      const timer = setInterval(() => {
        nextSlide();
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [currentSlide, banners.length]);

  const nextSlide = () => {
    if (isAnimating || banners.length === 0) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev + 1) % banners.length);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const prevSlide = () => {
    if (isAnimating || banners.length === 0) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const handleAddToCart = (product) => {
    if (!isRegistered) {
      toast.error('Please login to add to cart');
      onNavigate('login');
      return;
    }
    addToCart(product, 1);
  };

  const getProductQuantity = (productId) => {
    const cartItem = cart.find(item => item.product.id === productId);
    return cartItem ? cartItem.quantity : 0;
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    updateQuantity(productId, newQuantity);
  };

  const handleToggleWishlist = (product) => {
    if (!isRegistered) {
      toast('Please login to add to wishlist');
      onNavigate('login');
      return;
    }
    toggleWishlist(product);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#006A52]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden">
        <div className="section-container py-8">
          <div className="relative h-[250px] md:h-[450px] rounded-3xl overflow-hidden shadow-xl">
            {banners.length > 0 ? (
              banners.map((slide, index) => (
                <div
                  key={slide._id}
                  className={`absolute inset-0 transition-all duration-700 ${index === currentSlide
                    ? 'opacity-100 translate-x-0'
                    : index < currentSlide
                      ? 'opacity-0 -translate-x-full'
                      : 'opacity-0 translate-x-full'
                    }`}
                >
                  <img
                    src={normalizeImageUrl(slide.image)}
                    alt={`Banner ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {/* Subtle overlay to ensure controls are visible if banner is light */}
                  <div className="absolute inset-0 bg-black/5" />
                </div>
              ))
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                <ShoppingBag className="w-12 h-12 mb-2" />
                <span>No Banners Available</span>
              </div>
            )}

            {banners.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/60 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all duration-300 hover:scale-110 z-10"
                >
                  <ChevronLeft className="w-5 h-5 text-[#1A1A1A]" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/60 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all duration-300 hover:scale-110 z-10"
                >
                  <ChevronRight className="w-5 h-5 text-[#1A1A1A]" />
                </button>

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {banners.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentSlide
                        ? 'bg-[#006A52] w-6'
                        : 'bg-white/50 hover:bg-white'
                        }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="section-container">
          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-8">Shop by Category</h2>
          <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4">
            {categoriesData.map((category, index) => {
              return (
                <button
                  key={category._id}
                  onClick={() => onNavigate('products', { categoryId: category._id })}
                  className="flex flex-col items-center gap-3 group flex-shrink-0"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-24 h-24 rounded-2xl bg-[#F5F5F5] overflow-hidden transition-all duration-300 group-hover:bg-[#E8F5F1] group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-[#006A52]/10">
                    <img
                      src={normalizeImageUrl(category.image)}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/product-placeholder.png';
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-[#666666] group-hover:text-[#006A52] transition-colors">
                    {category.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-12 bg-[#FAFAFA]">
        <div className="section-container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-[#1A1A1A]">Featured Products</h2>
              <p className="text-[#666666] mt-1">Handpicked favorites just for you</p>
            </div>
            <Button
              onClick={() => onNavigate('products')}
              variant="outline"
              className="hidden md:flex items-center gap-2 border-[#006A52] text-[#006A52] hover:bg-[#E8F5F1]"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.map((product, index) => {
              const quantity = getProductQuantity(product.id);
              return (
                <div
                  key={product.id}
                  onClick={() => onNavigate('product-detail', { productId: product.id })}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative aspect-square bg-[#F5F5F5] overflow-hidden">
                    <img
                      src={product.image || '/product-placeholder.png'}
                      alt={product.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/product-placeholder.png';
                      }}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleWishlist(product);
                      }}
                      className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-[#FFF3ED] transition-colors"
                    >
                      <Heart
                        className={`w-4 h-4 ${isInWishlist(product.id)
                          ? 'fill-[#E85A24] text-[#E85A24]'
                          : 'text-[#666666]'
                          }`}
                      />
                    </button>
                  </div>

                  <div className="p-4">
                    <h3
                      className="font-medium text-[#1A1A1A] line-clamp-2 mb-2 cursor-pointer hover:text-[#006A52] transition-colors text-sm md:text-base"
                      onClick={() => onNavigate('product-detail', { productId: product.id })}
                    >
                      {product.name}
                    </h3>

                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-base md:text-lg font-bold text-[#006A52]">₹{product.price}</span>
                        </div>
                      </div>
                      {isRegistered && quantity > 0 ? (
                        <div className="flex items-center gap-3 bg-[#F5F5F5] rounded-xl p-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateQuantity(product.id, quantity - 1);
                            }}
                            className="w-7 h-7 bg-white rounded-lg flex items-center justify-center hover:bg-[#E8F5F1] transition-colors shadow-sm"
                          >
                            <Minus className="w-3.5 h-3.5 text-[#006A52]" />
                          </button>
                          <span className="w-4 text-center font-bold text-[#1A1A1A] text-sm">
                            {quantity}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateQuantity(product.id, quantity + 1);
                            }}
                            className="w-7 h-7 bg-white rounded-lg flex items-center justify-center hover:bg-[#E8F5F1] transition-colors shadow-sm"
                          >
                            <Plus className="w-3.5 h-3.5 text-[#006A52]" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(product);
                          }}
                          disabled={product.stock <= 0}
                          className={`w-8 h-8 md:w-10 md:h-10 bg-[#006A52] text-white rounded-xl flex items-center justify-center hover:bg-[#00523F] transition-colors hover:scale-105 active:scale-95 ${product.stock <= 0 ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                          <Plus className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 text-center md:hidden">
            <Button
              onClick={() => onNavigate('products')}
              variant="outline"
              className="border-[#006A52] text-[#006A52] hover:bg-[#E8F5F1]"
            >
              View All Products
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>



    </div>
  );
}
