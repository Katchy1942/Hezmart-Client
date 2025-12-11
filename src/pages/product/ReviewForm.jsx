import {FaStar, FaRegStar} from 'react-icons/fa'
import InputField from '../../components/common/InputField';

export const ReviewForm = ({ 
    newReview = { rating: 0, comment: '' },
    setNewReview, 
    handleSubmitReview,
    submitting
}) => {
    return (
        <div className="mb-8 border border-gray-100">
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
                                onClick={() => setNewReview({ ...newReview, rating: star })}
                                disabled={newReview?.submitting}
                                className="text-2xl mr-1 focus:outline-none transition-transform 
                                hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {star <= (newReview?.rating || 0) ? (
                                    <FaStar className="text-yellow-400" />
                                ) : (
                                    <FaRegStar className="text-gray-300" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="mb-4">
                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                        Review
                    </label>
                    <InputField
                        id="comment"
                        rows="4"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                        focus:outline-none focus:ring-black focus:border-black disabled:opacity-50"
                        value={newReview?.comment || ''}
                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                        disabled={submitting}
                        required
                        placeholder="What did you like about this product?"
                        as="textarea"
                    />
                </div>
                <button
                    type="submit"
                    disabled={submitting}
                    className="bg-primary-light hover:bg-primary-light/90 text-white text-sm 
                    font-medium py-3 px-6 rounded-full transition-colors w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
            </form>
        </div>
    );
};
