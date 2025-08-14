// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IPropertyListings {
    event PropertyListed(
        uint256 indexed listingId,
        address indexed owner,
        TransactionType transactionType,
        uint256 price,
        uint256 timestamp
    );
    event PropertyUpdated(
        uint256 indexed listingId,
        address indexed owner,
        uint256 timestamp
    );
    event PropertyDelisted(
        uint256 indexed listingId,
        address indexed owner,
        uint256 timestamp
    );
    event PropertyVerified(
        uint256 indexed listingId,
        address indexed verifier,
        bool verified,
        uint256 timestamp
    );
    event SwapProposalCreated(
        uint256 indexed listingId,
        uint256 indexed swapListingId,
        address indexed proposer,
        uint256 timestamp
    );

    enum TransactionType {
        Rent,
        Swap,
        Sale
    }

    enum ListingStatus {
        Active,
        Pending,
        Rented,
        Sold,
        Swapped,
        Cancelled,
        Expired
    }

    enum VerificationStatus {
        Unverified,
        Pending,
        Verified,
        Rejected
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

    struct SwapTerms {
        string desiredLocation;
        uint256 minSize;
        uint256 maxSize;
        uint256 swapDuration;
        string swapDate;
        bool flexibleDates;
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
        ListingStatus status;
        VerificationStatus verificationStatus;
        PropertyDetails propertyDetails;
        uint256 price;
        address paymentToken;
        uint256 createdAt;
        uint256 updatedAt;
        uint256 expiresAt;
        uint256 views;
        uint256 inquiries;
        RentalTerms rentalTerms;
        SwapTerms swapTerms;
        SaleTerms saleTerms;
        string ownershipProof;
        address verifier;
        uint256 verifiedAt;
        string verificationNotes;
    }

    struct SwapProposal {
        uint256 proposalId;
        uint256 listingId;
        uint256 swapListingId;
        address proposer;
        address recipient;
        uint256 proposedDate;
        bool accepted;
        bool rejected;
        uint256 createdAt;
        uint256 respondedAt;
    }

    function createListing(
        TransactionType transactionType,
        PropertyDetails calldata propertyDetails,
        uint256 price,
        address paymentToken,
        uint256 duration,
        RentalTerms calldata rentalTerms,
        SwapTerms calldata swapTerms,
        SaleTerms calldata saleTerms,
        string calldata ownershipProof
    ) external returns (uint256);

    function updateListing(
        uint256 listingId,
        PropertyDetails calldata propertyDetails,
        uint256 price,
        address paymentToken,
        RentalTerms calldata rentalTerms,
        SwapTerms calldata swapTerms,
        SaleTerms calldata saleTerms
    ) external;

    function delistProperty(uint256 listingId) external;

    function getListing(
        uint256 listingId
    ) external view returns (PropertyListing memory);

    function getListingsByOwner(
        address owner
    ) external view returns (uint256[] memory);

    function getListingsByType(
        TransactionType transactionType
    ) external view returns (uint256[] memory);

    function getListingsByLocation(
        string calldata location
    ) external view returns (uint256[] memory);

    function getActiveListings() external view returns (uint256[] memory);

    function verifyProperty(
        uint256 listingId,
        bool verified,
        string calldata notes
    ) external;

    function incrementViews(uint256 listingId) external;

    function incrementInquiries(uint256 listingId) external;

    function createSwapProposal(
        uint256 listingId,
        uint256 swapListingId,
        uint256 proposedDate
    ) external returns (uint256);

    function respondToSwapProposal(uint256 proposalId, bool accept) external;

    function getSwapProposal(
        uint256 proposalId
    ) external view returns (SwapProposal memory);

    function getSwapProposalsForListing(
        uint256 listingId
    ) external view returns (uint256[] memory);

    function getTotalListings() external view returns (uint256);

    function getTotalActiveListings() external view returns (uint256);

    function isListingActive(uint256 listingId) external view returns (bool);

    function isListingOwner(
        uint256 listingId,
        address user
    ) external view returns (bool);

    function canCreateListing(address user) external view returns (bool);
}
