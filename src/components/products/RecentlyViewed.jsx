import ProductsGrid from "./ProductsGrid"

const RecentlyViewed = () => {
    return (
        <div>
            <div>
                <h1 className="text-xl md:text-2xl font-semibold mb-4 font-['Poppins']">
                    Pickup Where You Left Off
                </h1>
            </div>
            <div>
                <ProductsGrid 
                    showPagination={false} 
                    fetchUrl="/api/v1/recently-viewed"
                    from="RecentlyViewed"
                />
            </div>
        </div>
    )
}

export default RecentlyViewed