import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Pagination = ({ 
    currentPage, 
    totalPages, 
    totalItems, 
    perPage,
    onPageChange,
    loading = false
}) => {
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else if (currentPage <= 3) {
            for (let i = 1; i <= maxVisiblePages; i++) {
                pages.push(i);
            }
        } else if (currentPage >= totalPages - 2) {
            for (let i = totalPages - maxVisiblePages + 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            for (let i = currentPage - 2; i <= currentPage + 2; i++) {
                pages.push(i);
            }
        }
        return pages;
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages && page !== currentPage && !loading) {
            onPageChange(page);

            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    };


    const startItem = (currentPage - 1) * perPage + 1;
    const endItem = Math.min(currentPage * perPage, totalItems);

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            {/* Desktop info */}
            <div className="">
                <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{startItem}</span> to{' '}
                    <span className="font-medium">{endItem}</span> of{' '}
                    <span className="font-medium">{totalItems}</span> results
                </p>
            </div>
            
            <nav className="flex items-center gap-2" aria-label="Pagination">
                <button 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1 || loading}
                    className="p-2 rounded-full border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                    <span className="sr-only">Previous</span>
                    <FaChevronLeft className="h-4 w-4" />
                </button>
                
                <div className="hidden sm:flex gap-3 border border-gray-300 rounded-full px-3 py-1 bg-white">
                {getPageNumbers().map((pageNum) => (
                    <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    disabled={loading}
                    className={`text-sm font-medium ${
                        pageNum === currentPage
                        ? 'text-primary-light'
                        : 'text-gray-700'
                    } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                    {pageNum}
                    </button>
                ))}
                </div>
                
                {/* Mobile page indicator */}
                <button
                    disabled
                    className="sm:hidden px-4 py-2 rounded-full border border-gray-300 bg-white text-sm font-medium text-primary-light cursor-default"
                >
                    {currentPage}
                </button>

                <button 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || loading}
                    className="p-2 rounded-full border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                <span className="sr-only">Next</span>
                <FaChevronRight className="h-4 w-4" />
                </button>
            </nav>
        </div>  
    );
};

export default Pagination;