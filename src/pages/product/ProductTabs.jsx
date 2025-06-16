export const ProductTabs = ({ 
    activeTab, 
    setActiveTab, 
    product, 
    reviewsSection 
}) => {
    return (
        <div className="mb-8">
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('description')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'description' 
                            ? 'border-blue-500 text-blue-600' 
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                    >
                        Description
                    </button>
                    <button
                        onClick={() => setActiveTab('specifications')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'specifications' 
                            ? 'border-blue-500 text-blue-600' 
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                    >
                        Specifications
                    </button>
                    <button
                        onClick={() => setActiveTab('reviews')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'reviews' 
                            ? 'border-blue-500 text-blue-600' 
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                    >
                        Reviews ({product.ratingsQuantity})
                    </button>
                </nav>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-md">
                {activeTab === 'description' && (
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Product Description</h3>
                        <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
                    </div>
                )}

                {activeTab === 'specifications' && (
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Specifications</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h4 className="font-medium text-gray-900 mb-2">General</h4>
                                <ul className="space-y-2">
                                    <li className="flex justify-between">
                                        <span className="text-gray-500">Category</span>
                                        <span className="text-gray-900">{product.category?.name}</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span className="text-gray-500">Subcategory</span>
                                        <span className="text-gray-900">{product.subCategory?.name}</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span className="text-gray-500">Weight</span>
                                        <span className="text-gray-900">{product.weight} kg</span>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900 mb-2">Other</h4>
                                <ul className="space-y-2">
                                    <li className="flex justify-between">
                                        <span className="text-gray-500">Taxable</span>
                                        <span className="text-gray-900">{product.taxable ? 'Yes' : 'No'}</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span className="text-gray-500">Digital Product</span>
                                        <span className="text-gray-900">{product.isDigital ? 'Yes' : 'No'}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'reviews' && reviewsSection}
            </div>
        </div>
    );
};