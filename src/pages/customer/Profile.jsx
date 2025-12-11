import Button from "../../components/common/Button";
import InputField from "../../components/common/InputField";
import SelectField from "../../components/common/SelectField";
import { toast } from 'react-toastify';
import axios from "../../lib/axios";
import { useEffect, useState, useRef } from 'react';
import { 
    FaUserCircle, 
    FaCamera, 
    FaTimes, 
    FaLock,
    FaMapMarkerAlt,
    FaUser
} from 'react-icons/fa';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [
        isChangingPassword, 
        setIsChangingPassword
    ] = useState(false);
    
    const [photoPreview, setPhotoPreview] = useState(null);
    const [errors, setErrors] = useState({
        account: {},
        address: {},
        password: {}
    });
    
    const fileInputRef = useRef(null);

    const nigerianStates = [
        "Abia", "Adamawa", "Akwa Ibom", "Anambra", 
        "Bauchi", "Bayelsa", "Benue", "Borno", 
        "Cross River", "Delta", "Ebonyi", "Edo", 
        "Ekiti", "Rivers", "Enugu", "FCT", 
        "Gombe", "Imo", "Jigawa", "Kaduna", 
        "Kano", "Katsina", "Kebbi", "Kogi", 
        "Kwara", "Lagos", "Nasarawa", "Niger", 
        "Ogun", "Ondo", "Osun", "Oyo", 
        "Plateau", "Sokoto", "Taraba", "Yobe", 
        "Zamfara"
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
            toast.error(
                err.response?.data?.message || 
                'Failed to fetch user data'
            );
        }
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.match('image.*')) {
                toast.error('Please select an image file');
                return;
            }
            if (file.size > 2 * 1024 * 1024) {
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
        
        if (!photoPreview && user.photo) {
            formData.append('photo', 'null');
        }
        
        try {
            const res = await axios.patch(
                'api/v1/users/updateMe', 
                formData, 
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            
            if (res.data.status === 'success') {
                toast.success('Account updated successfully');
                setUser(res.data.data.user);
                setErrors(prev => ({ ...prev, account: {} }));
                
                if (res.data.data.user.photo) {
                    setPhotoPreview(res.data.data.user.photo);
                } else {
                    setPhotoPreview(null);
                }
            }
        } catch (err) {
            if (err.response?.data?.errors) {
                setErrors(prev => ({ 
                    ...prev, 
                    account: err.response.data.errors 
                }));
            }
            toast.error(
                err.response?.data?.message || 
                'Failed to update account'
            );
        } finally {
            setIsUpdating(false);
        }
    };

    useEffect(() => {
        getUser();
    }, []);

    if (!user) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="
                    animate-spin 
                    rounded-full 
                    h-12 
                    w-12 
                    border-t-2 
                    border-b-2 
                    border-primary-dark 
                    mx-auto
                "></div>
            </div>
        );
    }

    return (
        <section className='min-h-screen'>
            <div className="
                max-w-7xl 
                mx-auto
                lg:px-8 
                py-10
            ">
                <div className="mb-8">
                    <h1 className="
                        text-2xl 
                        font-semibold 
                        text-gray-900 
                        font-['poppins']
                    ">
                        Account Settings
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Manage your profile and security settings
                    </p>
                </div>
                
                <div className="
                    grid 
                    grid-cols-1 
                    lg:grid-cols-3 
                    gap-8
                ">
                    {/* Left Column: Profile Card */}
                    <div className="lg:col-span-1">
                        <div className="
                            bg-white 
                            shadow-sm 
                            rounded-2xl 
                            p-6 
                            text-center
                        ">
                            <div className="relative inline-block mb-4">
                                {photoPreview ? (
                                    <div className="relative">
                                        <img 
                                            src={photoPreview} 
                                            alt="Profile" 
                                            className="
                                                w-32 
                                                h-32 
                                                rounded-full 
                                                object-cover 
                                                border-2
                                                border-gray-800                                                
                                            "
                                        />
                                        <button
                                            type="button"
                                            onClick={handleRemovePhoto}
                                            className="
                                                absolute 
                                                -top-1 
                                                -right-1 
                                                bg-red-500 
                                                text-white 
                                                rounded-full 
                                                p-2 
                                                hover:bg-red-600 
                                                transition
                                            "
                                        >
                                            <FaTimes className="w-3 h-3" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="
                                        w-32 
                                        h-32 
                                        rounded-full 
                                        bg-gray-100 
                                        flex 
                                        items-center 
                                        justify-center 
                                        mx-auto
                                    ">
                                        <FaUserCircle 
                                            className="
                                                text-gray-300 
                                                text-6xl
                                            " 
                                        />
                                    </div>
                                )}
                            </div>

                            <h2 className="
                                text-xl 
                                font-semibold 
                                text-gray-900
                            ">
                                {user.firstName} {user.lastName}
                            </h2>
                            <p className="text-gray-500 text-sm mb-6">
                                {user.email}
                            </p>

                            <button
                                type="button"
                                onClick={() => fileInputRef.current.click()}
                                className="
                                    flex 
                                    items-center 
                                    justify-center 
                                    gap-2 
                                    w-full 
                                    py-2 
                                    px-4 
                                    border 
                                    border-gray-300 
                                    rounded-lg 
                                    text-sm 
                                    font-medium 
                                    text-gray-700 
                                    hover:bg-gray-50 
                                    transition
                                "
                            >
                                <FaCamera />
                                Change Photo
                            </button>
                            
                            {errors.account?.photo && (
                                <p className="
                                    text-red-500 
                                    text-xs 
                                    mt-2 
                                    text-left
                                ">
                                    {errors.account.photo}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Forms */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* Personal Details */}
                        <div className="
                            bg-white 
                            shadow-sm 
                            rounded-2xl 
                            overflow-hidden
                        ">
                            <div className="
                                px-6 
                                py-4
                                flex 
                                items-center 
                                gap-3
                            ">
                                <h3 className="
                                    font-semibold 
                                    text-gray-900
                                ">
                                    Personal Details
                                </h3>
                            </div>
                            
                            <form 
                                onSubmit={handleAccountUpdate} 
                                className="p-6 space-y-6"
                            >
                                {/* Hidden input for photo ref */}
                                <input
                                    type="file"
                                    name="photo"
                                    accept="image/*"
                                    onChange={handlePhotoChange}
                                    ref={fileInputRef}
                                    className="hidden"
                                />

                                <div className="
                                    grid 
                                    grid-cols-1 
                                    md:grid-cols-2 
                                    gap-6
                                ">
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

                                <div className="
                                    grid 
                                    grid-cols-1 
                                    md:grid-cols-2 
                                    gap-6
                                ">
                                    <InputField
                                        label="Email Address"
                                        name="email"
                                        type="email"
                                        value={user.email}
                                        disabled
                                        className="bg-gray-50"
                                    />
                                    <InputField
                                        label="Phone Number"
                                        name="primaryPhone"
                                        type="tel"
                                        value={user.primaryPhone}
                                        error={errors.account?.primaryPhone}
                                        required
                                    />
                                </div>

                                <div className="flex justify-end pt-2">
                                    <Button 
                                        type="submit" 
                                        isLoading={isUpdating}
                                        className="sm:max-w-[25%] w-full text-sm font-semibold py-3"
                                    >
                                        Save Changes
                                    </Button>
                                </div>
                            </form>
                        </div>

                        {/* Address Section */}
                        <div className="
                            bg-white 
                            shadow-sm 
                            rounded-2xl 
                            overflow-hidden
                        ">
                            <div className="
                                px-6 
                                py-4
                                flex 
                                items-center 
                                gap-3
                            ">
                                <h3 className="
                                    font-semibold 
                                    text-gray-900
                                ">
                                    Location
                                </h3>
                            </div>
                            
                            <form 
                                onSubmit={handleAccountUpdate} 
                                className="p-6 space-y-6"
                            >
                                <div className="
                                    grid 
                                    grid-cols-1 
                                    md:grid-cols-2 
                                    gap-6
                                ">
                                    <SelectField
                                        name="state"
                                        label="State of Residence"
                                        defaultValue={user.state}
                                        options={nigerianStates}
                                        error={errors.account?.state}
                                    />
                                    <InputField
                                        label="Street Address"
                                        name="primaryAddress"
                                        value={user.primaryAddress}
                                        error={
                                            errors.account?.primaryAddress
                                        }
                                        required
                                    />
                                </div>

                                <div className="flex justify-end pt-2">
                                    <Button 
                                        type="submit" 
                                        isLoading={isUpdating}
                                        className="sm:max-w-[25%] w-full text-sm font-semibold py-3"
                                    >
                                        Update Location
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Profile;