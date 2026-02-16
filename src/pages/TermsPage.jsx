import { ScrollText, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TermsPage() {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-[#FAFAFA] pt-24 pb-12">
            <div className="section-container">

                {/* Header */}
                <div className="max-w-4xl mx-auto mb-8">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-[#666666] hover:text-[#006A52] transition-colors mb-6"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Home
                    </button>

                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#E5E5E5] flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-[#E8F5F1] rounded-xl flex items-center justify-center">
                            <ScrollText className="w-6 h-6 text-[#006A52]" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-[#1A1A1A]">Terms & Conditions</h1>
                            <p className="text-[#666666]">Last updated: {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-[#E5E5E5] overflow-hidden">
                    <div className="p-8 md:p-12 space-y-8">

                        <section>
                            <p className="text-[#666666] leading-relaxed">
                                Welcome to Thakkalies. By accessing and using our website, you agree to comply with and be bound by the following Terms and Conditions. Please read them carefully before making any purchase. If you do not agree with any part of these terms, you should not use our website or services.
                            </p>
                        </section>

                        <div className="w-full h-px bg-[#E5E5E5]" />

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-[#1A1A1A]">1. General Information</h2>
                            <p className="text-[#666666] leading-relaxed">
                                This website is owned and operated by Thakkalies, located in Kerala, India. We reserve the right to update, modify, or replace these Terms and Conditions at any time without prior notice. Continued use of our website after changes are posted constitutes acceptance of those changes.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-[#1A1A1A]">2. Eligibility</h2>
                            <p className="text-[#666666] leading-relaxed">
                                By using this website, you confirm that you are at least 18 years of age, or accessing the website under the supervision of a parent or legal guardian.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-[#1A1A1A]">3. Products and Services</h2>
                            <ul className="list-disc pl-5 text-[#666666] space-y-2">
                                <li>Thakkalies provides fresh vegetables, groceries, and related food products through its online platform.</li>
                                <li>All product descriptions, images, availability, and prices are subject to change at any time without prior notice.</li>
                                <li>While we strive for accuracy, we do not guarantee that all product details or content on the website are completely error-free.</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-[#1A1A1A]">4. Orders and Payments</h2>
                            <p className="text-[#666666] mb-2">By placing an order, you agree to provide accurate, complete, and current information.</p>
                            <ul className="list-disc pl-5 text-[#666666] space-y-2">
                                <li>All prices are listed in Indian Rupees (INR).</li>
                                <li>Applicable taxes and delivery charges will be shown during checkout.</li>
                                <li>Payments are processed through secure third-party payment gateways integrated into our platform.</li>
                            </ul>
                            <p className="text-[#666666] mt-2">Thakkalies reserves the right to cancel or refuse any order due to pricing errors, stock unavailability, or suspicious activity.</p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-[#1A1A1A]">5. Shipping and Delivery</h2>
                            <p className="text-[#666666] mb-2">Orders are delivered according to our Shipping & Delivery Policy.</p>
                            <ul className="list-disc pl-5 text-[#666666] space-y-2">
                                <li>Delivery timelines may vary depending on location, availability, and logistics partners.</li>
                                <li>Thakkalies is not responsible for delays caused by courier services, weather conditions, traffic, or other unforeseen circumstances beyond our control.</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-[#1A1A1A]">6. Returns and Refunds</h2>
                            <p className="text-[#666666] mb-2">Returns, replacements, and refunds are handled according to our Return & Refund Policy.</p>
                            <ul className="list-disc pl-5 text-[#666666] space-y-2">
                                <li>Only damaged, defective, or incorrect items may be eligible for return or replacement.</li>
                                <li>Requests must be raised within the specified return window mentioned in the policy.</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-[#1A1A1A]">7. User Responsibilities</h2>
                            <p className="text-[#666666] mb-2">When using our website, you agree:</p>
                            <ul className="list-disc pl-5 text-[#666666] space-y-2">
                                <li>Not to use the platform for illegal or unauthorized purposes.</li>
                                <li>Not to attempt unauthorized access to systems, servers, or data.</li>
                                <li>Not to copy, reproduce, distribute, or exploit any website content without written permission from Thakkalies.</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-[#1A1A1A]">8. Intellectual Property</h2>
                            <p className="text-[#666666] leading-relaxed">
                                All content on this website—including text, images, logos, graphics, and product information—is the property of Thakkalies and is protected by applicable intellectual property laws. Unauthorized use is strictly prohibited.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-[#1A1A1A]">9. Limitation of Liability</h2>
                            <p className="text-[#666666] mb-2">Thakkalies shall not be liable for any indirect, incidental, special, or consequential damages arising from:</p>
                            <ul className="list-disc pl-5 text-[#666666] space-y-2">
                                <li>Use or inability to use the website</li>
                                <li>Product availability issues</li>
                                <li>Delivery delays beyond our control</li>
                            </ul>
                            <p className="text-[#666666] mt-2">Customers must raise transit damage claims directly with the delivery partner where applicable.</p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-[#1A1A1A]">10. Privacy</h2>
                            <p className="text-[#666666] leading-relaxed">
                                Your use of this website is also governed by our Privacy Policy, which explains how we collect, use, and protect your personal information.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-[#1A1A1A]">11. Governing Law</h2>
                            <p className="text-[#666666] leading-relaxed">
                                These Terms and Conditions are governed by the laws of India. Any disputes shall fall under the exclusive jurisdiction of the courts in Kerala.
                            </p>
                        </section>

                        <div className="w-full h-px bg-[#E5E5E5]" />

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-[#1A1A1A]">12. Contact Us</h2>
                            <div className="bg-[#FAFAFA] rounded-xl p-6 border border-[#E5E5E5]">
                                <p className="text-[#666666] mb-4">For any questions regarding these Terms and Conditions, please contact:</p>
                                <div className="space-y-2 text-sm font-medium text-[#1A1A1A]">
                                    <p>Thakkalies Customer Support</p>
                                    <p className="flex items-center gap-2"><span className="text-[#666666]">📍</span> Kerala, India</p>
                                    <p className="flex items-center gap-2"><span className="text-[#666666]">📧</span> support@thakkalies.com</p>
                                    <p className="flex items-center gap-2"><span className="text-[#666666]">📞</span> +91-XXXXXXXXXX</p>
                                </div>
                            </div>
                        </section>

                    </div>
                </div>
            </div>
        </div>
    );
}
