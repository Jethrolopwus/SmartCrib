// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IReviews {
    event ReviewSubmitted(
        uint256 indexed reviewId,
        address indexed reviewer,
        address indexed reviewedUser,
        uint256 listingId,
        uint256 rating,
        uint256 timestamp
    );
    
    event ReviewUpdated(
        uint256 indexed reviewId,
        address indexed reviewer,
        uint256 newRating,
        uint256 timestamp
    );
    
    event ReputationUpdated(
        address indexed user,
        uint256 newReputationScore,
        uint256 timestamp
    );

    struct Review {
        uint256 reviewId;
        address reviewer;
        address reviewedUser;
        uint256 listingId;
        uint256 rating; // 1-5 stars
        string comment;
        uint256 createdAt;
        uint256 updatedAt;
        bool isActive;
    }

    struct ReviewFilters {
        string location;
        uint256 minPrice;
        uint256 maxPrice;
        uint256 minRating;
        uint256 maxRating;
        uint256 startDate;
        uint256 endDate;
    }

    struct UserReputation {
        uint256 totalReviews;
        uint256 averageRating;
        uint256 reputationScore;
        uint256 positiveReviews;
        uint256 negativeReviews;
    }

    /**
     * @dev Submit a new review for a user after a completed transaction
     * @param reviewedUser The address of the user being reviewed
     * @param listingId The ID of the listing involved in the transaction
     * @param rating Rating from 1-5 stars
     * @param comment Review comment
     */
    function submitReview(
        address reviewedUser,
        uint256 listingId,
        uint256 rating,
        string calldata comment
    ) external returns (uint256);

    /**
     * @dev Update an existing review (only by the original reviewer)
     * @param reviewId The ID of the review to update
     * @param newRating New rating from 1-5 stars
     * @param newComment New review comment
     */
    function updateReview(
        uint256 reviewId,
        uint256 newRating,
        string calldata newComment
    ) external;

    /**
     * @dev Get a specific review by ID
     * @param reviewId The ID of the review
     * @return Review struct
     */
    function getReview(uint256 reviewId) external view returns (Review memory);

    /**
     * @dev Get all reviews for a specific user
     * @param user The address of the user
     * @return Array of review IDs
     */
    function getReviewsForUser(address user) external view returns (uint256[] memory);

    /**
     * @dev Get reviews for a specific listing
     * @param listingId The ID of the listing
     * @return Array of review IDs
     */
    function getReviewsForListing(uint256 listingId) external view returns (uint256[] memory);

    /**
     * @dev Get reviews with filters (location, price range, rating range, date range)
     * @param filters ReviewFilters struct containing filter criteria
     * @return Array of review IDs that match the filters
     */
    function getFilteredReviews(ReviewFilters calldata filters) external view returns (uint256[] memory);

    /**
     * @dev Get user reputation information
     * @param user The address of the user
     * @return UserReputation struct
     */
    function getUserReputation(address user) external view returns (UserReputation memory);

    /**
     * @dev Get total number of reviews for a user
     * @param user The address of the user
     * @return Total number of reviews
     */
    function getTotalReviewsForUser(address user) external view returns (uint256);

    /**
     * @dev Get average rating for a user
     * @param user The address of the user
     * @return Average rating (1-5)
     */
    function getAverageRatingForUser(address user) external view returns (uint256);

    /**
     * @dev Check if a user can review another user (completed transaction required)
     * @param reviewer The address of the reviewer
     * @param reviewedUser The address of the user being reviewed
     * @param listingId The ID of the listing
     * @return True if review is allowed
     */
    function canReview(
        address reviewer,
        address reviewedUser,
        uint256 listingId
    ) external view returns (bool);

    /**
     * @dev Get total number of reviews in the system
     * @return Total number of reviews
     */
    function getTotalReviews() external view returns (uint256);

    /**
     * @dev Get reviews by rating range
     * @param minRating Minimum rating (1-5)
     * @param maxRating Maximum rating (1-5)
     * @return Array of review IDs
     */
    function getReviewsByRating(uint256 minRating, uint256 maxRating) external view returns (uint256[] memory);
} 