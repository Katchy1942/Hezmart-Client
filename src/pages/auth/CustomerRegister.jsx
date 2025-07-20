import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "../../lib/axios";
import InputField from "../../components/common/InputField";
import SelectField from "../../components/common/SelectField";
import Button from "../../components/common/Button";
import { FaGoogle, FaApple } from "react-icons/fa";
import { GoogleLogin } from '@react-oauth/google';
import AppleSignin from 'react-apple-signin-auth';

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

  const handleGoogleSuccess = async (credentialResponse) => {
    setSocialProcessing('google');
    try {
      const response = await axios.post('api/v1/users/auth/google', {
        token: credentialResponse.credential
      });
      
      if (response.data.status === 'success') {
        localStorage.setItem("user", JSON.stringify(response.data.data.user));
        navigate(from || '/', { replace: true });
      }
    } catch (err) {
      setErrors({
        root: err.response?.data?.message || 'Google signup failed'
      });
    } finally {
      setSocialProcessing(null);
    }
  };

  const handleGoogleError = () => {
    setErrors({ root: 'Google signup failed' });
    setSocialProcessing(null);
  };

  const handleAppleLogin = async (data) => {
    setSocialProcessing('apple');
    try {
      const response = await axios.post('api/v1/auth/apple', {
        token: data.authorization.id_token,
        user: data.user || null
      });
      
      if (response.data.status === 'success') {
        localStorage.setItem("user", JSON.stringify(response.data.data.user));
        navigate(from || '/', { replace: true });
      }
    } catch (err) {
      setErrors({
        root: err.response?.data?.message || 'Apple signup failed'
      });
    } finally {
      setSocialProcessing(null);
    }
  };

  return (
    <div className='pb-5'>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-[10px] py-4 lg:py-10 text-[14px] lg:px-0 px-4">
          <Link to="/">Home</Link>
          <span>{">"}</span>
          <Link to="/">Buy on Hezmart</Link>
          <span>{">"}</span>
          <strong>Register</strong>
        </div>

        <div className="px-4 mt-9 border-2 border-gray-200 rounded-lg bg-white py-5">
          <form onSubmit={handleSubmit}>
            <h1 className="text-xl text-[#111111] font-semibold mb-6">
              Personal Information
            </h1>

            {errors.root && (
              <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-lg">
                {errors.root}
              </div>
            )}

            {/* Social Auth Buttons */}
            <div className="mb-6">
              <div className="grid grid-cols-2 gap-3">
               <div className="col-span-2 flex justify-center">
                 <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  render={(renderProps) => (
                    <button
                      onClick={renderProps.onClick}
                      disabled={renderProps.disabled || !!socialProcessing}
                      type="button"
                      className="cursor-pointer w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <FaGoogle className="text-red-500 mr-2" />
                      {socialProcessing === 'google' ? 'Processing...' : 'Google'}
                    </button>
                  )}
                />
               </div>

                {/* <AppleSignin
                  authOptions={{
                    clientId: import.meta.env.REACT_APP_APPLE_CLIENT_ID,
                    scope: 'email name',
                    redirectURI: `${window.location.origin}/auth/apple/callback`,
                    state: 'state',
                    usePopup: true,
                  }}
                  onSuccess={handleAppleLogin}
                  onError={(error) => {
                    console.log('Apple error:', error)
                    setErrors({ root: 'Apple signup failed' });
                    setSocialProcessing(null);
                  }}
                  render={(props) => (
                    <button
                      {...props}
                      disabled={!!socialProcessing}
                      type="button"
                      className="cursor-pointer w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <FaApple className="text-black mr-2" />
                      {socialProcessing === 'apple' ? 'Processing...' : 'Apple'}
                    </button>
                  )}
                /> */}
              </div>

              <div className="relative mt-6 mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or register with email
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-5">
              <InputField
                label="First Name"
                name="firstName"
                onChange={handleChange}
                placeholder="Enter First name"
                error={errors.firstName}
                classNames="mb-5 lg:mb-0"
              />

              <InputField
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter Last name"
                error={errors.lastName}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-5 mt-5">
              <InputField
                label="Phone Number"
                name="primaryPhone"
                value={formData.primaryPhone}
                onChange={handleChange}
                placeholder="Enter phone number"
                type="tel"
                error={errors.primaryPhone}
                classNames="mb-5 lg:mb-0"
              />

              <InputField
                label="Email Address"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                type="email"
                error={errors.email}
              />
            </div>

            <div className="mt-5">
              <InputField
                label="Primary Address"
                name="primaryAddress"
                value={formData.primaryAddress}
                onChange={handleChange}
                placeholder="Address"
                as="textarea"
                error={errors.primaryAddress}
              />
            </div>

            <div className="mt-5">
              <SelectField
                name="state"
                label="State"
                value={formData.state}
                onChange={handleChange}
                options={nigerianStates}
                error={errors.state}
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-5 mt-5">
              <InputField
                label="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                type="password"
                error={errors.password}
                classNames="mb-5 lg:mb-0"
              />

              <InputField
                label="Confirm Password"
                name="passwordConfirm"
                value={formData.passwordConfirm}
                onChange={handleChange}
                placeholder="Confirm password"
                type="password"
                error={errors.passwordConfirm}
              />
            </div>
            <div className="mt-6">
              <Button type="submit" disabled={isSubmitting} isLoading={isSubmitting} loadingText="Processing...">
                Create Account
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CustomerRegister;