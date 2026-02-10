import { Heart, ShoppingCart, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';
import { products } from '../data/mockData.js';
import { Button } from '../components/ui/button.jsx';
import { toast } from '../components/ui/sonner';
import { normalizeImageUrl } from '../utils/utils.js';

export default function WishlistPage({ onNavigate }) {
  const { wishlist, toggleWishlist, addToCart } = useStore();

  const wishlistProducts = wishlist;

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    toast.success(`${product.name} added to cart!`);
  };

  const handleRemoveFromWishlist = (product) => {
    toggleWishlist(product);
    toast('Removed from wishlist');
  };

  if (wishlistProducts.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-[#FFF3ED] rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-12 h-12 text-[#E85A24]" />
          </div>
          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2">Your wishlist is empty</h2>
          <p className="text-[#666666] mb-6">Save products you love for later</p>
          <Button onClick={() => onNavigate('products')} className="btn-primary">
            Browse Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="bg-white border-b border-[#E5E5E5]">
        <div className="section-container py-6">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1A1A1A]">
            My Wishlist ({wishlistProducts.length})
          </h1>
        </div>
      </div>

      <div className="section-container py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {wishlistProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group"
            >
              <div
                className="relative aspect-square bg-[#F5F5F5] overflow-hidden cursor-pointer"
                onClick={() => onNavigate('product-detail', { productId: product.id })}
              >
                <img
                  src={normalizeImageUrl(product.image)}
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
                    handleRemoveFromWishlist(product);
                  }}
                  className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-[#FFF3ED] transition-colors"
                >
                  <Heart className="w-4 h-4 fill-[#E85A24] text-[#E85A24]" />
                </button>
              </div>

              <div className="p-4">
                <h3
                  className="font-medium text-[#1A1A1A] line-clamp-2 mb-2 cursor-pointer hover:text-[#006A52] transition-colors"
                  onClick={() => onNavigate('product-detail', { productId: product.id })}
                >
                  {product.name}
                </h3>

                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#006A52]">₹{product.price}</span>
                </div>

                <Button
                  onClick={() => handleAddToCart(product)}
                  className="w-full mt-3 btn-primary py-2 text-sm flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button
            onClick={() => onNavigate('products')}
            variant="outline"
            className="border-[#006A52] text-[#006A52] hover:bg-[#E8F5F1]"
          >
            Continue Shopping
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
