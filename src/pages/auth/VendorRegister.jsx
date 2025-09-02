import { useState, useEffect, useRef } from "react";
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
    email: "",
    ninNumber: "",
    primaryAddress: "",
    state: "",
    password: "",
    passwordConfirm: "",
    businessName: "",
    businessCategoryId: "",
    businessLogo: ''
  });

  const nigerianStates = [
    "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", 
    "Benue", "Borno", "Cross River", "Delta", "Ebonyi", "Edo", 
    "Ekiti", "Rivers", "Enugu", "FCT", "Gombe", "Imo", "Jigawa", 
    "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", 
    "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", 
    "Sokoto", "Taraba", "Yobe", "Zamfara"
  ];

  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const res = await axios.get('api/v1/categories?fields=name,id,icon');
      setCategories(res.data.data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        businessLogo: file,
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    setFormData((prev) => ({
      ...prev,
      businessLogo: '',
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const formDataToSend = new FormData(e.target);
    // Append the file if it exists
    if (formData.businessLogo) {
      formDataToSend.append('businessLogo', formData.businessLogo);
    }

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

      <div className="px-4 mt-9 border-2 border-gray-200 bg-white rounded-lg py-5">
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
              value={formData.firstName}
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-5 mt-5">
            <InputField
              label="NIN"
              name="ninNumber"
              value={formData.ninNumber}
              onChange={handleChange}
              placeholder="Enter your nin"
              error={errors.ninNumber}
              classNames="mb-5 lg:mb-0"
            />
            <SelectField
              name="state"
              label="State"
              value={formData.state}
              onChange={handleChange}
              options={nigerianStates}
              error={errors.state}
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
                    classNames="mb-5 lg:mb-0"
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
                  {previewImage ? (
                    <div className="relative w-48 h-48">
                      <img 
                        src={previewImage} 
                        alt="Business logo preview" 
                        className="w-full h-full object-cover rounded-2xl border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                        aria-label="Remove image"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <label
                      htmlFor="image-input"
                      className="w-48 h-48 border-gray-400 bg-[#E3E3E3] flex justify-center items-center 
                      text-gray-500 text-3xl font-semibold cursor-pointer rounded-2xl border-solid border-1
                      hover:bg-gray-200 transition-colors duration-200"
                    >
                      +
                      <input
                        id="image-input"
                        name="businessLogo"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        type="file"
                        className="hidden"
                        accept="image/png, image/jpg, image/jpeg, image/webp, image/svg+xml"
                      />
                    </label>
                  )}
                  {errors.businessLogo && (
                    <p className="mt-1 text-sm text-red-600">{errors.businessLogo}</p>
                  )}
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