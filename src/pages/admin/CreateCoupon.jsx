import React, { useState, useEffect } from "react";
import axios from "../../lib/axios";
import InputField from "../../components/common/InputField";
import SelectField from "../../components/common/SelectField";
import Button from "../../components/common/Button";
import Checkbox from "../../components/common/Checkbox";
import { toast } from 'react-toastify';
import { Link } from "react-router-dom";

const CreateCoupon = () => {
  const [couponData, setCouponData] = useState({
    code: "",
    name: "",
    type: "fixed",
    value: "",
    duration: "none",
    durationDays: "",
    appliesTo: "all",
    usageLimit: "none",
    limitAmount: "",
    selectedProducts: [],
    selectedCategories: []
  });

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Fetch products and categories
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setApiError(null);
      
      try {
        // Fetch products
        const productsRes = await axios.get('api/v1/products');
        if (productsRes.data.status === 'success') {
          setProducts(productsRes.data.data.products);
        } else {
          toast.error(productsRes.data.message || 'Failed to fetch products');
        }

        // Fetch categories
        const categoriesRes = await axios.get('api/v1/categories');
        if (categoriesRes.data.status === 'success') {
          setCategories(categoriesRes.data.data.categories);
        } else {
          toast.error(categoriesRes.data.message || 'Failed to fetch categories');
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setApiError(error.message || 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCouponData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProductSelect = (productId) => {
    setCouponData(prev => {
      const newSelection = prev.selectedProducts.includes(productId)
        ? prev.selectedProducts.filter(id => id !== productId)
        : [...prev.selectedProducts, productId];
      
      return {
        ...prev,
        selectedProducts: newSelection
      };
    });
  };

  const handleCategorySelect = (categoryId) => {
    setCouponData(prev => {
      const newSelection = prev.selectedCategories.includes(categoryId)
        ? prev.selectedCategories.filter(id => id !== categoryId)
        : [...prev.selectedCategories, categoryId];
      
      return {
        ...prev,
        selectedCategories: newSelection
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setApiError(null);
    setSuccessMessage(null);

    try {
      const payload = {
        ...couponData,
        // Only include these if relevant
        ...(couponData.appliesTo === 'products' && { productIds: couponData.selectedProducts }),
        ...(couponData.appliesTo === 'categories' && { categoryIds: couponData.selectedCategories }),
        // Don't send these to backend
        selectedProducts: undefined,
        selectedCategories: undefined
      };

      const response = await axios.post('api/v1/coupons', payload);

      if (response.data.status !== 'success') {
        throw new Error(response.data.message || 'Failed to create coupon');
      }

      // setSuccessMessage();
      toast.success('Coupon created successfully!');
      // Reset form if needed
      setCouponData({
        code: "",
        name: "",
        type: "fixed",
        value: "",
        duration: "none",
        durationDays: "",
        appliesTo: "all",
        usageLimit: "none",
        limitAmount: "",
        selectedProducts: [],
        selectedCategories: []
      });
    } catch (error) {
      console.error('Error creating coupon:', error);
      toast.error(error.response?.data?.message  || 'Failed to create coupon');
      // setApiError(error.response?.data?.message || error.message || 'Failed to create coupon');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
            {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Add New Coupon</h1>
        <Link to="/manage/admin/coupons" className="cursor-pointer">
          <button className="text-primary-dark font-medium cursor-pointer">Back</button>
        </Link>
      </div>
  
      
      {/* Success/Error Messages */}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
          {successMessage}
        </div>
      )}
      {apiError && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Coupon Information Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Coupon Information</h2>
          <p className="text-sm text-gray-500 mb-4">Code will be used by users in checkout</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Coupon Code"
              name="code"
              value={couponData.code}
              onChange={handleChange}
              required
            />
            
            <InputField
              label="Coupon Name"
              name="name"
              value={couponData.name}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Coupon Type Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Coupon Type</h2>
          <p className="text-sm text-gray-500 mb-4">Type of coupon you want to create</p>
          
          <div className="flex flex-wrap gap-4 mb-6">
            <Checkbox
              label="Fixed Discount"
              name="type"
              value="fixed"
              checked={couponData.type === "fixed"}
              onChange={() => setCouponData(prev => ({...prev, type: "fixed"}))}
            />
            <Checkbox
              label="Percentage Discount"
              name="type"
              value="percentage"
              checked={couponData.type === "percentage"}
              onChange={() => setCouponData(prev => ({...prev, type: "percentage"}))}
            />
            <Checkbox
              label="Price Discount"
              name="type"
              value="priceDiscount"
              checked={couponData.type === "priceDiscount"}
              onChange={() => setCouponData(prev => ({...prev, type: "priceDiscount"}))}
            />
            <Checkbox
              label="Free Shipping"
              name="type"
              value="freeShipping"
              checked={couponData.type === "freeShipping"}
              onChange={() => setCouponData(prev => ({...prev, type: "freeShipping"}))}
            />
          </div>
          
          <InputField
            label={couponData.type === "percentage" ? "Percentage Value" : 
                  couponData.type === "fixed" ? "Discount Amount" : 
                  couponData.type === "priceDiscount" ? "Price Discount Amount" : "Shipping Discount"}
            name="value"
            value={couponData.value}
            onChange={handleChange}
            type="number"
            required
            placeholder={
              couponData.type === "percentage" ? "e.g. 20" : 
              couponData.type === "fixed" ? "e.g. 10.00" : 
              couponData.type === "priceDiscount" ? "e.g. 5.00" : "0.00"
            }
            addOn={couponData.type === "percentage" ? "%" : "$"}
            disabled={couponData.type === "freeShipping"}
          />
        </div>

        {/* Duration Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Duration</h2>
          
          <div className="flex space-x-6 mb-4">
            <Checkbox
              label="Set Duration"
              name="duration"
              value="set"
              checked={couponData.duration === "set"}
              onChange={() => setCouponData(prev => ({...prev, duration: "set"}))}
            />
            <Checkbox
              label="Don't set duration"
              name="duration"
              value="none"
              checked={couponData.duration === "none"}
              onChange={() => setCouponData(prev => ({...prev, duration: "none"}))}
            />
          </div>
          
          {couponData.duration === "set" && (
            <InputField
              label="Duration in Days"
              name="durationDays"
              value={couponData.durationDays}
              onChange={handleChange}
              type="number"
              placeholder="e.g. 30"
              required
              min="1"
            />
          )}
        </div>

        {/* Applies To Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Applies to</h2>
          
          <SelectField
            label="Choose products or categories"
            name="appliesTo"
            value={couponData.appliesTo}
            onChange={handleChange}
            options={[
              { value: "all", label: "All Products" },
              { value: "categories", label: "Specific Categories" },
              { value: "products", label: "Specific Products" }
            ]}
          />

          {/* Product Selection */}
          {couponData.appliesTo === "products" && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Products {isLoading && "(Loading...)"}
              </label>
              {apiError && products.length === 0 ? (
                <p className="text-red-500 text-sm">{apiError}</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto p-2 border rounded">
                  {products.map(product => (
                    <div key={product.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`product-${product.id}`}
                        checked={couponData.selectedProducts.includes(product.id)}
                        onChange={() => handleProductSelect(product.id)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`product-${product.id}`} className="ml-2 text-sm text-gray-700">
                        {product.name} (ID: {product.id})
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Category Selection */}
          {couponData.appliesTo === "categories" && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Categories {isLoading && "(Loading...)"}
              </label>
              {apiError && categories.length === 0 ? (
                <p className="text-red-500 text-sm">{apiError}</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto p-2 border rounded">
                  {categories.map(category => (
                    <div key={category.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`category-${category.id}`}
                        checked={couponData.selectedCategories.includes(category.id)}
                        onChange={() => handleCategorySelect(category.id)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`category-${category.id}`} className="ml-2 text-sm text-gray-700">
                        {category.name} (ID: {category.id})
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Usage Limits Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Usage Limits</h2>
          
          <div className="flex space-x-6 mb-4">
            <Checkbox
              label="Amount of uses"
              name="usageLimit"
              value="limited"
              checked={couponData.usageLimit === "limited"}
              onChange={() => setCouponData(prev => ({...prev, usageLimit: "limited"}))}
            />
            <Checkbox
              label="Don't limit amount of uses"
              name="usageLimit"
              value="none"
              checked={couponData.usageLimit === "none"}
              onChange={() => setCouponData(prev => ({...prev, usageLimit: "none"}))}
            />
          </div>
          
          {couponData.usageLimit === "limited" && (
            <InputField
              label="Maximum Uses"
              name="limitAmount"
              value={couponData.limitAmount}
              onChange={handleChange}
              type="number"
              placeholder="e.g. 100"
              required
              min="1"
            />
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <Button variant="outline" type="button" disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Coupon"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateCoupon;