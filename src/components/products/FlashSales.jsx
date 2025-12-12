import ProductsGrid from "./ProductsGrid";

const FlashSales = () => {
    return (
        <div className="mt-8">
            <div className="flex justify-between items-center mb-4 px-4">
                <h1 className="text-xl md:text-2xl font-semibold font-['Poppins'] flex items-center gap-2">
                    Flash Sales
                </h1>
            </div>
            
            <div>
                <ProductsGrid 
                    count={16}
                    fetchUrl="api/v1/products?status=active&flashSale=true" 
                    enableHorizontalScroll={true}
                    showPagination={false}
                    itemsPerPage={10}
                    variant="flash"
                />
            </div>
        </div>
    )
}

export default FlashSales;