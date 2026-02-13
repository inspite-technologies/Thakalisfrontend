import { useState } from 'react';
import { ChevronLeft, User, Mail, Phone, Check } from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';
import { Button } from '../components/ui/button.jsx';
import { Input } from '../components/ui/input.jsx';
import { toast } from '../components/ui/sonner';

export default function EditProfilePage({ onNavigate }) {
  const { user, updateUserDetails } = useStore();
  const [name, setName] = useState(user?.name || user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    setIsLoading(true);
    try {
      const success = await updateUserDetails({ name, email });
      if (success) {
        toast.success('Profile updated successfully!');
        onNavigate('profile');
      }
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="bg-white border-b border-[#E5E5E5]">
        <div className="section-container py-4">
          <button
            onClick={() => onNavigate('profile')}
            className="flex items-center gap-2 text-[#666666] hover:text-[#006A52] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Profile
          </button>
        </div>
      </div>

      <div className="section-container py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-8">Edit Profile</h1>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 bg-[#E8F5F1] rounded-full flex items-center justify-center">
                  <User className="w-12 h-12 text-[#006A52]" />
                </div>
                <button
                  type="button"
                  className="absolute bottom-0 right-0 w-8 h-8 bg-[#006A52] text-white rounded-full flex items-center justify-center hover:bg-[#00523F] transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#999999]" />
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full pl-12 pr-4 py-3 h-14 bg-[#F5F5F5] border-none rounded-xl focus:ring-2 focus:ring-[#006A52]/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Email Address <span className="text-[#999999]">(Optional)</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#999999]" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full pl-12 pr-4 py-3 h-14 bg-[#F5F5F5] border-none rounded-xl focus:ring-2 focus:ring-[#006A52]/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#999999]" />
                <Input
                  type="tel"
                  value={user?.phone || '+91 9876543210'}
                  disabled
                  className="w-full pl-12 pr-4 py-3 h-14 bg-[#F5F5F5] border-none rounded-xl text-[#666666]"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[#22C55E]">
                  <Check className="w-4 h-4" />
                  <span className="text-xs font-medium">Verified</span>
                </div>
              </div>
              <p className="text-xs text-[#999999] mt-2">
                Phone number cannot be changed. Contact support for assistance.
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onNavigate('profile')}
                className="flex-1 py-4 h-14"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !name.trim()}
                className="flex-1 btn-primary py-4 h-14"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </span>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
