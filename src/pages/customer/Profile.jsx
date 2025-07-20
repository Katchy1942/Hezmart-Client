import Button from "../../components/common/Button";
import InputField from "../../components/common/InputField";
import SelectField from "../../components/common/SelectField";
import { toast } from 'react-toastify';
import axios from "../../lib/axios";
import { useEffect, useState, useRef } from 'react';
import { FaUserCircle, FaCamera, FaTimes } from 'react-icons/fa';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [errors, setErrors] = useState({
    account: {},
    address: {},
    password: {}
  });
  const fileInputRef = useRef(null);

  const nigerianStates = [
    "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", 
    "Benue", "Borno", "Cross River", "Delta", "Ebonyi", "Edo", 
    "Ekiti", "Rivers", "Enugu", "FCT", "Gombe", "Imo", "Jigawa", 
    "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", 
    "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", 
    "Sokoto", "Taraba", "Yobe", "Zamfara"
  ];

  const getUser = async () => {
    try {
      const res = await axios.get('api/v1/users/me');
      if (res.data.status === 'success') {
        setUser(res.data.user);
        if (res.data.user.photo) {
          setPhotoPreview(res.data.user.photo);
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch user data');
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match('image.*')) {
        toast.error('Please select an image file (JPEG, PNG)');
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

  const handleRemovePhoto = () => {
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAccountUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    const formData = new FormData(e.target);
    
    // If photo was removed, explicitly set photo to null
    if (!photoPreview && user.photo) {
      formData.append('photo', 'null');
    }
    
    try {
      const res = await axios.patch('api/v1/users/updateMe', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
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

  if (!user) {
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

            {/* Address Book */}
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