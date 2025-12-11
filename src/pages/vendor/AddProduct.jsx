import { useEffect, useState, useRef } from "react";
import Button from "../../components/common/Button";
import InputField from "../../components/common/InputField";
import SelectField from "../../components/common/SelectField";
import { toast } from 'react-toastify';
import axios from "../../lib/axios";
import { FiEdit, FiX, FiImage, FiUploadCloud } from 'react-icons/fi';

const AddProduct = () => {
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState();
    const [hasMultipleOptions, setHasMultipleOptions] = useState(false);
    const [isDigitalItem, setIsDigitalItem] = useState(true);
    const [tags, setTags] = useState([]);
    const [newTag, setNewTag] = useState("");

    // Options state management
    const [options, setOptions] = useState([]);
    const [newOptionName, setNewOptionName] = useState("");

    // Categories state
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedSubcategory, setSelectedSubcategory] = useState("");
    const [availableSubcategories, setAvailableSubcategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);

    // Image previews and File state
    const [coverImagePreview, setCoverImagePreview] = useState(null);
    const [coverImageFile, setCoverImageFile] = useState(null);

    const [additionalImagesPreview, setAdditionalImagesPreview] = useState([]);
    const [additionalImageFiles, setAdditionalImageFiles] = useState([]);

    const coverImageRef = useRef(null);
    const additionalImagesRef = useRef(null);

    // Fetch categories from API
    const fetchCategories = async () => {
        try {
            setLoadingCategories(true);
            const res = await axios.get('api/v1/categories?fields=name,id');

            if (res.data.status === 'success') {
                setCategories(res.data.data.categories);
            }
        } catch (error) {
            toast.error("Failed to load categories");
            console.error("Error fetching categories:", error);
        } finally {
            setLoadingCategories(false);
        }
    };

    // Handle Cover Image
    const handleCoverImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCoverImageFile(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setCoverImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeCoverImage = () => {
        setCoverImagePreview(null);
        setCoverImageFile(null);
        if (coverImageRef.current) {
            coverImageRef.current.value = '';
        }
    };

    // Handle Additional Images
    const handleAdditionalImagesChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setAdditionalImageFiles(prevFiles => [...prevFiles, ...files]);

            files.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setAdditionalImagesPreview(prevPreviews => [...prevPreviews, reader.result]);
                };
                reader.readAsDataURL(file);
            });
        }

        if (additionalImagesRef.current) {
            additionalImagesRef.current.value = '';
        }
    };

    const removeAdditionalImage = (index) => {
        setAdditionalImagesPreview(prev => prev.filter((_, i) => i !== index));
        setAdditionalImageFiles(prev => prev.filter((_, i) => i !== index));
    };

    // Handle category changes
    const handleCategoryChange = (categoryId) => {
        const category = categories.find(cat => cat.id == categoryId);
        if (category) {
            setSelectedCategory(categoryId);
            setAvailableSubcategories(category.subcategories || []);
            setSelectedSubcategory("");
        }
    };

    // Handle tag operations
    const handleAddTag = () => {
        if (newTag.trim()) {
            setTags([...tags, newTag.trim()]);
            setNewTag("");
        }
    };

    const handleRemoveTag = (index) => {
        const updatedTags = [...tags];
        updatedTags.splice(index, 1);
        setTags(updatedTags);
    };

    // Handle option operations
    const handleAddOptionValue = (optionIndex) => {
        const value = options[optionIndex].newValue.trim();
        if (!value) return;

        const updatedOptions = [...options];
        if (!updatedOptions[optionIndex].values.includes(value)) {
            updatedOptions[optionIndex].values.push(value);
            updatedOptions[optionIndex].newValue = "";
            setOptions(updatedOptions);
        }
    };

    const handleRemoveOptionValue = (optionIndex, valueIndex) => {
        const updatedOptions = [...options];
        updatedOptions[optionIndex].values.splice(valueIndex, 1);
        setOptions(updatedOptions);
    };

    const handleAddOption = () => {
        if (!newOptionName.trim()) return;

        const optionExists = options.some(opt =>
            opt.name.toLowerCase() === newOptionName.toLowerCase()
        );

        if (!optionExists) {
            setOptions([...options, {
                name: newOptionName.trim(),
                values: [],
                newValue: ""
            }]);
            setNewOptionName("");
        }
    };

    const handleRemoveOption = (optionIndex) => {
        const updatedOptions = [...options];
        updatedOptions.splice(optionIndex, 1);
        setOptions(updatedOptions);
    };

    // Reset form after successful submission
    const resetForm = () => {
        setTags([]);
        setNewTag("");
        setOptions([]);
        setNewOptionName("");
        setSelectedCategory("");
        setSelectedSubcategory("");

        setCoverImagePreview(null);
        setCoverImageFile(null);
        setAdditionalImagesPreview([]);
        setAdditionalImageFiles([]);

        setHasMultipleOptions(false);
        setIsDigitalItem(true);

        if (coverImageRef.current) coverImageRef.current.value = '';
        if (additionalImagesRef.current) additionalImagesRef.current.value = '';

        const form = document.querySelector('form');
        if (form) form.reset();
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const submit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        try {
            let formData = new FormData(e.target);

            formData.delete('coverImage');
            formData.delete('images');

            formData.append('tags', JSON.stringify(tags));
            formData.append('options', JSON.stringify(options));
            formData.append('categoryId', selectedCategory);
            if (selectedSubcategory) {
                formData.append('subCategoryId', selectedSubcategory);
            }

            if (coverImageFile) {
                formData.append('coverImage', coverImageFile);
            }

            additionalImageFiles.forEach((file) => {
                formData.append('images', file);
            });

            const response = await axios.post('api/v1/products', formData);
            if (response.data.status === 'success') {
                toast.success("Product added successfully");
                resetForm();
            }
        } catch (err) {
            if (err.response) {
                if (err.response.data.message) {
                    setMessage(err.response.data.message);
                }
                if (err.response.data.errors) {
                    setErrors(err.response.data.errors);
                    if (err.response.data.errors.userId) {
                        toast.error("Product must belong to a vendor.");
                    }
                }
            } else {
                toast.error("An error occurred. Please try again.");
            }
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="min-h-screen sm:p-6 flex flex-col items-center">
            
            {/* Header */}
            <div className="w-full mb-8">
                <h1 className="text-3xl font-bold text-gray-800 text-center font-[poppins]">Add New Product</h1>
            </div>

            {/* Status error message */}
            {message && (
                <div className="w-full max-w-3xl mb-4 p-3 bg-red-50 text-red-600 rounded-md border border-red-100">
                    {message}
                </div>
            )}

            {/* Product Form - Constrained width */}
            <form className="w-full max-w-xl space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-gray-100" onSubmit={submit}>

                {/* Information Section */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Information</h2>
                    <div className="space-y-4">
                        <InputField
                            label="Product Name"
                            placeholder="Summer T-Shirt"
                            name="name"
                            error={errors.name}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField
                                label="Product Quantity"
                                placeholder="e.g 20"
                                name="stockQuantity"
                                type="number"
                                error={errors.stockQuantity}
                            />
                             <InputField
                                label="Weight (kg)"
                                placeholder="0.5"
                                name="weight"
                                type="number"
                                error={errors.weight}
                                isRequired={false}
                            />
                        </div>
                        <InputField
                            label="Product Description"
                            placeholder="Product description"
                            name="description"
                            as="textarea"
                            error={errors.description}
                        />
                    </div>
                </div>

                <hr className="border-gray-100" />

                {/* Categories Section */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Categories</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <SelectField
                            label="Main Category"
                            options={[
                                { value: "", label: "Select a category" },
                                ...categories.map(category => ({
                                    value: category.id,
                                    label: category.name
                                }))
                            ]}
                            onChange={(e) => handleCategoryChange(e.target.value)}
                            value={selectedCategory}
                            disabled={loadingCategories}
                            error={errors.categoryId}
                        />

                        <SelectField
                            label="Subcategory"
                            options={[
                                { value: "", label: selectedCategory ? "Select a subcategory" : "Select main category first" },
                                ...availableSubcategories.map(sub => ({
                                    value: sub.id,
                                    label: sub.name
                                }))
                            ]}
                            onChange={(e) => setSelectedSubcategory(e.target.value)}
                            value={selectedSubcategory}
                            disabled={!selectedCategory}
                            error={errors.subCategoryId}
                        />
                    </div>
                </div>

                <hr className="border-gray-100" />

                {/* Images Section */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Images</h2>
                    <div className="space-y-6">
                        {/* Cover Image */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">Cover Image</label>

                            <input
                                type="file"
                                id="cover-image"
                                className="hidden"
                                name="coverImage"
                                accept="image/*"
                                onChange={handleCoverImageChange}
                                ref={coverImageRef}
                            />

                            {coverImagePreview ? (
                                <div className="relative w-full max-w-sm mx-auto group">
                                    <img
                                        src={coverImagePreview}
                                        alt="Cover preview"
                                        className="w-full h-auto max-h-[400px] object-cover rounded-xl border border-gray-200 shadow-sm"
                                    />
                                    {/* Icons always visible top right */}
                                    <div className="absolute -top-2 -right-2 flex gap-2">
                                        <button
                                            type="button"
                                            onClick={removeCoverImage}
                                            className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center 
                                            justify-center hover:bg-red-600 shadow-md transition-all"
                                            title="Remove Cover Image"
                                        >
                                            <FiX className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <label
                                    htmlFor="cover-image"
                                    className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center hover:bg-gray-50 hover:border-primary-dark transition-all cursor-pointer"
                                >
                                    <FiImage className="w-12 h-12 text-gray-400 mb-3" />
                                    <span className="text-primary-dark font-medium">
                                        + Add Cover Image
                                    </span>
                                    {errors.coverImage && (
                                        <p className="mt-2 text-sm text-red-500">{errors.coverImage}</p>
                                    )}
                                </label>
                            )}
                        </div>

                        {/* Additional Images */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Additional Images</label>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {additionalImagesPreview.map((preview, index) => (
                                    <div key={index} className="relative aspect-square">
                                        <img
                                            src={preview}
                                            alt={`Preview ${index}`}
                                            className="w-full h-full object-cover rounded-lg border border-gray-200"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeAdditionalImage(index)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 shadow-md"
                                        >
                                            <FiX className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}

                                <div className="aspect-square border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                    <input
                                        type="file"
                                        id="additional-images"
                                        className="hidden"
                                        multiple
                                        name="images"
                                        accept="image/*"
                                        onChange={handleAdditionalImagesChange}
                                        ref={additionalImagesRef}
                                    />
                                    <label
                                        htmlFor="additional-images"
                                        className="cursor-pointer w-full h-full flex flex-col items-center justify-center text-gray-400 hover:text-primary-dark"
                                    >
                                        <FiUploadCloud className="w-8 h-8 mb-1" />
                                        <span className="text-xs font-medium">+ Add</span>
                                    </label>
                                </div>
                            </div>
                            {errors.images && (
                                <p className="mt-1 text-sm text-red-500">{errors.images}</p>
                            )}
                        </div>
                    </div>
                </div>

                <hr className="border-gray-100" />

                {/* Tags Section */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Tags</h2>
                    <div>
                        <div className="flex gap-2 mb-3">
                            <input
                                label='Tag'
                                placeholder="Enter tag name"
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-light focus:border-primary-dark outline-none transition-all"
                            />
                            <button
                                type="button"
                                onClick={handleAddTag}
                                className="px-6 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                Add
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center border border-gray-200"
                                >
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveTag(index)}
                                        className="ml-2 text-gray-500 hover:text-red-500"
                                    >
                                        <FiX className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <hr className="border-gray-100" />

                {/* Price Section */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Price</h2>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField
                                label="Product Price"
                                placeholder="Enter price"
                                name="price"
                                type="number"
                                error={errors.price}
                            />
                            <InputField
                                label="Discount Price"
                                placeholder="Price at Discount"
                                name="discountPrice"
                                type="number"
                                error={errors.discountPrice}
                                isRequired={false}
                            />
                        </div>
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                name="has_tax"
                                className="h-4 w-4 text-primary-dark rounded focus:ring-primary-dark"
                            />
                            <span className="text-gray-700">Add tax for this product</span>
                        </label>
                    </div>
                </div>

                <hr className="border-gray-100" />

                {/* Variant Options */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-800">Different Options</h2>
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={hasMultipleOptions}
                                onChange={() => setHasMultipleOptions(!hasMultipleOptions)}
                                className="h-4 w-4 text-primary-dark rounded focus:ring-primary-dark"
                            />
                            <span className="text-gray-700 font-medium">This product has multiple options</span>
                        </label>
                    </div>

                    {hasMultipleOptions && (
                        <div className="space-y-6 bg-gray-50 p-6 rounded-xl border border-gray-100">
                            <div className="flex gap-4 items-end">
                                <div className="flex-1">
                                    <InputField
                                        label="New Option Name"
                                        placeholder="e.g. Color, Material"
                                        value={newOptionName}
                                        onChange={(e) => setNewOptionName(e.target.value)}
                                        isRequired={false}
                                    />
                                </div>
                                <Button
                                    type="button"
                                    onClick={handleAddOption}
                                    className="mb-[2px]"
                                >
                                    Add Option
                                </Button>
                            </div>

                            <div className="space-y-4">
                                {options.map((option, optionIndex) => (
                                    <div key={optionIndex} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                                        <div className="flex justify-between items-center mb-3">
                                            <h4 className="text-md font-semibold text-gray-800">{option.name}</h4>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveOption(optionIndex)}
                                                className="text-red-500 hover:text-red-700 text-sm font-medium"
                                            >
                                                Remove Option
                                            </button>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex gap-2">
                                                <InputField
                                                    placeholder={`Enter ${option.name} value`}
                                                    value={option.newValue}
                                                    onChange={(e) => {
                                                        const updatedOptions = [...options];
                                                        updatedOptions[optionIndex].newValue = e.target.value;
                                                        setOptions(updatedOptions);
                                                    }}
                                                    onKeyDown={(e) => e.key === "Enter" && handleAddOptionValue(optionIndex)}
                                                    isRequired={false}
                                                    className="flex-1"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleAddOptionValue(optionIndex)}
                                                    className="px-4 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
                                                >
                                                    Add
                                                </button>
                                            </div>

                                            <div className="flex flex-wrap gap-2">
                                                {option.values.map((value, valueIndex) => (
                                                    <span
                                                        key={valueIndex}
                                                        className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center border border-gray-200"
                                                    >
                                                        {value}
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveOptionValue(optionIndex, valueIndex)}
                                                            className="ml-2 text-gray-400 hover:text-red-500"
                                                        >
                                                            <FiX className="w-3 h-3" />
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <hr className="border-gray-100" />

                {/* Shipping Section */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Shipping</h2>
                    <div className="space-y-4">
                        <SelectField
                            label="Shipping Origin"
                            name="country"
                            options={["Select Country", "USA", "UK", "Canada", "Australia", "Nigeria"]}
                            error={errors.country}
                        />
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                name="is_digital"
                                checked={isDigitalItem}
                                onChange={() => setIsDigitalItem(!isDigitalItem)}
                                className="h-4 w-4 text-primary-dark rounded focus:ring-primary-dark"
                            />
                            <span className="text-gray-700">This is a digital item</span>
                        </label>
                    </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-4 pt-4">
                    <button
                        type="button"
                        className="px-6 py-2.5 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                        onClick={resetForm}
                    >
                        Cancel
                    </button>
                    <Button type="submit" disabled={processing} iconPosition="right" className="px-8 py-2.5 rounded-xl">
                        {processing ? "Saving..." : "Save Product"}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default AddProduct;
