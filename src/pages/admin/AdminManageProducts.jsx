import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import axios from "../../lib/axios";
import usePagination from "../../hooks/usePagination";
import ProductsTable from "../../components/products/ProductsTable";
import DataTableFilters from "../../components/common/DataTableFilters";

const AdminManageProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const { pagination, updatePagination } = usePagination();

    const statusFilterOptions = [
        { value: "all", label: "All Statuses" },
        { value: "pending", label: "Pending" },
        { value: "active", label: "Active" },
        { value: "denied", label: "Denied" },
        { value: "suspended", label: "Suspended" }
    ];
    

    const fetchProducts = async (page = 1, search = '', status = '') => {
        try {
            setLoading(true);
            let url = `api/v1/products?page=${page}&limit=${pagination.perPage}&search=${search}`;
            if (status && status !== 'all') {
                url += `&status=${status}`;
            }

            const res = await axios.get(url);
            if (res.data.status === 'success') {
                setProducts(res.data.data.products.map(product => ({
                    ...product,
                    owner: {
                        name: product.vendor?.businessName || 'N/A'
                    }
                })));
                updatePagination({
                    currentPage: res.data.pagination.currentPage,
                    totalPages: res.data.pagination.totalPages,
                    totalItems: res.data.pagination.totalItems
                });
            }
        } catch (error) {
            toast.error("Failed to load products");
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    const deleteProduct = async (productId) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                const res = await axios.delete(`api/v1/admin/products/${productId}`);
                if (res.data.status === 'success') {
                    toast.success("Product deleted successfully");
                    fetchProducts(pagination.currentPage, searchTerm, statusFilter === 'all' ? '' : statusFilter);
                }
            } catch (error) {
                toast.error("Failed to delete product");
                console.error("Error deleting product:", error);
            }
        }
    };

    const toggleStatus = async (productId, newStatus) => {
        try {
           
            const res = await axios.patch(`api/v1/products/${productId}/status`, { status: newStatus });
            if (res.data.status === 'success') {
                toast.success(`Product marked as ${newStatus}`);
                fetchProducts(pagination.currentPage, searchTerm, statusFilter === 'all' ? '' : statusFilter);
            }
        } catch (error) {
            toast.error("Failed to update product status");
            console.error("Error updating product status:", error);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchProducts(1, searchTerm, statusFilter === 'all' ? '' : statusFilter);
    };

    const handlePageChange = (page) => {
        fetchProducts(page, searchTerm, statusFilter === 'all' ? '' : statusFilter);
    };

    const handleStatusChange = (status) => {
        setStatusFilter(status);
        fetchProducts(1, searchTerm, status === 'all' ? '' : status);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <div className="">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Products Management</h1>
            <DataTableFilters
                searchTerm={searchTerm}
                onSearchChange={(e) => setSearchTerm(e.target.value)}
                onSearchSubmit={handleSearchSubmit}
                filters={[
                {
                    type: 'select',
                    value: statusFilter,
                    onChange: (e) => handleStatusChange(e.target.value),
                    options: statusFilterOptions
                }
                ]}
                totalItems={pagination.totalItems}
                searchPlaceholder="Search products..."
            />

            <ProductsTable
                products={products}
                loading={loading}
                pagination={pagination}
                onPageChange={handlePageChange}
                onDelete={deleteProduct}
                onStatusChange={toggleStatus}
                showOwner={true}
                showEditUrl={false}
                allowStatusUpdate={true}
            />
        </div>
    );
};

export default AdminManageProducts;