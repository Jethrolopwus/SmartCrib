// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./interfaces/ISmartCribsCore.sol";
import "./interfaces/IUserRegistry.sol";
import "./interfaces/IPropertyListings.sol";
import "./interfaces/IReviews.sol";
import "./UserRegistry.sol";
import "./PropertyListings.sol";
import "./Reviews.sol";

contract SmartCribsCore is ISmartCribsCore, Ownable, Pausable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    UserRegistry public userRegistry;
    PropertyListings public propertyListings;
    Reviews public reviews;
    PlatformStats private _platformStats;
    uint256 public platformFee;
    uint256 public constant MAX_FEE = 500;
    uint256 public constant FEE_DENOMINATOR = 10000;

    mapping(address => bool) public supportedTokens;
    address public constant NATIVE_TOKEN = address(0);

    event TokenSupported(
        address indexed token,
        bool supported,
        uint256 timestamp
    );
    event FeeCollected(
        address indexed token,
        uint256 amount,
        uint256 timestamp
    );

    modifier onlyRegisteredUser() {
        require(
            userRegistry.isUserRegistered(msg.sender),
            "SmartCribsCore: User not registered"
        );
        _;
    }

    modifier onlyValidFee(uint256 fee) {
        require(fee <= MAX_FEE, "SmartCribsCore: Fee too high");
        _;
    }

    modifier onlySupportedToken(address token) {
        require(
            supportedTokens[token] || token == NATIVE_TOKEN,
            "SmartCribsCore: Token not supported"
        );
        _;
    }

    constructor() Ownable(msg.sender) {
        platformFee = 250;
        supportedTokens[NATIVE_TOKEN] = true;

        userRegistry = new UserRegistry();
        propertyListings = new PropertyListings(
            address(userRegistry),
            address(this)
        );
        reviews = new Reviews(
            address(propertyListings),
            address(userRegistry)
        );

        userRegistry.transferOwnership(address(this));
        propertyListings.transferOwnership(address(this));
        reviews.transferOwnership(address(this));
    }

    function initialize() external override onlyOwner {
        require(
            address(userRegistry) != address(0),
            "SmartCribsCore: Already initialized"
        );
        emit PlatformInitialized(msg.sender, block.timestamp);
    }

    function registerUser(
        IUserRegistry.UserRole role,
        string calldata profileHash
    ) external override whenNotPaused nonReentrant {
        userRegistry.registerUserByCore(msg.sender, role, profileHash);
        _platformStats.totalUsers++;
    }

    function updateUserRole(
        IUserRegistry.UserRole newRole
    ) external override whenNotPaused onlyRegisteredUser {
        userRegistry.updateUserRoleByCore(msg.sender, newRole);
    }

    function updateProfile(
        string calldata profileHash
    ) external override whenNotPaused onlyRegisteredUser {
        userRegistry.updateProfileByCore(msg.sender, profileHash);
    }

    function getUserProfile(
        address user
    ) external view override returns (IUserRegistry.UserProfile memory) {
        return userRegistry.getUserProfile(user);
    }

    function isUserRegistered(
        address user
    ) external view override returns (bool) {
        return userRegistry.isUserRegistered(user);
    }

    function getPlatformStats()
        external
        view
        override
        returns (PlatformStats memory)
    {
        return _platformStats;
    }

    function updatePlatformFee(
        uint256 newFee
    ) external override onlyOwner onlyValidFee(newFee) {
        platformFee = newFee;
        emit FeeUpdated(newFee, block.timestamp);
    }

    function withdrawFees() external override onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "SmartCribsCore: No fees to withdraw");

        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "SmartCribsCore: Fee withdrawal failed");
    }

    function withdrawTokenFees(
        address token
    ) external onlyOwner nonReentrant onlySupportedToken(token) {
        uint256 balance = IERC20(token).balanceOf(address(this));
        require(balance > 0, "SmartCribsCore: No token fees to withdraw");

        IERC20(token).safeTransfer(owner(), balance);
    }

    function pause() external override onlyOwner {
        _pause();
        userRegistry.pause();
        emit EmergencyPaused(msg.sender, block.timestamp);
    }

    function unpause() external override onlyOwner {
        _unpause();
        userRegistry.unpause();
        emit EmergencyUnpaused(msg.sender, block.timestamp);
    }

    function isPaused() external view override returns (bool) {
        return paused();
    }

    function setTokenSupport(address token, bool supported) external onlyOwner {
        require(
            token != address(0),
            "SmartCribsCore: Cannot modify native token support"
        );
        supportedTokens[token] = supported;
        emit TokenSupported(token, supported, block.timestamp);
    }

    function calculateFee(uint256 amount) public view returns (uint256) {
        return (amount * platformFee) / FEE_DENOMINATOR;
    }

    function updatePlatformStats(
        int256 listingsChange,
        int256 transactionsChange,
        uint256 revenueChange
    ) external {
        // This will be called by other contracts (PropertyListings, TransactionManager)
        // In a full implementation, we'd add access control here

        if (listingsChange > 0) {
            _platformStats.totalListings += uint256(listingsChange);
        } else if (listingsChange < 0) {
            _platformStats.totalListings -= uint256(-listingsChange);
        }

        if (transactionsChange > 0) {
            _platformStats.totalTransactions += uint256(transactionsChange);
        } else if (transactionsChange < 0) {
            _platformStats.totalTransactions -= uint256(-transactionsChange);
        }

        _platformStats.totalRevenue += revenueChange;
    }

    function updatePlatformStatsFromPropertyListings() external {
        uint256 totalListings = propertyListings.getTotalListings();
        uint256 totalActiveListings = propertyListings.getTotalActiveListings();

        _platformStats.totalListings = totalListings;
    }

    function getUserRegistryAddress() external view returns (address) {
        return address(userRegistry);
    }

    function canListProperties(address user) external view returns (bool) {
        return userRegistry.canListProperties(user);
    }

    function canRentProperties(address user) external view returns (bool) {
        return userRegistry.canRentProperties(user);
    }

    function createPropertyListing(
        IPropertyListings.TransactionType transactionType,
        IPropertyListings.PropertyDetails calldata propertyDetails,
        uint256 price,
        address paymentToken,
        uint256 duration,
        IPropertyListings.RentalTerms calldata rentalTerms,
        IPropertyListings.SwapTerms calldata swapTerms,
        IPropertyListings.SaleTerms calldata saleTerms,
        string calldata ownershipProof
    ) external whenNotPaused onlyRegisteredUser returns (uint256) {
        return
            propertyListings.createListingByCore(
                msg.sender,
                transactionType,
                propertyDetails,
                price,
                paymentToken,
                duration,
                rentalTerms,
                swapTerms,
                saleTerms,
                ownershipProof
            );
    }

    function updatePropertyListing(
        uint256 listingId,
        IPropertyListings.PropertyDetails calldata propertyDetails,
        uint256 price,
        address paymentToken,
        IPropertyListings.RentalTerms calldata rentalTerms,
        IPropertyListings.SwapTerms calldata swapTerms,
        IPropertyListings.SaleTerms calldata saleTerms
    ) external whenNotPaused {
        propertyListings.updateListing(
            listingId,
            propertyDetails,
            price,
            paymentToken,
            rentalTerms,
            swapTerms,
            saleTerms
        );
    }

    function delistProperty(uint256 listingId) external whenNotPaused {
        propertyListings.delistProperty(listingId);
    }

    function getPropertyListing(
        uint256 listingId
    ) external view returns (IPropertyListings.PropertyListing memory) {
        return propertyListings.getListing(listingId);
    }

    function getPropertyListingsByOwner(
        address owner
    ) external view returns (uint256[] memory) {
        return propertyListings.getListingsByOwner(owner);
    }

    function getPropertyListingsByType(
        IPropertyListings.TransactionType transactionType
    ) external view returns (uint256[] memory) {
        return propertyListings.getListingsByType(transactionType);
    }

    function getPropertyListingsByLocation(
        string calldata location
    ) external view returns (uint256[] memory) {
        return propertyListings.getListingsByLocation(location);
    }

    function getActivePropertyListings()
        external
        view
        returns (uint256[] memory)
    {
        return propertyListings.getActiveListings();
    }

    function verifyProperty(
        uint256 listingId,
        bool verified,
        string calldata notes
    ) external onlyOwner {
        propertyListings.verifyProperty(listingId, verified, notes);
    }

    function createSwapProposal(
        uint256 listingId,
        uint256 swapListingId,
        uint256 proposedDate
    ) external whenNotPaused onlyRegisteredUser returns (uint256) {
        return
            propertyListings.createSwapProposalByCore(
                msg.sender,
                listingId,
                swapListingId,
                proposedDate
            );
    }

    function respondToSwapProposal(
        uint256 proposalId,
        bool accept
    ) external whenNotPaused {
        propertyListings.respondToSwapProposalByCore(
            msg.sender,
            proposalId,
            accept
        );
    }

    function getSwapProposal(
        uint256 proposalId
    ) external view returns (IPropertyListings.SwapProposal memory) {
        return propertyListings.getSwapProposal(proposalId);
    }

    function getSwapProposalsForListing(
        uint256 listingId
    ) external view returns (uint256[] memory) {
        return propertyListings.getSwapProposalsForListing(listingId);
    }

    function getTotalPropertyListings() external view returns (uint256) {
        return propertyListings.getTotalListings();
    }

    function getTotalActivePropertyListings() external view returns (uint256) {
        return propertyListings.getTotalActiveListings();
    }

    function isPropertyListingActive(
        uint256 listingId
    ) external view returns (bool) {
        return propertyListings.isListingActive(listingId);
    }

    function isPropertyListingOwner(
        uint256 listingId,
        address user
    ) external view returns (bool) {
        return propertyListings.isListingOwner(listingId, user);
    }

    function canCreatePropertyListing(
        address user
    ) external view returns (bool) {
        return propertyListings.canCreateListing(user);
    }

    function emergencyRecover(
        address token,
        address to,
        uint256 amount
    ) external onlyOwner {
        require(to != address(0), "SmartCribsCore: Invalid recipient");

        if (token == NATIVE_TOKEN) {
            require(
                amount <= address(this).balance,
                "SmartCribsCore: Insufficient balance"
            );
            (bool success, ) = payable(to).call{value: amount}("");
            require(success, "SmartCribsCore: Transfer failed");
        } else {
            IERC20(token).safeTransfer(to, amount);
        }
    }

    receive() external payable {}
}
