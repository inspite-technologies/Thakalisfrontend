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
  Mail,
  LogIn
} from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext.jsx';
import { toast } from '../components/ui/sonner';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout, isLoggedIn, isGuest, fetchUserDetails } = useStore();

  useEffect(() => {
    if (isLoggedIn) {
      fetchUserDetails();
    }
  }, [isLoggedIn, fetchUserDetails]);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const registeredMenuItems = [
    {
      icon: Edit3,
      label: 'Edit Profile',
      onClick: () => navigate('/edit-profile'),
      description: 'Update your personal information',
    },
    {
      icon: MapPin,
      label: 'Saved Addresses',
      onClick: () => navigate('/addresses'),
      description: 'Manage your delivery addresses',
    },
    {
      icon: ShoppingBag,
      label: 'My Orders',
      onClick: () => navigate('/orders'),
      description: 'View your order history',
    },
    {
      icon: Gift,
      label: 'Rewards',
      onClick: () => navigate('/rewards'),
      description: 'Check your reward points',
    },
    {
      icon: Users,
      label: 'Refer & Earn',
      onClick: () => navigate('/refer-earn'),
      description: 'Invite friends and earn rewards',
    },
    {
      icon: Heart,
      label: 'Wishlist',
      onClick: () => navigate('/wishlist'),
      description: 'Your saved products',
    },
  ];

  const guestMenuItems = [
    {
      icon: MapPin,
      label: 'Saved Addresses',
      onClick: () => {
        toast.error('Please login to manage addresses');
        navigate('/login');
      },
      description: 'Manage your delivery addresses',
    },
    {
      icon: ShoppingBag,
      label: 'My Orders',
      onClick: () => {
        toast.error('Please login to view orders');
        navigate('/login');
      },
      description: 'View your order history',
    },
    {
      icon: Heart,
      label: 'Wishlist',
      onClick: () => navigate('/wishlist'),
      description: 'Your saved products',
    },
  ];

  const menuItems = isGuest ? guestMenuItems : registeredMenuItems;

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="bg-[#006A52]">
        <div className="section-container py-8">
          <h1 className="text-2xl font-bold text-white text-center">Profile</h1>
        </div>
      </div>

      <div className="section-container py-8 relative">
        {/* User Info Card */}
        <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm mb-6 -mt-6 md:-mt-12 relative z-10 animate-fade-in-up">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-[#E8F5F1] rounded-full flex items-center justify-center shadow-inner">
              <User className="w-8 h-8 md:w-10 md:h-10 text-[#006A52]" />
            </div>
            <div className="flex-1 min-w-0"> {/* min-w-0 to fix flex text overflow */}
              <h2 className="text-lg md:text-xl font-bold text-[#1A1A1A] truncate">
                {isGuest ? 'Guest Session' : (user?.name || user?.fullName || 'User')}
              </h2>
              <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 mt-1 md:mt-2 text-sm text-[#666666]">
                {!isGuest && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" />
                    {user?.phone || user?.phoneNumber || ''}
                  </span>
                )}
                {isGuest && (
                  <span className="text-[#006A52] font-medium">Logged in as Guest</span>
                )}
                {!isGuest && user?.email && (
                  <span className="flex items-center gap-1.5 truncate">
                    <Mail className="w-3.5 h-3.5" />
                    {user.email}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="p-4 border-b border-[#E5E5E5]">
            <h3 className="font-semibold text-[#1A1A1A]">Account Settings</h3>
          </div>
          <div className="divide-y divide-[#E5E5E5]">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={item.onClick}
                className="w-full flex items-center gap-4 p-4 hover:bg-[#F5F5F5] active:bg-[#E8F5F1] transition-colors text-left group"
              >
                <div className="w-10 h-10 bg-[#E8F5F1] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <item.icon className="w-5 h-5 text-[#006A52]" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-[#1A1A1A]">{item.label}</p>
                  <p className="text-xs md:text-sm text-[#666666] line-clamp-1">{item.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-[#999999] group-hover:text-[#006A52] group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>
        </div>

        {/* Login/Logout Button */}
        {isGuest ? (
          <button
            onClick={() => navigate('/login')}
            className="w-full mt-6 flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm hover:bg-[#E8F5F1] active:scale-[0.99] transition-all animate-fade-in-up"
            style={{ animationDelay: '0.2s' }}
          >
            <div className="w-10 h-10 bg-[#E8F5F1] rounded-xl flex items-center justify-center">
              <LogIn className="w-5 h-5 text-[#006A52]" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-[#006A52]">Login / Sign Up</p>
              <p className="text-xs md:text-sm text-[#666666]">Access all features and track orders</p>
            </div>
            <ChevronRight className="w-5 h-5 text-[#999999]" />
          </button>
        ) : (
          <button
            onClick={handleLogout}
            className="w-full mt-6 flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm hover:bg-[#FFF3ED] active:scale-[0.99] transition-all animate-fade-in-up"
            style={{ animationDelay: '0.2s' }}
          >
            <div className="w-10 h-10 bg-[#FFF3ED] rounded-xl flex items-center justify-center">
              <LogOut className="w-5 h-5 text-[#E85A24]" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-[#E85A24]">Logout</p>
              <p className="text-xs md:text-sm text-[#666666]">Sign out of your account</p>
            </div>
            <ChevronRight className="w-5 h-5 text-[#999999]" />
          </button>
        )}

      </div>
    </div>
  );
}
