import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "../../lib/axios";
import InputField from "../../components/common/InputField";
import SelectField from "../../components/common/SelectField";
import Button from "../../components/common/Button";
import { FaGoogle } from "react-icons/fa";
import { useGoogleLogin } from '@react-oauth/google';

const CustomerRegister = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        primaryPhone: "",
        email: "",
        primaryAddress: "",
        state: "",
        password: "",
        passwordConfirm: "",
        role: 'customer'
    });

    const nigerianStates = [
        "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", 
        "Benue", "Borno", "Cross River", "Delta", "Ebonyi", "Edo", 
        "Ekiti", "Rivers", "Enugu", "FCT", "Gombe", "Imo", "Jigawa", 
        "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", 
        "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", 
        "Sokoto", "Taraba", "Yobe", "Zamfara"
    ];

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [socialProcessing, setSocialProcessing] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleGoogleSuccess = async (tokenResponse) => {
        setSocialProcessing('google');
        setErrors({});

        try {
            const response = await axios.post('api/v1/users/auth/google', {
                token: tokenResponse.access_token
            });
        
            if (response.data.status === 'success' && response.data.data?.user) {
                localStorage.setItem("user", JSON.stringify(response.data.data.user));
                navigate(from || '/', { replace: true });
            } else {
                console.error("User data missing in response");
            }
        } catch (err) {
            setErrors({
                root: err.response?.data?.message || 'Google signup failed. Please try again.'
            });
        } finally {
            setSocialProcessing(null);
        }
    };

    const handleGoogleError = () => {
        setErrors({ root: 'Google sign in was cancelled or failed.' });
        setSocialProcessing(null);
    };

    const login = useGoogleLogin({
        onSuccess: handleGoogleSuccess,
        onError: handleGoogleError,
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        const formDataToSend = new FormData(e.target);
    
        try {
            const response = await axios.post("/api/v1/users/signup", formDataToSend);

            if (response.data.status === "success") {
                navigate(`/confirm-email`, { 
                    state: { from, email: formData.email },
                    replace: true
                });
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

    return (
        <div className="min-h-screen pb-12">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb Navigation */}
                <nav className="flex items-center space-x-2 py-8 text-sm text-gray-500">
                    <Link to="/" className="hover:text-gray-900 transition-colors">Home</Link>
                    <span className="text-gray-400">/</span>
                    <Link to="/" className="hover:text-gray-900 transition-colors">Buy on Hezmart</Link>
                    <span className="text-gray-400">/</span>
                    <span className="font-semibold text-gray-900">Register</span>
                </nav>

                {/* Main Form Container */}
                <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="px-6 py-10 sm:px-12 sm:py-12">
                        <form onSubmit={handleSubmit}>
                            <div className="text-center mb-10">
                                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight font-['poppins']">
                                    Personal Information
                                </h1>
                                <p className="mt-2 text-sm text-gray-500">
                                    Please fill in your details to create your account
                                </p>
                            </div>

                            {errors.root && (
                                <div className="mb-6 p-4 text-[14px] text-red-700 bg-red-50 border 
                                border-red-100 rounded-lg flex items-center justify-center">
                                    {errors.root}
                                </div>
                            )}

                            {/* Social Auth Buttons */}
                            <div className="mb-8">
                                <div className="flex flex-col gap-3">
                                    {/* Centered container for the Google button */}
                                    <div className="flex justify-center w-full">
                                        <button
                                            onClick={() => login()}
                                            disabled={!!socialProcessing}
                                            type="button"
                                            className="relative w-full sm:w-auto sm:min-w-[280px] flex justify-center
                                            items-center py-3 px-6 border border-gray-300 rounded-full shadow-sm
                                            bg-white text-[14px] font-medium text-gray-700 hover:bg-gray-50
                                            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 
                                            transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                        >
                                            <FaGoogle className="text-red-500 mr-3 text-lg" />
                                            <span>
                                                {socialProcessing === 'google' ? 'Processing...' : 'Continue with Google'}
                                            </span>
                                        </button>
                                    </div>

                                    {/* Apple Signin code... */}
                                </div>

                                <div className="relative mt-8">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-200"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-4 bg-white text-gray-500 font-medium">
                                            Or register with email
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6 text-[14px]">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputField
                                        label="First Name"
                                        name="firstName"
                                        onChange={handleChange}
                                        placeholder="e.g. John"
                                        error={errors.firstName}
                                        classNames="w-full"
                                    />

                                    <InputField
                                        label="Last Name"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        placeholder="e.g. Eze"
                                        error={errors.lastName}
                                        classNames="w-full"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputField
                                        label="Phone Number"
                                        name="primaryPhone"
                                        value={formData.primaryPhone}
                                        onChange={handleChange}
                                        placeholder="080..."
                                        type="tel"
                                        error={errors.primaryPhone}
                                        classNames="w-full"
                                    />

                                    <InputField
                                        label="Email Address"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="name@example.com"
                                        type="email"
                                        error={errors.email}
                                        classNames="w-full"
                                    />
                                </div>

                                <div>
                                    <InputField
                                        label="Primary Address"
                                        name="primaryAddress"
                                        value={formData.primaryAddress}
                                        onChange={handleChange}
                                        placeholder="Street address, apartment, suite, etc."
                                        as="textarea"
                                        error={errors.primaryAddress}
                                        classNames="w-full"
                                    />
                                </div>

                                <div>
                                    <SelectField
                                        name="state"
                                        label="State"
                                        value={formData.state}
                                        onChange={handleChange}
                                        options={nigerianStates}
                                        error={errors.state}
                                        classNames="w-full"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputField
                                        label="Create Password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Min. 8 characters"
                                        type="password"
                                        error={errors.password}
                                        classNames="w-full"
                                    />

                                    <InputField
                                        label="Confirm Password"
                                        name="passwordConfirm"
                                        value={formData.passwordConfirm}
                                        onChange={handleChange}
                                        placeholder="Re-enter password"
                                        type="password"
                                        error={errors.passwordConfirm}
                                        classNames="w-full"
                                    />
                                </div>
                            </div>

                            <div className="mt-10">
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    isLoading={isSubmitting}
                                    loadingText="Creating Account..."
                                    className="w-full py-3.5 text-base text-[14px] font-semibold shadow-md hover:shadow-lg transition-all"
                                >
                                    Create Account
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerRegister;