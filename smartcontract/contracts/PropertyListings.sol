// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./interfaces/IPropertyListings.sol";
import "./interfaces/IUserRegistry.sol";

contract PropertyListings is
    IPropertyListings,
    Ownable,
    Pausable,
    ReentrancyGuard
{
    using Strings for uint256;

    mapping(uint256 => PropertyListing) private _listings;
    mapping(address => uint256[]) private _ownerListings;
    mapping(TransactionType => uint256[]) private _listingsByType;
    mapping(string => uint256[]) private _listingsByLocation;
    mapping(uint256 => SwapProposal) private _swapProposals;
    mapping(uint256 => uint256[]) private _swapProposalsForListing;

    uint256 private _nextListingId = 1;
    uint256 private _nextProposalId = 1;
    uint256 private _totalListings;
    uint256 private _totalActiveListings;

    uint256 public constant MIN_LISTING_DURATION = 1 days;
    uint256 public constant MAX_LISTING_DURATION = 365 days;
    uint256 public constant MIN_PROPERTY_SIZE = 100;
    uint256 public constant MAX_PROPERTY_SIZE = 10000;
    uint256 public constant MAX_BEDROOMS = 20;
    uint256 public constant MAX_BATHROOMS = 10;
    uint256 public constant MIN_YEAR_BUILT = 1800;
    uint256 public constant MAX_YEAR_BUILT = 2030;

    address public userRegistry;
    address public smartCribsCore;

    modifier onlyListingOwner(uint256 listingId) {
        require(
            _listings[listingId].owner == msg.sender,
            "PropertyListings: Not listing owner"
        );
        _;
    }

    modifier onlyActiveListing(uint256 listingId) {
        require(
            _listings[listingId].status == ListingStatus.Active,
            "PropertyListings: Listing not active"
        );
        _;
    }

    modifier onlyVerifiedListing(uint256 listingId) {
        require(
            _listings[listingId].verificationStatus ==
                VerificationStatus.Verified,
            "PropertyListings: Listing not verified"
        );
        _;
    }

    modifier onlyValidPropertyDetails(PropertyDetails calldata details) {
        require(
            bytes(details.location).length > 0,
            "PropertyListings: Location required"
        );
        require(
            details.size >= MIN_PROPERTY_SIZE &&
                details.size <= MAX_PROPERTY_SIZE,
            "PropertyListings: Invalid property size"
        );
        require(
            details.bedrooms <= MAX_BEDROOMS,
            "PropertyListings: Too many bedrooms"
        );
        require(
            details.bathrooms <= MAX_BATHROOMS,
            "PropertyListings: Too many bathrooms"
        );
        require(
            details.yearBuilt >= MIN_YEAR_BUILT &&
                details.yearBuilt <= MAX_YEAR_BUILT,
            "PropertyListings: Invalid year built"
        );
        require(
            bytes(details.propertyType).length > 0,
            "PropertyListings: Property type required"
        );
        require(
            bytes(details.propertyHash).length > 0,
            "PropertyListings: Property hash required"
        );
        _;
    }

    modifier onlyValidDuration(uint256 duration) {
        require(
            duration >= MIN_LISTING_DURATION &&
                duration <= MAX_LISTING_DURATION,
            "PropertyListings: Invalid listing duration"
        );
        _;
    }

    modifier onlyVerifier() {
        require(
            msg.sender == owner() || msg.sender == smartCribsCore,
            "PropertyListings: Not authorized verifier"
        );
        _;
    }

    constructor(
        address _userRegistry,
        address _smartCribsCore
    ) Ownable(msg.sender) {
        userRegistry = _userRegistry;
        smartCribsCore = _smartCribsCore;
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
    )
        external
        override
        whenNotPaused
        nonReentrant
        onlyValidPropertyDetails(propertyDetails)
        onlyValidDuration(duration)
        returns (uint256)
    {
        require(
            IUserRegistry(userRegistry).canListProperties(msg.sender),
            "PropertyListings: User cannot create listings"
        );
        require(
            bytes(ownershipProof).length > 0,
            "PropertyListings: Ownership proof required"
        );

        uint256 listingId = _nextListingId++;

        PropertyListing memory newListing = PropertyListing({
            listingId: listingId,
            owner: msg.sender,
            transactionType: transactionType,
            status: ListingStatus.Pending,
            verificationStatus: VerificationStatus.Pending,
            propertyDetails: propertyDetails,
            price: price,
            paymentToken: paymentToken,
            createdAt: block.timestamp,
            updatedAt: block.timestamp,
            expiresAt: block.timestamp + duration,
            views: 0,
            inquiries: 0,
            rentalTerms: rentalTerms,
            swapTerms: swapTerms,
            saleTerms: saleTerms,
            ownershipProof: ownershipProof,
            verifier: address(0),
            verifiedAt: 0,
            verificationNotes: ""
        });

        _listings[listingId] = newListing;
        _ownerListings[msg.sender].push(listingId);
        _listingsByType[transactionType].push(listingId);
        _listingsByLocation[propertyDetails.location].push(listingId);

        _totalListings++;

        emit PropertyListed(
            listingId,
            msg.sender,
            transactionType,
            price,
            block.timestamp
        );

        return listingId;
    }

    function createListingByCore(
        address user,
        TransactionType transactionType,
        PropertyDetails calldata propertyDetails,
        uint256 price,
        address paymentToken,
        uint256 duration,
        RentalTerms calldata rentalTerms,
        SwapTerms calldata swapTerms,
        SaleTerms calldata saleTerms,
        string calldata ownershipProof
    )
        external
        whenNotPaused
        nonReentrant
        onlyValidPropertyDetails(propertyDetails)
        onlyValidDuration(duration)
        returns (uint256)
    {
        require(
            msg.sender == smartCribsCore,
            "PropertyListings: Only SmartCribsCore can create listings"
        );

        require(
            IUserRegistry(userRegistry).canListProperties(user),
            "PropertyListings: User cannot create listings"
        );
        require(
            bytes(ownershipProof).length > 0,
            "PropertyListings: Ownership proof required"
        );

        uint256 listingId = _nextListingId++;

        PropertyListing memory newListing = PropertyListing({
            listingId: listingId,
            owner: user,
            transactionType: transactionType,
            status: ListingStatus.Pending,
            verificationStatus: VerificationStatus.Pending,
            propertyDetails: propertyDetails,
            price: price,
            paymentToken: paymentToken,
            createdAt: block.timestamp,
            updatedAt: block.timestamp,
            expiresAt: block.timestamp + duration,
            views: 0,
            inquiries: 0,
            rentalTerms: rentalTerms,
            swapTerms: swapTerms,
            saleTerms: saleTerms,
            ownershipProof: ownershipProof,
            verifier: address(0),
            verifiedAt: 0,
            verificationNotes: ""
        });

        _listings[listingId] = newListing;
        _ownerListings[user].push(listingId);
        _listingsByType[transactionType].push(listingId);
        _listingsByLocation[propertyDetails.location].push(listingId);

        _totalListings++;

        emit PropertyListed(
            listingId,
            user,
            transactionType,
            price,
            block.timestamp
        );

        return listingId;
    }

    function updateListing(
        uint256 listingId,
        PropertyDetails calldata propertyDetails,
        uint256 price,
        address paymentToken,
        RentalTerms calldata rentalTerms,
        SwapTerms calldata swapTerms,
        SaleTerms calldata saleTerms
    )
        external
        override
        whenNotPaused
        onlyListingOwner(listingId)
        onlyValidPropertyDetails(propertyDetails)
    {
        require(
            _listings[listingId].status == ListingStatus.Active ||
                _listings[listingId].status == ListingStatus.Pending,
            "PropertyListings: Cannot update listing in current status"
        );

        PropertyListing storage listing = _listings[listingId];

        if (
            keccak256(bytes(listing.propertyDetails.location)) !=
            keccak256(bytes(propertyDetails.location))
        ) {
            _removeFromLocationArray(
                listing.propertyDetails.location,
                listingId
            );
            _listingsByLocation[propertyDetails.location].push(listingId);
        }

        listing.propertyDetails = propertyDetails;
        listing.price = price;
        listing.paymentToken = paymentToken;
        listing.rentalTerms = rentalTerms;
        listing.swapTerms = swapTerms;
        listing.saleTerms = saleTerms;
        listing.updatedAt = block.timestamp;

        emit PropertyUpdated(listingId, msg.sender, block.timestamp);
    }

    function delistProperty(
        uint256 listingId
    ) external override whenNotPaused onlyListingOwner(listingId) {
        PropertyListing storage listing = _listings[listingId];
        require(
            listing.status == ListingStatus.Active ||
                listing.status == ListingStatus.Pending,
            "PropertyListings: Cannot delist listing in current status"
        );

        listing.status = ListingStatus.Cancelled;
        listing.updatedAt = block.timestamp;

        if (listing.status == ListingStatus.Active) {
            _totalActiveListings--;
        }

        emit PropertyDelisted(listingId, msg.sender, block.timestamp);
    }

    function getListing(
        uint256 listingId
    ) external view override returns (PropertyListing memory) {
        require(
            _listings[listingId].listingId != 0,
            "PropertyListings: Listing does not exist"
        );
        return _listings[listingId];
    }

    function getListingsByOwner(
        address owner
    ) external view override returns (uint256[] memory) {
        return _ownerListings[owner];
    }

    function getListingsByType(
        TransactionType transactionType
    ) external view override returns (uint256[] memory) {
        return _listingsByType[transactionType];
    }

    function getListingsByLocation(
        string calldata location
    ) external view override returns (uint256[] memory) {
        return _listingsByLocation[location];
    }

    function getActiveListings()
        external
        view
        override
        returns (uint256[] memory)
    {
        uint256[] memory activeListings = new uint256[](_totalActiveListings);
        uint256 count = 0;

        for (uint256 i = 1; i < _nextListingId; i++) {
            if (_listings[i].status == ListingStatus.Active) {
                activeListings[count] = i;
                count++;
            }
        }

        return activeListings;
    }

    function verifyProperty(
        uint256 listingId,
        bool verified,
        string calldata notes
    ) external override whenNotPaused onlyVerifier {
        require(
            _listings[listingId].listingId != 0,
            "PropertyListings: Listing does not exist"
        );

        PropertyListing storage listing = _listings[listingId];
        listing.verificationStatus = verified
            ? VerificationStatus.Verified
            : VerificationStatus.Rejected;
        listing.verifier = msg.sender;
        listing.verifiedAt = block.timestamp;
        listing.verificationNotes = notes;

        if (verified && listing.status == ListingStatus.Pending) {
            listing.status = ListingStatus.Active;
            _totalActiveListings++;
        }

        emit PropertyVerified(listingId, msg.sender, verified, block.timestamp);
    }

    function incrementViews(uint256 listingId) external override whenNotPaused {
        require(
            _listings[listingId].listingId != 0,
            "PropertyListings: Listing does not exist"
        );
        _listings[listingId].views++;
    }

    function incrementInquiries(
        uint256 listingId
    ) external override whenNotPaused {
        require(
            _listings[listingId].listingId != 0,
            "PropertyListings: Listing does not exist"
        );
        _listings[listingId].inquiries++;
    }

    function createSwapProposal(
        uint256 listingId,
        uint256 swapListingId,
        uint256 proposedDate
    )
        external
        override
        whenNotPaused
        onlyActiveListing(listingId)
        onlyActiveListing(swapListingId)
        returns (uint256)
    {
        require(
            _listings[listingId].transactionType == TransactionType.Swap,
            "PropertyListings: Listing not for swap"
        );
        require(
            _listings[swapListingId].transactionType == TransactionType.Swap,
            "PropertyListings: Swap listing not for swap"
        );
        require(
            _listings[listingId].owner != msg.sender,
            "PropertyListings: Cannot propose swap to own listing"
        );
        require(
            _listings[swapListingId].owner == msg.sender,
            "PropertyListings: Must own swap listing"
        );
        require(
            proposedDate > block.timestamp,
            "PropertyListings: Proposed date must be in future"
        );

        uint256 proposalId = _nextProposalId++;

        SwapProposal memory newProposal = SwapProposal({
            proposalId: proposalId,
            listingId: listingId,
            swapListingId: swapListingId,
            proposer: msg.sender,
            recipient: _listings[listingId].owner,
            proposedDate: proposedDate,
            accepted: false,
            rejected: false,
            createdAt: block.timestamp,
            respondedAt: 0
        });

        _swapProposals[proposalId] = newProposal;
        _swapProposalsForListing[listingId].push(proposalId);

        emit SwapProposalCreated(
            listingId,
            swapListingId,
            msg.sender,
            block.timestamp
        );

        return proposalId;
    }

    function createSwapProposalByCore(
        address user,
        uint256 listingId,
        uint256 swapListingId,
        uint256 proposedDate
    )
        external
        whenNotPaused
        onlyActiveListing(listingId)
        onlyActiveListing(swapListingId)
        returns (uint256)
    {
        require(
            msg.sender == smartCribsCore,
            "PropertyListings: Only SmartCribsCore can create swap proposals"
        );
        require(
            _listings[listingId].transactionType == TransactionType.Swap,
            "PropertyListings: Listing not for swap"
        );
        require(
            _listings[swapListingId].transactionType == TransactionType.Swap,
            "PropertyListings: Swap listing not for swap"
        );
        require(
            _listings[listingId].owner != user,
            "PropertyListings: Cannot propose swap to own listing"
        );
        require(
            _listings[swapListingId].owner == user,
            "PropertyListings: Must own swap listing"
        );
        require(
            proposedDate > block.timestamp,
            "PropertyListings: Proposed date must be in future"
        );

        uint256 proposalId = _nextProposalId++;

        SwapProposal memory newProposal = SwapProposal({
            proposalId: proposalId,
            listingId: listingId,
            swapListingId: swapListingId,
            proposer: user,
            recipient: _listings[listingId].owner,
            proposedDate: proposedDate,
            accepted: false,
            rejected: false,
            createdAt: block.timestamp,
            respondedAt: 0
        });

        _swapProposals[proposalId] = newProposal;
        _swapProposalsForListing[listingId].push(proposalId);

        emit SwapProposalCreated(
            listingId,
            swapListingId,
            user,
            block.timestamp
        );

        return proposalId;
    }

    function respondToSwapProposal(
        uint256 proposalId,
        bool accept
    ) external override whenNotPaused {
        SwapProposal storage proposal = _swapProposals[proposalId];
        require(
            proposal.proposalId != 0,
            "PropertyListings: Proposal does not exist"
        );
        require(
            proposal.recipient == msg.sender,
            "PropertyListings: Not proposal recipient"
        );
        require(
            !proposal.accepted && !proposal.rejected,
            "PropertyListings: Proposal already responded to"
        );

        proposal.accepted = accept;
        proposal.rejected = !accept;
        proposal.respondedAt = block.timestamp;

        if (accept) {
            _listings[proposal.listingId].status = ListingStatus.Swapped;
            _listings[proposal.swapListingId].status = ListingStatus.Swapped;
            _totalActiveListings -= 2;
        }
    }

    function respondToSwapProposalByCore(
        address user,
        uint256 proposalId,
        bool accept
    ) external whenNotPaused {
        require(
            msg.sender == smartCribsCore,
            "PropertyListings: Only SmartCribsCore can respond to swap proposals"
        );
        SwapProposal storage proposal = _swapProposals[proposalId];
        require(
            proposal.proposalId != 0,
            "PropertyListings: Proposal does not exist"
        );
        require(
            proposal.recipient == user,
            "PropertyListings: Not proposal recipient"
        );
        require(
            !proposal.accepted && !proposal.rejected,
            "PropertyListings: Proposal already responded to"
        );

        proposal.accepted = accept;
        proposal.rejected = !accept;
        proposal.respondedAt = block.timestamp;

        if (accept) {
            _listings[proposal.listingId].status = ListingStatus.Swapped;
            _listings[proposal.swapListingId].status = ListingStatus.Swapped;
            _totalActiveListings -= 2;
        }
    }

    function getSwapProposal(
        uint256 proposalId
    ) external view override returns (SwapProposal memory) {
        require(
            _swapProposals[proposalId].proposalId != 0,
            "PropertyListings: Proposal does not exist"
        );
        return _swapProposals[proposalId];
    }

    function getSwapProposalsForListing(
        uint256 listingId
    ) external view override returns (uint256[] memory) {
        return _swapProposalsForListing[listingId];
    }

    function getTotalListings() external view override returns (uint256) {
        return _totalListings;
    }

    function getTotalActiveListings() external view override returns (uint256) {
        return _totalActiveListings;
    }

    function isListingActive(
        uint256 listingId
    ) external view override returns (bool) {
        return _listings[listingId].status == ListingStatus.Active;
    }

    function isListingOwner(
        uint256 listingId,
        address user
    ) external view override returns (bool) {
        return _listings[listingId].owner == user;
    }

    function canCreateListing(
        address user
    ) external view override returns (bool) {
        return IUserRegistry(userRegistry).canListProperties(user);
    }

    function _removeFromLocationArray(
        string memory location,
        uint256 listingId
    ) internal {
        uint256[] storage locationListings = _listingsByLocation[location];
        for (uint256 i = 0; i < locationListings.length; i++) {
            if (locationListings[i] == listingId) {
                locationListings[i] = locationListings[
                    locationListings.length - 1
                ];
                locationListings.pop();
                break;
            }
        }
    }

    function setUserRegistry(address _userRegistry) external onlyOwner {
        userRegistry = _userRegistry;
    }

    function setSmartCribsCore(address _smartCribsCore) external onlyOwner {
        smartCribsCore = _smartCribsCore;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function cleanupExpiredListings() external onlyOwner {
        for (uint256 i = 1; i < _nextListingId; i++) {
            if (
                _listings[i].status == ListingStatus.Active &&
                _listings[i].expiresAt < block.timestamp
            ) {
                _listings[i].status = ListingStatus.Expired;
                _totalActiveListings--;
            }
        }
    }
}
