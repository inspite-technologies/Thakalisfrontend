import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, User, Mail, Phone, Check, Receipt, Building2, Landmark, Upload, X } from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';
import { Button } from '../components/ui/button.jsx';
import { Input } from '../components/ui/input.jsx';
import { toast } from '../components/ui/sonner';
import { normalizeImageUrl } from '../utils/utils.js';

export default function EditProfilePage({ onNavigate }) {
  const { user, updateStoreProfile } = useStore();
  const [name, setName] = useState(user?.name || user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');

  // Bank Details State
  const [bankDetails, setBankDetails] = useState({
    accountNumber: user?.bankDetails?.accountNumber || '',
    ifscCode: user?.bankDetails?.ifscCode || '',
    branch: user?.bankDetails?.branch || ''
  });

  // GST Details State
  const [gstDetails, setGstDetails] = useState({
    gstNumber: user?.gstDetails?.gstNumber || '',
    gstType: user?.gstDetails?.gstType || 'REGULAR',
    businessLegalName: user?.gstDetails?.businessLegalName || ''
  });

  const [gstCertificate, setGstCertificate] = useState(null);
  const [gstCertificatePreview, setGstCertificatePreview] = useState(user?.gstDetails?.gstCertificate || null);
  const [isLoading, setIsLoading] = useState(false);

  const fileInputRef = useRef(null);

  // Sync state when user object changes (important for async loads)
  useEffect(() => {
    if (user) {
      console.log('🔄 Syncing Profile User Data:', user);
      setName(user.name || user.fullName || '');
      setEmail(user.email || '');
      setBankDetails({
        accountNumber: user.bankDetails?.accountNumber || '',
        ifscCode: user.bankDetails?.ifscCode || '',
        branch: user.bankDetails?.branch || ''
      });
      setGstDetails({
        gstNumber: user.gstDetails?.gstNumber || '',
        gstType: user.gstDetails?.gstType || 'REGULAR',
        businessLegalName: user.gstDetails?.businessLegalName || ''
      });
      setGstCertificatePreview(user.gstDetails?.gstCertificate || null);
    }
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('📂 File selected:', file.name);
      setGstCertificate(file);
      setGstCertificatePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('fullName', name);
      formData.append('email', email);

      // Store fields
      formData.append('businessName', name); // Often business name is the same as the user's name in this context

      // Send nested objects as JSON strings (backend expects this)
      formData.append('bankDetails', JSON.stringify(bankDetails));
      formData.append('gstDetails', JSON.stringify(gstDetails));

      if (gstCertificate) {
        formData.append('gstCertificate', gstCertificate);
      }

      const success = await updateStoreProfile(formData);
      if (success) {
        toast.success('Profile updated successfully!');
        onNavigate('profile');
      }
    } catch (error) {
      console.error('Update error:', error);
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

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm space-y-8">
            {/* Personal Information */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-[#1A1A1A] flex items-center gap-2 border-b pb-2">
                <User className="w-5 h-5 text-[#006A52]" />
                Personal Information
              </h2>

              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-[#E8F5F1] rounded-full flex items-center justify-center overflow-hidden border border-[#E5E5E5]">
                    {user?.aadhaarOrLicenseImage ? (
                      <img src={normalizeImageUrl(user.aadhaarOrLicenseImage)} alt="Store" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-12 h-12 text-[#006A52]" />
                    )}
                  </div>
                  <button
                    type="button"
                    className="absolute bottom-0 right-0 w-8 h-8 bg-[#006A52] text-white rounded-full flex items-center justify-center hover:bg-[#00523F] transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Full Name</label>
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
                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Email Address <span className="text-[#999999]">(Optional)</span></label>
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
                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#999999]" />
                  <Input
                    type="tel"
                    value={user?.phone || user?.phoneNumber || '+91 9876543210'}
                    disabled
                    className="w-full pl-12 pr-4 py-3 h-14 bg-[#F5F5F5] border-none rounded-xl text-[#666666]"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[#22C55E]">
                    <Check className="w-4 h-4" />
                    <span className="text-xs font-medium">Verified</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bank Details */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-[#1A1A1A] flex items-center gap-2 border-b pb-2">
                <Landmark className="w-5 h-5 text-[#006A52]" />
                Bank Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Account Number</label>
                  <Input
                    type="text"
                    value={bankDetails.accountNumber}
                    onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                    placeholder="Enter account number"
                    className="w-full px-4 py-3 h-14 bg-[#F5F5F5] border-none rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-2">IFSC Code</label>
                  <Input
                    type="text"
                    value={bankDetails.ifscCode}
                    onChange={(e) => setBankDetails({ ...bankDetails, ifscCode: e.target.value.toUpperCase() })}
                    placeholder="IFSC Code"
                    className="w-full px-4 py-3 h-14 bg-[#F5F5F5] border-none rounded-xl uppercase"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Branch</label>
                  <Input
                    type="text"
                    value={bankDetails.branch}
                    onChange={(e) => setBankDetails({ ...bankDetails, branch: e.target.value })}
                    placeholder="Branch name"
                    className="w-full px-4 py-3 h-14 bg-[#F5F5F5] border-none rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Tax Information */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-[#1A1A1A] flex items-center gap-2 border-b pb-2">
                <Receipt className="w-5 h-5 text-[#006A52]" />
                Tax Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-2">GST Number</label>
                  <Input
                    type="text"
                    value={gstDetails.gstNumber}
                    onChange={(e) => setGstDetails({ ...gstDetails, gstNumber: e.target.value.toUpperCase() })}
                    placeholder="Enter GST number"
                    className="w-full px-4 py-3 h-14 bg-[#F5F5F5] border-none rounded-xl uppercase"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">GST Type</label>
                    <select
                      value={gstDetails.gstType}
                      onChange={(e) => setGstDetails({ ...gstDetails, gstType: e.target.value })}
                      className="w-full px-4 py-3 h-14 bg-[#F5F5F5] border-none rounded-xl focus:ring-2 focus:ring-[#006A52]/20"
                    >
                      <option value="REGULAR">Regular</option>
                      <option value="COMPOSITION">Composition</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Legal Business Name</label>
                    <Input
                      type="text"
                      value={gstDetails.businessLegalName}
                      onChange={(e) => setGstDetails({ ...gstDetails, businessLegalName: e.target.value })}
                      placeholder="Legal business name"
                      className="w-full px-4 py-3 h-14 bg-[#F5F5F5] border-none rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-2">GST Certificate</label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-[#E5E5E5] rounded-2xl p-4 text-center cursor-pointer hover:border-[#006A52] transition-colors"
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      accept="image/*,.pdf"
                    />
                    {gstCertificatePreview ? (
                      <div className="space-y-3">
                        {typeof gstCertificatePreview === 'string' && (gstCertificatePreview.startsWith('http') || gstCertificatePreview.startsWith('blob:')) ? (
                          <div className="relative group mx-auto w-full max-w-[200px]">
                            <img
                              src={normalizeImageUrl(gstCertificatePreview)}
                              alt="GST Certificate"
                              className="w-full h-32 object-cover rounded-xl shadow-sm border border-[#E5E5E5]"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center text-white text-sm font-medium">
                              Change Image
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2">
                            <Check className="w-8 h-8 text-[#22C55E]" />
                            <p className="text-[#1A1A1A] font-medium">{gstCertificate?.name || 'Document Uploaded'}</p>
                          </div>
                        )}
                        <p className="text-[#006A52] text-sm font-medium">Click to change file</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="w-8 h-8 text-[#999999] mx-auto" />
                        <p className="text-[#1A1A1A] font-medium">Upload GST Certificate</p>
                        <p className="text-[#999999] text-xs">PNG, JPG or PDF up to 5MB</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
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
