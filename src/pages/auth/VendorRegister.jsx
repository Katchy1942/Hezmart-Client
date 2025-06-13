import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../lib/axios";
import InputField from "../../components/common/InputField";
import SelectField from "../../components/common/SelectField";
import Button from "../../components/common/Button";
import { toast } from 'react-toastify';

const VendorRegister = () => {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    primaryPhone: "",
    secondaryPhone: "",
    email: "",
    ninNumber:"",
    primaryAddress: "",
    secondaryAddress: "",
    city: "",
    region: "",
    country: "",
    password: "",
    passwordConfirm: "",
    businessName:"",
    businessCategoryId:"",
    businessLogo:''

  });

  
    
  
  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const res = await axios.get('api/v1/categories?fields=name,id,icon');
      setCategories(res.data.data.categories);
        
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    }finally{
      setLoadingCategories(false);
    }
  };
  
     
  useEffect(() => {
    fetchCategories();
  }, []);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      businessLogo: file,
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
        navigate(`/confirm-email?email=${encodeURIComponent(formData.email)}`);
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
    <div className="max-w-5xl mx-auto pb-5">
      <div className="flex items-center gap-[10px] py-4 lg:py-10 text-[14px] lg:px-0 px-4">
        <Link to="/">Home</Link>
        <span>{">"}</span>
        <Link to="/sell-on-hezmart">Sell on Hezmart</Link>
        <span>{">"}</span>
        <strong>Register</strong>
      </div>

      <div className="px-4 mt-9 border-2 border-gray-200 rounded-lg py-5">
        <form onSubmit={handleSubmit}>
          <h1 className="text-xl text-[#111111] font-semibold mb-6">
            Personal Information
          </h1>

          {errors.root && (
            <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-lg">
              {errors.root}
            </div>
          )}
        
          <input type="hidden" name="role" value='vendor' />
    

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
              label="Phone Number 2 (Optional)"
              name="secondaryPhone"
              value={formData.secondaryPhone}
              onChange={handleChange}
              placeholder="Enter phone number"
              type="tel"
              error={errors.secondaryPhone}
              isRequired={false}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-5 mt-5">
            <InputField
              label="Email Address"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              type="email"
              error={errors.email}
            />

            <InputField
              label="NIN"
              name="ninNumber"
              value={formData.ninNumber}
              onChange={handleChange}
              placeholder="Enter your nin"
              error={errors.ninNumber}
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
            <InputField
              label="Secondary Address (Optional)"
              name="secondaryAddress"
              value={formData.secondaryAddress}
              onChange={handleChange}
              placeholder="Address"
              as="textarea"
              error={errors.secondaryAddress}
              isRequired={false}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-5 mt-5">
            <InputField
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Enter city"
              error={errors.city}
            />

            <InputField
              label="Region"
              name="region"
              value={formData.region}
              onChange={handleChange}
              placeholder="Enter region"
              error={errors.region}
            />
          </div>

          <div className="mt-5">
            <SelectField
              name="country"
              label="Country"
              value={formData.country}
              onChange={handleChange}
              options={[
                { value: "ng", label: "Nigeria" },
                { value: "us", label: "United States" },
                { value: "uk", label: "United Kingdom" },
              ]}
              error={errors.country}
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

          <div className="my-4">
            <h1 className="text-xl text-[#111111] font-semibold">
                Business information
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-5 mt-5">
                <InputField
                    label="Business Name"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    placeholder="Enter your business name"
                    error={errors.businessName}
                />

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

                 <div className="mt-5">
                    <label htmlFor="" className="block text-md text-[#5A607F] mb-1">Business Logo</label>
                    <label
                        htmlFor="image-input"
                        className="w-48 h-48 border-gray-400 bg-[#E3E3E3] flex justify-center items-center 
                        text-gray-500 text-3xl font-semibold cursor-pointer rounded-2xl border-solid border-1
                        "
                    >
                        +
                        <InputField
                            id='image-input'
                            name="businessLogo" 
                            
                            onChange={handleFileChange}
                            type="file"
                            classNames="hidden"
                            accept="image/png, image/jpg, image/jpeg, image/webp, image/svg+xml"
                            error={errors.businessLogo}
                        />
                    </label>
                </div>
            </div>

            
          </div>

          <div className="mt-6">
            <Button type="submit" disabled={isSubmitting} isLoading={isSubmitting} loadingText="Processing...">
              Create Account
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VendorRegister;
