import { FaStar, FaRegStar } from "react-icons/fa";

export const renderRatingStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        if(rating >= i){
            stars.push(<FaStar key={i} className="text-primary-light" />);
        }else{
            stars.push(<FaRegStar key={i} className="text-primary-light" />);
        }
    }
    return stars;
};

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
export const ReviewForm = ({ user, newReview, setNewReview, handleSubmitReview }) => {
    return (
        <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Write a Review</h4>
            <form onSubmit={handleSubmitReview}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rating
                    </label>
                    <div className="flex">
                        {[1, 2, 3, 4, 5].map(star => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setNewReview({...newReview, rating: star})}
                                className="text-2xl mr-1"
                            >
                                {star <= newReview.rating ? (
                                    <FaStar className="text-primary-light" />
                                ) : (
                                    <FaRegStar className="text-primary-light" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="mb-4">
                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                        Review
                    </label>
                    <textarea
                        id="comment"
                        rows="4"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        value={newReview.comment}
                        onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                        required
                    ></textarea>
                </div>
                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
                >
                    Submit Review
                </button>
            </form>
        </div>
    );
};

export const ReviewItem = ({ review }) => {
    return (
        <div className="border-b border-gray-200 pb-6 last:border-0">
            <div className="flex items-start">
                <img 
                    src={review.reviewUser.photo} 
                    alt={review.reviewUser.firstName } 
                    className="h-10 w-10 rounded-full mr-4"
                />
                <div>
                    <div className="flex items-center mb-1">
                        <h4 className="font-medium text-gray-900 mr-2">{review.reviewUser.firstName} {" "} {review.reviewUser.lastName}</h4>
                        <div className="flex">
                            {renderRatingStars(review.rating)}
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">{formatDate(review.createdAt)}</p>
                    <p className="text-gray-700">{review.review}</p>
                </div>
            </div>
        </div>
    );
};

export const ReviewsSection = ({ 
    product, 
    user, 
    reviews, 
    newReview, 
    setNewReview, 
    handleSubmitReview 
}) => {
    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Customer Reviews</h3>
                    <div className="flex items-center">
                        <div className="flex mr-2">
                            {renderRatingStars(product.ratingsAverage)}
                        </div>
                        <span className="text-sm text-gray-500">
                            {product.ratingsAverage.toFixed(1)} out of 5 ({product.ratingsQuantity} reviews)
                        </span>
                    </div>
                </div>
            </div>

            {/* Review Form */}
            {/* {user && (
                <ReviewForm 
                    user={user}
                    newReview={newReview}
                    setNewReview={setNewReview}
                    handleSubmitReview={handleSubmitReview}
                />
            )} */}

            {/* Reviews List */}
            <div className="space-y-6">
                {reviews.length > 0 ? (
                    reviews.map(review => (
                        <ReviewItem key={review.id} review={review} />
                    ))
                ) : (
                    <p className="text-gray-500">No reviews yet. Be the first to review!</p>
                )}
            </div>
        </div>
    );
};