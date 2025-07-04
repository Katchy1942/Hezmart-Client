import { useState } from "react";
import Button from "../../components/common/Button";
import InputField from "../../components/common/InputField";
import SelectField from "../../components/common/SelectField";
import axios from "../../lib/axios";
import { toast } from 'react-toastify';

const ProfileTab = ({ user, setUser, nigerianStates }) => {

    const [isUpdating, setIsUpdating] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [errors, setErrors] = useState({
        account: {},
    });
    // Account update handler
    const handleAccountUpdate = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        const formData = new FormData(e.target);
        
        try {
            const res = await axios.patch('api/v1/users/updateMe', Object.fromEntries(formData));
            if (res.data.status === 'success') {
                toast.success('Account updated successfully');
                setUser(res.data.data.user);
                setErrors(prev => ({ ...prev, account: {} }));
            }
        } catch (err) {
            console.log(err);
            
            if (err.response?.data?.errors) {
                setErrors(prev => ({ ...prev, account: err.response.data.errors }));
            }
            toast.error(err.response?.data?.message || 'Failed to update account');
        } finally {
            setIsUpdating(false);
        }
    };

    // Password change handler
    const handleChangePassword = async (e) => {
        e.preventDefault();
        setIsChangingPassword(true);
        const formData = new FormData(e.target);
        
        try {
            const res = await axios.patch('api/v1/users/updateMyPassword', Object.fromEntries(formData));
            if (res.data.status === 'success') {
                toast.success('Password changed successfully');
                e.target.reset();
                setErrors(prev => ({ ...prev, password: {} }));
            }
        } catch (err) {
            if (err.response?.data?.errors) {
                setErrors(prev => ({ ...prev, password: err.response.data.errors }));
            }
            toast.error(err.response?.data?.message || 'Failed to change password');
        } finally {
            setIsChangingPassword(false);
        }
    };
    return (
        <div className="space-y-6">
            <div className='border border-gray-300 rounded-md'>
                <h2 className='mb-4 border-b border-b-gray-300 p-3 font-medium'>Account Details</h2>
                <form className='p-3 space-y-4' onSubmit={handleAccountUpdate}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField
                            label="First Name"
                            name="firstName"
                            value={user.firstName}
                            error={errors.account?.firstName}
                            required
                        />
                        <InputField
                            label="Last Name"
                            name="lastName"
                            value={user.lastName}
                            error={errors.account?.lastName}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField
                            label="Email"
                            name="email"
                            type="email"
                            value={user.email}
                            error={errors.account?.email}
                            required
                            disabled
                        />
                        <InputField
                            label="Primary Phone"
                            name="primaryPhone"
                            type="tel"
                            value={user.primaryPhone}
                            error={errors.account?.primaryPhone}
                            required
                        />
                    </div>
                    <Button type="submit" isLoading={isUpdating}>
                        Update Account
                    </Button>
                </form>
            </div>

            <div className='border border-gray-300 rounded-md'>
                <h2 className='mb-4 border-b border-b-gray-300 p-3 font-medium'>Address Book</h2>
                <form className='p-3 space-y-4' onSubmit={handleAccountUpdate}>
                    <SelectField
                        name="state"
                        label="State"
                        value={user.state}
                        options={nigerianStates}
                        error={errors.account?.state}
                    />
                    <InputField
                        label="Primary Address"
                        name="primaryAddress"
                        value={user.primaryAddress}
                        error={errors.account?.primaryAddress}
                        required
                    />
                    <Button type="submit" isLoading={isUpdating}>
                        Update Address
                    </Button>
                </form>
            </div>

            <div className='border border-gray-300 rounded-md'>
                <h2 className='mb-4 border-b border-b-gray-300 p-3 font-medium'>Password Manager</h2>
                <form className='p-3 space-y-4 max-w-lg mx-auto' onSubmit={handleChangePassword}>
                    <InputField
                        label="Current Password"
                        name="passwordCurrent"
                        type="password"
                        error={errors.password?.passwordCurrent}
                        required
                    />
                    <InputField
                        label="New Password"
                        name="password"
                        type="password"
                        error={errors.password?.password}
                        required
                    />
                    <InputField
                        label="Confirm New Password"
                        name="passwordConfirm"
                        type="password"
                        error={errors.password?.passwordConfirm}
                        required
                    />
                    <Button type="submit" isLoading={isChangingPassword}>
                        Change Password
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default ProfileTab;