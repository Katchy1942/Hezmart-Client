import { useState, useRef } from "react";
import Button from "./Button";
import InputField from "./InputField";
import SelectField from "./SelectField";
import axios from "../../lib/axios";
import { toast } from 'react-toastify';
import { FaUserCircle, FaCamera, FaTimes } from 'react-icons/fa';

const ProfileTab = ({ user, setUser, nigerianStates }) => {
    const [isUpdating, setIsUpdating] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [errors, setErrors] = useState({
        account: {},
    });
    const [photoPreview, setPhotoPreview] = useState(user?.photo || null);
    const fileInputRef = useRef(null);

    // Handle photo selection
    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.match('image.*')) {
                toast.error('Please select an image file');
                return;
            }
            if (file.size > 2 * 1024 * 1024) { // 2MB limit
                toast.error('Image size should be less than 2MB');
                return;
            }
            
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Remove selected photo
    const handleRemovePhoto = () => {
        setPhotoPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Account update handler
    const handleAccountUpdate = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        const formData = new FormData(e.target);
        
        // If photo was removed, explicitly set photo to null
        if (!photoPreview && user.photo) {
            formData.append('photo', 'null');
        }
        
        try {
            const res = await axios.patch('api/v1/users/updateMe', formData);
            if (res.data.status === 'success') {
                toast.success('Account updated successfully');
                setUser(res.data.data.user);
                setErrors(prev => ({ ...prev, account: {} }));
                // Update photo preview with new photo URL if it was changed
                if (res.data.data.user.photo) {
                    setPhotoPreview(res.data.data.user.photo);
                } else {
                    setPhotoPreview(null);
                }
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
                    {/* Photo Upload Section */}
                    <div className="flex flex-col items-center mb-4">
                        <div className="relative mb-3">
                            {photoPreview ? (
                                <div className="relative">
                                    <img 
                                        src={photoPreview} 
                                        alt="Profile Preview" 
                                        className="w-32 h-32 rounded-full object-cover border-2 border-orange-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleRemovePhoto}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                    >
                                        <FaTimes className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-2 border-dashed border-gray-400">
                                    <FaUserCircle className="text-gray-400 text-6xl" />
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col items-center">
                            <input
                                type="file"
                                id="photo"
                                name="photo"
                                accept="image/*"
                                onChange={handlePhotoChange}
                                ref={fileInputRef}
                                className="hidden"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => fileInputRef.current.click()}
                                className="flex items-center gap-2"
                            >
                                <FaCamera />
                                {photoPreview ? 'Change Photo' : 'Upload Photo'}
                            </Button>
                            {/* <p className="text-xs text-gray-500 mt-1">JPEG or PNG, max 2MB</p> */}
                        </div>
                        {errors.account?.photo && (
                            <p className="text-red-500 text-sm mt-1">{errors.account.photo}</p>
                        )}
                    </div>

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
                        defaultValue={user.state}
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
                        autoComplete={true}
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