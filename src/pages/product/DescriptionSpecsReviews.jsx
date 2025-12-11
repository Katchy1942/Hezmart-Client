import { useState } from "react";

export const DescriptionSpecsReviews = ({ product, reviewsSection }) => {
    const [showFullDescription, setShowFullDescription] = useState(false);

    const toggleDescription = () => setShowFullDescription(!showFullDescription);

    return (
        <div className="space-y-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="sm:p-6 h-fit">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Product Description</h3>
                    <p
                        className={`text-gray-700 whitespace-pre-line transition-max-height text-sm duration-300 overflow-hidden ${
                            showFullDescription ? 'max-h-full' : 'max-h-40'
                        }`}
                    >
                        {product.description}
                    </p>
                    {product.description.length > 300 && (
                        <button
                            onClick={toggleDescription}
                            className="mt-2 text-blue-600 border p-1 rounded-full text-xs"
                        >
                            {showFullDescription ? 'Show Less' : 'Show More'}
                        </button>
                    )}
                </div>

                <div className="sm:p-6 overflow-x-auto h-fit">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Specifications</h3>
                    <div className="border border-gray-300 rounded-2xl overflow-hidden">
                        <table className="w-full text-sm border-collapse">
                            <tbody>
                                {[
                                    { label: "Category", value: product.category?.name },
                                    { label: "Subcategory", value: product.subCategory?.name },
                                    { label: "Weight", value: `${product.weight} kg` },
                                    { label: "Taxable", value: product.taxable ? "Yes" : "No" },
                                    { label: "Digital Product", value: product.isDigital ? "Yes" : "No" },
                                ].map((item, idx) => (
                                    <tr key={idx} className="border-b border-gray-300 last:border-b-0">
                                        <td className="py-4 px-6 text-gray-500 font-medium border-r border-gray-300 w-1/3">
                                            {item.label}
                                        </td>
                                        <td className="py-4 px-6 text-gray-900">{item.value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="sm:p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Reviews ({product.ratingsQuantity})
                </h3>
                {reviewsSection}
            </div>
        </div>
    );
};