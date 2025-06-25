import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "../../lib/axios";
import InputField from "../../components/common/InputField";
import SelectField from "../../components/common/SelectField";
import Button from "../../components/common/Button";

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
    role:'customer'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from; // Get the original redirect path

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

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-5">
                        <InputField
                            label="First Name"
                            name="firstName"
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
                            options={[
                            { value: "Abia", label: "Abia" },
                            { value: "Adamawa", label: "Adamawa" },
                            { value: "Akwa Ibom", label: "Akwa Ibom" },
                            ]}
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
