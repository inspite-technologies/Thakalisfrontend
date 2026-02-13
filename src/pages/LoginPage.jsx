import { useState } from 'react';
import { Phone, ArrowRight, ChevronLeft } from 'lucide-react';
import { Button } from '../components/ui/button.jsx';
import { Input } from '../components/ui/input.jsx';
import { useStore } from '../context/StoreContext.jsx';
import { toast } from '../components/ui/sonner';

export default function LoginPage({ onNavigate }) {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('phone');
  const [isLoading, setIsLoading] = useState(false);
  const { login, requestOTP } = useStore();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (phone.length !== 10) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }
    setIsLoading(true);
    try {
      await requestOTP(phone);
      setStep('otp');
      toast.success('OTP sent successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }
    setIsLoading(true);
    const success = await login(phone, otp);
    setIsLoading(false);
    if (success) {
      toast.success('Login successful!');
      onNavigate('home');
    } else {
      toast.error('Invalid OTP. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8F5F1] via-white to-[#FFF3ED] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <button
          onClick={() => onNavigate('home')}
          className="mb-6 flex items-center gap-2 text-[#666666] hover:text-[#006A52] transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Home
        </button>

        <div className="bg-white rounded-3xl shadow-xl shadow-black/5 p-8">
          <div className="text-center mb-8">
            <div className="h-16 flex items-center justify-center mx-auto mb-4">
              <img
                src="/thakkalies_horizontal_logo.svg"
                alt="Thakkalies"
                className="h-full w-auto object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold text-[#1A1A1A]">Welcome Back</h1>
            <p className="text-[#666666] mt-2">
              {step === 'phone'
                ? 'Enter your phone number to continue'
                : 'Enter the OTP sent to your phone'}
            </p>
          </div>

          {step === 'phone' ? (
            <form onSubmit={handleSendOTP} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <Phone className="w-5 h-5 text-[#999999]" />
                    <span className="text-[#1A1A1A] font-medium">+91</span>
                  </div>
                  <Input
                    type="tel"
                    placeholder="9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="pl-24 pr-4 py-4 h-14 bg-[#F5F5F5] border-none rounded-xl text-lg focus:ring-2 focus:ring-[#006A52]/20"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading || phone.length !== 10}
                className="w-full btn-primary py-4 h-14 text-lg"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending OTP...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Continue
                    <ArrowRight className="w-5 h-5" />
                  </span>
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                  Enter OTP
                </label>
                <div className="flex gap-2 justify-center">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <Input
                      key={index}
                      type="text"
                      maxLength={1}
                      value={otp[index] || ''}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        const newOtp = otp.split('');
                        newOtp[index] = value;
                        setOtp(newOtp.join('').slice(0, 6));
                        if (value && index < 5) {
                          const nextInput = e.target.parentElement?.nextElementSibling?.querySelector('input');
                          nextInput?.focus();
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace' && !otp[index] && index > 0) {
                          const prevInput = e.currentTarget.parentElement?.previousElementSibling?.querySelector('input');
                          prevInput?.focus();
                        }
                      }}
                      className="w-12 h-14 text-center text-xl font-bold bg-[#F5F5F5] border-none rounded-xl focus:ring-2 focus:ring-[#006A52]/20"
                    />
                  ))}
                </div>
                <p className="text-center text-sm text-[#999999] mt-4">
                  Please enter the 6-digit code sent to your phone
                </p>
              </div>

              <Button
                type="submit"
                disabled={isLoading || otp.length !== 6}
                className="w-full btn-primary py-4 h-14 text-lg"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Verifying...
                  </span>
                ) : (
                  'Verify & Login'
                )}
              </Button>

              <button
                type="button"
                onClick={() => {
                  setStep('phone');
                  setOtp('');
                }}
                className="w-full text-center text-[#006A52] hover:underline"
              >
                Change Phone Number
              </button>
            </form>
          )}

        </div>

        <div className="mt-8 flex justify-center gap-8 text-sm text-[#666666]">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#22C55E] rounded-full" />
            Secure Login
          </span>
        </div>
      </div>
    </div>
  );
}
