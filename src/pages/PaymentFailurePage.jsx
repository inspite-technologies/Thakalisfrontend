import { AlertCircle, ArrowRight, ShieldAlert, RefreshCw, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button.jsx';

export default function PaymentFailurePage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-sm border border-[#E5E5E5] overflow-hidden">
                <div className="p-8 pb-6 text-center">
                    <div className="w-20 h-20 bg-[#FEF2F2] rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertCircle className="w-10 h-10 text-[#EF4444]" strokeWidth={2} />
                    </div>

                    <h1 className="text-2xl font-bold text-[#1A1A1A] mb-2">
                        Payment Unsuccessful
                    </h1>
                    <p className="text-[#666666] mb-8 max-w-sm mx-auto">
                        We couldn't process your payment. Don't worry, no funds were deducted from your account.
                    </p>

                    <div className="bg-[#FAFAFA] rounded-xl p-5 text-left mb-8 border border-[#F0F0F0]">
                        <h3 className="text-sm font-semibold text-[#1A1A1A] mb-3 flex items-center gap-2">
                            <ShieldAlert className="w-4 h-4 text-[#666666]" />
                            Common reasons for failure:
                        </h3>
                        <ul className="space-y-2 text-sm text-[#666666] pl-1">
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#D4D4D4] mt-1.5" />
                                Internet connection interruption
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#D4D4D4] mt-1.5" />
                                Incorrect card details or UPI PIN
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#D4D4D4] mt-1.5" />
                                Bank server temporarily down
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <Button
                            onClick={() => navigate('/cart')}
                            className="w-full btn-primary h-12 text-base shadow-md hover:shadow-lg transition-all"
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Retry Payment
                        </Button>

                        <div className="grid grid-cols-1">
                            <Button
                                onClick={() => navigate('/')}
                                variant="outline"
                                className="w-full border-[#E5E5E5] text-[#666666] hover:text-[#1A1A1A] hover:bg-[#F5F5F5]"
                            >
                                Cancel Order
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
