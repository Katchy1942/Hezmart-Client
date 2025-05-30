import { FiShoppingBag } from 'react-icons/fi';
const TopProducts = ({ products }) => {
    console.log(products);
    
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Top Products by Units Sold</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units Sold</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            {product.coverImage ? (
                                <img 
                                src={product.coverImage} 
                                alt={product.name} 
                                className="h-full w-full rounded-full object-cover" 
                                />
                            ) : (
                                <FiShoppingBag className="text-blue-600" />
                            )}
                        </div>
                        <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        </div>
                    </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{product.price}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{product.unitsSold}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopProducts;