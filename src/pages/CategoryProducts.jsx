import { useParams } from "react-router-dom";
import ProductsGrid from "../components/products/ProductsGrid";

const CategoryProducts = () => {
    const { categoryId, subcategoryId } = useParams();
    
    const fetchUrl = subcategoryId 
        ? `api/v1/products?status=active&categoryId=${categoryId}&subCategoryId=${subcategoryId}`
        : `api/v1/products?status=active&categoryId=${categoryId}`;

    const headerTitle = subcategoryId 
        ? `Products in Subcategory` 
        : `Products in Category`;
    
    const headerSubtitle = subcategoryId 
        ? `Browse all products in this subcategory` 
        : `Browse all products in this category`;

    return (
        <div className="py-12">
            <ProductsGrid 
                fetchUrl={fetchUrl}
                showHeader={true}
                headerTitle={headerTitle}
                headerSubtitle={headerSubtitle}
            />
        </div>
    );
};

export default CategoryProducts;