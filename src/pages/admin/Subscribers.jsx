import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import axios from "../../lib/axios";
import usePagination from "../../hooks/usePagination";
import SubscribersTable from "../../components/subscribers/SubscribersTable";
const Subscribers = ()=>{
    const [subscribers, setSubscribers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { pagination, updatePagination } = usePagination();
    const [deletingCouponId, setDeletingCouponId] = useState(null);

    const fetchSubscribers = async (page = 1,) => {
        try {
            setLoading(true);
            let url = `api/v1/subscribers?page=${page}&limit=${pagination.perPage}`;
            const res = await axios.get(url);
            if (res.data.status === 'success') {
                setSubscribers(res.data.data.subscribers);
                updatePagination({
                    currentPage: res.data.pagination.currentPage,
                    totalPages: res.data.pagination.totalPages,
                    totalItems: res.data.pagination.totalItems
                });
            }
        } catch (error) {
            toast.error("Failed to load subscribers");
            console.error("Error fetching subscriber:", error);
        } finally {
            setLoading(false);
        }
    };
    const handlePageChange = (page) => {
        fetchSubscribers(page);
    };

       useEffect(() => {
        fetchSubscribers();
    }, []);
    return(
        <div className=''>
             <h1 className="text-2xl font-bold text-gray-800 mb-6">Subscribers Management</h1>


             <SubscribersTable
                subscribers={subscribers}
                loading={loading}
                pagination={pagination}
                onPageChange={handlePageChange}
                // onDelete={handleDeleteSubscriber}
                // deletingSubscriberId={deletingId}
            />
        </div>
    )
}

export default Subscribers