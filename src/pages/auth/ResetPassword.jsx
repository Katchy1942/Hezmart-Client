import { useState } from "react";
import { useNavigate} from "react-router-dom";
import axios from "../../lib/axios";
import InputField from "../../components/common/InputField";
import Button from "../../components/common/Button";
import { FaLock } from "react-icons/fa";
import { toast } from 'react-toastify';

const ResetPassword = () => {
    const[processing, setProcessing] = useState(false)
    const [errors, setErrors] = useState({email:''})
    const[message, setMessage] = useState()
    const navigate = useNavigate();

    const searchParams = new URLSearchParams(document.location.search)
    const token = searchParams.get('token')
    const submit = async(e) => {
        e.preventDefault();
        setProcessing(true)
       
        try {
            let data = new FormData(e.target)
            let jsonData = Object.fromEntries(data);
            const response = await axios.patch(`api/v1/users/resetPassword/${token}`, jsonData);
            if(response.data.status === 'success'){
                toast.success("Password Reset Successfully.");
                
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            }
            setProcessing(false)
        } catch (err) {
            console.log(err)
            setProcessing(false)
        
            if (err && !err.response) {
              alert(err);
            } else { 
                if(err.response.data.message & !err.response.data.errors){
                    setMessage(err.response.data.message)
                }
              setErrors(err.response.data.errors)
            }
        }
    };


    return (
        <div className="min-h-screen flex justify-center items-center py-10 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg">
                <form
                    onSubmit={submit}
                    className="bg-white rounded-xl border border-[#D9E1EC] shadow p-6 sm:p-8 lg:p-10 flex flex-col gap-6"
                >
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-center font-serif text-gray-900">
                        Reset Your Password
                    </h1>

                    {message && (
                        <div className="font-medium text-sm text-red-600 text-center">
                            {message}
                        </div>
                    )}

                    <div className="flex flex-col gap-4">
                        <InputField
                            type="password"
                            name="password"
                            label="Password"
                            placeholder="Enter your password"
                            error={errors.password}
                            icon={<FaLock className="text-gray-400" />}
                        />

                        <InputField
                            type="password"
                            name="passwordConfirm"
                            label="Confirm Password"
                            placeholder="Confirm your password"
                            error={errors.passwordConfirm}
                            icon={<FaLock className="text-gray-400" />}
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={processing}
                        isLoading={processing}
                        loadingText="Resetting..."
                        className="w-full py-3 font-medium"
                    >
                        Reset Password
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;