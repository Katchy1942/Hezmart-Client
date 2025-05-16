import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../../lib/axios";
import InputField from "../../components/common/InputField";
import Button from "../../components/common/Button";
import { mail } from "../../assets/images";
import { toast } from 'react-toastify';

const ConfirmEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // const queryParams = new URLSearchParams(location.search);
  // const email = queryParams.get("email");

   // Get the redirect path and email from state
   const from = location.state?.from || "/";
   const email = location.state?.email;

  const [code, setCode] = useState("");
  const [serverError, setServerError] = useState("");
  const [resendStatus, setResendStatus] = useState("");
  const [resending, setResending] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validateCode = () => {
    const newErrors = {};
    if (!code) {
      newErrors.code = "Verification code is required";
    } else if (code.length !== 4) {
      newErrors.code = "Verification code must be exactly 4 digits";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    
    if (!validateCode()) return;

    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/v1/users/verify_email", {
        code,
      });

      if (response.data.status === "success") {
        // Store user data 
        localStorage.setItem("user", JSON.stringify(response.data.data.user));
        const role = response.data.data?.user?.role;
        toast.success("Email Verified Successfully.");
        // Redirect based on user role or purpose
        if (role === "vendor") {
          setTimeout(() => {
            navigate("/pending_verification");
        }, 3000);
         
        } else if (role === "customer") {
          setTimeout(() => {
            navigate(from, { replace: true });
        }, 3000);
        } else {
          navigate("/"); // fallback route
        }
        //Merge cart
        await axios.post('api/v1/cart/merge')
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Something went wrong.";
      setServerError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resendEmail = async () => {
    if (!email) return;
    setResendStatus("");
    setResending(true);
    try {
      const response = await axios.post("/api/v1/users/resend_verification", {
        email,
      });

      if (response.data.status === "success") {
        setResendStatus("Verification email sent successfully.");
      } else {
        setResendStatus("Unable to resend verification email.");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Error resending email.";
      setResendStatus(msg);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="bg-[#F5F6FA]  flex justify-center items-center py-10">
      <form
        onSubmit={onSubmit}
        className="bg-white max-w-135 border-1 rounded border-solid border-[#D9E1EC] shadow-sm
        lg:px-15 py-6 px-4"
      >
        <img src={mail} alt="Mail Icon" className="block mx-auto h-20" />
        <h1 className="text-2xl text-[#131523] font-bold text-center mb-2">
          Almost There!
        </h1>

        <p className="text-sm text-gray-600 mb-4 text-center">
          We've sent a four-digit verification code to{" "}
          <strong>{email}</strong>. Please check your inbox.
        </p>

        {serverError && (
          <p className="text-red-500 text-sm text-center mb-4">
            {serverError}
          </p>
        )}

        <InputField
          name="code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter verification code"
          error={errors.code}
        />

       <div className="flex justify-center mt-2">
        <Button
          type="submit"
          disabled={isSubmitting}
          isLoading={isSubmitting}
          loadingText="Processing..."
        >
          Confirm Email
        </Button>
       </div>

        <hr className="text-[#D7DBEC] my-8" />

        <div className="text-sm text-center text-gray-600 mt-4">
          Didn't get an email?{" "}
          <button
            type="button"
            onClick={resendEmail}
            disabled={resending}
            className="text-blue-500 underline cursor-pointer disabled:text-gray-400"
          >
            {resending ? "Resending..." : "Resend email"}
          </button>
          {resendStatus && (
            <p className="mt-2 text-xs text-green-600">{resendStatus}</p>
          )}
        </div>

        <ul className="text-sm text-gray-600 mt-4 list-disc pl-5">
          <li>Make sure you've entered your email correctly.</li>
          <li>Check your spam folder.</li>
          <li>Make sure the email isn't blocked by firewalls or filters.</li>
        </ul>
      </form>
    </div>
  );
};

export default ConfirmEmail;