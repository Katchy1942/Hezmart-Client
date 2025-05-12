import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/common/Button";
import InputField from "../../components/common/InputField";
import SelectField from "../../components/common/SelectField";
import { toast } from 'react-toastify';
import axios from "../../lib/axios";
import { MdAdd } from "react-icons/md";

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

  // Image previews state
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [additionalImagesPreview, setAdditionalImagesPreview] = useState([]);
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

  // Handle image previews
  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdditionalImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const previews = [];
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          previews.push(reader.result);
          if (previews.length === files.length) {
            setAdditionalImagesPreview(prev => [...prev, ...previews]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeCoverImage = () => {
    setCoverImagePreview(null);
    if (coverImageRef.current) {
      coverImageRef.current.value = '';
    }
  };

  const removeAdditionalImage = (index) => {
    const updatedPreviews = [...additionalImagesPreview];
    updatedPreviews.splice(index, 1);
    setAdditionalImagesPreview(updatedPreviews);
    
    // Update the files in the input element
    const dataTransfer = new DataTransfer();
    const files = additionalImagesRef.current.files;
    for (let i = 0; i < files.length; i++) {
      if (i !== index) {
        dataTransfer.items.add(files[i]);
      }
    }
    additionalImagesRef.current.files = dataTransfer.files;
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
  const handleAddTag = (e) => {
    if (e.key === "Enter" && newTag.trim()) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
      e.preventDefault();
    }
  };

  const handleRemoveTag = (index) => {
    const updatedTags = [...tags];
    updatedTags.splice(index, 1);
    setTags(updatedTags);
  };

  // Handle option operations
  const handleAddOptionValue = (optionIndex, e) => {
    if (e.key === "Enter") {
      const value = options[optionIndex].newValue.trim();
      if (!value) return;

      const updatedOptions = [...options];
      if (!updatedOptions[optionIndex].values.includes(value)) {
        updatedOptions[optionIndex].values.push(value);
        updatedOptions[optionIndex].newValue = "";
        setOptions(updatedOptions);
      }
      e.preventDefault();
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
    setAdditionalImagesPreview([]);
    setHasMultipleOptions(false);
    setIsDigitalItem(true);
    
    // Reset file inputs
    if (coverImageRef.current) coverImageRef.current.value = '';
    if (additionalImagesRef.current) additionalImagesRef.current.value = '';
    
    // Reset form fields
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
      formData.append('tags', JSON.stringify(tags));
      formData.append('options', JSON.stringify(options));
      formData.append('categoryId', selectedCategory);
      if (selectedSubcategory) {
        formData.append('subCategoryId', selectedSubcategory);
      }

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
          if(err.response.data.errors.userId){
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
    <div className="">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Add New Product</h1>
        <Link to="/manage/vendor/products" className="cursor-pointer">
          <button className="text-primary-dark font-medium cursor-pointer">Back</button>
        </Link>
      </div>

      {/* Status error message */}
      {message && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md">
          {message}
        </div>
      )}

      {/* Product Form */}
      <form className="space-y-6" onSubmit={submit}>
        {/* Information Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Information</h2>
          <div className="space-y-4">
            <InputField
              label="Product Name"
              placeholder="Summer T-Shirt"
              name="name"
              error={errors.name}
            />
            <InputField
              label="Product Quantity"
              placeholder="e.g 20"
              name="stockQuantity"
              error={errors.stockQuantity}
            />
            <InputField
              label="Product Description"
              placeholder="Product description"
              name="description"
              as="textarea"
              error={errors.description}
            />
          </div>
        </div>

        {/* Categories Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Categories</h2>
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

        {/* Images Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Images</h2>
          <div className="space-y-4">
            {/* Cover Image */}
            <div>
              <label className="block text-md text-[#5A607F] mb-2">Cover Image</label>
              {coverImagePreview && (
                <div className="relative mb-2">
                  <img 
                    src={coverImagePreview} 
                    alt="Cover preview" 
                    className="h-40 w-40 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={removeCoverImage}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ) }
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <input 
                    type="file" 
                    id="cover-image" 
                    className="hidden" 
                    name="coverImage"
                    accept="image/*"
                    onChange={handleCoverImageChange}
                    ref={coverImageRef}
                  />
                  <label
                    htmlFor="cover-image"
                    className="cursor-pointer text-primary-dark font-medium"
                  >
                    + Add File
                  </label>
                  <p className="text-gray-500 mt-2">or drag and drop files</p>
                  {errors.coverImage && (
                    <p className="mt-1 text-sm text-red-500">{errors.coverImage}</p>
                  )}
                </div>
              
            </div>

            {/* Additional Images */}
            <div>
              <label className="block text-md text-[#5A607F] mb-2">Additional Images</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {additionalImagesPreview.map((preview, index) => (
                  <div key={index} className="relative">
                    <img 
                      src={preview} 
                      alt={`Preview ${index}`}
                      className="h-24 w-24 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeAdditionalImage(index)}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
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
                  className="cursor-pointer text-primary-dark font-medium"
                >
                  + Add File
                </label>
                <p className="text-gray-500 mt-2">or drag and drop files</p>
                {errors.images && (
                  <p className="mt-1 text-sm text-red-500">{errors.images}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tags Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Tags</h2>
          <div>
            <InputField
              label='Tag'
              placeholder="Enter tag name"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={handleAddTag}
              isRequired={false}
            />
            <div className="flex flex-wrap gap-2 mt-3">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(index)}
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Price Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Price</h2>
          <div className="space-y-4">
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
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="has_tax"
                className="h-4 w-4 text-primary-dark rounded"
              />
              <span>Add tax for this product</span>
            </label>
          </div>
        </div>

        {/* SEO Settings */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">SEO Settings</h2>
          <div className="space-y-4">
            <InputField 
              label="Title" 
              name="seoTitle" 
              error={errors.seoTitle}
              isRequired={false}
            />
            <InputField 
              label="Description" 
              name="seoDescription" 
              as="textarea" 
              error={errors.seoDescription}
              isRequired={false}
            />
          </div>
        </div>

        {/* Variant Options */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Different Options</h2>
          <label className="flex items-center space-x-2 mb-4">
            <input
              type="checkbox"
              checked={hasMultipleOptions}
              onChange={() => setHasMultipleOptions(!hasMultipleOptions)}
              className="h-4 w-4 text-primary-dark rounded"
            />
            <span>This product has multiple options</span>
          </label>

          {hasMultipleOptions && (
            <div className="space-y-4">
              {/* Add new option */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <InputField
                  label="New Option Name"
                  placeholder="e.g. Color, Material"
                  value={newOptionName}
                  onChange={(e) => setNewOptionName(e.target.value)}
                  isRequired={false}
                />
                <Button 
                  type="button" 
                  onClick={handleAddOption}
                  className="w-full sm:w-auto"
                >
                  Add Option
                </Button>
              </div>

              {/* Existing options */}
              <div className="mt-4 space-y-6">
                {options.map((option, optionIndex) => (
                  <div key={optionIndex} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-md font-semibold text-gray-700">{option.name}</h4>
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(optionIndex)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove Option
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      <InputField
                        label={`Add ${option.name} Values`}
                        placeholder={`Enter ${option.name} value`}
                        value={option.newValue}
                        onChange={(e) => {
                          const updatedOptions = [...options];
                          updatedOptions[optionIndex].newValue = e.target.value;
                          setOptions(updatedOptions);
                        }}
                        onKeyDown={(e) => handleAddOptionValue(optionIndex, e)}
                        isRequired={false}
                      />
                      
                      <div className="flex flex-wrap gap-2 mt-2">
                        {option.values.map((value, valueIndex) => (
                          <span
                            key={valueIndex}
                            className="bg-gray-200 px-3 py-1 rounded-full text-sm flex items-center"
                          >
                            {value}
                            <button
                              type="button"
                              onClick={() => handleRemoveOptionValue(optionIndex, valueIndex)}
                              className="ml-1 text-gray-500 hover:text-gray-700"
                            >
                              ×
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

        {/* Shipping Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Shipping</h2>
          <div className="space-y-4">
            <InputField
              label="Weight (kg)"
              placeholder="Enter Weight"
              name="weight"
              type="number"
              error={errors.weight}
              isRequired={false}
            />
            <SelectField
              label="Country"
              name="country"
              options={["Select Country", "USA", "UK", "Canada", "Australia"]}
              error={errors.country}
            />
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="is_digital"
                checked={isDigitalItem}
                onChange={() => setIsDigitalItem(!isDigitalItem)}
                className="h-4 w-4 text-primary-dark rounded"
              />
              <span>This is digital item</span>
            </label>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium cursor-pointer"
            onClick={resetForm}
          >
            Cancel
          </button>
          <Button type="submit" disabled={processing} icon={<MdAdd />} iconPosition="right">
            {processing ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;