import { ChevronLeft, Gift, Plus, Minus, ShoppingBag, Users, Cake, ChevronRight } from 'lucide-react';
import { mockRewards, redeemOptions, waysToEarn } from '../data/mockData.js';
import { toast } from '../components/ui/sonner';

const iconMap = {
  'ShoppingBag': ShoppingBag,
  'Users': Users,
  'Gift': Gift,
  'Cake': Cake,
};

export default function RewardsPage({ onNavigate }) {
  const handleRedeem = (points, discount) => {
    if (mockRewards.availablePoints < points) {
      toast.error(`You need ${points - mockRewards.availablePoints} more points`);
      return;
    }
    toast.success(`₹${discount} off coupon redeemed!`);
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
        <div className="bg-[#006A52] rounded-2xl p-6 text-white mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm mb-1">Available Points</p>
              <h2 className="text-4xl font-bold">
                {mockRewards.availablePoints.toLocaleString()}
              </h2>
              <p className="text-white/80 text-sm mt-2">
                ≈ ₹{mockRewards.value.toFixed(2)} value
              </p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <Gift className="w-8 h-8" />
            </div>
          </div>
          <p className="text-white/60 text-xs mt-4">100 points = ₹1</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-[#1A1A1A] mb-4">Recent Transactions</h3>
              <div className="space-y-4">
                {mockRewards.transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between py-3 border-b border-[#E5E5E5] last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${transaction.type === 'earned'
                            ? 'bg-[#E8F5F1]'
                            : 'bg-[#FFF3ED]'
                          }`}
                      >
                        {transaction.type === 'earned' ? (
                          <Plus className="w-5 h-5 text-[#006A52]" />
                        ) : (
                          <Minus className="w-5 h-5 text-[#E85A24]" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-[#1A1A1A]">{transaction.description}</p>
                        <p className="text-sm text-[#666666]">
                          {transaction.date} • {transaction.orderId}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`font-semibold ${transaction.type === 'earned'
                          ? 'text-[#006A52]'
                          : 'text-[#E85A24]'
                        }`}
                    >
                      {transaction.type === 'earned' ? '+' : '-'}
                      {transaction.points}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-[#1A1A1A] mb-4">Ways to Earn Points</h3>
              <div className="space-y-4">
                {waysToEarn.map((way, index) => {
                  const Icon = iconMap[way.icon] || Gift;
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 bg-[#F5F5F5] rounded-xl"
                    >
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                        <Icon className="w-6 h-6 text-[#006A52]" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-[#1A1A1A]">{way.title}</p>
                        <p className="text-sm text-[#666666]">{way.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-[#1A1A1A] mb-4">Redeem Points</h3>
              <div className="space-y-3">
                {redeemOptions.map((option) => (
                  <button
                    key={option.points}
                    onClick={() => handleRedeem(option.points, option.discount)}
                    disabled={mockRewards.availablePoints < option.points}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${mockRewards.availablePoints >= option.points
                        ? 'border-[#E5E5E5] hover:border-[#006A52] hover:bg-[#E8F5F1]'
                        : 'border-[#E5E5E5] opacity-50 cursor-not-allowed'
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-1 bg-[#E85A24]/10 text-[#E85A24] text-xs font-medium rounded-lg">
                            {option.points}
                          </span>
                          <span className="font-semibold text-[#1A1A1A]">
                            ₹{option.discount} OFF
                          </span>
                        </div>
                        <p className="text-xs text-[#666666]">
                          Min order ₹{option.minOrder}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-[#999999]" />
                    </div>
                  </button>
                ))}
              </div>

              <p className="text-xs text-[#999999] text-center mt-4">
                Points expire after 12 months of inactivity
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
