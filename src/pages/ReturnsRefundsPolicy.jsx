import { FiInfo, FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";

const ReturnsRefundsPolicy = () => {
    return (
        <div className="pt-8 pb-12 max-w-4xl mx-auto px-4 sm:px-6 bg-white rounded-xl shadow">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-primary-light mb-2">RETURNS AND REFUNDS POLICY</h1>
                {/* <p className="text-gray-600">Last updated: July 10, 2025</p> */}
            </div>

            {/* Introduction */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
                <p className="text-gray-700 mb-4">
                    At Hemart, we want you to have a positive experience every time you shop with us. 
                    Occasionally though, we know you may want to return items you have purchased. 
                    This Returns & Refunds Policy sets out our conditions for accepting returns and issuing refunds
                    for items purchased on Hezmart on behalf of our sellers. It also sets out when we will
                    not accept returns or issue refunds.
                </p>
            </section>

            {/* Return Period */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Return period and conditions for acceptance of returns</h2>
                <p className="text-gray-700 mb-4">
                  Subject to the rules set out in this Returns and Refunds Policy,
                  sellers on Hezmart offer returns for most items within 7 days post delivery.
                  We do not accept returns, for any reason whatsoever, after the returns period has lapsed.
                  This does not affect your legal rights against the seller.
                  You may return items purchased on Hezmart within the returns period, for the reasons
                  listed below:
                </p>
                
                
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead className="bg-primary-light">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider border-b border-r border-gray-300">Reason for Return</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider border-b">Applicable Product Category</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            <tr>
                                <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200">I changed my mind</td>
                                <td className="px-4 py-3 text-sm text-gray-700">
                                    All categories except: Health/hygiene products, events, tickets, software, products with broken seals
                                </td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200">Size is correct but doesn't fit as expected</td>
                                <td className="px-4 py-3 text-sm text-gray-700">Clothing and shoes only</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200">Item stopped working well after usage</td>
                                <td className="px-4 py-3 text-sm text-gray-700">All categories except clothing, sport & fitness, consumables</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200">Item received broken or defective</td>
                                <td className="px-4 py-3 text-sm text-gray-700">All product categories</td>
                            </tr>
                           <tr>
                                <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200">Packaging was damaged</td>
                                <td className="px-4 py-3 text-sm text-gray-700">All product categories</td>
                            </tr>

                            <tr>
                                <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200">Item received with missing parts or accessories</td>
                                <td className="px-4 py-3 text-sm text-gray-700">All product categories</td>
                            </tr>

                             <tr>
                                <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200">Item received used or expired</td>
                                <td className="px-4 py-3 text-sm text-gray-700">All product categories except software</td>
                            </tr>

                            <tr>
                                <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200">Item seems to be fake/unauthentic</td>
                                <td className="px-4 py-3 text-sm text-gray-700">All product categories</td>
                            </tr>

                            <tr>
                                <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200">Wrong item/colour/size/model</td>
                                <td className="px-4 py-3 text-sm text-gray-700">All product categories</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Non-Returnable Items */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Items that cannot be returned</h2>
                <p className="text-gray-700 mb-4">
                    We do not accept returns of certain product categories for health and hygiene reasons. 
                    Customer safety is important to us, so certain product categories cannot be returned due to 
                    health and hygiene reasons, or if they may deteriorate or expire rapidly.
                    You shall only be entitled to return and refund in respect of these items if you
                     received the wrong item, a damaged or defective item, or a fake or inauthentic item.
                </p>
                <p className="text-gray-700 mb-4">
                    We do not accept returns of customized items, items you have damaged after delivery, 
                    or used/worn items unless they became damaged or defective after reasonable use.
                </p>
            </section>

            {/* Packaging Returns */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Packaging returns</h2>
                <p className="text-gray-700">
                    When returning an item, you must do so in the exact condition you received it, with its original 
                    packaging and all tags and labels attached. Returned items are your responsibility until they reach us,
                    so ensure they are packaged properly and can't get damaged on the way.
                </p>
            </section>

            {/* Refunds */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Refunds</h2>
                <p className="text-gray-700 mb-4">
                   If we accept your return, we aim to refund you the purchase price of the item within
                   the period stated on the return timelines page. For incorrect, defective, or damaged items,
                   you will also be refunded for the delivery costs.
                </p>
            </section>

            {/* Rejected Returns */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Rejected return and refund requests</h2>
                <p className="text-gray-700 mb-4">
                    All items are inspected on return. If your return request is not approved, we will make two 
                    re-delivery attempts. If unsuccessful, you must collect the item within 60 days,
                    failing which the item will be forfeited.
                </p>
            </section>

            {/* No Exchange */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">7. No exchange</h2>
                <p className="text-gray-700">
                    We do not offer exchanges. If you would like a different size or color, please return your 
                    unwanted item and place a new order.
                </p>
            </section>

            {/* Further Information */}
            <section className="mb-8 hidden">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Further information</h2>
                <div className="space-y-2">
                    <Link to="/how-to-return" className="flex items-center text-blue-600 hover:underline">
                        <span>How to create a return?</span>
                        <FiArrowRight className="ml-1" />
                    </Link>
                    <Link to="/return-timelines" className="flex items-center text-blue-600 hover:underline">
                        <span>Timelines</span>
                        <FiArrowRight className="ml-1" />
                    </Link>
                    <Link to="/faqs" className="flex items-center text-blue-600 hover:underline">
                        <span>FAQs</span>
                        <FiArrowRight className="ml-1" />
                    </Link>
                    <Link to="/warranty-policy" className="flex items-center text-blue-600 hover:underline">
                        <span>Warranty Policy</span>
                        <FiArrowRight className="ml-1" />
                    </Link>
                    <Link to="/contact-us" className="flex items-center text-blue-600 hover:underline">
                        <span>Contact Us</span>
                        <FiArrowRight className="ml-1" />
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default ReturnsRefundsPolicy;