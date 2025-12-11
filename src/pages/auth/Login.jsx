import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link, useLocation } from "react-router-dom";
import axios from "../../lib/axios";
import InputField from "../../components/common/InputField";
import Button from "../../components/common/Button";
import { FaGoogle, FaLock } from "react-icons/fa";
import { FiMail } from "react-icons/fi";
import { useGoogleLogin } from '@react-oauth/google';
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { BiErrorCircle } from "react-icons/bi";

const Login = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const pathname = searchParams.get("redirectTo") || location.state?.from || null;
    
    const [processing, setProcessing] = useState(false);
    const [socialProcessing, setSocialProcessing] = useState(null);
    const [redirecting, setRedirecting] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    
    const [error, setError] = useState(null);
    const [rememberMe, setRememberMe] = useState(false);
    const [errorMessage, setErrorMessage] = useState(
        location.state?.error || searchParams.get("message") || null
    );

    useEffect(() => {
        if (location.state?.error) {
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location, navigate]);

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSuccessfulLogin = async (response) => {
        setRedirecting(true);
        try {
            
            localStorage.setItem("user", JSON.stringify(response.data.data.user));
            if (rememberMe) {
                localStorage.setItem("rememberMe", "true");
            } else {
                localStorage.removeItem("rememberMe");
            }

            await axios.post('api/v1/cart/merge');

            let goTo;
            switch (response.data.data.user.role) {
                case 'user':
                case 'customer':
                goTo = pathname || '/';
                break;
                case 'vendor':
                goTo = pathname || (
                    response.data.data.user.status !== 'active'
                    ? '/pending_verification'
                    : '/manage/vendor/dashboard'
                );
                break;
                case 'admin':
                goTo = pathname || '/manage/admin/dashboard';
                break;
                default:
                goTo = '/';
            }
                navigate(goTo, { replace: true });
            } finally {
                setRedirecting(false);
        }
    };

    const handleGoogleSuccess = async (tokenResponse) => {
        setSocialProcessing('google');
        try {
        const response = await axios.post('api/v1/users/auth/google', {
            token: tokenResponse.access_token
        });
        
        if (response.data.status === 'success') {
            await handleSuccessfulLogin(response);
        }
        } catch (err) {
            console.log(err);
            setError(err.response?.data?.message || 'Google login failed');
        } finally {
         setSocialProcessing(null);
        }
    };

    const handleGoogleError = () => {
        setError('Google login failed');
        setSocialProcessing(null);
    };

    const googleLogin = useGoogleLogin({
        onSuccess: handleGoogleSuccess,
        onError: handleGoogleError,
    });

    const submit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setError(null);
        
        try {
            const response = await axios.post('api/v1/users/login', formData);
            if (response.data.status === 'success') {
                await handleSuccessfulLogin(response);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center pb-12 sm:px-6 lg:px-8">
            {redirecting && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex 
                items-center justify-center z-50">
                    <div className="bg-white px-8 py-2 rounded-full shadow-2xl 
                    flex items-center justify-center gap-2 animate-in fade-in zoom-in duration-200">
                        <LoadingSpinner size="sm" />
                        <p className="text-gray-900 font-medium text-[14px]">Redirecting you...</p>
                    </div>
                </div>
            )}

            {/* Breadcrumb Navigation */}
            <nav className="flex items-center space-x-2 py-8 text-sm text-gray-500">
                <Link to="/" className="hover:text-gray-900 transition-colors">Home</Link>
                <span className="text-gray-400">/</span>
                <span className="font-semibold text-gray-900">Login</span>
            </nav>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 rounded-2xl shadow-xl 
                shadow-gray-200/50 border border-gray-100 sm:rounded-2xl sm:px-10">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight font-['poppins']">
                            Login to your account
                        </h1>
                        <p className="mt-2 text-sm text-gray-500">
                            Welcome back! Please enter your details.
                        </p>
                    </div>
                    
                    {(error || errorMessage) && (
                        <div className="mb-6 p-4 text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg flex items-center">
                            <BiErrorCircle />
                            {error || errorMessage}
                        </div>
                    )}

                    {/* Social Login */}
                    <div className="mb-8">
                        <div className="grid grid-cols-1 gap-3">
                            <button
                                type="button"
                                onClick={() => googleLogin()}
                                disabled={!!socialProcessing || redirecting}
                                className="relative w-full flex justify-center items-center 
                                cursor-pointer py-2.5 px-4 border border-gray-300 
                                rounded-full shadow-sm bg-white text-sm font-medium 
                                text-gray-700 hover:bg-gray-50 
                                focus:outline-none focus:ring-2 focus:ring-offset-2 
                                focus:ring-indigo-500 transition-all duration-200 
                                disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <FaGoogle className="text-red-500 mr-2 text-lg" />
                                <span>
                                    {socialProcessing === 'google' ? 'Processing...' : 'Continue with Google'}
                                </span>
                            </button>
                        </div>

                        <div className="relative mt-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500 font-medium">
                                    Or login with email
                                </span>
                            </div>
                        </div>
                    </div>

                    <form className="space-y-6" onSubmit={submit}>
                        <InputField
                        type="email"
                        name="email"
                        label="Email Address"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        icon={<FiMail />}
                        required
                        disabled={redirecting}
                        className="w-full"
                        />

                        <InputField
                        name="password"
                        label="Password"
                        type="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        icon={<FaLock />}
                        required
                        disabled={redirecting}
                        className="w-full"
                        />

                        <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                            id="remember-me"
                            name="remember-me"
                            type="checkbox"
                            checked={rememberMe}
                            onChange={() => setRememberMe(!rememberMe)}
                            disabled={redirecting}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                            Remember me
                            </label>
                        </div>

                        <div className="text-sm">
                            <Link
                            to="/forgot-password"
                            className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                            >
                            Forgot password?
                            </Link>
                        </div>
                        </div>

                        <div>
                        <Button
                            type="submit"
                            disabled={processing || redirecting}
                            isLoading={processing || redirecting}
                            loadingText={redirecting ? "Redirecting..." : "Logging in..."}
                            className="w-full py-3 text-base shadow-md hover:shadow-lg transition-all font-semibold"
                        >
                            Login
                        </Button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-white px-2 text-gray-500">
                            Don't have an account?{' '}
                            <Link
                                to="/customer-register"
                                state={{ from: location.state?.from }}
                                className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                            >
                                Create account
                            </Link>
                            </span>
                        </div>
                    </div>
                    </div>
            </div>
        </div>
    );
};

export default Login;