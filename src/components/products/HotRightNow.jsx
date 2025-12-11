import ProductSkeletonLoader from "../common/ProductSkeletonLoader"
import ProductsGrid from "./ProductsGrid"

const HotRightNow = () => {
    return (
        <div>
            <div>
                <h1 className="text-xl md:text-2xl font-semibold mb-4 font-['Poppins',sans-serif]">
                    Hot Right Now
                </h1>
            </div>
            <div>
                <ProductsGrid from={"HotRightNow"} showPagination={false} />
            </div>
        </div>
    )
}

export default HotRightNow