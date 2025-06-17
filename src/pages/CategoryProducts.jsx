import { useParams } from "react-router-dom";
import ProductsGrid from "../components/products/ProductsGrid";

const CategoryProducts = () => {
    const { categoryId, subcategoryId } = useParams();
    
    // Determine the fetch URL based on whether subcategoryId exists
    const fetchUrl = subcategoryId 
        ? `api/v1/products?categoryId=${categoryId}&subCategoryId=${subcategoryId}`
        : `api/v1/products?categoryId=${categoryId}`;

    // Customize header text based on whether it's a category or subcategory
    const headerTitle = subcategoryId 
        ? `Products in Subcategory` 
        : `Products in Category`;
    
    const headerSubtitle = subcategoryId 
        ? `Browse all products in this subcategory` 
        : `Browse all products in this category`;

    return (
        <ProductsGrid 
            fetchUrl={fetchUrl}
            showHeader={true}
            headerTitle={headerTitle}
            headerSubtitle={headerSubtitle}
        />
    );
};

export default CategoryProducts;