import { Facebook, Instagram, Twitter, Youtube, CreditCard, Truck, Shield, Headphones } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const features = [
    { icon: Truck, title: 'Free Delivery', description: 'On orders above ₹299' },
    { icon: Shield, title: 'Fresh Guaranteed', description: '100% quality assurance' },
    { icon: Headphones, title: '24/7 Support', description: 'Always here to help' },
    { icon: CreditCard, title: 'Secure Payment', description: 'Multiple payment options' },
  ];

  const footerLinks = {
    support: [
      { label: 'Terms & Conditions', path: '/terms' },
      { label: 'Privacy Policy', path: '/privacy-policy' },
    ],
    quickLinks: [
      { label: 'My Account', path: '/profile' },
      { label: 'My Orders', path: '/orders' },
      { label: 'Wishlist', path: '/wishlist' },
      { label: 'Rewards', path: '/rewards' },
    ],
  };

  return (
    <footer className="bg-[#1A1A1A] text-white">
      <div className="border-b border-white/10">
        <div className="section-container py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-start gap-4 group"
              >
                <div className="w-12 h-12 bg-[#006A52]/20 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:bg-[#006A52] group-hover:scale-110">
                  <feature.icon className="w-6 h-6 text-[#006A52] group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">{feature.title}</h4>
                  <p className="text-sm text-white/60">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <div className="flex items-center mb-6 h-10">
                <img
                  src="/thakkalies_horizontal_logo.svg"
                  alt="Thakkalies"
                  className="h-full w-auto object-contain brightness-0 invert"
                />
              </div>
              <p className="text-white/60 max-w-sm leading-relaxed">
                Fresh groceries, delivered with care. Connecting local farmers to your doorstep with transparency and trust. Experience the true taste of quality.
              </p>
            </div>

            <div className="flex gap-4">
              {[
                { icon: Facebook, label: 'Facebook' },
                { icon: Instagram, label: 'Instagram' },
                { icon: Twitter, label: 'Twitter' },
                { icon: Youtube, label: 'YouTube' },
              ].map((social) => (
                <button
                  key={social.label}
                  className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center hover:bg-[#006A52] hover:border-[#006A52] hover:scale-105 transition-all duration-300 group"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 text-white/80 group-hover:text-white" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-4">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-white/60 hover:text-[#006A52] hover:translate-x-1 transition-all duration-300 flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white/20"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-6">Support</h4>
            <ul className="space-y-4">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-white/60 hover:text-[#006A52] hover:translate-x-1 transition-all duration-300 flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white/20"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="section-container py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/40 text-sm">
              © 2024 Thakkalies. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-white/40 text-sm">Payment Methods:</span>
              <div className="flex gap-2">
                {['Visa', 'Mastercard', 'UPI', 'COD'].map((method) => (
                  <div
                    key={method}
                    className="px-3 py-1.5 bg-white/10 rounded-lg text-xs text-white/60"
                  >
                    {method}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
