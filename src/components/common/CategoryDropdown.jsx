import { useEffect, useState } from "react";
import axios from "../../lib/axios";
import { FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";

const CategoryDropdown = () => {
    const [categories, setCategories] = useState([]);
    const [activeCategoryId, setActiveCategoryId] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const res = await axios.get('api/v1/categories?fields=name,id,icon');
            const fetchedCategories = res.data.data.categories;
            setCategories(fetchedCategories);
            
            if (fetchedCategories.length > 0) {
                setActiveCategoryId(fetchedCategories[0].id);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const activeCategory = categories.find(c => c.id === activeCategoryId);

    const LeftSkeleton = () => (
        <div className="py-2 px-4 space-y-4">
            {[...Array(10)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex-shrink-0" />
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                </div>
            ))}
        </div>
    );

    const RightSkeleton = () => (
        <div className="animate-pulse h-full">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 rounded-full bg-gray-200" />
                <div className="flex-1 space-y-2">
                    <div className="h-5 bg-gray-200 rounded w-1/3" />
                    <div className="h-3 bg-gray-200 rounded w-1/4" />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                {[...Array(14)].map((_, i) => (
                    <div key={i} className="h-8 bg-gray-200 rounded w-full" />
                ))}
            </div>
        </div>
    );

    return (
        <div className="flex w-[800px] h-[450px] bg-white rounded-lg shadow-xl 
        overflow-hidden text-sm border border-gray-100">
            
            {/* Left Column */}
            <div className="w-[35%] bg-gray-50 h-full overflow-y-auto 
            [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
                {loading ? (
                    <LeftSkeleton />
                ) : (
                    <ul className="py-2 space-y-1">
                        {categories.map((category) => (
                            <li 
                                key={category.id}
                                onMouseEnter={() => setActiveCategoryId(category.id)}
                                className={`px-4 py-3 mx-2 cursor-pointer flex items-center 
                                    justify-between group transition-all duration-200 rounded-lg
                                    ${activeCategoryId === category.id 
                                        ? 'bg-gray-200 text-primary-light font-semibold shadow-sm' 
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                    }`}
                            >
                                <div className="flex items-center gap-3 overflow-hidden">
                                    {category.icon ? (
                                        <img 
                                            src={category.icon} 
                                            alt="" 
                                            className="w-6 h-6 object-cover rounded-full 
                                            flex-shrink-0 bg-white border border-gray-200"
                                        />
                                    ) : (
                                        <div className="w-6 h-6 rounded-full bg-gray-200 flex-shrink-0" />
                                    )}
                                    <span className="truncate">{category.name}</span>
                                </div>
                                
                                {(activeCategoryId === category.id) && (
                                    <FiChevronRight className="text-primary-light" />
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Right Column */}
            <div className="w-[65%] bg-white p-6 h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
                {loading ? (
                    <RightSkeleton />
                ) : (
                    <>
                        {activeCategory ? (
                            <div className="animate-fade-in">
                                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                                     {activeCategory.icon && (
                                        <img 
                                            src={activeCategory.icon} 
                                            alt={activeCategory.name} 
                                            className="w-10 h-10 object-cover rounded-full border border-gray-100"
                                        />
                                     )}
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800 leading-tight">
                                            {activeCategory.name}
                                        </h3>
                                        <Link 
                                            to={`/category/${activeCategory.id}`}
                                            className="text-xs text-primary-light hover:underline font-medium"
                                        >
                                            View all products in this category
                                        </Link>
                                    </div>
                                </div>

                                {activeCategory.subcategories && activeCategory.subcategories.length > 0 ? (
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                        {activeCategory.subcategories.map((sub) => (
                                            <Link
                                                key={sub.id}
                                                to={`/category/${activeCategory.id}/${sub.id}`}
                                                className="block p-2 rounded hover:bg-gray-50 text-gray-600
                                                 hover:text-primary-light transition-colors truncate"
                                            >
                                                {sub.name}
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="h-40 flex flex-col items-center justify-center text-gray-400">
                                        <p>No subcategories found.</p>
                                        <Link 
                                            to={`/category/${activeCategory.id}`}
                                            className="mt-2 text-primary-light text-xs hover:underline"
                                        >
                                            Browse Main Category
                                        </Link>
                                    </div>
                                )}
                            </div>
                        ) : (
                             <div className="h-full flex items-center justify-center text-gray-400">
                                Select a category
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default CategoryDropdown;