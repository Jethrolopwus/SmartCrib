// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract SmartCribsCore is Ownable, Pausable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // Enums
    enum UserRole { Renter, Homeowner, Agent }
    enum TransactionType { Rent, Sale }
    enum ListingStatus { Active, Inactive, Rented, Sold }
    enum VerificationStatus { Pending, Verified, Rejected }

    // Structs
    struct UserProfile {
        UserRole role;
        string fullName;
        string profileHash;
        uint256 reputationScore;
        uint256 totalTransactions;
        bool isActive;
    }

    struct PropertyDetails {
        string location;
        uint256 size;
        uint256 bedrooms;
        uint256 bathrooms;
        string propertyType;
        string amenities;
        uint256 yearBuilt;
        bool furnished;
        bool petsAllowed;
        string propertyHash;
    }

    struct RentalTerms {
        uint256 minDuration;
        uint256 maxDuration;
        uint256 securityDeposit;
        bool utilitiesIncluded;
        string moveInDate;
    }

    struct SaleTerms {
        uint256 downPayment;
        bool financingAvailable;
        string closingDate;
        bool inspectionRequired;
    }

    struct PropertyListing {
        uint256 listingId;
        address owner;
        TransactionType transactionType;
        PropertyDetails propertyDetails;
        uint256 price;
        address paymentToken;
        uint256 duration;
        RentalTerms rentalTerms;
        SaleTerms saleTerms;
        string ownershipProof;
        ListingStatus status;
        VerificationStatus verificationStatus;
        uint256 views;
        uint256 inquiries;
        uint256 createdAt;
    }

    struct Review {
        uint256 reviewId;
        address reviewer;
        address reviewedUser;
        uint256 listingId;
        uint256 rating;
        string comment;
        uint256 createdAt;
    }

    struct PlatformStats {
        uint256 totalUsers;
        uint256 totalListings;
        uint256 totalTransactions;
        uint256 totalRevenue;
    }

    // State variables
    mapping(address => UserProfile) public userProfiles;
    mapping(uint256 => PropertyListing) public propertyListings;
    mapping(uint256 => Review) public reviews;
    mapping(address => bool) public isUserRegistered;
    mapping(address => bool) public supportedTokens;
    mapping(address => uint256[]) public userListings;
    mapping(address => uint256[]) public userReviews;

    PlatformStats public platformStats;
    uint256 public platformFee;
    uint256 public constant MAX_FEE = 500;
    uint256 public constant FEE_DENOMINATOR = 10000;
    uint256 public constant MAX_RATING = 5;

    uint256 public nextListingId = 1;
    uint256 public nextReviewId = 1;

    address public constant NATIVE_TOKEN = address(0);

    // Events
    event UserRegistered(address indexed user, UserRole role, string fullName, uint256 timestamp);
    event UserRoleUpdated(address indexed user, UserRole newRole, uint256 timestamp);
    event ProfileUpdated(address indexed user, string profileHash, uint256 timestamp);
    event PropertyListed(uint256 indexed listingId, address indexed owner, TransactionType transactionType, uint256 timestamp);
    event PropertyVerified(uint256 indexed listingId, bool verified, string reason, uint256 timestamp);
    event ReviewSubmitted(uint256 indexed reviewId, address indexed reviewer, address indexed reviewedUser, uint256 rating, uint256 timestamp);
    event PlatformInitialized(address indexed owner, uint256 timestamp);
    event FeeUpdated(uint256 newFee, uint256 timestamp);
    event TokenSupported(address indexed token, bool supported, uint256 timestamp);
    event FeeCollected(address indexed token, uint256 amount, uint256 timestamp);

    // Modifiers
    modifier onlyRegisteredUser() {
        require(isUserRegistered[msg.sender], "SmartCribsCore: User not registered");
        _;
    }

    modifier onlyValidFee(uint256 fee) {
        require(fee <= MAX_FEE, "SmartCribsCore: Fee too high");
        _;
    }

    modifier onlySupportedToken(address token) {
        require(supportedTokens[token] || token == NATIVE_TOKEN, "SmartCribsCore: Token not supported");
        _;
    }

    modifier onlyListingOwner(uint256 listingId) {
        require(propertyListings[listingId].owner == msg.sender, "SmartCribsCore: Not listing owner");
        _;
    }

    modifier onlyValidListing(uint256 listingId) {
        require(propertyListings[listingId].listingId != 0, "SmartCribsCore: Listing does not exist");
        _;
    }

    modifier onlyValidRating(uint256 rating) {
        require(rating > 0 && rating <= MAX_RATING, "SmartCribsCore: Invalid rating");
        _;
    }

    constructor() Ownable(msg.sender) {
        platformFee = 250;
        supportedTokens[NATIVE_TOKEN] = true;
    }

    // User Management Functions
    function registerUser(UserRole role, string calldata fullName, string calldata profileHash) 
        external 
        whenNotPaused 
        nonReentrant 
    {
        require(!isUserRegistered[msg.sender], "SmartCribsCore: User already registered");
        require(bytes(fullName).length > 0, "SmartCribsCore: Full name required");

        userProfiles[msg.sender] = UserProfile({
            role: role,
            fullName: fullName,
            profileHash: profileHash,
            reputationScore: 0,
            totalTransactions: 0,
            isActive: true
        });

        isUserRegistered[msg.sender] = true;
        platformStats.totalUsers++;

        emit UserRegistered(msg.sender, role, fullName, block.timestamp);
    }

    function updateUserRole(UserRole newRole) 
        external 
        whenNotPaused 
        onlyRegisteredUser 
    {
        userProfiles[msg.sender].role = newRole;
        emit UserRoleUpdated(msg.sender, newRole, block.timestamp);
    }

    function updateProfile(string calldata profileHash) 
        external 
        whenNotPaused 
        onlyRegisteredUser 
    {
        userProfiles[msg.sender].profileHash = profileHash;
        emit ProfileUpdated(msg.sender, profileHash, block.timestamp);
    }

    function getUserProfile(address user) external view returns (UserProfile memory) {
        return userProfiles[user];
    }

    // Property Listing Functions
    function createPropertyListing(
        TransactionType transactionType,
        PropertyDetails calldata propertyDetails,
        uint256 price,
        address paymentToken,
        uint256 duration,
        RentalTerms calldata rentalTerms,
        SaleTerms calldata saleTerms,
        string calldata ownershipProof
    ) external whenNotPaused onlyRegisteredUser onlySupportedToken(paymentToken) {
        require(bytes(propertyDetails.location).length > 0, "SmartCribsCore: Location required");
        require(price > 0, "SmartCribsCore: Price must be greater than 0");

        uint256 listingId = nextListingId++;
        
        propertyListings[listingId] = PropertyListing({
            listingId: listingId,
            owner: msg.sender,
            transactionType: transactionType,
            propertyDetails: propertyDetails,
            price: price,
            paymentToken: paymentToken,
            duration: duration,
            rentalTerms: rentalTerms,
            saleTerms: saleTerms,
            ownershipProof: ownershipProof,
            status: ListingStatus.Active,
            verificationStatus: VerificationStatus.Pending,
            views: 0,
            inquiries: 0,
            createdAt: block.timestamp
        });

        userListings[msg.sender].push(listingId);
        platformStats.totalListings++;

        emit PropertyListed(listingId, msg.sender, transactionType, block.timestamp);
    }

    function verifyProperty(uint256 listingId, bool verified, string calldata reason) 
        external 
        onlyOwner 
        onlyValidListing(listingId) 
    {
        propertyListings[listingId].verificationStatus = verified ? VerificationStatus.Verified : VerificationStatus.Rejected;
        emit PropertyVerified(listingId, verified, reason, block.timestamp);
    }

    function getPropertyListing(uint256 listingId) external view returns (PropertyListing memory) {
        return propertyListings[listingId];
    }

    function getPropertyListingsByOwner(address owner) external view returns (uint256[] memory) {
        return userListings[owner];
    }

    function getTotalPropertyListings() external view returns (uint256) {
        return platformStats.totalListings;
    }

    function getTotalActivePropertyListings() external view returns (uint256) {
        uint256 count = 0;
        for (uint256 i = 1; i < nextListingId; i++) {
            if (propertyListings[i].status == ListingStatus.Active && 
                propertyListings[i].verificationStatus == VerificationStatus.Verified) {
                count++;
            }
        }
        return count;
    }

    // Review Functions
    function submitReview(
        address reviewedUser,
        uint256 listingId,
        uint256 rating,
        string calldata comment
    ) external whenNotPaused onlyRegisteredUser onlyValidRating(rating) onlyValidListing(listingId) {
        require(reviewedUser != msg.sender, "SmartCribsCore: Cannot review yourself");
        require(isUserRegistered[reviewedUser], "SmartCribsCore: Reviewed user not registered");

        uint256 reviewId = nextReviewId++;
        
        reviews[reviewId] = Review({
            reviewId: reviewId,
            reviewer: msg.sender,
            reviewedUser: reviewedUser,
            listingId: listingId,
            rating: rating,
            comment: comment,
            createdAt: block.timestamp
        });

        userReviews[msg.sender].push(reviewId);
        
        // Update reputation score
        uint256 currentScore = userProfiles[reviewedUser].reputationScore;
        uint256 totalReviews = userReviews[reviewedUser].length;
        userProfiles[reviewedUser].reputationScore = (currentScore + rating) / (totalReviews + 1);

        emit ReviewSubmitted(reviewId, msg.sender, reviewedUser, rating, block.timestamp);
    }

    function getReview(uint256 reviewId) external view returns (Review memory) {
        return reviews[reviewId];
    }

    function getUserReviews(address user) external view returns (uint256[] memory) {
        return userReviews[user];
    }

    // Platform Management Functions
    function getPlatformStats() external view returns (PlatformStats memory) {
        return platformStats;
    }

    function updatePlatformFee(uint256 newFee) external onlyOwner onlyValidFee(newFee) {
        platformFee = newFee;
        emit FeeUpdated(newFee, block.timestamp);
    }

    function addSupportedToken(address token) external onlyOwner {
        supportedTokens[token] = true;
        emit TokenSupported(token, true, block.timestamp);
    }

    function removeSupportedToken(address token) external onlyOwner {
        supportedTokens[token] = false;
        emit TokenSupported(token, false, block.timestamp);
    }

    function withdrawFees() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "SmartCribsCore: No fees to withdraw");

        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "SmartCribsCore: Fee withdrawal failed");
        
        emit FeeCollected(NATIVE_TOKEN, balance, block.timestamp);
    }

    function withdrawTokenFees(address token) external onlyOwner nonReentrant onlySupportedToken(token) {
        uint256 balance = IERC20(token).balanceOf(address(this));
        require(balance > 0, "SmartCribsCore: No token fees to withdraw");

        IERC20(token).safeTransfer(owner(), balance);
        emit FeeCollected(token, balance, block.timestamp);
    }

    // Utility Functions
    function canListProperties(address user) external view returns (bool) {
        return isUserRegistered[user] && 
               (userProfiles[user].role == UserRole.Homeowner || userProfiles[user].role == UserRole.Agent);
    }

    function canRentProperties(address user) external view returns (bool) {
        return isUserRegistered[user] && userProfiles[user].isActive;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    // Emergency functions
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        if (balance > 0) {
            (bool success, ) = payable(owner()).call{value: balance}("");
            require(success, "SmartCribsCore: Emergency withdrawal failed");
        }
    }
}
