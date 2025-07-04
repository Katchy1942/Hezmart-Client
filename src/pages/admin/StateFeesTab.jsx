import Button from "../../components/common/Button";
import InputField from "../../components/common/InputField";
import SelectField from "../../components/common/SelectField";
import { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import axios from "../../lib/axios";
import { FiTrash2 } from 'react-icons/fi';

const StateFeesTab = ({ 
    nigerianStates
}) => {
    const [showForm, setShowForm] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
    const [stateFees, setStateFees] = useState([]);

    const handleSubmit = async (e) => {
        setProcessing(true);
        e.preventDefault();
        const formData = new FormData(e.target);
        const dataToSend = Object.fromEntries(formData);
        
        try {
            const res = await axios.post('api/v1/shipping-settings/state-fees', dataToSend);
            if (res.data.status === 'success') {
                toast.success('State fee added successfully');
                getStateFees();
                setShowForm(false);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to add state fee');
        } finally {
            setProcessing(false);
        }
    };

    const handleDelete = async (id) => {
        // Show confirmation dialog
        const isConfirmed = window.confirm('Are you sure you want to delete this state fee?');
        
        if (!isConfirmed) {
            return; // Exit if user cancels
        }
        setDeletingId(id);
        try {
            const res = await axios.delete(`api/v1/shipping-settings/state-fees/${id}`);
            if (res.status === 204) {
                toast.success('State fee deleted successfully');
                getStateFees();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete state fee');
        } finally {
            setDeletingId(null);
        }
    };

    const getStateFees = async () => {
        try {
            const res = await axios.get('api/v1/shipping-settings/state-fees');
            if (res.data.status === 'success') {
                setStateFees(res.data.data.stateFees);
            }
        } catch (err) {
            console.log(err);
            toast.error(err.response?.data?.message || 'Failed to fetch state fees');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getStateFees();
    }, []);

    return (
        <div className="space-y-6">
            <div>
                {/* State Fees Configuration */}
                <div className='border border-gray-300 rounded-md mt-6'>
                    <div className="flex justify-between items-center mb-4 border-b border-b-gray-300 p-3">
                        <h2 className='font-medium'>State Fees</h2>
                        {
                        showForm ? ( 
                            <button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setShowForm(false);
                                    setBarcodePreview(null);
                                }}
                                className="px-4 py-2 cursor-pointer border border-gray-300 text-sm font-medium rounded-md hover:bg-gray-50"
                                >
                                Cancel
                            </button>
                        ) : (
                            <Button type="button" size="sm" onClick={() => setShowForm(prev => !prev)}>
                                Add State Fee
                            </Button>

                        )
                    }
                    </div>
                     <div className='p-3 space-y-4'>
                        {showForm && (
                            <div className='p-3 bg-gray-50 rounded-lg border border-gray-200'>
                                <h3 className="text-md font-medium text-gray-700 mb-4">Add New State Fee</h3>
                                <form onSubmit={handleSubmit}>
                                    <SelectField
                                        name="state"
                                        label="State"
                                        options={nigerianStates}
                                        classNames="mb-4"
                                    />
                                    <InputField
                                        name="fee"
                                        label="Fee (₦)"
                                        type="number"
                                        classNames="mb-4"
                                    />

                                    <div className="mt-6 flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {setShowForm(false)}}
                                            className="px-4 py-2 cursor-pointer border border-gray-300 text-sm font-medium rounded-md hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                         <Button 
                                            type="submit"
                                            isLoading={processing}
                                            disabled={processing}
                                            loadingText="Processing..."
                                        >
                                            Save Settings
                                        </Button>
                                    </div>
                                   
                                </form>
                            </div>
                        )}
                    
                        <div className='p-3 space-y-4'>
                            {loading ? (
                                <div className="flex justify-center items-center h-64">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-dark"></div>
                                </div>
                            ) : stateFees && stateFees.length > 0 ? (
                                <div className="bg-white rounded-lg shadow overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    {['State', 'Fee', 'Actions'].map((header, idx) => (
                                                        <th 
                                                            key={idx} 
                                                            className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${header === 'Actions' ? 'text-right' : ''}`}
                                                        >
                                                            {header}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {stateFees.map((fee) => (
                                                    <tr key={fee.id}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {fee.state || 'N/A'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            ₦{fee.fee?.toLocaleString() || '0'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <button
                                                                onClick={() => handleDelete(fee.id)}
                                                                disabled={deletingId === fee.id}
                                                                className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                                            >
                                                                {deletingId === fee.id ? (
                                                                    <div className="animate-spin h-5 w-5 border-t-2 border-b-2 border-red-600 rounded-full"></div>
                                                                ) : (
                                                                    <FiTrash2 className="h-5 w-5" />
                                                                )}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    No state fees configured
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StateFeesTab;