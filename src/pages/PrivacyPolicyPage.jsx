import { ScrollText, ArrowLeft, Shield } from 'lucide-react';

export default function PrivacyPolicyPage({ onNavigate }) {
    return (
        <div className="min-h-screen bg-[#FAFAFA] pt-24 pb-12">
            <div className="section-container">

                {/* Header */}
                <div className="max-w-4xl mx-auto mb-8">
                    <button
                        onClick={() => onNavigate('home')}
                        className="flex items-center gap-2 text-[#666666] hover:text-[#006A52] transition-colors mb-6"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Home
                    </button>

                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#E5E5E5] flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-[#E8F5F1] rounded-xl flex items-center justify-center">
                            <Shield className="w-6 h-6 text-[#006A52]" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-[#1A1A1A]">Privacy Policy</h1>
                            <p className="text-[#666666]">Last updated: {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-[#E5E5E5] overflow-hidden">
                    <div className="p-8 md:p-12 space-y-8">

                        <section>
                            <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">Who We Are</h2>
                            <p className="text-[#666666] leading-relaxed mb-2">
                                Our website address is: <span className="font-medium text-[#006A52]">https://thakkalies.com</span>.
                            </p>
                            <p className="text-[#666666] leading-relaxed">
                                This website is owned and operated by Thakkalies, Kerala, India.
                            </p>
                        </section>

                        <div className="w-full h-px bg-[#E5E5E5]" />

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-[#1A1A1A]">Comments</h2>
                            <p className="text-[#666666] leading-relaxed">
                                When visitors leave comments on the site, we collect the data shown in the comments form, along with the visitor’s IP address and browser user agent string to help detect spam.
                            </p>
                            <p className="text-[#666666] leading-relaxed">
                                An anonymized string created from your email address (called a hash) may be shared with the Gravatar service to check whether you are using it. Gravatar’s privacy policy is available at: https://automattic.com/privacy/. After approval of your comment, your profile picture may be visible publicly alongside your comment.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-[#1A1A1A]">Media</h2>
                            <p className="text-[#666666] leading-relaxed">
                                If you upload images to the website, you should avoid uploading images that contain embedded location data (EXIF GPS). Visitors to the website may be able to download and extract location data from images available on the site.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-[#1A1A1A]">Cookies</h2>

                            <h3 className="font-semibold text-[#1A1A1A] mt-4">Comment Cookies</h3>
                            <p className="text-[#666666] leading-relaxed">
                                If you leave a comment, you may choose to save your name, email address, and website in cookies for convenience. These cookies will remain for one year.
                            </p>

                            <h3 className="font-semibold text-[#1A1A1A] mt-4">Login Cookies</h3>
                            <ul className="list-disc pl-5 text-[#666666] space-y-2">
                                <li>A temporary cookie is set when visiting the login page to check if your browser accepts cookies. Contains no personal data and is removed when the browser is closed.</li>
                                <li>When you log in: Login cookies last for 2 days, and screen preference cookies last for 1 year.</li>
                                <li>Selecting "Remember Me" keeps you logged in for 2 weeks.</li>
                                <li>Logging out removes login cookies.</li>
                            </ul>

                            <h3 className="font-semibold text-[#1A1A1A] mt-4">Editor Cookies</h3>
                            <p className="text-[#666666] leading-relaxed">
                                If you edit or publish content, an additional cookie is stored containing the post ID only. No personal data included. Expires after 1 day.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-[#1A1A1A]">Embedded Content from Other Websites</h2>
                            <p className="text-[#666666] leading-relaxed">
                                Articles on this site may include embedded content (videos, images, articles, etc.). Embedded content behaves the same as if you visited the original website directly.
                            </p>
                            <p className="text-[#666666] mb-2">These third-party websites may:</p>
                            <ul className="list-disc pl-5 text-[#666666] space-y-2">
                                <li>Collect data about you</li>
                                <li>Use cookies</li>
                                <li>Track interactions</li>
                                <li>Monitor activity if you are logged into their platform</li>
                            </ul>
                            <p className="text-[#666666] mt-2">Thakkalies is not responsible for the privacy practices of such external websites.</p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-[#1A1A1A]">Who We Share Your Data With</h2>
                            <p className="text-[#666666] leading-relaxed">
                                If you request a password reset, your IP address may be included in the reset email for security verification. We do not sell or rent personal data to third parties.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-[#1A1A1A]">How Long We Retain Your Data</h2>
                            <ul className="list-disc pl-5 text-[#666666] space-y-2">
                                <li>Comments and metadata are stored indefinitely to help recognize and approve follow-up comments automatically.</li>
                                <li>For registered users: Personal information is stored in the user profile. Users can view, edit, or delete their personal data anytime (except username changes). Website administrators can also view and edit this information.</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-[#1A1A1A]">Your Data Rights</h2>
                            <p className="text-[#666666] mb-2">If you have an account or have left comments, you may:</p>
                            <ul className="list-disc pl-5 text-[#666666] space-y-2">
                                <li>Request an exported file of the personal data we hold about you</li>
                                <li>Request deletion of your personal data</li>
                            </ul>
                            <p className="text-[#666666] mt-2">This excludes data we must retain for legal, administrative, or security purposes. To make such a request, please contact Thakkalies support.</p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-[#1A1A1A]">Where Your Data Is Sent</h2>
                            <p className="text-[#666666] leading-relaxed">
                                Visitor comments may be checked through an automated spam detection service to maintain website security and quality.
                            </p>
                        </section>

                        <div className="w-full h-px bg-[#E5E5E5]" />

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-[#1A1A1A]">Contact Us</h2>
                            <div className="bg-[#FAFAFA] rounded-xl p-6 border border-[#E5E5E5]">
                                <p className="text-[#666666] mb-4">For any questions regarding this Privacy Policy or your personal data, please contact:</p>
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
