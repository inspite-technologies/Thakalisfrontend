import { useState, useEffect } from 'react';
import {
  ChevronLeft,
  Heart,
  Star,
  Minus,
  Plus,
  ShoppingCart,
  Clock,
  Store,
  Check,
  Truck,
  Shield
} from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';
import { products } from '../data/mockData.js';
import { Button } from '../components/ui/button.jsx';
import { toast } from '../components/ui/sonner';
import { normalizeImageUrl } from '../utils/utils.js';

import api from '../api/axios';

export default function ProductDetailPage({ productId, onNavigate }) {
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart, toggleWishlist, isInWishlist, isLoggedIn, isRegistered } = useStore();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${productId}`);
        const result = response.data;
        if (result.data) {
          // Normalize backend data to match frontend expectations
          const p = result.data;
          setProduct({
            id: p._id,
            name: p.productName || p.name,
            price: p.price,
            image: normalizeImageUrl(p.image || (p.images && p.images.length > 0 ? p.images[0] : null)),
            category: p.categoryName || p.category?.name || p.category || 'Uncategorized',
            shop: p.storeName || p.storeId?.storeName || p.shop || 'Unknown Store',
            description: p.description || 'No description available for this product.',
            rating: p.rating || 4.5,
            reviewCount: p.reviewCount || 128,
            deliveryTime: p.deliveryTime || '30-45 mins',
            isAvailable: p.isAvailable !== undefined ? p.isAvailable : true,
            stock: p.quantity !== undefined ? p.quantity : 0,
            discount: p.discount || 0,
            originalPrice: p.originalPrice || Math.round(p.price * 1.2)
          });
        } else {
          // Fallback to mock if not found in backend
          const mockP = products.find(p => p.id === productId);
          setProduct(mockP);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        // Fallback to mock on error
        const mockP = products.find(p => p.id === productId);
        setProduct(mockP);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#006A52]"></div>
      </div>
    );
  }

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    if (!isRegistered) {
      toast.error('Please login to add to cart');
      onNavigate('login');
      return;
    }
    addToCart(product, quantity);
  };

  const handleToggleWishlist = () => {
    if (!isRegistered) {
      toast('Please login to add to wishlist');
      onNavigate('login');
      return;
    }
    toggleWishlist(product);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="bg-white border-b border-[#E5E5E5]">
        <div className="section-container py-4">
          <button
            onClick={() => onNavigate('products')}
            className="flex items-center gap-2 text-[#666666] hover:text-[#006A52] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Products
          </button>
        </div>
      </div>

      <div className="section-container py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl p-8 shadow-sm">
            <div className="relative aspect-square bg-[#F5F5F5] rounded-2xl overflow-hidden">
              <img
                src={normalizeImageUrl(product.image)}
                alt={product.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/product-placeholder.png';
                }}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <span className="inline-block px-3 py-1 bg-[#E8F5F1] text-[#006A52] text-sm font-medium rounded-full mb-3">
                  {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                </span>
                <h1 className="text-2xl md:text-3xl font-bold text-[#1A1A1A]">
                  {product.name}
                </h1>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleToggleWishlist}
                  className="w-10 h-10 bg-[#F5F5F5] rounded-xl flex items-center justify-center hover:bg-[#FFF3ED] transition-colors"
                >
                  <Heart
                    className={`w-5 h-5 ${isInWishlist(product.id)
                      ? 'fill-[#E85A24] text-[#E85A24]'
                      : 'text-[#666666]'
                      }`}
                  />
                </button>
              </div>
            </div>


            <div className="flex items-center gap-3 p-4 bg-[#F5F5F5] rounded-xl">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <Store className="w-5 h-5 text-[#006A52]" />
              </div>
              <div>
                <p className="text-sm text-[#666666]">Sold by</p>
                <p className="font-medium text-[#1A1A1A]">{product.shop}</p>
              </div>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-[#006A52]">
                ₹{product.price}
              </span>

            </div>

            <div>
              <h3 className="font-semibold text-[#1A1A1A] mb-2">Description</h3>
              <p className="text-[#666666] leading-relaxed">
                {product.description}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-[#1A1A1A] mb-3">Quantity</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 bg-[#F5F5F5] rounded-xl p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 bg-white rounded-lg flex items-center justify-center hover:bg-[#E8F5F1] transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 bg-white rounded-lg flex items-center justify-center hover:bg-[#E8F5F1] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-sm text-[#666666]">
                  Total:{' '}
                  <span className="font-semibold text-[#006A52]">
                    ₹{product.price * quantity}
                  </span>
                </span>
              </div>
            </div>

            <Button
              onClick={handleAddToCart}
              disabled={product.stock <= 0 || !product.isAvailable}
              className={`w-full btn-primary py-4 h-14 text-lg flex items-center justify-center gap-2 ${product.stock <= 0 || !product.isAvailable ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
              <ShoppingCart className="w-5 h-5" />
              {product.stock <= 0 || !product.isAvailable ? 'Out of Stock' : `Add to Cart - ₹${product.price * quantity}`}
            </Button>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#E5E5E5]">
              <div className="text-center">
                <div className="w-10 h-10 bg-[#E8F5F1] rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Truck className="w-5 h-5 text-[#006A52]" />
                </div>
                <p className="text-xs text-[#666666]">Free Delivery</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-[#E8F5F1] rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Shield className="w-5 h-5 text-[#006A52]" />
                </div>
                <p className="text-xs text-[#666666]">Quality Assured</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-[#E8F5F1] rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Check className="w-5 h-5 text-[#006A52]" />
                </div>
                <p className="text-xs text-[#666666]">Authentic Product</p>
              </div>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">Similar Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div
                  key={relatedProduct.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group"
                  onClick={() => onNavigate('product-detail', { productId: relatedProduct.id })}
                >
                  <div className="relative aspect-square bg-[#F5F5F5] overflow-hidden">
                    <img
                      src={normalizeImageUrl(relatedProduct.image)}
                      alt={relatedProduct.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/product-placeholder.png';
                      }}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-[#1A1A1A] line-clamp-2 mb-2">
                      {relatedProduct.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#006A52]">
                        ₹{relatedProduct.price}
                      </span>

                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
