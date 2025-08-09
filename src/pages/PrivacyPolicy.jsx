import { FiInfo, FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
    return (
        <div className="pt-8 pb-12 max-w-4xl mx-auto px-4 sm:px-6 bg-white rounded-xl shadow">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-primary-light mb-2">Hezmart Privacy Notice</h1>
               
            </div>

            {/* Introduction */}
            <section className="mb-8">
                <p className="text-gray-700 mb-4">
                    At Hezmart Nigeria Ltd., your privacy is important to us. This Privacy Notice explains how we collect, use, disclose, and protect your personal data when you visit or make use of our platform (website, mobile app, or services).
                </p>
            </section>

            {/* Information We Collect */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
                <p className="text-gray-700 mb-4">
                    We collect personal and non-personal data when you:
                </p>
                
                <h3 className="text-lg font-medium text-gray-800 mb-2">a. Create an Account</h3>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                    <li>Full name</li>
                    <li>Email address</li>
                    <li>Phone number</li>
                    <li>Password</li>
                    <li>Delivery address</li>
                </ul>

                <h3 className="text-lg font-medium text-gray-800 mb-2">b. Make a Purchase or Request a Service</h3>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                    <li>Payment details (processed securely via third-party gateways)</li>
                    <li>Order history</li>
                    <li>Location data (for delivery purposes)</li>
                </ul>

                <h3 className="text-lg font-medium text-gray-800 mb-2">c. Contact Customer Support</h3>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                    <li>Communication content (emails, chat logs, etc.)</li>
                    <li>Any additional information voluntarily provided</li>
                </ul>

                <h3 className="text-lg font-medium text-gray-800 mb-2">d. Use Our Platform</h3>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                    <li>IP address</li>
                    <li>Device/browser information</li>
                    <li>Cookies and usage data</li>
                </ul>
            </section>

            {/* How We Use Your Information */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
                <p className="text-gray-700 mb-4">
                    We use your information to:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                    <li>Process orders and deliveries</li>
                    <li>Communicate order status and updates</li>
                    <li>Provide customer support</li>
                    <li>Improve user experience and platform functionality</li>
                    <li>Send promotional offers (with your consent)</li>
                    <li>Comply with legal or regulatory requirements</li>
                </ul>
            </section>

            {/* Sharing Your Data */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Sharing Your Data</h2>
                <p className="text-gray-700 mb-4">
                    We may share your information with:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                    <li>Vendors for order fulfillment</li>
                    <li>Logistics partners for delivery coordination</li>
                    <li>Payment processors for secure transactions</li>
                    <li>Regulatory authorities, if legally required</li>
                    <li>Third-party service providers (e.g., analytics, cloud storage) under confidentiality agreements</li>
                </ul>
                <p className="text-gray-700">
                    We do not sell your personal data.
                </p>
            </section>

            {/* Data Security */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Data Security</h2>
                <p className="text-gray-700 mb-4">
                    We implement appropriate technical and organizational measures to protect your data, including:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                    <li>SSL encryption</li>
                    <li>Secure data storage</li>
                    <li>Role-based access control</li>
                </ul>
                <p className="text-gray-700">
                    However, no system is 100% secure. Users are advised to protect their login details and notify us of any suspicious activity.
                </p>
            </section>

            {/* Your Rights */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Your Rights</h2>
                <p className="text-gray-700 mb-4">
                    You have the right to:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                    <li>Access the personal data we hold about you</li>
                    <li>Request correction or deletion of your data</li>
                    <li>Withdraw consent for marketing at any time</li>
                    <li>Object to certain data processing</li>
                    <li>Request data portability (where applicable)</li>
                </ul>
                <p className="text-gray-700">
                    To exercise any of these rights, contact  {' '}
                  
                    <Link to='privacy@hezmart.com' className="text-primary-light">
                       privacy@hezmart.com
                    </Link>
                </p>
               
            </section>

            {/* Data Retention */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Data Retention</h2>
                <p className="text-gray-700 mb-4">
                    We retain your information:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                    <li>For as long as your account is active</li>
                    <li>As needed to comply with legal obligations or resolve disputes</li>
                    <li>For a maximum of 5 years after your last interaction, unless a longer retention period is required by law</li>
                </ul>
            </section>

            {/* Third-Party Links */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Third-Party Links</h2>
                <p className="text-gray-700">
                    Our platform may contain links to third-party websites. Hezmart is not responsible for the privacy practices or content of those sites.
                </p>
            </section>

            {/* Updates to this Policy */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Updates to this Policy</h2>
                <p className="text-gray-700">
                    We may update this Privacy Notice periodically. Users will be notified of significant changes via email or app notification.
                </p>
            </section>

            {/* Contact Information */}
            <section className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-start">
                    <FiInfo className="text-primary-light mt-1 mr-2 flex-shrink-0" />
                    <div>
                        <h3 className="font-medium text-gray-900">Contact Us</h3>
                        <p className="text-gray-700">
                            If you have any questions about this Privacy Notice, please contact us at {' '}   
                            <Link to='privacy@hezmart.com' className="text-primary-light">
                                privacy@hezmart.com
                            </Link>
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PrivacyPolicy;