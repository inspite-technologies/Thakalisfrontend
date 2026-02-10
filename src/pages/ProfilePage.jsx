import {
  User,
  MapPin,
  ShoppingBag,
  Gift,
  Users,
  Heart,
  LogOut,
  ChevronRight,
  Edit3,
  Phone,
  Mail
} from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';
import { toast } from '../components/ui/sonner';

export default function ProfilePage({ onNavigate }) {
  const { user, logout } = useStore();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    onNavigate('home');
  };

  const menuItems = [
    {
      icon: Edit3,
      label: 'Edit Profile',
      onClick: () => onNavigate('edit-profile'),
      description: 'Update your personal information',
    },
    {
      icon: MapPin,
      label: 'Saved Addresses',
      onClick: () => onNavigate('addresses'),
      description: 'Manage your delivery addresses',
    },
    {
      icon: ShoppingBag,
      label: 'My Orders',
      onClick: () => onNavigate('orders'),
      description: 'View your order history',
    },
    {
      icon: Gift,
      label: 'Rewards',
      onClick: () => onNavigate('rewards'),
      description: 'Check your reward points',
    },
    {
      icon: Users,
      label: 'Refer & Earn',
      onClick: () => onNavigate('refer-earn'),
      description: 'Invite friends and earn rewards',
    },
    {
      icon: Heart,
      label: 'Wishlist',
      onClick: () => onNavigate('wishlist'),
      description: 'Your saved products',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="bg-[#006A52]">
        <div className="section-container py-8">
          <h1 className="text-2xl font-bold text-white text-center">Profile</h1>
        </div>
      </div>

      <div className="section-container py-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6 -mt-12 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-[#E8F5F1] rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-[#006A52]" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-[#1A1A1A]">
                {user?.name || user?.fullName || 'User'}
              </h2>
              <div className="flex items-center gap-4 mt-2 text-sm text-[#666666]">
                <span className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  {user?.phone || user?.phoneNumber || '+91 9876543210'}
                </span>
                {user?.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {user.email}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-[#E5E5E5]">
            <h3 className="font-semibold text-[#1A1A1A]">Account Settings</h3>
          </div>
          <div className="divide-y divide-[#E5E5E5]">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={item.onClick}
                className="w-full flex items-center gap-4 p-4 hover:bg-[#F5F5F5] transition-colors text-left"
              >
                <div className="w-10 h-10 bg-[#E8F5F1] rounded-xl flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-[#006A52]" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-[#1A1A1A]">{item.label}</p>
                  <p className="text-sm text-[#666666]">{item.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-[#999999]" />
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full mt-6 flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm hover:bg-[#FFF3ED] transition-colors"
        >
          <div className="w-10 h-10 bg-[#FFF3ED] rounded-xl flex items-center justify-center">
            <LogOut className="w-5 h-5 text-[#E85A24]" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-[#E85A24]">Logout</p>
            <p className="text-sm text-[#666666]">Sign out of your account</p>
          </div>
          <ChevronRight className="w-5 h-5 text-[#999999]" />
        </button>

      </div>
    </div>
  );
}
