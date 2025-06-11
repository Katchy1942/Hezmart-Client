import Button from "../../components/common/Button";
import InputField from "../../components/common/InputField";
import SelectField from "../../components/common/SelectField";
import { toast } from 'react-toastify';
import axios from "../../lib/axios";
import { useEffect, useState } from 'react';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [errors, setErrors] = useState({
    account: {},
    address: {},
    password: {}
  });

  const countries = [
    { value: 'ng', label: 'Nigeria' },
    { value: 'gh', label: 'Ghana' },
    { value: 'ke', label: 'Kenya' },
    { value: 'za', label: 'South Africa' }
  ];

  const getUser = async () => {
    try {
      const res = await axios.get('api/v1/users/me');
      if (res.data.status === 'success') {
        setUser(res.data.user);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch user data');
    }
  };

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
      if (err.response?.data?.errors) {
        setErrors(prev => ({ ...prev, account: err.response.data.errors }));
      }
      toast.error(err.response?.data?.message || 'Failed to update account');
    } finally {
      setIsUpdating(false);
    }
  };

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

  useEffect(() => {
    getUser();
  }, []);

  if (!user){
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-dark mx-auto"></div>
      </div>
    );
  }

  return (
    <section className='bg-gray-100 min-h-screen'>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h1>
        
        <div className='bg-white shadow overflow-hidden sm:rounded-lg p-5'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
            {/* Account Details */}
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
                
                <InputField
                  label="Secondary Phone"
                  name="secondaryPhone"
                  type="tel"
                  value={user.secondaryPhone || ''}
                  error={errors.account?.secondaryPhone}
                  isRequired={false}
                />
                
                <Button type="submit" isLoading={isUpdating}>
                  Update Account
                </Button>
              </form>
            </div>

            {/* Address Book */}
            <div className='border border-gray-300 rounded-md'>
              <h2 className='mb-4 border-b border-b-gray-300 p-3 font-medium'>Address Book</h2>
              <form className='p-3 space-y-4' onSubmit={handleAccountUpdate}>
                <InputField
                  label="Primary Address"
                  name="primaryAddress"
                  value={user.primaryAddress}
                  error={errors.account?.primaryAddress}
                  required
                />
                
                <InputField
                  label="Secondary Address"
                  name="secondaryAddress"
                  value={user.secondaryAddress || ''}
                  error={errors.account?.secondaryAddress}
                  isRequired={false}
                />
                
                <SelectField
                  label="Country"
                  name="country"
                  options={countries}
                  value={user.country}
                  error={errors.account?.country}
                  required
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="City"
                    name="city"
                    value={user.city}
                    error={errors.account?.city}
                    required
                  />
                  <InputField
                    label="Region/State"
                    name="region"
                    value={user.region}
                    error={errors.account?.region}
                    required
                  />
                </div>
                
                <Button type="submit" isLoading={isUpdating}>
                  Update Address
                </Button>
              </form>
            </div>

            {/* Password Manager */}
            <div className='border border-gray-300 rounded-md md:col-span-2'>
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
        </div>
      </div>
    </section>
  );
};

export default Profile;