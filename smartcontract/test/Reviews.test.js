const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Reviews Contract", function () {
  let reviews;
  let propertyListings;
  let userRegistry;
  let owner;
  let user1;
  let user2;
  let user3;

  beforeEach(async function () {
    [owner, user1, user2, user3] = await ethers.getSigners();

    // Deploy mock contracts for testing
    const MockPropertyListings = await ethers.getContractFactory("MockPropertyListings");
    propertyListings = await MockPropertyListings.deploy();
    await propertyListings.waitForDeployment();

    const MockUserRegistry = await ethers.getContractFactory("MockUserRegistry");
    userRegistry = await MockUserRegistry.deploy();
    await userRegistry.waitForDeployment();

    // Deploy Reviews contract
    const ReviewsFactory = await ethers.getContractFactory("Reviews");
    reviews = await ReviewsFactory.deploy(
      await propertyListings.getAddress(),
      await userRegistry.getAddress()
    );
    await reviews.waitForDeployment();

    // Setup mock data
    await userRegistry.setUserRegistered(await user1.getAddress(), true);
    await userRegistry.setUserRegistered(await user2.getAddress(), true);
    await userRegistry.setUserRegistered(await user3.getAddress(), true);

    // Create a mock listing
    await propertyListings.createMockListing(1, await user2.getAddress(), "New York", 1000);
  });

  describe("Deployment", function () {
    it("Should set the correct owner", async function () {
      expect(await reviews.owner()).to.equal(await owner.getAddress());
    });

    it("Should set the correct property listings address", async function () {
      expect(await reviews.propertyListings()).to.equal(await propertyListings.getAddress());
    });

    it("Should set the correct user registry address", async function () {
      expect(await reviews.userRegistry()).to.equal(await userRegistry.getAddress());
    });
  });

  describe("Submit Review", function () {
    it("Should submit a review successfully", async function () {
      const rating = 5;
      const comment = "Great experience with this property owner!";

      await expect(
        reviews.connect(user1).submitReview(await user2.getAddress(), 1, rating, comment)
      )
        .to.emit(reviews, "ReviewSubmitted");

      const review = await reviews.getReview(1);
      expect(review.reviewer).to.equal(await user1.getAddress());
      expect(review.reviewedUser).to.equal(await user2.getAddress());
      expect(review.listingId).to.equal(1);
      expect(review.rating).to.equal(rating);
      expect(review.comment).to.equal(comment);
      expect(review.isActive).to.be.true;
    });

    it("Should fail if rating is invalid", async function () {
      const invalidRating = 6;
      const comment = "Test comment";

      await expect(
        reviews.connect(user1).submitReview(await user2.getAddress(), 1, invalidRating, comment)
      ).to.be.revertedWith("Reviews: Invalid rating");
    });

    it("Should fail if comment is too short", async function () {
      const rating = 5;
      const shortComment = "Short";

      await expect(
        reviews.connect(user1).submitReview(await user2.getAddress(), 1, rating, shortComment)
      ).to.be.revertedWith("Reviews: Comment too short");
    });

    it("Should fail if user tries to review themselves", async function () {
      const rating = 5;
      const comment = "Test comment";

      await expect(
        reviews.connect(user1).submitReview(await user1.getAddress(), 1, rating, comment)
      ).to.be.revertedWith("Reviews: Cannot review yourself");
    });

    it("Should fail if user is not registered", async function () {
      const [unregisteredUser] = await ethers.getSigners();
      const rating = 5;
      const comment = "Test comment";

      // Don't register this user
      await expect(
        reviews.connect(unregisteredUser).submitReview(await user2.getAddress(), 1, rating, comment)
      ).to.be.revertedWith("Reviews: User not registered");
    });
  });

  describe("Get Reviews", function () {
    beforeEach(async function () {
      await reviews.connect(user1).submitReview(await user2.getAddress(), 1, 5, "Great experience!");
      await reviews.connect(user3).submitReview(await user2.getAddress(), 1, 4, "Good experience!");
    });

    it("Should get reviews for a user", async function () {
      const userReviews = await reviews.getReviewsForUser(await user2.getAddress());
      expect(userReviews.length).to.equal(2);
      expect(userReviews[0]).to.equal(1);
      expect(userReviews[1]).to.equal(2);
    });

    it("Should get reviews for a listing", async function () {
      const listingReviews = await reviews.getReviewsForListing(1);
      expect(listingReviews.length).to.equal(2);
      expect(listingReviews[0]).to.equal(1);
      expect(listingReviews[1]).to.equal(2);
    });

    it("Should get reviews given by a user", async function () {
      const givenReviews = await reviews.getReviewsGivenByUser(await user1.getAddress());
      expect(givenReviews.length).to.equal(1);
      expect(givenReviews[0]).to.equal(1);
    });
  });

  describe("Reputation System", function () {
    it("Should update reputation score correctly", async function () {
      await reviews.connect(user1).submitReview(await user2.getAddress(), 1, 5, "Excellent!");
      
      const reputation = await reviews.getUserReputation(await user2.getAddress());
      expect(reputation.reputationScore).to.equal(10);
      expect(reputation.positiveReviews).to.equal(1);
      expect(reputation.negativeReviews).to.equal(0);
      expect(reputation.averageRating).to.equal(5);
    });

    it("Should handle negative reviews correctly", async function () {
      await reviews.connect(user1).submitReview(await user2.getAddress(), 1, 1, "Terrible experience!");
      
      const reputation = await reviews.getUserReputation(await user2.getAddress());
      // The reputation score should be 0 since we can't go negative
      expect(reputation.reputationScore).to.equal(0);
      expect(reputation.positiveReviews).to.equal(0);
      expect(reputation.negativeReviews).to.equal(1);
      expect(reputation.averageRating).to.equal(1);
    });
  });

  describe("Can Review Check", function () {
    it("Should return true for valid review scenario", async function () {
      const canReview = await reviews.canReview(await user1.getAddress(), await user2.getAddress(), 1);
      expect(canReview).to.be.true;
    });

    it("Should return false for non-existent listing", async function () {
      const canReview = await reviews.canReview(await user1.getAddress(), await user2.getAddress(), 999);
      expect(canReview).to.be.false;
    });
  });

  describe("Pause/Unpause", function () {
    it("Should pause and unpause correctly", async function () {
      await reviews.pause();
      expect(await reviews.paused()).to.be.true;

      await reviews.unpause();
      expect(await reviews.paused()).to.be.false;
    });

    it("Should fail to submit review when paused", async function () {
      await reviews.pause();
      
      await expect(
        reviews.connect(user1).submitReview(await user2.getAddress(), 1, 5, "Test comment")
      ).to.be.revertedWithCustomError(reviews, "EnforcedPause");
    });
  });
}); 