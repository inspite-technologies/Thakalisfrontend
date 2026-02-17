import { CheckCircle, ShoppingBag, ArrowRight, Truck, MapPin } from 'lucide-react';
import { Button } from '../components/ui/button.jsx';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function PaymentSuccessPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const orderId = location.state?.orderId;
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        if (!orderId) {
            navigate('/');
            return;
        }
        if (countdown <= 0) return;
        const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
        return () => clearTimeout(timer);
    }, [countdown, orderId, navigate]);

    useEffect(() => {
        if (countdown === 0 && orderId) {
            navigate(`/order/${orderId}`);
        }
    }, [countdown, orderId, navigate]);

    return (
        <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-sm border border-[#E5E5E5] overflow-hidden">
                <div className="p-8 pb-6 text-center">
                    <div className="w-20 h-20 bg-[#E8F5F1] rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-[#006A52]" strokeWidth={2} />
                    </div>

                    <h1 className="text-2xl font-bold text-[#1A1A1A] mb-2">
                        Payment Successful!
                    </h1>
                    <p className="text-[#666666] mb-8 max-w-sm mx-auto">
                        Thank you for your purchase. Your order has been confirmed.
                    </p>

                    <div className="bg-[#FAFAFA] rounded-xl p-5 mb-8 border border-[#F0F0F0] text-left">
                        <div className="flex justify-between items-center mb-4 border-b border-[#E5E5E5] pb-3">
                            <span className="text-sm text-[#666666]">Order ID</span>
                            <span className="font-mono font-medium text-[#1A1A1A]">#{orderId}</span>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm text-[#666666]">
                                <Truck className="w-4 h-4" />
                                <span>Status: <span className="text-[#006A52] font-medium">Preparing</span></span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Button
                            onClick={() => navigate(`/order/${orderId}`)}
                            className="w-full btn-primary h-12 text-base shadow-md hover:shadow-lg transition-all"
                        >
                            <ShoppingBag className="w-4 h-4 mr-2" />
                            View Order Details
                        </Button>

                        <Button
                            onClick={() => navigate('/')}
                            variant="outline"
                            className="w-full border-[#E5E5E5] text-[#666666] hover:text-[#006A52] hover:border-[#006A52] hover:bg-[#E8F5F1]"
                        >
                            Continue Shopping
                        </Button>
                    </div>
                </div>

                <div className="bg-[#F9FAFB] p-4 text-center border-t border-[#E5E5E5]">
                    <p className="text-sm text-[#666666]">
                        Redirecting to order details in <span className="font-semibold text-[#006A52]">{countdown}s</span>...
                    </p>
                </div>
            </div>
        </div>
    );
}
