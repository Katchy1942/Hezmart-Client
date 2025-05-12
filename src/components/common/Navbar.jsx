import { useEffect, useState } from "react";
import axios from "../../lib/axios";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";

const Navbar = () => {
    const [categories, setCategories] = useState([]);
    const [expandedCategories, setExpandedCategories] = useState({});

    const fetchCategories = async () => {
        try {
            const res = await axios.get('api/v1/categories?fields=name,id,icon');
            setCategories(res.data.data.categories);
            // Initialize all categories as collapsed
            const initialExpandedState = {};
            res.data.data.categories.forEach(cat => {
                initialExpandedState[cat.id] = false;
            });
            setExpandedCategories(initialExpandedState);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const toggleCategory = (categoryId) => {
        setExpandedCategories(prev => ({
            ...prev,
            [categoryId]: !prev[categoryId]
        }));
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <div className="w-64 bg-white shadow-md rounded-lg p-4 h-full">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Categories</h2>
            <ul className="space-y-2">
                {categories.map((category) => (
                    <li key={category.id} className="border-b border-gray-100 last:border-b-0">
                        <div 
                            className={`flex items-center justify-between p-2 rounded-md cursor-pointer 
                                ${expandedCategories[category.id] ? 'bg-gray-50' : 'hover:bg-gray-50'}`}
                            onClick={() => toggleCategory(category.id)}
                        >
                            <div className="flex items-center">
                                {category.icon ? (
                                    <img 
                                        src={category.icon} 
                                        alt={category.name} 
                                        className="w-5 h-5 mr-2 object-contain"
                                    />
                                ) : (
                                    <div className="w-5 h-5 mr-2 bg-gray-200 rounded-full"></div>
                                )}
                                <span className="text-gray-700">{category.name}</span>
                            </div>
                            {category.subcategories.length > 0 && (
                                expandedCategories[category.id] ? (
                                    <FiChevronDown className="text-gray-500" />
                                ) : (
                                    <FiChevronRight className="text-gray-500" />
                                )
                            )}
                        </div>
                        
                        {expandedCategories[category.id] && category.subcategories.length > 0 && (
                            <ul className="ml-6 mt-1 space-y-1">
                                {category.subcategories.map((subcategory) => (
                                    <li key={subcategory.id}>
                                        <a 
                                            href={`/category/${category.id}/subcategory/${subcategory.id}`}
                                            className="block p-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md"
                                        >
                                            {subcategory.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Navbar;