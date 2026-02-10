import { MapPin, Plus, ChevronLeft, Home, Briefcase, MapPinned } from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';
import { Button } from '../components/ui/button.jsx';

const typeIcons = {
  home: Home,
  work: Briefcase,
  other: MapPinned,
};

export default function AddressesPage({ onNavigate }) {
  const { addresses, setDefaultAddress, deleteAddress } = useStore();

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
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1A1A1A]">Saved Addresses</h1>
          <Button
            onClick={() => onNavigate('add-address')}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add New
          </Button>
        </div>

        {addresses.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center">
            <div className="w-20 h-20 bg-[#F5F5F5] rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-10 h-10 text-[#999999]" />
            </div>
            <h3 className="text-lg font-medium text-[#1A1A1A] mb-2">No saved addresses</h3>
            <p className="text-[#666666] mb-6">Add your first address to get started</p>
            <Button
              onClick={() => onNavigate('add-address')}
              className="btn-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Address
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {addresses.map((address) => {
              const Icon = typeIcons[address.type];
              return (
                <div
                  key={address._id}
                  className={`bg-white rounded-2xl p-6 shadow-sm border-2 transition-all ${address.isDefault
                    ? 'border-[#006A52]'
                    : 'border-transparent hover:border-[#E5E5E5]'
                    }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#E8F5F1] rounded-xl flex items-center justify-center">
                        {Icon ? (
                          <Icon className="w-5 h-5 text-[#006A52]" />
                        ) : (
                          <Home className="w-5 h-5 text-[#006A52]" />
                        )}
                      </div>
                      <div>
                        <span className="px-2 py-1 bg-[#006A52] text-white text-xs font-medium rounded-lg capitalize">
                          {address.type}
                        </span>
                        {address.isDefault && (
                          <span className="ml-2 text-xs text-[#006A52]">Default</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-[#1A1A1A] mb-2">{address.fullAddress}</p>
                  {address.landmark && (
                    <p className="text-sm text-[#666666] mb-2">
                      Landmark: {address.landmark}
                    </p>
                  )}
                  {address.phone && (
                    <p className="text-sm text-[#666666]">Phone: {address.phone}</p>
                  )}

                  <div className="flex gap-2 mt-4 pt-4 border-t border-[#E5E5E5]">
                    {!address.isDefault && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDefaultAddress(address._id)}
                        className="flex-1 border-[#006A52] text-[#006A52] hover:bg-[#E8F5F1]"
                      >
                        Set as Default
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteAddress(address._id)}
                      className="border-[#E85A24] text-[#E85A24] hover:bg-[#FFF3ED]"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
