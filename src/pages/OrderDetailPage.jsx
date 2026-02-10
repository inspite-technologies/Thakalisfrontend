import { ChevronLeft, MapPin, Package, CreditCard, Truck, Check } from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';
import { Button } from '../components/ui/button.jsx';
import { normalizeImageUrl } from '../utils/utils.js';

const statusColors = {
  confirmed: 'bg-[#E8F5F1] text-[#006A52]',
  packed: 'bg-[#FFF3ED] text-[#E85A24]',
  out_for_delivery: 'bg-[#E8F5F1] text-[#006A52]',
  delivered: 'bg-[#E8F5F1] text-[#22C55E]',
  cancelled: 'bg-[#FFF3ED] text-[#EF4444]',
};

const statusLabels = {
  confirmed: 'Confirmed',
  packed: 'Packed',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export default function OrderDetailPage({ orderId, onNavigate }) {
  const { orders } = useStore();
  const order = orders.find((o) => o.id === orderId);

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2">Order not found</h2>
          <Button onClick={() => onNavigate('orders')} className="btn-primary">
            Back to Orders
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
            onClick={() => onNavigate('orders')}
            className="flex items-center gap-2 text-[#666666] hover:text-[#006A52] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Orders
          </button>
        </div>
      </div>

      <div className="section-container py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-xl font-bold text-[#1A1A1A]">{order.orderId}</h1>
                  <p className="text-sm text-[#666666] mt-1">
                    Ordered on{' '}
                    {new Date(order.orderDate).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]
                    }`}
                >
                  {statusLabels[order.status]}
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-[#1A1A1A] mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#006A52]" />
                Delivery Address
              </h3>
              <div className="p-4 bg-[#F5F5F5] rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-[#006A52] text-white text-xs font-medium rounded-lg capitalize">
                    {order.deliveryAddress?.type || 'Delivery'}
                  </span>
                </div>
                <p className="text-[#1A1A1A]">{order.deliveryAddress?.fullAddress || 'Address not available'}</p>
                {order.deliveryAddress?.landmark && (
                  <p className="text-sm text-[#666666] mt-1">
                    Landmark: {order.deliveryAddress.landmark}
                  </p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-[#1A1A1A] mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-[#006A52]" />
                Items ({order.items.length})
              </h3>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-4 pb-4 border-b border-[#E5E5E5] last:border-0 last:pb-0"
                  >
                    <img
                      src={normalizeImageUrl(item.product.image)}
                      alt={item.product.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/product-placeholder.png';
                      }}
                      className="w-20 h-20 object-cover rounded-xl bg-[#F5F5F5]"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-[#1A1A1A]">{item.product.name}</h4>
                      <p className="text-sm text-[#666666]">{item.product.shop}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-[#666666]">
                          Qty: {item.quantity}
                        </span>
                        <span className="font-semibold text-[#006A52]">
                          ₹{item.product.price * item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-[#1A1A1A] mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#006A52]" />
                Payment Method
              </h3>
              <p className="text-[#666666]">{order.paymentMethod}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-[#1A1A1A] mb-4">Bill Summary</h3>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-[#666666]">
                  <span>Item Total</span>
                  <span>₹{order.subtotal}</span>
                </div>
                <div className="flex justify-between text-[#666666]">
                  <span className="flex items-center gap-1">
                    <Truck className="w-4 h-4" />
                    Delivery Fee
                  </span>
                  <span className={order.deliveryFee === 0 ? 'text-[#22C55E]' : ''}>
                    {order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-[#666666]">
                  <span>Taxes & Charges</span>
                  <span>₹{order.taxes}</span>
                </div>
              </div>
              <div className="border-t border-[#E5E5E5] pt-4">
                <div className="flex justify-between">
                  <span className="font-semibold text-[#1A1A1A]">Total</span>
                  <span className="font-bold text-xl text-[#006A52]">
                    ₹{order.total}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-10">
              <Button
                onClick={() => {
                  const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://thakkalies-api.onrender.com';
                  window.open(`${API_URL}/order/invoice/${order.id}`, '_blank');
                }}
                className="w-full btn-primary"
              >
                <Check className="w-4 h-4 mr-2" />
                Download Invoice
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
