import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link, useLocation } from "react-router-dom";
import axios from "../../lib/axios";
import InputField from "../../components/common/InputField";
import Button from "../../components/common/Button";
import { FaGoogle, FaApple } from "react-icons/fa";
import { FiMail } from "react-icons/fi";
import { FaLock } from "react-icons/fa";
import { GoogleLogin } from '@react-oauth/google';
import AppleSignin from 'react-apple-signin-auth';

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const pathname = searchParams.get("redirectTo") || location.state?.from || null;
  const message = searchParams.get("message") || null;
  const [processing, setProcessing] = useState(false);
  const [socialProcessing, setSocialProcessing] = useState(null);
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

  const handleSuccessfulLogin = async (response) => {
    await axios.post('api/v1/cart/merge');
    localStorage.setItem("user", JSON.stringify(response.data.data.user));
    if (rememberMe) {
      localStorage.setItem("rememberMe", "true");
    } else {
      localStorage.removeItem("rememberMe");
    }

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
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setSocialProcessing('google');
    try {
      const response = await axios.post('api/v1/users/auth/google', {
        token: credentialResponse.credential
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

  const handleAppleLogin = async (data) => {
    setSocialProcessing('apple');
    try {
      const response = await axios.post('api/v1/auth/apple', {
        token: data.authorization.id_token,
        user: data.user || null
      });
      
      if (response.data.status === 'success') {
        await handleSuccessfulLogin(response);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Apple login failed');
    } finally {
      setSocialProcessing(null);
    }
  };

  return (
    <div className="flex justify-center items-center py-10 bg-[#F5F6FA]">
      <div className="w-full max-w-md">
        <form
          onSubmit={submit}
          className="bg-white rounded-lg border border-[#D9E1EC] shadow-sm p-8"
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
            <p className="text-sm text-gray-600 mt-2">
              Please enter your credentials to login
            </p>
          </div>

          {(error || errorMessage) && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
              {error || errorMessage}
            </div>
          )}

          {/* Moved Social Auth Buttons to the top */}
          <div className="mb-6">
            <div className="grid grid-cols-2 gap-3">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                render={(renderProps) => (
                  <button
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled || !!socialProcessing}
                    className="cursor-pointer w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <FaGoogle className="text-red-500 mr-2" />
                    {socialProcessing === 'google' ? 'Processing...' : 'Google'}
                  </button>
                )}
              />

              <AppleSignin
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
                  setError('Apple login failed');
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
              />
            </div>

            <div className="relative mt-6 mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or login with email
                </span>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <InputField
              type="email"
              name="email"
              label="Email Address"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              icon={<FiMail className="text-gray-400" />}
              required
            />
          </div>

          <div className="mb-4">
            <InputField
              name="password"
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              icon={<FaLock className="text-gray-400" />}
              required
            />
          </div>

          <div className="flex justify-between items-center mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>

            <Link
              to="/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            disabled={processing}
            isLoading={processing}
            loadingText="Logging in..."
            className="w-full py-3"
          >
            Login
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link
              to="/customer-register"
              state={{ from: location.state?.from }}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;