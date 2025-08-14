const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PropertyListings", function () {
  let smartCribsCore, userRegistry, propertyListings;
  let owner, homeowner, renter, verifier;
  
  const PROFILE_HASH = "QmTestProfileHash123456789";
  const PROPERTY_HASH = "QmPropertyHash987654321";
  const OWNERSHIP_PROOF = "QmOwnershipProof123456789";

  beforeEach(async function () {
    [owner, homeowner, renter, verifier] = await ethers.getSigners();
    
    // Deploy SmartCribsCore (this will deploy UserRegistry and PropertyListings)
    const SmartCribsCore = await ethers.getContractFactory("SmartCribsCore");
    smartCribsCore = await SmartCribsCore.deploy();
    await smartCribsCore.waitForDeployment();

    // Get contract addresses
    const userRegistryAddress = await smartCribsCore.getUserRegistryAddress();
    userRegistry = await ethers.getContractAt("UserRegistry", userRegistryAddress);
    
    // PropertyListings is deployed by SmartCribsCore but we need to get its address
    // For now, we'll test through SmartCribsCore

    // Initialize platform
    await smartCribsCore.initialize();

    // Register users
    await smartCribsCore.connect(homeowner).registerUser(2, PROFILE_HASH); // Homeowner
    await smartCribsCore.connect(renter).registerUser(1, PROFILE_HASH); // Renter
  });

  describe("Property Listing Creation", function () {
    it("Should create a rental listing", async function () {
      const propertyDetails = {
        location: "123 Main St, New York, NY",
        size: 1500,
        bedrooms: 3,
        bathrooms: 2,
        propertyType: "Apartment",
        amenities: "Parking, Gym, Pool",
        yearBuilt: 2020,
        furnished: true,
        petsAllowed: false,
        propertyHash: PROPERTY_HASH
      };

      const rentalTerms = {
        minDuration: 30,
        maxDuration: 365,
        securityDeposit: ethers.parseEther("2.0"),
        utilitiesIncluded: true,
        moveInDate: "2024-01-01"
      };

      const swapTerms = {
        desiredLocation: "",
        minSize: 0,
        maxSize: 0,
        swapDuration: 0,
        swapDate: "",
        flexibleDates: false
      };

      const saleTerms = {
        downPayment: 0,
        financingAvailable: false,
        closingDate: "",
        inspectionRequired: false
      };

      const price = ethers.parseEther("2.5"); // 2.5 ETH per month
      const duration = 30 * 24 * 60 * 60; // 30 days

      const tx = await smartCribsCore.connect(homeowner).createPropertyListing(
        0, // TransactionType.Rent
        propertyDetails,
        price,
        ethers.ZeroAddress, // Native token
        duration,
        rentalTerms,
        swapTerms,
        saleTerms,
        OWNERSHIP_PROOF
      );

      const receipt = await tx.wait();
      expect(receipt.status).to.equal(1);

      // Check if listing was created
      const totalListings = await smartCribsCore.getTotalPropertyListings();
      expect(totalListings).to.equal(1);
    });

    it("Should create a sale listing", async function () {
      const propertyDetails = {
        location: "456 Oak Ave, Los Angeles, CA",
        size: 2500,
        bedrooms: 4,
        bathrooms: 3,
        propertyType: "House",
        amenities: "Garden, Garage, Fireplace",
        yearBuilt: 2015,
        furnished: false,
        petsAllowed: true,
        propertyHash: PROPERTY_HASH
      };

      const rentalTerms = {
        minDuration: 0,
        maxDuration: 0,
        securityDeposit: 0,
        utilitiesIncluded: false,
        moveInDate: ""
      };

      const swapTerms = {
        desiredLocation: "",
        minSize: 0,
        maxSize: 0,
        swapDuration: 0,
        swapDate: "",
        flexibleDates: false
      };

      const saleTerms = {
        downPayment: ethers.parseEther("50.0"),
        financingAvailable: true,
        closingDate: "2024-03-01",
        inspectionRequired: true
      };

      const price = ethers.parseEther("500.0"); // 500 ETH
      const duration = 90 * 24 * 60 * 60; // 90 days

      const tx = await smartCribsCore.connect(homeowner).createPropertyListing(
        2, // TransactionType.Sale
        propertyDetails,
        price,
        ethers.ZeroAddress,
        duration,
        rentalTerms,
        swapTerms,
        saleTerms,
        OWNERSHIP_PROOF
      );

      const receipt = await tx.wait();
      expect(receipt.status).to.equal(1);

      const totalListings = await smartCribsCore.getTotalPropertyListings();
      expect(totalListings).to.equal(1);
    });

    it("Should create a swap listing", async function () {
      const propertyDetails = {
        location: "789 Pine St, Miami, FL",
        size: 1800,
        bedrooms: 2,
        bathrooms: 2,
        propertyType: "Condo",
        amenities: "Beach Access, Pool, Gym",
        yearBuilt: 2018,
        furnished: true,
        petsAllowed: true,
        propertyHash: PROPERTY_HASH
      };

      const rentalTerms = {
        minDuration: 0,
        maxDuration: 0,
        securityDeposit: 0,
        utilitiesIncluded: false,
        moveInDate: ""
      };

      const swapTerms = {
        desiredLocation: "New York, NY",
        minSize: 1500,
        maxSize: 3000,
        swapDuration: 30,
        swapDate: "2024-02-01",
        flexibleDates: true
      };

      const saleTerms = {
        downPayment: 0,
        financingAvailable: false,
        closingDate: "",
        inspectionRequired: false
      };

      const price = 0; // No price for swaps
      const duration = 60 * 24 * 60 * 60; // 60 days

      const tx = await smartCribsCore.connect(homeowner).createPropertyListing(
        1, // TransactionType.Swap
        propertyDetails,
        price,
        ethers.ZeroAddress,
        duration,
        rentalTerms,
        swapTerms,
        saleTerms,
        OWNERSHIP_PROOF
      );

      const receipt = await tx.wait();
      expect(receipt.status).to.equal(1);

      const totalListings = await smartCribsCore.getTotalPropertyListings();
      expect(totalListings).to.equal(1);
    });

    it("Should revert if user cannot create listings", async function () {
      const propertyDetails = {
        location: "123 Test St",
        size: 1000,
        bedrooms: 2,
        bathrooms: 1,
        propertyType: "Apartment",
        amenities: "Basic",
        yearBuilt: 2020,
        furnished: false,
        petsAllowed: false,
        propertyHash: PROPERTY_HASH
      };

      const rentalTerms = {
        minDuration: 30,
        maxDuration: 365,
        securityDeposit: ethers.parseEther("1.0"),
        utilitiesIncluded: true,
        moveInDate: "2024-01-01"
      };

      const swapTerms = {
        desiredLocation: "",
        minSize: 0,
        maxSize: 0,
        swapDuration: 0,
        swapDate: "",
        flexibleDates: false
      };

      const saleTerms = {
        downPayment: 0,
        financingAvailable: false,
        closingDate: "",
        inspectionRequired: false
      };

      await expect(
        smartCribsCore.connect(renter).createPropertyListing(
          0,
          propertyDetails,
          ethers.parseEther("1.0"),
          ethers.ZeroAddress,
          30 * 24 * 60 * 60,
          rentalTerms,
          swapTerms,
          saleTerms,
          OWNERSHIP_PROOF
        )
      ).to.be.revertedWith("PropertyListings: User cannot create listings");
    });
  });

  describe("Property Verification", function () {
    let listingId;

    beforeEach(async function () {
      // Create a listing first
      const propertyDetails = {
        location: "123 Main St, New York, NY",
        size: 1500,
        bedrooms: 3,
        bathrooms: 2,
        propertyType: "Apartment",
        amenities: "Parking, Gym, Pool",
        yearBuilt: 2020,
        furnished: true,
        petsAllowed: false,
        propertyHash: PROPERTY_HASH
      };

      const rentalTerms = {
        minDuration: 30,
        maxDuration: 365,
        securityDeposit: ethers.parseEther("2.0"),
        utilitiesIncluded: true,
        moveInDate: "2024-01-01"
      };

      const swapTerms = {
        desiredLocation: "",
        minSize: 0,
        maxSize: 0,
        swapDuration: 0,
        swapDate: "",
        flexibleDates: false
      };

      const saleTerms = {
        downPayment: 0,
        financingAvailable: false,
        closingDate: "",
        inspectionRequired: false
      };

      const tx = await smartCribsCore.connect(homeowner).createPropertyListing(
        0,
        propertyDetails,
        ethers.parseEther("2.5"),
        ethers.ZeroAddress,
        30 * 24 * 60 * 60,
        rentalTerms,
        swapTerms,
        saleTerms,
        OWNERSHIP_PROOF
      );

      // Get the listing ID from the event
      const receipt = await tx.wait();
      listingId = 1; // First listing
    });

    it("Should verify a property listing", async function () {
      await smartCribsCore.connect(owner).verifyProperty(listingId, true, "Property verified successfully");

      const listing = await smartCribsCore.getPropertyListing(listingId);
      expect(listing.verificationStatus).to.equal(2); // Verified
      expect(listing.status).to.equal(0); // Active
    });

    it("Should reject a property listing", async function () {
      await smartCribsCore.connect(owner).verifyProperty(listingId, false, "Invalid ownership proof");

      const listing = await smartCribsCore.getPropertyListing(listingId);
      expect(listing.verificationStatus).to.equal(3); // Rejected
      expect(listing.status).to.equal(1); // Pending
    });

    it("Should revert if non-owner tries to verify", async function () {
      await expect(
        smartCribsCore.connect(renter).verifyProperty(listingId, true, "Test")
      ).to.be.revertedWith("PropertyListings: Not authorized verifier");
    });
  });

  describe("Property Listing Management", function () {
    let listingId;

    beforeEach(async function () {
      // Create and verify a listing
      const propertyDetails = {
        location: "123 Main St, New York, NY",
        size: 1500,
        bedrooms: 3,
        bathrooms: 2,
        propertyType: "Apartment",
        amenities: "Parking, Gym, Pool",
        yearBuilt: 2020,
        furnished: true,
        petsAllowed: false,
        propertyHash: PROPERTY_HASH
      };

      const rentalTerms = {
        minDuration: 30,
        maxDuration: 365,
        securityDeposit: ethers.parseEther("2.0"),
        utilitiesIncluded: true,
        moveInDate: "2024-01-01"
      };

      const swapTerms = {
        desiredLocation: "",
        minSize: 0,
        maxSize: 0,
        swapDuration: 0,
        swapDate: "",
        flexibleDates: false
      };

      const saleTerms = {
        downPayment: 0,
        financingAvailable: false,
        closingDate: "",
        inspectionRequired: false
      };

      await smartCribsCore.connect(homeowner).createPropertyListing(
        0,
        propertyDetails,
        ethers.parseEther("2.5"),
        ethers.ZeroAddress,
        30 * 24 * 60 * 60,
        rentalTerms,
        swapTerms,
        saleTerms,
        OWNERSHIP_PROOF
      );

      await smartCribsCore.connect(owner).verifyProperty(listingId = 1, true, "Verified");
    });

    it("Should update a property listing", async function () {
      const updatedPropertyDetails = {
        location: "123 Main St, New York, NY",
        size: 1600,
        bedrooms: 3,
        bathrooms: 2,
        propertyType: "Apartment",
        amenities: "Parking, Gym, Pool, Balcony",
        yearBuilt: 2020,
        furnished: true,
        petsAllowed: true,
        propertyHash: PROPERTY_HASH
      };

      const updatedRentalTerms = {
        minDuration: 60,
        maxDuration: 365,
        securityDeposit: ethers.parseEther("3.0"),
        utilitiesIncluded: true,
        moveInDate: "2024-02-01"
      };

      const swapTerms = {
        desiredLocation: "",
        minSize: 0,
        maxSize: 0,
        swapDuration: 0,
        swapDate: "",
        flexibleDates: false
      };

      const saleTerms = {
        downPayment: 0,
        financingAvailable: false,
        closingDate: "",
        inspectionRequired: false
      };

      await smartCribsCore.connect(homeowner).updatePropertyListing(
        listingId,
        updatedPropertyDetails,
        ethers.parseEther("3.0"),
        ethers.ZeroAddress,
        updatedRentalTerms,
        swapTerms,
        saleTerms
      );

      const listing = await smartCribsCore.getPropertyListing(listingId);
      expect(listing.propertyDetails.size).to.equal(1600);
      expect(listing.propertyDetails.petsAllowed).to.be.true;
      expect(listing.price).to.equal(ethers.parseEther("3.0"));
    });

    it("Should delist a property", async function () {
      await smartCribsCore.connect(homeowner).delistProperty(listingId);

      const listing = await smartCribsCore.getPropertyListing(listingId);
      expect(listing.status).to.equal(5); // Cancelled
    });

    it("Should get listings by owner", async function () {
      const ownerListings = await smartCribsCore.getPropertyListingsByOwner(homeowner.address);
      expect(ownerListings.length).to.equal(1);
      expect(ownerListings[0]).to.equal(listingId);
    });

    it("Should get listings by type", async function () {
      const rentalListings = await smartCribsCore.getPropertyListingsByType(0); // Rent
      expect(rentalListings.length).to.equal(1);
      expect(rentalListings[0]).to.equal(listingId);
    });

    it("Should get listings by location", async function () {
      const locationListings = await smartCribsCore.getPropertyListingsByLocation("123 Main St, New York, NY");
      expect(locationListings.length).to.equal(1);
      expect(locationListings[0]).to.equal(listingId);
    });

    it("Should get active listings", async function () {
      const activeListings = await smartCribsCore.getActivePropertyListings();
      expect(activeListings.length).to.equal(1);
      expect(activeListings[0]).to.equal(listingId);
    });
  });

  describe("Swap Proposals", function () {
    let listing1Id, listing2Id;

    beforeEach(async function () {
      // Create two swap listings
      const propertyDetails1 = {
        location: "123 Main St, New York, NY",
        size: 1500,
        bedrooms: 3,
        bathrooms: 2,
        propertyType: "Apartment",
        amenities: "Parking, Gym, Pool",
        yearBuilt: 2020,
        furnished: true,
        petsAllowed: false,
        propertyHash: PROPERTY_HASH
      };

      const propertyDetails2 = {
        location: "456 Oak Ave, Los Angeles, CA",
        size: 1800,
        bedrooms: 2,
        bathrooms: 2,
        propertyType: "Condo",
        amenities: "Beach Access, Pool",
        yearBuilt: 2018,
        furnished: true,
        petsAllowed: true,
        propertyHash: PROPERTY_HASH
      };

      const rentalTerms = {
        minDuration: 0,
        maxDuration: 0,
        securityDeposit: 0,
        utilitiesIncluded: false,
        moveInDate: ""
      };

      const swapTerms1 = {
        desiredLocation: "Los Angeles, CA",
        minSize: 1500,
        maxSize: 3000,
        swapDuration: 30,
        swapDate: "2024-02-01",
        flexibleDates: true
      };

      const swapTerms2 = {
        desiredLocation: "New York, NY",
        minSize: 1200,
        maxSize: 2500,
        swapDuration: 30,
        swapDate: "2024-02-01",
        flexibleDates: true
      };

      const saleTerms = {
        downPayment: 0,
        financingAvailable: false,
        closingDate: "",
        inspectionRequired: false
      };

      // Create first listing
      await smartCribsCore.connect(homeowner).createPropertyListing(
        1, // Swap
        propertyDetails1,
        0,
        ethers.ZeroAddress,
        60 * 24 * 60 * 60,
        rentalTerms,
        swapTerms1,
        saleTerms,
        OWNERSHIP_PROOF
      );

      // Create second listing
      await smartCribsCore.connect(renter).createPropertyListing(
        1, // Swap
        propertyDetails2,
        0,
        ethers.ZeroAddress,
        60 * 24 * 60 * 60,
        rentalTerms,
        swapTerms2,
        saleTerms,
        OWNERSHIP_PROOF
      );

      // Verify both listings
      await smartCribsCore.connect(owner).verifyProperty(listing1Id = 1, true, "Verified");
      await smartCribsCore.connect(owner).verifyProperty(listing2Id = 2, true, "Verified");
    });

    it("Should create a swap proposal", async function () {
      const proposedDate = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60; // 30 days from now

      const tx = await smartCribsCore.connect(renter).createSwapProposal(
        listing1Id,
        listing2Id,
        proposedDate
      );

      const receipt = await tx.wait();
      expect(receipt.status).to.equal(1);
    });

    it("Should respond to a swap proposal", async function () {
      const proposedDate = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;

      await smartCribsCore.connect(renter).createSwapProposal(
        listing1Id,
        listing2Id,
        proposedDate
      );

      // Accept the proposal
      await smartCribsCore.connect(homeowner).respondToSwapProposal(1, true);

      const proposal = await smartCribsCore.getSwapProposal(1);
      expect(proposal.accepted).to.be.true;
      expect(proposal.rejected).to.be.false;
    });

    it("Should reject a swap proposal", async function () {
      const proposedDate = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;

      await smartCribsCore.connect(renter).createSwapProposal(
        listing1Id,
        listing2Id,
        proposedDate
      );

      // Reject the proposal
      await smartCribsCore.connect(homeowner).respondToSwapProposal(1, false);

      const proposal = await smartCribsCore.getSwapProposal(1);
      expect(proposal.accepted).to.be.false;
      expect(proposal.rejected).to.be.true;
    });
  });

  describe("Platform Statistics", function () {
    it("Should track total listings correctly", async function () {
      expect(await smartCribsCore.getTotalPropertyListings()).to.equal(0);
      expect(await smartCribsCore.getTotalActivePropertyListings()).to.equal(0);

      // Create a listing
      const propertyDetails = {
        location: "123 Main St, New York, NY",
        size: 1500,
        bedrooms: 3,
        bathrooms: 2,
        propertyType: "Apartment",
        amenities: "Parking, Gym, Pool",
        yearBuilt: 2020,
        furnished: true,
        petsAllowed: false,
        propertyHash: PROPERTY_HASH
      };

      const rentalTerms = {
        minDuration: 30,
        maxDuration: 365,
        securityDeposit: ethers.parseEther("2.0"),
        utilitiesIncluded: true,
        moveInDate: "2024-01-01"
      };

      const swapTerms = {
        desiredLocation: "",
        minSize: 0,
        maxSize: 0,
        swapDuration: 0,
        swapDate: "",
        flexibleDates: false
      };

      const saleTerms = {
        downPayment: 0,
        financingAvailable: false,
        closingDate: "",
        inspectionRequired: false
      };

      await smartCribsCore.connect(homeowner).createPropertyListing(
        0,
        propertyDetails,
        ethers.parseEther("2.5"),
        ethers.ZeroAddress,
        30 * 24 * 60 * 60,
        rentalTerms,
        swapTerms,
        saleTerms,
        OWNERSHIP_PROOF
      );

      expect(await smartCribsCore.getTotalPropertyListings()).to.equal(1);
      expect(await smartCribsCore.getTotalActivePropertyListings()).to.equal(0);

      // Verify the listing
      await smartCribsCore.connect(owner).verifyProperty(1, true, "Verified");

      expect(await smartCribsCore.getTotalActivePropertyListings()).to.equal(1);
    });
  });
}); 