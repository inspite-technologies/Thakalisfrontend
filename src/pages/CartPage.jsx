import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  MapPin,
  Plus,
  Minus,
  Trash2,
  Truck,
  Tag,
  ChevronRight
} from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';
import { Button } from '../components/ui/button.jsx';
import { toast } from '../components/ui/sonner';
import { normalizeImageUrl } from '../utils/utils.js';

export default function CartPage() {
  const navigate = useNavigate();
  const {
    cart,
    cartTotal,
    cartCount,
    updateQuantity,
    removeFromCart,
    addresses,
    placeOrder,
    isRegistered
  } = useStore();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [selectedAddress] = useState(
    addresses.find((a) => a.isDefault)?.id || addresses[0]?.id
  );
  const [paymentMethod, setPaymentMethod] = useState('online');

  const deliveryFee = cartTotal >= 299 ? 0 : 40;
  const taxes = Math.round(cartTotal * 0.05);
  const total = cartTotal + deliveryFee + taxes;

  const defaultAddress = addresses.find((a) => a.id === selectedAddress);

  const handlePlaceOrder = async () => {
    if (!isRegistered) {
      toast.error('Please login to place an order');
      navigate('/login');
      return;
    }
    if (!defaultAddress) {
      toast.error('Please add a delivery address');
      navigate('/add-address');
      return;
    }

    setIsPlacingOrder(true);
    try {
      const order = await placeOrder({
        items: cart,
        status: 'confirmed',
        subtotal: cartTotal,
        deliveryFee,
        taxes,
        total,
        paymentMethod: 'Online Payment',
        deliveryAddress: defaultAddress,
      });
      // Success toast handled in StoreContext
      navigate('/payment-success', { state: { orderId: order.id } });
    } catch (error) {
      console.error('Order placement error:', error);
      // Error toasts handled in StoreContext

      // Check for any payment-related keywords to redirect
      if (error.message && (
        error.message.toLowerCase().includes('payment') ||
        error.message.toLowerCase().includes('cancel') ||
        error.message.toLowerCase().includes('verification')
      )) {
        navigate('/payment-failure');
      }
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-[#E8F5F1] rounded-full flex items-center justify-center mx-auto mb-6">
            <Truck className="w-12 h-12 text-[#006A52]" />
          </div>
          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2">Your cart is empty</h2>
          <p className="text-[#666666] mb-6">Add some products to get started</p>
          <Button onClick={() => navigate('/products')} className="btn-primary">
            Browse Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="bg-white border-b border-[#E5E5E5]">
        <div className="section-container py-4">
          <button
            onClick={() => navigate('/products')}
            className="flex items-center gap-2 text-[#666666] hover:text-[#006A52] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Continue Shopping
          </button>
        </div>
      </div>

      <div className="section-container py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-8">
          Shopping Cart ({cartCount} items)
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[#1A1A1A] flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#006A52]" />
                  Delivery Address
                </h3>
                <button
                  onClick={() => navigate('/addresses', { state: { from: 'cart' } })}
                  className="text-[#006A52] text-sm font-medium hover:underline"
                >
                  Change
                </button>
              </div>
              {defaultAddress ? (
                <div className="p-4 bg-[#F5F5F5] rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-[#006A52] text-white text-xs font-medium rounded-lg capitalize">
                      {defaultAddress.type}
                    </span>
                    {defaultAddress.isDefault && (
                      <span className="text-xs text-[#006A52]">Default</span>
                    )}
                  </div>
                  <p className="text-[#1A1A1A]">{defaultAddress.fullAddress}</p>
                  {defaultAddress.landmark && (
                    <p className="text-sm text-[#666666] mt-1">
                      Landmark: {defaultAddress.landmark}
                    </p>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => navigate('/add-address')}
                  className="w-full p-4 border-2 border-dashed border-[#E5E5E5] rounded-xl text-[#666666] hover:border-[#006A52] hover:text-[#006A52] transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Delivery Address
                </button>
              )}
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-6">
              {cart.map((item, index) => (
                <div
                  key={`${item.product?.id || item._id}-${index}`}
                  className="flex flex-col sm:flex-row gap-4 pb-6 border-b border-[#E5E5E5] last:border-0 last:pb-0"
                >
                  {/* Image & Basic Info Wrapper for Mobile */}
                  <div className="flex gap-4">
                    <img
                      src={normalizeImageUrl(item.product.image)}
                      alt={item.product.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/product-placeholder.png';
                      }}
                      className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl bg-[#F5F5F5] flex-shrink-0"
                    />
                    <div className="flex-1 sm:hidden">
                      {/* Mobile View Title */}
                      <h3 className="font-medium text-[#1A1A1A] line-clamp-2 mb-1">
                        {item.product.name}
                      </h3>
                      <p className="text-xs text-[#666666] mb-1">{item.product.shop}</p>
                      <p className="text-sm font-bold text-[#006A52]">
                        ₹{item.product.price}
                      </p>
                    </div>
                  </div>

                  {/* Desktop View Details & Controls */}
                  <div className="flex-1">
                    <div className="hidden sm:block">
                      <h3 className="font-medium text-[#1A1A1A] line-clamp-2 mb-1">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-[#666666] mb-2">{item.product.shop}</p>
                      <p className="text-sm text-[#006A52] mb-3">
                        ₹{item.product.price} per item
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2 sm:mt-0">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-8 h-8 bg-[#F5F5F5] rounded-lg flex items-center justify-center hover:bg-[#E8F5F1] transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-8 h-8 bg-[#F5F5F5] rounded-lg flex items-center justify-center hover:bg-[#E8F5F1] transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="font-bold text-[#006A52] text-lg">
                          ₹{item.product.price * item.quantity}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="w-8 h-8 bg-[#FFF3ED] rounded-lg flex items-center justify-center hover:bg-[#E85A24]/20 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-[#E85A24]" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-[#1A1A1A] mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5 text-[#006A52]" />
                Bill Summary
              </h3>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-[#666666]">
                  <span>Item Total</span>
                  <span>₹{cartTotal}</span>
                </div>
                <div className="flex justify-between text-[#666666]">
                  <span className="flex items-center gap-1">
                    <Truck className="w-4 h-4" />
                    Delivery Fee
                  </span>
                  <span className={deliveryFee === 0 ? 'text-[#22C55E]' : ''}>
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-[#666666]">
                  <span>Taxes & Charges</span>
                  <span>₹{taxes}</span>
                </div>
              </div>

              <div className="border-t border-[#E5E5E5] pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="font-semibold text-[#1A1A1A]">To Pay</span>
                  <span className="font-bold text-xl text-[#006A52]">₹{total}</span>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-medium text-[#666666] mb-3">
                  Payment Method
                </h4>
                <button
                  onClick={() => setPaymentMethod('online')}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-colors flex items-center gap-3 border-[#006A52] bg-[#E8F5F1]`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center border-[#006A52]`}
                  >
                    <div className="w-2.5 h-2.5 bg-[#006A52] rounded-full" />
                  </div>
                  <div>
                    <span className="font-medium block">Online Payment</span>
                    <span className="text-xs text-[#666666]">
                      UPI, Cards, Net Banking (Razorpay)
                    </span>
                  </div>
                </button>
              </div>

              <Button
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder || !defaultAddress}
                className="w-full btn-primary py-4 h-14 text-lg"
              >
                {isPlacingOrder ? (
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Placing Order...
                  </span>
                ) : (
                  <span className="flex items-center justify-between w-full">
                    <span>Place Order</span>
                    <span className="flex items-center gap-2">
                      ₹{total}
                      <ChevronRight className="w-5 h-5" />
                    </span>
                  </span>
                )}
              </Button>

              {!defaultAddress && (
                <p className="text-sm text-[#E85A24] text-center mt-3">
                  Please add a delivery address to continue
                </p>
              )}
            </div>

            {cartTotal >= 299 && (
              <div className="bg-[#E8F5F1] rounded-2xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-[#006A52] rounded-xl flex items-center justify-center">
                  <Tag className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-[#006A52]">Yay! You saved ₹40</p>
                  <p className="text-sm text-[#006A52]/70">
                    Free delivery on orders above ₹299
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
