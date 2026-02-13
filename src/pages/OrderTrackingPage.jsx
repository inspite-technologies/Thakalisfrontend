import { useState, useEffect } from 'react';
import { ChevronLeft, Truck, Package, Check, Phone, MessageCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';
import { Button } from '../components/ui/button.jsx';

const trackingSteps = [
  { status: 'Order Confirmed', description: 'Your order has been confirmed', icon: Check },
  { status: 'Order Packed', description: 'Items packed and ready', icon: Package },
  { status: 'Out for Delivery', description: 'Delivery partner picked up', icon: Truck },
  { status: 'Delivered', description: 'Order delivered successfully', icon: Check },
];

export default function OrderTrackingPage({ orderId, onNavigate }) {
  const { orders } = useStore();
  const [currentStep, setCurrentStep] = useState(2);
  const order = orders.find((o) => o.id === orderId);

  useEffect(() => {
    if (order) {
      switch (order.status) {
        case 'confirmed':
          setCurrentStep(0);
          break;
        case 'packed':
          setCurrentStep(1);
          break;
        case 'out_for_delivery':
          setCurrentStep(2);
          break;
        case 'delivered':
          setCurrentStep(3);
          break;
        default:
          setCurrentStep(0);
      }
    }
  }, [order]);

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
        <div className="bg-[#006A52] rounded-2xl p-6 text-white mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
              <Truck className="w-7 h-7" />
            </div>
            <div>
              <p className="text-white/80 text-sm">Status</p>
              <h2 className="text-xl font-bold">
                {order.status === 'out_for_delivery'
                  ? 'Out for Delivery'
                  : order.status === 'delivered'
                    ? 'Delivered'
                    : 'In Transit'}
              </h2>
              {order.estimatedDelivery && (
                <p className="text-white/80 text-sm mt-1">
                  Arriving {order.estimatedDelivery}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-[#1A1A1A] mb-6">Tracking Updates</h3>

              <div className="relative">
                <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-[#E5E5E5]">
                  <div
                    className="absolute top-0 left-0 w-full bg-[#006A52] transition-all duration-500"
                    style={{ height: `${(currentStep / (trackingSteps.length - 1)) * 100}%` }}
                  />
                </div>

                <div className="space-y-8">
                  {trackingSteps.map((step, index) => {
                    const isCompleted = index <= currentStep;
                    const isCurrent = index === currentStep;
                    const Icon = step.icon;

                    return (
                      <div key={index} className="relative flex items-start gap-4">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 transition-all duration-300 ${isCompleted
                            ? 'bg-[#006A52] text-white'
                            : 'bg-[#F5F5F5] text-[#999999]'
                            } ${isCurrent ? 'ring-4 ring-[#006A52]/20' : ''}`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 pt-1">
                          <h4
                            className={`font-medium ${isCompleted ? 'text-[#1A1A1A]' : 'text-[#999999]'
                              }`}
                          >
                            {step.status}
                          </h4>
                          <p className="text-sm text-[#666666]">{step.description}</p>
                          {order.trackingUpdates?.[index] && (
                            <p className="text-xs text-[#999999] mt-1">
                              {order.trackingUpdates[index].timestamp}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-[#1A1A1A] mb-4">Order Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[#666666]">Order ID</p>
                  <p className="font-medium text-[#1A1A1A]">{order.orderId}</p>
                </div>
                <div>
                  <p className="text-sm text-[#666666]">Order Date</p>
                  <p className="font-medium text-[#1A1A1A]">
                    {new Date(order.orderDate).toLocaleDateString('en-IN')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[#666666]">Items</p>
                  <p className="font-medium text-[#1A1A1A]">{order.items.length}</p>
                </div>
                <div>
                  <p className="text-sm text-[#666666]">Total</p>
                  <p className="font-medium text-[#006A52]">₹{order.total}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-[#1A1A1A] mb-4">Delivery Partner</h3>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-[#E8F5F1] rounded-full flex items-center justify-center">
                  <Truck className="w-7 h-7 text-[#006A52]" />
                </div>
                <div>
                  <p className="font-medium text-[#1A1A1A]">Delivery Partner</p>
                  <p className="text-sm text-[#666666]">+91 98765 43210</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="border-[#E5E5E5]">
                  <Phone className="w-4 h-4 mr-2" />
                  Call
                </Button>
                <Button className="btn-primary">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-[#1A1A1A] mb-2">Need Help?</h3>
              <p className="text-sm text-[#666666] mb-4">
                Having issues with your order? Contact our support team.
              </p>
              <Button variant="outline" className="w-full border-[#006A52] text-[#006A52]">
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
