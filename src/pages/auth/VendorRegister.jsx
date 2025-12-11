import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../lib/axios";
import InputField from "../../components/common/InputField";
import SelectField from "../../components/common/SelectField";
import Button from "../../components/common/Button";
import { toast } from 'react-toastify';
import { BiX } from "react-icons/bi";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const VendorRegister = () => {
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [loadingForm, setLoadingForm] = useState(false);
    const [authMethod, setAuthMethod] = useState(null);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        primaryPhone: "",
        email: "",
        ninNumber: "",
        primaryAddress: "",
        state: "",
        password: "",
        passwordConfirm: "",
        businessName: "",
        businessCategoryId: "",
        businessLogo: null
    });

    const nigerianStates = [
        "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa",
        "Benue", "Borno", "Cross River", "Delta", "Ebonyi", "Edo",
        "Ekiti", "Rivers", "Enugu", "FCT", "Gombe", "Imo", "Jigawa",
        "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos",
        "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau",
        "Sokoto", "Taraba", "Yobe", "Zamfara"
    ];

    const [previewImage, setPreviewImage] = useState(null);
    const fileInputRef = useRef(null);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();

    const fetchCategories = async () => {
        setLoadingCategories(true);
        try {
            const res = await axios.get('api/v1/categories?fields=name,id,icon');
            setCategories(res.data.data.categories);
        } catch (error) {
            console.error("Error fetching categories:", error);
            toast.error("Failed to load categories");
        } finally {
            setLoadingCategories(false);
        }
    };

    const checkCustomerStatus = async () => {
        setLoadingForm(true);
        try {
            const response = await axios.get('/api/v1/users/me');
            setAuthMethod(response?.data?.user?.authProvider);
        } catch (error) {
            console.error("Error checking user status:", error);
        } finally {
            setLoadingForm(false);
        }
    };

    useEffect(() => {
        fetchCategories();
        checkCustomerStatus();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({
                ...prev,
                businessLogo: file,
            }));

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setPreviewImage(null);
        setFormData((prev) => ({
            ...prev,
            businessLogo: null,
        }));
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        const vendorRaw = localStorage.getItem('user');
        const vendor = vendorRaw ? JSON.parse(vendorRaw) : null;
        const user_id = vendor.id

        const data = new FormData();
        Object.keys(formData).forEach((key) => {
            data.append(key, formData[key]);
        });

        data.append('role', 'vendor');
        if (user_id) {
            data.append('user_id', user_id);
        }


        try {
            const response = await axios.post("/api/v1/users/auth/vendor_registration", data);

            if (response.data.status === "success") {
                const updatedUser = response.data.data.user;
                localStorage.setItem('user', JSON.stringify(updatedUser));

                navigate(`/pending_verification`);
            }
        } catch (err) {
            const backendErrors = err.response?.data?.errors || {};
            const newErrors = {};

            Object.entries(backendErrors).forEach(([field, msg]) => {
                newErrors[field] = msg;
            });

            if (err.response?.data?.message && !Object.keys(newErrors).length) {
                newErrors.root = err.response.data.message;
            }

            setErrors(newErrors);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loadingForm) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex items-center justify-center gap-2 bg-white px-6 py-2 rounded-full shadow-lg">
                    <LoadingSpinner size='sm' />
                    <span className="text-sm">Loading Form...</span>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen py-8 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                {/* Breadcrumbs */}
                <nav className="flex items-center text-sm text-gray-500 mb-6">
                    <Link to="/" className="hover:text-gray-900 transition-colors">Home</Link>
                    <span className="mx-2">/</span>
                    <Link to="/sell-on-hezmart" className="hover:text-gray-900 transition-colors">Sell on Hezmart</Link>
                    <span className="mx-2">/</span>
                    <span className="font-semibold text-gray-900">Register</span>
                </nav>

                <div className="bg-white shadow-sm rounded-2xl overflow-hidden">
                    <div className="px-4 py-5 sm:p-6">
                        <div className="mb-8 pb-4 text-center">
                            <h1 className="text-2xl font-bold text-gray-900 font-['poppins']">Vendor Registration</h1>
                            <p className="mt-1 text-sm text-gray-500">
                                Fill in the details below to start selling on Hezmart.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {errors.root && (
                                <div className="p-4 rounded-md bg-red-50 border border-red-200">
                                    <div className="flex">
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-red-800">
                                                There were errors with your submission
                                            </h3>
                                            <div className="mt-2 text-sm text-red-700">
                                                <p>{errors.root}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <input type="hidden" name="role" value='vendor' />

                            {/* Section 1: Personal Info */}
                            {
                                authMethod === 'google' && (
                                    <>
                                    <div>
                                        <h3 className="text-lg font-semibold leading-6 text-gray-900 mb-4 font-['poppins']">Personal Information</h3>
                                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                                            <InputField
                                                label="First Name"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                placeholder="Enter First name"
                                                error={errors.firstName}
                                            />

                                            <InputField
                                                label="Last Name"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                placeholder="Enter Last name"
                                                error={errors.lastName}
                                            />

                                            <InputField
                                                label="Phone Number"
                                                name="primaryPhone"
                                                value={formData.primaryPhone}
                                                onChange={handleChange}
                                                placeholder="Enter phone number"
                                                type="tel"
                                                error={errors.primaryPhone}
                                            />

                                            <InputField
                                                label="NIN"
                                                name="ninNumber"
                                                value={formData.ninNumber}
                                                onChange={handleChange}
                                                placeholder="National Identity Number"
                                                error={errors.ninNumber}
                                            />

                                            <SelectField
                                                name="state"
                                                label="State"
                                                value={formData.state}
                                                onChange={handleChange}
                                                options={nigerianStates}
                                                error={errors.state}
                                            />

                                            <div className="sm:col-span-2">
                                                <InputField
                                                    label="Primary Address"
                                                    name="primaryAddress"
                                                    value={formData.primaryAddress}
                                                    onChange={handleChange}
                                                    placeholder="Full street address"
                                                    as="textarea"
                                                    error={errors.primaryAddress}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-8">
                                        <h3 className="text-lg font-semibold leading-6 text-gray-900 mb-4 font-['poppins']">Security</h3>
                                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                                            <InputField
                                                label="Password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                placeholder="Create a password"
                                                type="password"
                                                error={errors.password}
                                            />

                                            <InputField
                                                label="Confirm Password"
                                                name="passwordConfirm"
                                                value={formData.passwordConfirm}
                                                onChange={handleChange}
                                                placeholder="Repeat password"
                                                type="password"
                                                error={errors.passwordConfirm}
                                            />
                                        </div>
                                    </div>
                                    </>
                                )
                            }

                            {/* Section 2: Business Info */}
                            <div className="">
                                <h3 className="text-lg font-semibold leading-6 text-gray-900 mb-4 font-['poppins']">Business Details</h3>
                                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                                    <div className="sm:col-span-2">
                                        <InputField
                                            label="Business Name"
                                            name="businessName"
                                            value={formData.businessName}
                                            onChange={handleChange}
                                            placeholder="Registered business name"
                                            error={errors.businessName}
                                        />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <SelectField
                                            name="businessCategoryId"
                                            label="Business Category"
                                            value={formData.businessCategoryId}
                                            onChange={handleChange}
                                            options={[
                                                { value: "", label: "Select a category" },
                                                ...categories.map(category => ({
                                                    value: category.id,
                                                    label: category.name
                                                }))
                                            ]}
                                            disabled={loadingCategories}
                                            error={errors.businessCategoryId}
                                        />
                                    </div>

                                    {
                                        authMethod !== 'google' && (
                                            <InputField
                                                label="NIN"
                                                name="ninNumber"
                                                value={formData.ninNumber}
                                                onChange={handleChange}
                                                placeholder="National Identity Number"
                                                error={errors.ninNumber}
                                            />
                                        )
                                    }

                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-medium mb-2">Business Logo</label>
                                        
                                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 
                                        border-gray-300 border-dashed rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
                                             onClick={() => !previewImage && fileInputRef.current?.click()}
                                        >
                                            {previewImage ? (
                                                <div className="relative text-center">
                                                    <img
                                                        src={previewImage}
                                                        alt="Business logo preview"
                                                        className="mx-auto h-48 w-48 object-contain rounded-md"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleRemoveImage();
                                                        }}
                                                        className="mt-4 inline-flex items-center px-3 py-3 border 
                                                        border-transparent text-sm leading-4 font-medium rounded-full 
                                                        text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none"
                                                    >
                                                        <BiX />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="space-y-1 text-center w-full">
                                                    <svg
                                                        className="mx-auto h-12 w-12 text-gray-400"
                                                        stroke="currentColor"
                                                        fill="none"
                                                        viewBox="0 0 48 48"
                                                        aria-hidden="true"
                                                    >
                                                        <path
                                                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 
                                                            01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 
                                                            4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                            strokeWidth={2}
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                    <div className="flex text-sm text-gray-600 justify-center">
                                                        <span className="relative cursor-pointer bg-white rounded-md 
                                                        font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                                                            <span>Upload a file</span>
                                                            <input
                                                                id="file-upload"
                                                                name="businessLogo"
                                                                ref={fileInputRef}
                                                                onChange={handleFileChange}
                                                                type="file"
                                                                className="sr-only"
                                                                accept="image/png, image/jpg, image/jpeg, image/webp, image/svg+xml"
                                                            />
                                                        </span>
                                                        <p className="pl-1">or drag and drop</p>
                                                    </div>
                                                    <p className="text-xs text-gray-500">
                                                        PNG, JPG, GIF up to 5MB
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                        {errors.businessLogo && (
                                            <p className="mt-2 text-sm text-red-600">{errors.businessLogo}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4">
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    isLoading={isSubmitting}
                                    loadingText="Creating Account..."
                                    className="w-full flex justify-center py-3 px-4 border border-transparent 
                                    rounded-full shadow-sm text-sm font-medium text-white hover:bg-primary-light 
                                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Create Vendor Account
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorRegister;