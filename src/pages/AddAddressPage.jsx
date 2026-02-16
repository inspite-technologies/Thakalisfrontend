import { useState } from 'react';
import { ChevronLeft, MapPin, Home, Briefcase, MapPinned } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getCurrentPosition, getAddressFromCoords } from '../services/locationService';
import { useStore } from '../context/StoreContext.jsx';
import { Button } from '../components/ui/button.jsx';
import { Input } from '../components/ui/input.jsx';
import { toast } from '../components/ui/sonner';

export default function AddAddressPage() {
  const navigate = useNavigate();
  const { addAddress } = useStore();
  const [addressType, setAddressType] = useState('home');
  const [name, setName] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [pincode, setPincode] = useState('');
  const [phone, setPhone] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fullAddress.trim()) {
      toast.error('Please enter your address');
      return;
    }

    if (!pincode.trim() || pincode.length < 6) {
      toast.error('Please enter a valid pincode');
      return;
    }

    setIsLoading(true);
    try {
      const success = await addAddress({
        name: name.trim(),
        type: addressType,
        fullAddress: fullAddress.trim(),
        landmark: landmark.trim() || undefined,
        pincode: pincode.trim(),
        phone: phone.trim() || undefined,
        isDefault,
      });

      if (success) {
        toast.success('Address saved successfully!');
        navigate('/addresses');
      }
    } catch (error) {
      toast.error('Failed to save address');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="bg-white border-b border-[#E5E5E5]">
        <div className="section-container py-4">
          <button
            onClick={() => navigate('/addresses')}
            className="flex items-center gap-2 text-[#666666] hover:text-[#006A52] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Addresses
          </button>
        </div>
      </div>

      <div className="section-container py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-8">Add New Address</h1>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-3">
                Address Type
              </label>
              <div className="flex gap-3">
                {['home', 'work', 'other'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setAddressType(type)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 transition-all ${addressType === type
                      ? 'border-[#006A52] bg-[#E8F5F1] text-[#006A52]'
                      : 'border-[#E5E5E5] text-[#666666] hover:border-[#006A52]/50'
                      }`}
                  >
                    {type === 'home' && <Home className="w-4 h-4" />}
                    {type === 'work' && <Briefcase className="w-4 h-4" />}
                    {type === 'other' && <MapPinned className="w-4 h-4" />}
                    <span className="capitalize font-medium">{type}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Name <span className="text-[#999999]">(Optional)</span>
              </label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Home, Office, John Doe"
                className="w-full px-4 py-3 h-12 bg-[#F5F5F5] border-none rounded-xl focus:ring-2 focus:ring-[#006A52]/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Full Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-4 w-5 h-5 text-[#999999]" />
                <textarea
                  value={fullAddress}
                  onChange={(e) => setFullAddress(e.target.value)}
                  placeholder="Enter your complete address (House no., Street, Area, City, Pincode)"
                  rows={3}
                  className="w-full pl-12 pr-4 py-3 bg-[#F5F5F5] border-none rounded-xl focus:ring-2 focus:ring-[#006A52]/20 resize-none"
                />
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      setIsLoading(true);
                      toast.info('Detecting location...', { duration: 1000 });
                      const coords = await getCurrentPosition();
                      const address = await getAddressFromCoords(coords.lat, coords.lng);

                      setFullAddress(address.formatted);
                      if (address.details.postcode) {
                        setPincode(address.details.postcode);
                      }
                      toast.success('Address filled from location!');
                    } catch (error) {
                      toast.error('Could not detect location');
                      console.error(error);
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  className="absolute right-2 bottom-2 text-xs font-medium text-[#006A52] hover:bg-[#E8F5F1] px-2 py-1 rounded-lg transition-colors flex items-center gap-1"
                >
                  <MapPinned className="w-3 h-3" />
                  Use Current Location
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Pincode
              </label>
              <Input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="682001"
                className="w-full px-4 py-3 h-12 bg-[#F5F5F5] border-none rounded-xl focus:ring-2 focus:ring-[#006A52]/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Landmark <span className="text-[#999999]">(Optional)</span>
              </label>
              <Input
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder="e.g., Near City Mall, Opposite Metro Station"
                className="w-full px-4 py-3 h-12 bg-[#F5F5F5] border-none rounded-xl focus:ring-2 focus:ring-[#006A52]/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Phone Number <span className="text-[#999999]">(Optional)</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1A1A1A] font-medium">
                  +91
                </span>
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="9876543210"
                  className="w-full pl-14 pr-4 py-3 h-12 bg-[#F5F5F5] border-none rounded-xl focus:ring-2 focus:ring-[#006A52]/20"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsDefault(!isDefault)}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${isDefault
                  ? 'bg-[#006A52] border-[#006A52]'
                  : 'border-[#999999] hover:border-[#006A52]'
                  }`}
              >
                {isDefault && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
              <span className="text-[#1A1A1A]">Set as default address</span>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/addresses')}
                className="flex-1 py-4 h-14"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !fullAddress.trim()}
                className="flex-1 btn-primary py-4 h-14"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </span>
                ) : (
                  'Save Address'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
