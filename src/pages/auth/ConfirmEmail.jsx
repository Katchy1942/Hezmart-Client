import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../../lib/axios";
import Button from "../../components/common/Button";
import { toast } from 'react-toastify';
import { FiMail } from "react-icons/fi";

const ConfirmEmail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);

    const from = location.state?.from || "/";
    const email = location.state?.email || queryParams.get("email");

    const [otp, setOtp] = useState(new Array(4).fill(""));
    const [activeOtpIndex, setActiveOtpIndex] = useState(0);
    const inputRef = useRef(null);

    const [serverError, setServerError] = useState("");
    const [resendStatus, setResendStatus] = useState("");
    const [resending, setResending] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleOnChange = ({ target }, index) => {
        const { value } = target;
        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        if (!value) setActiveOtpIndex(index - 1);
        else setActiveOtpIndex(index + 1);
    };

    const handleOnKeyDown = ({ key }, index) => {
        if (key === "Backspace") {
            if (index === 0) return;
            setActiveOtpIndex(index - 1);
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").slice(0, 4).split("");
        if (pastedData.length > 0) {
            const newOtp = [...otp];
            pastedData.forEach((val, index) => {
                if (index < 4) newOtp[index] = val;
            });
            setOtp(newOtp);
            setActiveOtpIndex(4);
        }
    };

    useEffect(() => {
        inputRef.current?.focus();
    }, [activeOtpIndex]);

    const onSubmit = async (e) => {
        e.preventDefault();
        setServerError("");
        const code = otp.join("");

        if (code.length !== 4) {
            setServerError("Please enter the complete 4-digit code.");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await axios.post("/api/v1/users/verify_email", {
                code,
            });

            if (response.data.status === "success") {
                localStorage.setItem("user", JSON.stringify(response.data.data.user));
                const role = response.data.data?.user?.role;
                toast.success("Email Verified Successfully.");
                
                if (role === "vendor") {
                    setTimeout(() => {
                        navigate(from, { replace: true });
                    }, 3000);
                } else if (role === "customer") {
                    setTimeout(() => {
                        navigate(from, { replace: true });
                    }, 3000);
                } else {
                    navigate("/");
                }
                
                await axios.post('api/v1/cart/merge');
            }
        } catch (err) {
            const msg = err.response?.data?.message || "Something went wrong.";
            setServerError(msg);
            setOtp(new Array(4).fill(""));
            setActiveOtpIndex(0);
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
        <div className="min-h-screen flex justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="px-8 pt-8 pb-6 text-center">
                    <div className="mx-auto h-20 w-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                        <FiMail className="h-8 w-8" />
                    </div>
                    
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight font-serif mb-2">
                        Verify your email
                    </h2>
                    
                    <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                        We've sent a 4-digit verification code to <br />
                        <span className="font-semibold text-gray-900">{email}</span>
                    </p>

                    <form onSubmit={onSubmit}>
                        <div className="flex justify-center gap-3 mb-8">
                            {otp.map((_, index) => (
                                <input
                                    key={index}
                                    ref={index === activeOtpIndex ? inputRef : null}
                                    type="number"
                                    className={`w-14 h-14 border-2 rounded-lg text-center text-2xl font-bold 
                                        text-gray-700 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 
                                        focus:outline-none transition-all duration-200 spin-button-none ${
                                        serverError ? "border-red-300 bg-red-50" : "border-gray-200"
                                    }`}
                                    onChange={(e) => handleOnChange(e, index)}
                                    onKeyDown={(e) => handleOnKeyDown(e, index)}
                                    onPaste={handlePaste}
                                    value={otp[index]}
                                />
                            ))}
                        </div>

                        {serverError && (
                            <div className="bg-red-50 text-red-600 text-sm py-2 px-3 rounded-md mb-6 animate-pulse">
                                {serverError}
                            </div>
                        )}

                        <div className="w-full">
                            <Button
                                type="submit"
                                disabled={isSubmitting || otp.join("").length !== 4}
                                isLoading={isSubmitting}
                                loadingText="Verifying..."
                                className="w-full py-3 text-base font-medium shadow-md hover:shadow-lg transition-all"
                            >
                                Verify Email
                            </Button>
                        </div>
                    </form>
                </div>

                <div className="bg-gray-50 px-8 py-6 border-t border-gray-100">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="text-sm text-gray-600">
                            Didn't receive the email?{" "}
                            <button
                                type="button"
                                onClick={resendEmail}
                                disabled={resending}
                                className="font-semibold text-blue-600 hover:text-blue-500 
                                transition-colors disabled:opacity-50 disabled:cursor-not-allowed ml-1"
                            >
                                {resending ? "Sending..." : "Click to resend"}
                            </button>
                        </div>
                        
                        {resendStatus && (
                            <p className={`text-xs font-medium ${resendStatus.includes("success") ? "text-green-600" : "text-red-500"}`}>
                                {resendStatus}
                            </p>
                        )}
                        
                        <div className="w-full pt-4 px-4">
                            <p className="text-xs text-gray-500 text-center leading-relaxed">
                                If you don't see the email, please check your spam folder, verify the address spelling, or ensure no firewalls are blocking us.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            
            <style>{`
                .spin-button-none::-webkit-outer-spin-button,
                .spin-button-none::-webkit-inner-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }
                .spin-button-none {
                    -moz-appearance: textfield;
                }
            `}</style>
        </div>
    );
};

export default ConfirmEmail;