import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import axios from "../../lib/axios";
import usePagination from "../../hooks/usePagination";
import ProductsTable from "../../components/products/ProductsTable";
import DataTableFilters from "../../components/common/DataTableFilters";

const VendorManageProducts = () => {
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

            const res = await axios.get(url, {
                params: {showAll: false}
            });

            if (res.data.status === 'success') {
                setProducts(res.data.data.products);
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
                const res = await axios.delete(`api/v1/products/${productId}`);
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
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Products Manager</h1>

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
                addButtonLink="/manage/vendor/add-product"
                addButtonText="Add Product"
                searchPlaceholder="Search products..."
            />

            <ProductsTable
                products={products}
                loading={loading}
                pagination={pagination}
                onPageChange={handlePageChange}
                onDelete={deleteProduct}
                onStatusChange={() => {}} // Empty function since vendors can't change status
                showOwner={false}
                allowStatusUpdate={false}
            />
        </div>
    );
};

export default VendorManageProducts;