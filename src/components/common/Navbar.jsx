import { useEffect, useState } from "react";
import axios from "../../lib/axios";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";

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

    const toggleCategory = (categoryId, hasSubcategories) => {
        if (hasSubcategories) {
            setExpandedCategories(prev => ({
                ...prev,
                [categoryId]: !prev[categoryId]
            }));
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <div className="w-full">
            <h2 className="font-semibold text-gray-800 mb-4">Our categories</h2>
            <ul className="space-y-4">
                {categories.map((category) => {
                    const hasSubcategories = category.subcategories?.length > 0;
                    
                    return (
                        <li key={category.id} className="border-b text-sm border-gray-100 last:border-b-0">
                            {hasSubcategories ? (
                                <div 
                                    className={`flex items-center justify-between p-2 rounded-md cursor-pointer 
                                        ${expandedCategories[category.id] ? 'bg-gray-50' : 'hover:bg-gray-50'}`}
                                    onClick={() => toggleCategory(category.id, hasSubcategories)}
                                >
                                    <div className="flex items-center">
                                        {category.icon ? (
                                            <img 
                                                src={category.icon} 
                                                alt={category.name} 
                                                className="w-4 h-4 mr-2 object-contain"
                                            />
                                        ) : (
                                            <div className="w-4 h-4 mr-2 bg-gray-200 rounded-full"></div>
                                        )}
                                        <span className="text-gray-700">{category.name}</span>
                                    </div>
                                    {hasSubcategories && (
                                        expandedCategories[category.id] ? (
                                            <FiChevronDown className="text-gray-500" />
                                        ) : (
                                            <FiChevronRight className="text-gray-500" />
                                        )
                                    )}
                                </div>
                            ) : (
                                <Link
                                    to={`/category/${category.id}`}
                                    className="flex items-center p-2 rounded-md hover:bg-gray-50"
                                    onClick={() => window.innerWidth < 1024 && setMobileNavOpen(false)}
                                >
                                    {category.icon ? (
                                        <img 
                                            src={category.icon} 
                                            alt={category.name} 
                                            className="w-4 h-4 mr-2 object-contain"
                                        />
                                    ) : (
                                        <div className="w-4 h-4 mr-2 bg-gray-200 rounded-full"></div>
                                    )}
                                    <span className="text-gray-700">{category.name}</span>
                                </Link>
                            )}
                            
                            {expandedCategories[category.id] && hasSubcategories && (
                                <ul className="ml-6 mt-1 space-y-1">
                                    {category.subcategories.map((subcategory) => (
                                        <li key={subcategory.id}>
                                           <Link
                                                to={`/category/${category.id}/${subcategory.id}`}
                                                className="block p-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md"
                                                onClick={() => window.innerWidth < 1024 && setMobileNavOpen(false)}
                                                >
                                                {subcategory.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default Navbar;