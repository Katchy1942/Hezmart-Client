import { FiTrash2 } from "react-icons/fi";
import Pagination from "../common/Pagination";

const SubscribersTable = ({
  subscribers,
  loading,
  pagination,
  onPageChange,
//   onDelete,
//   deletingSubscriberId,
}) => {
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
        });
    };
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {loading ? (
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-dark mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading subscribers...</p>
        </div>
      ) : subscribers.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-gray-600">No subscribers found</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Subscribed
                  </th>
                  {/* <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th> */}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {subscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {subscriber.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {subscriber.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(subscriber.createdAt)}
                      </div>
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end">
                        <button
                          onClick={() => onDelete(subscriber.id)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Delete"
                          disabled={deletingSubscriberId === subscriber.id}
                        >
                          {deletingSubscriberId === subscriber.id ? (
                            <div className="h-4 w-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <FiTrash2 />
                          )}
                        </button>
                      </div>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {subscribers.length > 0 && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalItems}
              perPage={pagination.perPage}
              onPageChange={onPageChange}
              loading={loading}
            />
          )}
        </>
      )}
    </div>
  );
};

export default SubscribersTable;