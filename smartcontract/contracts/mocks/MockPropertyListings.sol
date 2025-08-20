// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "../interfaces/IPropertyListings.sol";

contract MockPropertyListings {
    mapping(uint256 => IPropertyListings.PropertyListing) private _listings;
    mapping(uint256 => bool) private _listingExists;

    function createMockListing(
        uint256 listingId,
        address owner,
        string memory location,
        uint256 price
    ) external {
        IPropertyListings.PropertyDetails memory details = IPropertyListings.PropertyDetails({
            location: location,
            size: 1000,
            bedrooms: 2,
            bathrooms: 1,
            propertyType: "Apartment",
            amenities: "WiFi, Parking",
            yearBuilt: 2020,
            furnished: true,
            petsAllowed: false,
            propertyHash: "QmHash123"
        });

        IPropertyListings.RentalTerms memory rentalTerms = IPropertyListings.RentalTerms({
            minDuration: 30 days,
            maxDuration: 365 days,
            securityDeposit: price / 2,
            utilitiesIncluded: true,
            moveInDate: "2024-01-01"
        });

        IPropertyListings.SwapTerms memory swapTerms = IPropertyListings.SwapTerms({
            desiredLocation: "",
            minSize: 0,
            maxSize: 0,
            swapDuration: 0,
            swapDate: "",
            flexibleDates: false
        });

        IPropertyListings.SaleTerms memory saleTerms = IPropertyListings.SaleTerms({
            downPayment: 0,
            financingAvailable: false,
            closingDate: "",
            inspectionRequired: false
        });

        IPropertyListings.PropertyListing memory listing = IPropertyListings.PropertyListing({
            listingId: listingId,
            owner: owner,
            transactionType: IPropertyListings.TransactionType.Rent,
            status: IPropertyListings.ListingStatus.Rented, // Completed transaction
            verificationStatus: IPropertyListings.VerificationStatus.Verified,
            propertyDetails: details,
            price: price,
            paymentToken: address(0),
            createdAt: block.timestamp,
            updatedAt: block.timestamp,
            expiresAt: block.timestamp + 365 days,
            views: 0,
            inquiries: 0,
            rentalTerms: rentalTerms,
            swapTerms: swapTerms,
            saleTerms: saleTerms,
            ownershipProof: "proof123",
            verifier: address(0),
            verifiedAt: block.timestamp,
            verificationNotes: "Verified"
        });

        _listings[listingId] = listing;
        _listingExists[listingId] = true;
    }

    function getListing(uint256 listingId) external view returns (IPropertyListings.PropertyListing memory) {
        require(_listingExists[listingId], "Listing does not exist");
        return _listings[listingId];
    }

    function isListingActive(uint256 listingId) external view returns (bool) {
        return _listingExists[listingId] && _listings[listingId].status == IPropertyListings.ListingStatus.Active;
    }
} 