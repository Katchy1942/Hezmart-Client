import { useState } from 'react';
import { renderRatingStars } from "./renderRatingStars";

export const ReviewItem = ({ review }) => {
    const [imageError, setImageError] = useState(false);

    if (!review) return null;
    
    const user = review.reviewUser;
    
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getInitials = (firstName, lastName) => {
        const first = firstName ? firstName.charAt(0).toUpperCase() : '';
        const last = lastName ? lastName.charAt(0).toUpperCase() : '';
        return `${first}${last}` || 'U';
    };

    return (
        <div className="border-b border-gray-100 pb-8 mb-8 last:border-0 last:mb-0 last:pb-0">
            <div className="flex items-start gap-4">
                {/* Avatar Section */}
                <div className="flex-shrink-0">
                    {user?.photo && !imageError ? (
                        <img
                            src={user.photo}
                            alt={`${user.firstName} ${user.lastName}`}
                            onError={() => setImageError(true)}
                            className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-sm ring-1 ring-gray-100"
                        />
                    ) : (
                        <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center ring-1 ring-orange-200">
                            <span className="text-orange-600 font-bold text-lg">
                                {getInitials(user?.firstName, user?.lastName)}
                            </span>
                        </div>
                    )}
                </div>

                {/* Content Section */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-bold text-gray-900 truncate">
                            {user ? `${user.firstName} ${user.lastName}` : 'Anonymous User'}
                        </h4>
                        <span className="text-xs text-gray-400">
                            {formatDate(review.createdAt)}
                        </span>
                    </div>

                    <div className="flex items-center mb-3">
                        <div className="flex text-yellow-400 text-sm">
                            {renderRatingStars(review.rating)}
                        </div>
                    </div>
                    
                    <div className="text-sm max-w-none text-gray-600 leading-relaxed">
                        <p>{review.review}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
