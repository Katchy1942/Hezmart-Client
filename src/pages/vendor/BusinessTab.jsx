import { useState, useRef } from "react";
import InputField from "../../components/common/InputField";
import SelectField from "../../components/common/SelectField";
import Button from "../../components/common/Button";

const BusinessTab = ({ 
    user, 
    updateBusinessInfo, 
    errors, 
    isUpdating, 
    categories, 
    loadingCategories 
}) => {
    const [formData, setFormData] = useState({
        businessName: user.businessName || "",
        businessCategoryId: user.businessCategoryId || "",
        businessLogo: null
    });
    const [previewImage, setPreviewImage] = useState(user.businessLogo || null);
    const fileInputRef = useRef(null);

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
            businessLogo: null,
        }));
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await updateBusinessInfo(formData);
        if (success) {
            // Reset form if update was successful
            setFormData(prev => ({...prev, businessLogo: null}));
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Business Information</h2>
            
            {errors.root && (
                <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-lg">
                    {errors.root}
                </div>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-5 gap-y-6">
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
            </div>

            <div className="mt-6">
                <label className="block text-md text-gray-700 mb-2">Business Logo</label>
                {previewImage ? (
                    <div className="relative w-48 h-48 mb-4">
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
                        htmlFor="business-logo-input"
                        className="w-48 h-48 border-gray-400 bg-gray-100 flex justify-center items-center 
                        text-gray-500 text-3xl font-semibold cursor-pointer rounded-2xl border-solid border-2
                        hover:bg-gray-200 transition-colors duration-200 mb-4"
                    >
                        +
                        <input
                            id="business-logo-input"
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
                <p className="text-sm text-gray-500">Upload your business logo (PNG, JPG, JPEG, WEBP, SVG)</p>
            </div>

            <div className="mt-8">
                <Button type="submit" disabled={isUpdating} isLoading={isUpdating} loadingText="Updating...">
                    Update Business Information
                </Button>
            </div>
        </form>
    );
};

export default BusinessTab;