const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SmartCribsCore - Property Listings", function () {
  let smartCribsCore;
  let owner, homeowner, renter, verifier;

  const PROFILE_HASH = "QmTestProfileHash123456789";
  const PROPERTY_HASH = "QmPropertyHash987654321";
  const OWNERSHIP_PROOF = "QmOwnershipProof123456789";

  beforeEach(async function () {
    [owner, homeowner, renter, verifier] = await ethers.getSigners();
    
    // Deploy SmartCribsCore (simplified version with all functionality)
    const SmartCribsCore = await ethers.getContractFactory("SmartCribsCore");
    smartCribsCore = await SmartCribsCore.deploy();
    await smartCribsCore.waitForDeployment();

    // Register users with fullName (new requirement)
    await smartCribsCore.connect(homeowner).registerUser(1, "John Homeowner", PROFILE_HASH); // Homeowner (1)
    await smartCribsCore.connect(renter).registerUser(0, "Jane Renter", PROFILE_HASH); // Renter (0)
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

      const saleTerms = {
        downPayment: ethers.parseEther("50.0"),
        financingAvailable: true,
        closingDate: "2024-03-01",
        inspectionRequired: true
      };

      const price = ethers.parseEther("500.0"); // 500 ETH
      const duration = 0; // Sale doesn't need duration

      const tx = await smartCribsCore.connect(homeowner).createPropertyListing(
        1, // TransactionType.Sale
        propertyDetails,
        price,
        ethers.ZeroAddress,
        duration,
        rentalTerms,
        saleTerms,
        OWNERSHIP_PROOF
      );

      const receipt = await tx.wait();
      expect(receipt.status).to.equal(1);

      const totalListings = await smartCribsCore.getTotalPropertyListings();
      expect(totalListings).to.equal(1);
    });

    it("Should fail to create listing if user is not registered", async function () {
      const [unregisteredUser] = await ethers.getSigners();
      
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

      const saleTerms = {
        downPayment: 0,
        financingAvailable: false,
        closingDate: "",
        inspectionRequired: false
      };

      const price = ethers.parseEther("2.5");
      const duration = 30 * 24 * 60 * 60;

      await expect(
        smartCribsCore.connect(unregisteredUser).createPropertyListing(
          0, // TransactionType.Rent
          propertyDetails,
          price,
          ethers.ZeroAddress,
          duration,
          rentalTerms,
          saleTerms,
          OWNERSHIP_PROOF
        )
      ).to.be.revertedWith("SmartCribsCore: User not registered");
    });

    it("Should fail to create listing with invalid price", async function () {
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

      const saleTerms = {
        downPayment: 0,
        financingAvailable: false,
        closingDate: "",
        inspectionRequired: false
      };

      const price = 0; // Invalid price
      const duration = 30 * 24 * 60 * 60;

      await expect(
        smartCribsCore.connect(homeowner).createPropertyListing(
          0, // TransactionType.Rent
          propertyDetails,
          price,
          ethers.ZeroAddress,
          duration,
          rentalTerms,
          saleTerms,
          OWNERSHIP_PROOF
        )
      ).to.be.revertedWith("SmartCribsCore: Price must be greater than 0");
    });
  });

  describe("Property Listing Management", function () {
    beforeEach(async function () {
      // Create a test listing
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

      const saleTerms = {
        downPayment: 0,
        financingAvailable: false,
        closingDate: "",
        inspectionRequired: false
      };

      await smartCribsCore.connect(homeowner).createPropertyListing(
        0, // TransactionType.Rent
        propertyDetails,
        ethers.parseEther("2.5"),
        ethers.ZeroAddress,
        30 * 24 * 60 * 60,
        rentalTerms,
        saleTerms,
        OWNERSHIP_PROOF
      );
    });

    it("Should get property listing by ID", async function () {
      const listing = await smartCribsCore.getPropertyListing(1);
      expect(listing.listingId).to.equal(1);
      expect(listing.owner).to.equal(homeowner.address);
      expect(listing.propertyDetails.location).to.equal("123 Main St, New York, NY");
    });

    it("Should get property listings by owner", async function () {
      const listings = await smartCribsCore.getPropertyListingsByOwner(homeowner.address);
      expect(listings.length).to.equal(1);
      expect(listings[0]).to.equal(1);
    });

    it("Should get total property listings", async function () {
      const totalListings = await smartCribsCore.getTotalPropertyListings();
      expect(totalListings).to.equal(1);
    });

    it("Should verify property listing", async function () {
      await smartCribsCore.connect(owner).verifyProperty(1, true, "Property verified successfully");
      
      const listing = await smartCribsCore.getPropertyListing(1);
      expect(listing.verificationStatus).to.equal(1); // Verified
    });
  });

  describe("User Management", function () {
    it("Should register user with full name", async function () {
      const [newUser] = await ethers.getSigners();
      
      await smartCribsCore.connect(newUser).registerUser(0, "Alice NewUser", PROFILE_HASH);
      
      const profile = await smartCribsCore.getUserProfile(newUser.address);
      expect(profile.fullName).to.equal("Alice NewUser");
      expect(profile.role).to.equal(0); // Renter
      expect(profile.isActive).to.equal(true);
    });

    it("Should update user role", async function () {
      await smartCribsCore.connect(renter).updateUserRole(1); // Change to Homeowner
      
      const profile = await smartCribsCore.getUserProfile(renter.address);
      expect(profile.role).to.equal(1); // Homeowner
    });

    it("Should update user profile", async function () {
      const newProfileHash = "QmNewProfileHash987654321";
      await smartCribsCore.connect(renter).updateProfile(newProfileHash);
      
      const profile = await smartCribsCore.getUserProfile(renter.address);
      expect(profile.profileHash).to.equal(newProfileHash);
    });

    it("Should check if user can list properties", async function () {
      const canList = await smartCribsCore.canListProperties(homeowner.address);
      expect(canList).to.equal(true);
      
      const cannotList = await smartCribsCore.canListProperties(renter.address);
      expect(cannotList).to.equal(false);
    });

    it("Should check if user can rent properties", async function () {
      const canRent = await smartCribsCore.canRentProperties(renter.address);
      expect(canRent).to.equal(true);
    });
  });

  describe("Review System", function () {
    beforeEach(async function () {
      // Create a test listing first
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

      const saleTerms = {
        downPayment: 0,
        financingAvailable: false,
        closingDate: "",
        inspectionRequired: false
      };

      await smartCribsCore.connect(homeowner).createPropertyListing(
        0, // TransactionType.Rent
        propertyDetails,
        ethers.parseEther("2.5"),
        ethers.ZeroAddress,
        30 * 24 * 60 * 60,
        rentalTerms,
        saleTerms,
        OWNERSHIP_PROOF
      );
    });

    it("Should submit a review", async function () {
      await smartCribsCore.connect(renter).submitReview(
        homeowner.address,
        1, // listingId
        5, // rating
        "Great property and landlord!"
      );

      const review = await smartCribsCore.getReview(1);
      expect(review.reviewer).to.equal(renter.address);
      expect(review.reviewedUser).to.equal(homeowner.address);
      expect(review.rating).to.equal(5);
      expect(review.comment).to.equal("Great property and landlord!");
    });

    it("Should fail to submit review with invalid rating", async function () {
      await expect(
        smartCribsCore.connect(renter).submitReview(
          homeowner.address,
          1, // listingId
          6, // Invalid rating (max is 5)
          "Great property and landlord!"
        )
      ).to.be.revertedWith("SmartCribsCore: Invalid rating");
    });

    it("Should fail to review yourself", async function () {
      await expect(
        smartCribsCore.connect(homeowner).submitReview(
          homeowner.address,
          1, // listingId
          5, // rating
          "Great property and landlord!"
        )
      ).to.be.revertedWith("SmartCribsCore: Cannot review yourself");
    });
  });
}); 