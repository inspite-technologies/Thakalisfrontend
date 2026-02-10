import { useState } from 'react';
import { ChevronLeft, Users, Share2, Copy, Gift, Check, ArrowRight, UserPlus } from 'lucide-react';
import { Button } from '../components/ui/button.jsx';
import { toast } from '../components/ui/sonner';

const howItWorks = [
  {
    icon: Share2,
    title: 'Share Your Code',
    description: 'Share code with friends and family',
  },
  {
    icon: UserPlus,
    title: 'They Sign Up',
    description: 'Friend signs up using your code',
  },
  {
    icon: Gift,
    title: 'You Both Earn',
    description: 'Get rewards on their first order',
  },
];

export default function ReferEarnPage({ onNavigate }) {
  const [referralCode] = useState('THAKKAL123');
  const [copied, setCopied] = useState(false);
  const totalRewards = 250;
  const successfulReferrals = 5;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    toast.success('Referral code copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join Thakkalies',
          text: `Use my referral code ${referralCode} to get ₹50 off on your first order!`,
          url: window.location.origin,
        });
      } catch (error) {
        // User cancelled share
      }
    } else {
      handleCopy();
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
        <div className="bg-[#006A52] rounded-2xl p-6 text-white mb-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Refer & Earn</h2>
            <p className="text-white/80">Invite friends and earn rewards together!</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4">
            <p className="text-white/60 text-sm text-center mb-2">Your Referral Code</p>
            <div className="text-3xl font-bold text-center tracking-wider mb-4">
              {referralCode}
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleCopy}
                variant="outline"
                className="flex-1 bg-white/10 border-white/30 text-white hover:bg-white/20"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
              <Button
                onClick={handleShare}
                className="flex-1 bg-white text-[#006A52] hover:bg-white/90"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          <p className="text-center text-white/60 text-sm">
            You get ₹50 • They get ₹50 off first order
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-semibold text-[#1A1A1A] mb-6">How it Works</h3>
            <div className="space-y-6">
              {howItWorks.map((step, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#E8F5F1] rounded-xl flex items-center justify-center flex-shrink-0">
                    <step.icon className="w-6 h-6 text-[#006A52]" />
                  </div>
                  <div>
                    <p className="font-medium text-[#1A1A1A]">{step.title}</p>
                    <p className="text-sm text-[#666666]">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-semibold text-[#1A1A1A] mb-6">Your Rewards</h3>
            <div className="bg-gradient-to-br from-[#E8F5F1] to-[#D4EDE6] rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-[#666666] text-sm">Total Rewards Earned</p>
                  <p className="text-3xl font-bold text-[#006A52]">₹{totalRewards}</p>
                </div>
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center">
                  <Gift className="w-7 h-7 text-[#006A52]" />
                </div>
              </div>
              <p className="text-sm text-[#666666]">
                From {successfulReferrals} successful referrals
              </p>
            </div>

            <Button
              onClick={() => onNavigate('rewards')}
              className="w-full mt-6 btn-secondary"
            >
              View All Rewards
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
