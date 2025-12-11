import { ReviewItem } from './ReviewItem';
import { ReviewForm } from "./ReviewForm";
import { useState, useEffect } from 'react';
import axios from '../../lib/axios';
import {toast} from 'react-toastify';

export const ReviewComponent = ({ product }) => {
    const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (product?.id) {
            fetchReviews();
        }
    }, [product?.id]);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/v1/reviews', { params: { productId: product.id } })
            setReviews(response.data.data?.reviews || [])
        } catch (error) {
            console.error('Error fetching reviews:', error);
            toast.error('Failed to load reviews');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();

        if (!user) {
            toast.error('Please login to submit a review');
            return;
        }

        if (!newReview.rating || newReview.rating === 0) {
            toast.error('Please select a rating');
            return;
        }

        if (!newReview.comment || newReview.comment.trim() === '') {
            toast.error('Please write a review');
            return;
        }

        try {
            setSubmitting(true);
            
            const reviewData = {
                rating: parseInt(newReview.rating, 10),
                review: newReview.comment.trim(),
                productId: parseInt(product.id, 10),
                userId: parseInt(user.id, 10)
            };
                    
            const response = await axios.post(`/api/v1/reviews`, reviewData);

            setReviews([response.data.data.review, ...reviews]);
            
            setNewReview({ rating: 0, comment: '' });
            
            toast.success('Review submitted successfully!');
            
            // Update product ratings if returned
            if (response.data.data.product) {
                product.ratingsAverage = response.data.data.product.ratingsAverage;
                product.ratingsQuantity = response.data.data.product.ratingsQuantity;
            }

            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (error) {
            console.error('Error submitting review:', error);
            console.error('Full error response:', error.response); // More detailed logging
            
            // Handle validation errors specifically
            if (error.response?.data?.errors) {
                const errorMessages = error.response.data.errors.map(err => err.message).join(', ');
                toast.error(errorMessages);
            } else {
                const errorMessage = error.response?.data?.message || 'Failed to submit review';
                toast.error(errorMessage);
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="w-full">
            <div className="flex flex-col lg:flex-row gap-12">
                <div className="w-full lg:w-1/2">
                    {/* Header Section */}
                    {loading && (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                        </div>
                    )}

                    {/* Review Form */}
                    {user ? (
                        <ReviewForm
                            user={user}
                            newReview={newReview}
                            setNewReview={setNewReview}
                            handleSubmitReview={handleSubmitReview}
                            submitting={submitting}
                        />
                    ) : (
                        <div className="mb-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                            <p className="text-gray-600 text-sm">
                                Please <a href="/login" className="text-blue-600 hover:underline">login</a> to write a review
                            </p>
                        </div>
                    )}

                    {/* Reviews List */}
                    <div className="space-y-2">
                        {reviews && reviews.length > 0 && (
                            reviews.map(review => (
                                <ReviewItem key={review.id} review={review} />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};