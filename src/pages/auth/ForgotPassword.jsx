import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../lib/axios";
import InputField from "../../components/common/InputField";
import Button from "../../components/common/Button";
import { FiMail } from "react-icons/fi";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const[processing, setProcessing] = useState(false)
    const [errors, setErrors] = useState({email:''})
    const[message, setMessage] = useState()
    const[status, setStatus] = useState('')

    const submit = async(e) => {
        e.preventDefault();
        setProcessing(true)
        
        try {
            let data = new FormData(e.target)
            let jsonData = Object.fromEntries(data);
            const response = await axios.post('api/v1/users/forgotPassword', jsonData);
            if(response.data.status == 'success'){
                setMessage(response.data.message)
            };

            setProcessing(false);
        } catch (err) {
            setProcessing(false)
        
            if (err && !err.response) {
                alert(err);
            } else { 
                const errors = {};
                if(err.response.data.message){
                    setStatus(err.response.data.message)
                }

                if(err.response.data.errors){
                    err.response.data.errors.forEach(el =>{
                        for(let key in el){
                            errors[key] = el[key]
                        }
                    })
                    setErrors(errors)
                }        
            }
        }
    };
 

    return (
        <div className="min-h-screen flex justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md">
                <form
                    onSubmit={submit}
                    className="bg-white rounded-2xl border border-[#D9E1EC] shadow-sm p-8 text-center"
                >
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight font-serif mb-2">
                        Forgot Password?
                    </h2>

                    <p className="text-xs text-gray-500 leading-relaxed mb-4">
                        Enter your email address and we'll send you a password reset link.
                    </p>

                    {message && <div className="mb-7 font-medium text-center text-sm text-green-600">{message}</div>}
                    {status && <div className="mb-7 font-medium text-center text-sm text-red-600">{status}</div>}

                    <div className="mb-4">
                        <InputField
                            type="email"
                            name="email"
                            label="Email Address"
                            placeholder="Enter your email"
                            icon={<FiMail className="text-gray-400" />}
                        />
                    </div>

                    <div className="mb-6">
                        <Link
                            to="/login"
                            className="text-sm text-blue-600 hover:text-blue-800 underline"
                        >
                            Back to Sign in
                        </Link>
                    </div>

                    <Button
                        type="submit"
                        disabled={processing}
                        isLoading={processing}
                        loadingText="Processing..."
                        className="w-full py-3 font-medium shadow-md hover:shadow-lg transition-all"
                    >
                        Send Link
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;