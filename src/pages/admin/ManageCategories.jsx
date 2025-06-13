import { useState, useEffect } from 'react';
import axios from '../../lib/axios';
import { FiEdit, FiTrash2, FiPlus, FiSearch, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import InputField from '../../components/common/InputField';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { toast } from 'react-toastify';
import { MdAdd } from 'react-icons/md';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubcategoryModalOpen, setIsSubcategoryModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [currentSubcategory, setCurrentSubcategory] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const [formData, setFormData] = useState({ name: '', catIcon: null });
  const [subcategoryForm, setSubcategoryForm] = useState({ name: '' });

  const [errors, setErrors] = useState({});

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get('api/v1/categories');
      setCategories(res.data.data.categories);
      setFilteredCategories(res.data.data.categories);

      const initialExpanded = {};
      res.data.data.categories.forEach(cat => {
        initialExpanded[cat.id] = false;
      });
      setExpandedCategories(initialExpanded);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch categories.';
      toast.error(errorMessage);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const results = categories.filter(category =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategories(results);
  }, [searchTerm, categories]);

  const toggleCategoryExpansion = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubcategoryInputChange = (e) => {
    const { name, value } = e.target;
    setSubcategoryForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, catIcon: e.target.files[0] }));
    if (errors.icon) {
      setErrors(prev => ({ ...prev, catIcon: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    setGeneralError('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      if (formData.catIcon) formDataToSend.append('catIcon', formData.catIcon);

      if (currentCategory) {
        await axios.patch(`api/v1/categories/${currentCategory.id}`, formDataToSend);
        toast.success('Category updated successfully.');
      } else {
        await axios.post('api/v1/categories', formDataToSend);
        toast.success('Category added successfully.');
      }

      fetchCategories();
      setIsModalOpen(false);
      setFormData({ name: '', icon: null });
      setCurrentCategory(null);
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
        toast.error(err.response.data?.message ||'Please fix the form errors and try again.');
      } else {
        const errorMessage = err.response?.data?.message || 'An error occurred while processing your request.';
        setGeneralError(errorMessage);
        toast.error(errorMessage);
      }
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubcategorySubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    setGeneralError('');

    try {
      if (currentSubcategory) {
        await axios.patch(
          `api/v1/categories/${currentCategory.id}/subcategories/${currentSubcategory.id}`,
          { name: subcategoryForm.name }
        );
        toast.success('Subcategory updated successfully.');
      } else {
        await axios.post(
          `api/v1/categories/${currentCategory.id}/subcategories`,
          { name: subcategoryForm.name }
        );
        toast.success('Subcategory added successfully.');
      }

      fetchCategories();
      setIsSubcategoryModalOpen(false);
      setSubcategoryForm({ name: '' });
      setCurrentSubcategory(null);
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
        toast.error('Please fix the form errors and try again.');
      } else {
        const errorMessage = err.response?.data?.message || 'An error occurred while processing your request.';
        setGeneralError(errorMessage);
        toast.error(errorMessage);
      }
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (category) => {
    setCurrentCategory(category);
    setFormData({ name: category.name, icon: null });
    setIsModalOpen(true);
    setErrors({});
    setGeneralError('');
  };

  const handleEditSubcategory = (category, subcategory) => {
    setCurrentCategory(category);
    setCurrentSubcategory(subcategory);
    setSubcategoryForm({ name: subcategory.name });
    setIsSubcategoryModalOpen(true);
    setErrors({});
    setGeneralError('');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setLoading(true);
      try {
        await axios.delete(`api/v1/categories/${id}`);
        toast.success('Category deleted successfully.');
        fetchCategories();
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Failed to delete category.';
        toast.error(errorMessage);
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteSubcategory = async (categoryId, subcategoryId) => {
    if (window.confirm('Are you sure you want to delete this subcategory?')) {
      setLoading(true);
      try {
        await axios.delete(`api/v1/categories/${categoryId}/subcategories/${subcategoryId}`);
        toast.success('Subcategory deleted successfully.');
        fetchCategories();
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Failed to delete subcategory.';
        toast.error(errorMessage);
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const openAddSubcategoryModal = (category) => {
    setCurrentCategory(category);
    setCurrentSubcategory(null);
    setSubcategoryForm({ name: '' });
    setIsSubcategoryModalOpen(true);
    setErrors({});
    setGeneralError('');
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Manage Categories</h1>
          <Button
            className="flex items-center gap-2 w-full md:w-auto md:max-w-40 px-3"
            onClick={() => {
              setCurrentCategory(null);
              setFormData({ name: '', icon: null });
              setIsModalOpen(true);
              setErrors({});
              setGeneralError('');
            }}
          >
            <FiPlus /> Add Category
          </Button>
        </div>

        {/* Search bar */}
        <div className="relative mb-6">
          <InputField
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<FiSearch />}
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          /* Categories table */
          <div className="bg-white rounded-lg shadow overflow-hidden overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subcategories</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Icon</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCategories.map((category) => (
                  <>
                    <tr key={category.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {category.subcategories?.length > 0 && (
                            <button 
                              onClick={() => toggleCategoryExpansion(category.id)}
                              className="mr-2 text-gray-500 hover:text-gray-700"
                            >
                              {expandedCategories[category.id] ? <FiChevronUp /> : <FiChevronDown />}
                            </button>
                          )}
                          <div className="text-sm font-medium text-gray-900">{category.name}</div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {category.subcategories?.length || 0}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {category.icon ? (
                          <img src={category.icon} alt={category.name} className="h-8 w-8 object-contain" />
                        ) : (
                          <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium space-x-1 md:space-x-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit"
                        >
                          <FiEdit className="inline md:mr-1" /> <span className="hidden md:inline">Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <FiTrash2 className="inline md:mr-1" /> <span className="hidden md:inline">Delete</span>
                        </button>
                        <button
                          onClick={() => openAddSubcategoryModal(category)}
                          className="text-green-600 hover:text-green-900"
                          title="Add Subcategory"
                        >
                          <FiPlus className="inline md:mr-1" /> <span className="hidden md:inline">Add Sub</span>
                        </button>
                      </td>
                    </tr>
                    {expandedCategories[category.id] && category.subcategories?.length > 0 && (
                      <tr className="bg-gray-50">
                        <td colSpan="4" className="px-4 py-2">
                          <div className="ml-4 md:ml-8">
                            <h4 className="text-sm font-medium text-gray-500 mb-2">Subcategories:</h4>
                            <ul className="space-y-2">
                              {category.subcategories.map((subcategory) => (
                                <li key={subcategory.id} className="flex justify-between items-center">
                                  <span className="text-sm text-gray-700">{subcategory.name}</span>
                                  <div className="space-x-2">
                                    <button
                                      onClick={() => handleEditSubcategory(category, subcategory)}
                                      className="text-blue-500 hover:text-blue-700 text-sm"
                                      title="Edit"
                                    >
                                      <FiEdit className="inline" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteSubcategory(category.id, subcategory.id)}
                                      className="text-red-500 hover:text-red-700 text-sm"
                                      title="Delete"
                                    >
                                      <FiTrash2 className="inline" />
                                    </button>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Category Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-2">
              <div className="p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-bold mb-4">
                  {currentCategory ? 'Edit Category' : 'Add New Category'}
                </h2>
                {generalError && (
                  <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                    {generalError}
                  </div>
                )}
                <form onSubmit={handleSubmit}>
                  <InputField
                    label='Category Name'
                    name="name"
                    placeholder="Enter category name"
                    classNames='mb-4'
                    value={formData.name}
                    onChange={handleInputChange}
                    error={errors.name}
                  />
                  <div className="mb-4">
                    <InputField
                      label='Category Icon'
                      type='file'
                      onChange={handleFileChange}
                      accept="image/*"
                      name='catIcon'
                      error={errors.catIcon}
                    />
                    {currentCategory?.icon && !formData.icon && (
                      <div className="mt-2">
                        <span className="text-sm text-gray-500">Current Icon:</span>
                        <img src={currentCategory.icon} alt={currentCategory.name} className="h-10 w-10 mt-1" />
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end space-x-3 items-center">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 border border-gray-300 rounded-2xl text-gray-700 hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <Button
                      className="max-w-[100px] px-3"
                      type="submit"
                      disabled={submitting}
                      icon={<MdAdd />} iconPosition="right"
                    >
                      {submitting ? <LoadingSpinner size="sm" /> : currentCategory ? 'Update' : 'Save'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Subcategory Modal */}
        {isSubcategoryModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-2">
              <div className="p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-bold mb-4">
                  {currentSubcategory ? 'Edit Subcategory' : `Add New Subcategory to ${currentCategory?.name}`}
                </h2>
                {generalError && (
                  <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                    {generalError}
                  </div>
                )}
                <form onSubmit={handleSubcategorySubmit}>
                  <InputField
                    label='Subcategory Name'
                    placeholder="Enter subcategory name"
                    classNames='mb-4'
                    name="name"
                    value={subcategoryForm.name}
                    onChange={handleSubcategoryInputChange}
                    error={errors.name}
                  />
                  <div className="flex justify-end space-x-3 items-center">
                    <button
                      type="button"
                      onClick={() => setIsSubcategoryModalOpen(false)}
                      className="px-4 py-2 border border-gray-300 rounded-2xl text-gray-700 hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <Button
                      className="max-w-[100px] px-3"
                      type="submit"
                      disabled={submitting}
                      icon={<MdAdd />} iconPosition="right"
                    >
                      {submitting ? <LoadingSpinner size="sm" /> : currentSubcategory ? 'Update' : 'Save'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageCategories;