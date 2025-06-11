import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import axios from "../../lib/axios";
import usePagination from "../../hooks/usePagination";
import CouponsTable from "../../components/coupons/CouponsTable";
import DataTableFilters from "../../components/common/DataTableFilters";

const AdminManageCoupons = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const { pagination, updatePagination } = usePagination();
    const [deletingCouponId, setDeletingCouponId] = useState(null);

    const statusFilterOptions = [
        { value: "all", label: "All Statuses" },
        { value: "active", label: "Active" },
        { value: "expired", label: "Expired" },
    ];

    const fetchCoupons = async (page = 1, search = '', status = '') => {
        try {
            setLoading(true);
            let url = `api/v1/coupons?page=${page}&limit=${pagination.perPage}&search=${search}`;
            if (status && status !== 'all') {
                url += `&status=${status}`;
            }

            const res = await axios.get(url);
            if (res.data.status === 'success') {
                setCoupons(res.data.data.coupons);
                updatePagination({
                    currentPage: res.data.pagination.currentPage,
                    totalPages: res.data.pagination.totalPages,
                    totalItems: res.data.pagination.totalItems
                });
            }
        } catch (error) {
            toast.error("Failed to load coupons");
            console.error("Error fetching coupons:", error);
        } finally {
            setLoading(false);
        }
    };

    const deleteCoupon = async (couponId) => {
        if (window.confirm("Are you sure you want to delete this coupon?")) {
            try {
                setDeletingCouponId(couponId);
                const res = await axios.delete(`api/v1/coupons/${couponId}`);
                if (res.status === 204) {
                    toast.success("Coupon deleted successfully");
                    fetchCoupons(pagination.currentPage, searchTerm, statusFilter === 'all' ? '' : statusFilter);
                }
            } catch (error) {
                toast.error(error.response?.data?.message  || 'Failed to delete coupon');
                console.log("Error deleting coupon:", error);
            }
        }
    };

    const toggleStatus = async (couponId, newStatus) => {
        try {
            const res = await axios.patch(`api/v1/coupons/${couponId}/status`, { status: newStatus });
            if (res.data.status === 'success') {
                toast.success(`Coupon status updated to ${newStatus}`);
                fetchCoupons(pagination.currentPage, searchTerm, statusFilter === 'all' ? '' : statusFilter);
            }
        } catch (error) {
            toast.error("Failed to update coupon status");
            console.error("Error updating coupon status:", error);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchCoupons(1, searchTerm, statusFilter === 'all' ? '' : statusFilter);
    };

    const handlePageChange = (page) => {
        fetchCoupons(page, searchTerm, statusFilter === 'all' ? '' : statusFilter);
    };

    const handleStatusChange = (status) => {
        setStatusFilter(status);
        fetchCoupons(1, searchTerm, status === 'all' ? '' : status);
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    return (
        <div className="">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Coupons Management</h1>
            <DataTableFilters
                searchTerm={searchTerm}
                onSearchChange={(e) => setSearchTerm(e.target.value)}
                onSearchSubmit={handleSearchSubmit}
                addButtonLink="/manage/admin/create-coupon"
                addButtonText="Add Coupon"
                filters={[
                    {
                        type: 'select',
                        value: statusFilter,
                        onChange: (e) => handleStatusChange(e.target.value),
                        options: statusFilterOptions
                    }
                ]}
                totalItems={pagination.totalItems}
                searchPlaceholder="Search coupons..."
            />

            <CouponsTable
                coupons={coupons}
                loading={loading}
                pagination={pagination}
                onPageChange={handlePageChange}
                onDelete={deleteCoupon}
                deletingCouponId={deletingCouponId}
                onStatusChange={toggleStatus}
            />
        </div>
    );
};

export default AdminManageCoupons;