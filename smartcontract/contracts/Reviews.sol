// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./interfaces/IReviews.sol";
import "./interfaces/IPropertyListings.sol";
import "./interfaces/IUserRegistry.sol";

contract Reviews is IReviews, Ownable, Pausable, ReentrancyGuard {
    using Strings for uint256;

    mapping(uint256 => Review) private _reviews;
    mapping(address => uint256[]) private _userReviews;
    mapping(address => uint256[]) private _userGivenReviews;
    mapping(uint256 => uint256[]) private _listingReviews;
    mapping(address => UserReputation) private _userReputations;
    mapping(address => mapping(uint256 => bool)) private _hasReviewed;

    uint256 private _nextReviewId = 1;
    uint256 private _totalReviews;

    uint256 public constant MIN_RATING = 1;
    uint256 public constant MAX_RATING = 5;
    uint256 public constant MIN_COMMENT_LENGTH = 10;
    uint256 public constant MAX_COMMENT_LENGTH = 1000;

    IPropertyListings public propertyListings;
    IUserRegistry public userRegistry;

    modifier onlyValidRating(uint256 rating) {
        require(
            rating >= MIN_RATING && rating <= MAX_RATING,
            "Reviews: Invalid rating"
        );
        _;
    }

    modifier onlyValidComment(string calldata comment) {
        require(
            bytes(comment).length >= MIN_COMMENT_LENGTH,
            "Reviews: Comment too short"
        );
        require(
            bytes(comment).length <= MAX_COMMENT_LENGTH,
            "Reviews: Comment too long"
        );
        _;
    }

    modifier onlyReviewOwner(uint256 reviewId) {
        require(
            _reviews[reviewId].reviewer == msg.sender,
            "Reviews: Not review owner"
        );
        _;
    }

    modifier onlyActiveReview(uint256 reviewId) {
        require(_reviews[reviewId].isActive, "Reviews: Review not active");
        _;
    }

    modifier onlyRegisteredUser() {
        require(
            userRegistry.isUserRegistered(msg.sender),
            "Reviews: User not registered"
        );
        _;
    }

    constructor(
        address _propertyListings,
        address _userRegistry
    ) Ownable(msg.sender) {
        propertyListings = IPropertyListings(_propertyListings);
        userRegistry = IUserRegistry(_userRegistry);
    }

    function submitReview(
        address reviewedUser,
        uint256 listingId,
        uint256 rating,
        string calldata comment
    )
        external
        override
        whenNotPaused
        nonReentrant
        onlyRegisteredUser
        onlyValidRating(rating)
        onlyValidComment(comment)
        returns (uint256)
    {
        require(reviewedUser != address(0), "Reviews: Invalid reviewed user");
        require(reviewedUser != msg.sender, "Reviews: Cannot review yourself");
        require(
            _canReview(msg.sender, reviewedUser, listingId),
            "Reviews: Cannot review - no completed transaction"
        );
        require(
            !_hasReviewed[msg.sender][listingId],
            "Reviews: Already reviewed this listing"
        );

        uint256 reviewId = _nextReviewId++;

        Review memory newReview = Review({
            reviewId: reviewId,
            reviewer: msg.sender,
            reviewedUser: reviewedUser,
            listingId: listingId,
            rating: rating,
            comment: comment,
            createdAt: block.timestamp,
            updatedAt: block.timestamp,
            isActive: true
        });

        _reviews[reviewId] = newReview;
        _userReviews[reviewedUser].push(reviewId);
        _userGivenReviews[msg.sender].push(reviewId);
        _listingReviews[listingId].push(reviewId);
        _hasReviewed[msg.sender][listingId] = true;
        _totalReviews++;

        _updateReputation(reviewedUser, rating);

        emit ReviewSubmitted(
            reviewId,
            msg.sender,
            reviewedUser,
            listingId,
            rating,
            block.timestamp
        );

        return reviewId;
    }

    function updateReview(
        uint256 reviewId,
        uint256 newRating,
        string calldata newComment
    )
        external
        override
        whenNotPaused
        nonReentrant
        onlyReviewOwner(reviewId)
        onlyActiveReview(reviewId)
        onlyValidRating(newRating)
        onlyValidComment(newComment)
    {
        Review storage review = _reviews[reviewId];

        _updateReputation(review.reviewedUser, review.rating, true);

        review.rating = newRating;
        review.comment = newComment;
        review.updatedAt = block.timestamp;

        _updateReputation(review.reviewedUser, newRating);

        emit ReviewUpdated(reviewId, msg.sender, newRating, block.timestamp);
    }

    function getReview(
        uint256 reviewId
    ) external view override returns (Review memory) {
        require(
            reviewId > 0 && reviewId < _nextReviewId,
            "Reviews: Invalid review ID"
        );
        return _reviews[reviewId];
    }

    function getReviewsForUser(
        address user
    ) external view override returns (uint256[] memory) {
        return _userReviews[user];
    }

    function getReviewsForListing(
        uint256 listingId
    ) external view override returns (uint256[] memory) {
        return _listingReviews[listingId];
    }

    function getFilteredReviews(
        ReviewFilters calldata filters
    ) external view override returns (uint256[] memory) {
        uint256[] memory tempResults = new uint256[](_totalReviews);
        uint256 resultCount = 0;

        for (uint256 i = 1; i < _nextReviewId; i++) {
            Review memory review = _reviews[i];

            if (!review.isActive) continue;

            if (filters.minRating > 0 && review.rating < filters.minRating)
                continue;
            if (filters.maxRating > 0 && review.rating > filters.maxRating)
                continue;

            if (filters.startDate > 0 && review.createdAt < filters.startDate)
                continue;
            if (filters.endDate > 0 && review.createdAt > filters.endDate)
                continue;

            if (
                bytes(filters.location).length > 0 ||
                filters.minPrice > 0 ||
                filters.maxPrice > 0
            ) {
                try propertyListings.getListing(review.listingId) returns (
                    IPropertyListings.PropertyListing memory listing
                ) {
                    if (bytes(filters.location).length > 0) {
                        if (
                            !_stringsEqual(
                                listing.propertyDetails.location,
                                filters.location
                            )
                        ) continue;
                    }

                    if (
                        filters.minPrice > 0 && listing.price < filters.minPrice
                    ) continue;
                    if (
                        filters.maxPrice > 0 && listing.price > filters.maxPrice
                    ) continue;
                } catch {
                    continue;
                }
            }

            tempResults[resultCount] = review.reviewId;
            resultCount++;
        }

        uint256[] memory results = new uint256[](resultCount);
        for (uint256 i = 0; i < resultCount; i++) {
            results[i] = tempResults[i];
        }

        return results;
    }

    function getUserReputation(
        address user
    ) external view override returns (UserReputation memory) {
        return _userReputations[user];
    }

    function getTotalReviewsForUser(
        address user
    ) external view override returns (uint256) {
        return _userReviews[user].length;
    }

    function getAverageRatingForUser(
        address user
    ) external view override returns (uint256) {
        uint256[] memory reviews = _userReviews[user];
        if (reviews.length == 0) return 0;

        uint256 totalRating = 0;
        uint256 activeReviews = 0;

        for (uint256 i = 0; i < reviews.length; i++) {
            Review memory review = _reviews[reviews[i]];
            if (review.isActive) {
                totalRating += review.rating;
                activeReviews++;
            }
        }

        return activeReviews > 0 ? totalRating / activeReviews : 0;
    }

    function canReview(
        address reviewer,
        address reviewedUser,
        uint256 listingId
    ) external view override returns (bool) {
        return _canReview(reviewer, reviewedUser, listingId);
    }

    function _canReview(
        address reviewer,
        address reviewedUser,
        uint256 listingId
    ) internal view returns (bool) {
        if (
            !userRegistry.isUserRegistered(reviewer) ||
            !userRegistry.isUserRegistered(reviewedUser)
        ) {
            return false;
        }

        if (_hasReviewed[reviewer][listingId]) {
            return false;
        }

        try propertyListings.getListing(listingId) returns (
            IPropertyListings.PropertyListing memory listing
        ) {
            return
                listing.owner == reviewedUser &&
                listing.status != IPropertyListings.ListingStatus.Active;
        } catch {
            return false;
        }
    }

    function getTotalReviews() external view override returns (uint256) {
        return _totalReviews;
    }

    function getReviewsByRating(
        uint256 minRating,
        uint256 maxRating
    ) external view override returns (uint256[] memory) {
        require(
            minRating >= MIN_RATING &&
                maxRating <= MAX_RATING &&
                minRating <= maxRating,
            "Reviews: Invalid rating range"
        );

        uint256[] memory tempResults = new uint256[](_totalReviews);
        uint256 resultCount = 0;

        for (uint256 i = 1; i < _nextReviewId; i++) {
            Review memory review = _reviews[i];

            if (
                review.isActive &&
                review.rating >= minRating &&
                review.rating <= maxRating
            ) {
                tempResults[resultCount] = review.reviewId;
                resultCount++;
            }
        }

        uint256[] memory results = new uint256[](resultCount);
        for (uint256 i = 0; i < resultCount; i++) {
            results[i] = tempResults[i];
        }

        return results;
    }

    function getReviewsGivenByUser(
        address user
    ) external view returns (uint256[] memory) {
        return _userGivenReviews[user];
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function _updateReputation(address user, uint256 rating) internal {
        _updateReputation(user, rating, false);
    }

    function _updateReputation(
        address user,
        uint256 rating,
        bool shouldRevert
    ) internal {
        UserReputation storage reputation = _userReputations[user];

        int256 scoreChange;
        if (rating >= 4) {
            scoreChange = shouldRevert ? int256(-10) : int256(10);
            if (!shouldRevert) reputation.positiveReviews++;
            else reputation.positiveReviews--;
        } else if (rating <= 2) {
            scoreChange = shouldRevert ? int256(5) : int256(-5);
            if (!shouldRevert) reputation.negativeReviews++;
            else reputation.negativeReviews--;
        } else {
            scoreChange = shouldRevert ? int256(-2) : int256(2);
        }

        if (shouldRevert) {
            reputation.reputationScore = reputation.reputationScore >
                uint256(-scoreChange)
                ? reputation.reputationScore - uint256(-scoreChange)
                : 0;
        } else {
            if (scoreChange > 0) {
                reputation.reputationScore += uint256(scoreChange);
            } else {
                uint256 decrease = uint256(-scoreChange);
                reputation.reputationScore = reputation.reputationScore >
                    decrease
                    ? reputation.reputationScore - decrease
                    : 0;
            }
        }

        uint256 totalRating = reputation.averageRating *
            reputation.totalReviews;
        if (shouldRevert) {
            reputation.totalReviews--;
            if (reputation.totalReviews > 0) {
                reputation.averageRating =
                    totalRating /
                    reputation.totalReviews;
            } else {
                reputation.averageRating = 0;
            }
        } else {
            reputation.totalReviews++;
            reputation.averageRating =
                (totalRating + rating) /
                reputation.totalReviews;
        }

        try userRegistry.updateReputationScore(user, scoreChange) {} catch {}

        emit ReputationUpdated(
            user,
            reputation.reputationScore,
            block.timestamp
        );
    }

    function _stringsEqual(
        string memory a,
        string memory b
    ) internal pure returns (bool) {
        return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
    }
}
