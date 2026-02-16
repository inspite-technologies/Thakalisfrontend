import { normalizeImageUrl } from '../utils/utils.js';
import { Package, ChevronRight, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext.jsx';
import { Button } from '../components/ui/button.jsx';

const statusColors = {
  Pending: 'bg-[#FFF3ED] text-[#E85A24]',
  Accepted: 'bg-[#E8F5F1] text-[#006A52]',
  Delivered: 'bg-[#E8F5F1] text-[#22C55E]',
  Cancelled: 'bg-[#FFF3ED] text-[#EF4444]',
  Rejected: 'bg-[#FFF3ED] text-[#EF4444]',
};

const statusLabels = {
  Pending: 'Pending',
  Accepted: 'Accepted',
  Delivered: 'Delivered',
  Cancelled: 'Cancelled',
  Rejected: 'Rejected',
};

export default function OrdersPage() {
  const navigate = useNavigate();
  const { orders } = useStore();

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-[#E8F5F1] rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-12 h-12 text-[#006A52]" />
          </div>
          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2">No orders yet</h2>
          <p className="text-[#666666] mb-6">Start shopping to see your orders here</p>
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
        <div className="section-container py-6">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1A1A1A]">Order History</h1>
        </div>
      </div>

      <div className="section-container py-8">
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl p-6 shadow-sm"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#E8F5F1] rounded-xl flex items-center justify-center">
                    <Package className="w-6 h-6 text-[#006A52]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#1A1A1A]">{order.orderId}</p>
                    <p className="text-sm text-[#666666]">
                      {new Date(order.orderDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]
                    }`}
                >
                  {statusLabels[order.status]}
                </span>
              </div>

              <div className="border-t border-[#E5E5E5] pt-4 mb-4">
                <p className="text-sm text-[#666666] mb-2">
                  {order.items.length} item{order.items.length > 1 ? 's' : ''}
                </p>
                <div className="flex gap-2 flex-wrap">
                  {order.items.slice(0, 4).map((item, index) => {
                    const itemStatus = item.status || 'Pending';
                    return (
                      <div key={index} className="relative group">
                        <img
                          src={normalizeImageUrl(item.product?.image)}
                          alt={item.product?.name || 'Product'}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/product-placeholder.png';
                          }}
                          className="w-16 h-16 object-cover rounded-lg bg-[#F5F5F5]"
                        />
                        <span className={`absolute -top-1 -right-1 px-1.5 py-0.5 rounded text-xs font-medium ${statusColors[itemStatus]}`}>
                          {statusLabels[itemStatus]?.charAt(0) || 'P'}
                        </span>
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#1A1A1A] text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                          {item.product.name} - {statusLabels[itemStatus]}
                        </div>
                      </div>
                    );
                  })}
                  {order.items.length > 4 && (
                    <div className="w-16 h-16 bg-[#F5F5F5] rounded-lg flex items-center justify-center">
                      <span className="text-sm text-[#666666]">
                        +{order.items.length - 4}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#666666]">Total Amount</p>
                  <p className="text-xl font-bold text-[#006A52]">₹{order.total}</p>
                </div>
                <div className="flex gap-2">
                  {order.status === 'Delivered' && (
                    <Button
                      variant="outline"
                      className="border-[#006A52] text-[#006A52] hover:bg-[#E8F5F1]"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reorder
                    </Button>
                  )}
                  <Button
                    onClick={() => navigate(`/order/${order.id}`)}
                    className="btn-primary"
                  >
                    View Details
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
