import { useParams } from "react-router-dom";
import ProductsGrid from "../components/products/ProductsGrid";

const CategoryProducts = () => {
    const{categoryId, subcategoryId} = useParams();
    
    return (
        <ProductsGrid 
            fetchUrl={`api/v1/products?categoryId=${categoryId}&subCategoryId=${subcategoryId}`}
            showHeader={true}
            headerTitle={`Products in Category`}
            headerSubtitle={`Browse all products in this category`}
        />
    );
};

export default CategoryProducts;