import { expect } from "chai";
import { ethers } from "hardhat";
import { UserRegistry, IUserRegistry } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("UserRegistry", function () {
  let userRegistry: UserRegistry;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let user3: SignerWithAddress;

  const PROFILE_HASH = "QmTestProfileHash123456789";

  beforeEach(async function () {
    [owner, user1, user2, user3] = await ethers.getSigners();
    
    const UserRegistryFactory = await ethers.getContractFactory("UserRegistry");
    userRegistry = await UserRegistryFactory.deploy();
  });

  describe("Deployment", function () {
    it("Should set the correct owner", async function () {
      expect(await userRegistry.owner()).to.equal(owner.address);
    });

    it("Should start with 0 total users", async function () {
      expect(await userRegistry.getTotalUsers()).to.equal(0);
    });
  });

  describe("User Registration", function () {
    it("Should register a user as Renter", async function () {
      await userRegistry.connect(user1).registerUser(
        IUserRegistry.UserRole.Renter,
        PROFILE_HASH
      );

      expect(await userRegistry.isUserRegistered(user1.address)).to.be.true;
      expect(await userRegistry.getUserRole(user1.address)).to.equal(IUserRegistry.UserRole.Renter);
      expect(await userRegistry.getTotalUsers()).to.equal(1);
    });

    it("Should register a user as Homeowner", async function () {
      await userRegistry.connect(user1).registerUser(
        IUserRegistry.UserRole.Homeowner,
        PROFILE_HASH
      );

      expect(await userRegistry.getUserRole(user1.address)).to.equal(IUserRegistry.UserRole.Homeowner);
    });

    it("Should register a user as Both", async function () {
      await userRegistry.connect(user1).registerUser(
        IUserRegistry.UserRole.Both,
        PROFILE_HASH
      );

      expect(await userRegistry.getUserRole(user1.address)).to.equal(IUserRegistry.UserRole.Both);
    });

    it("Should set correct initial values", async function () {
      await userRegistry.connect(user1).registerUser(
        IUserRegistry.UserRole.Renter,
        PROFILE_HASH
      );

      const profile = await userRegistry.getUserProfile(user1.address);
      expect(profile.role).to.equal(IUserRegistry.UserRole.Renter);
      expect(profile.reputationScore).to.equal(500); // Default neutral score
      expect(profile.totalTransactions).to.equal(0);
      expect(profile.isActive).to.be.true;
      expect(profile.profileHash).to.equal(PROFILE_HASH);
    });

    it("Should revert if user already registered", async function () {
      await userRegistry.connect(user1).registerUser(
        IUserRegistry.UserRole.Renter,
        PROFILE_HASH
      );

      await expect(
        userRegistry.connect(user1).registerUser(
          IUserRegistry.UserRole.Homeowner,
          PROFILE_HASH
        )
      ).to.be.revertedWith("UserRegistry: User already registered");
    });

    it("Should revert if role is None", async function () {
      await expect(
        userRegistry.connect(user1).registerUser(
          IUserRegistry.UserRole.None,
          PROFILE_HASH
        )
      ).to.be.revertedWith("UserRegistry: Invalid role");
    });

    it("Should revert if profile hash is empty", async function () {
      await expect(
        userRegistry.connect(user1).registerUser(
          IUserRegistry.UserRole.Renter,
          ""
        )
      ).to.be.revertedWith("UserRegistry: Profile hash required");
    });
  });

  describe("Role Management", function () {
    beforeEach(async function () {
      await userRegistry.connect(user1).registerUser(
        IUserRegistry.UserRole.Renter,
        PROFILE_HASH
      );
    });

    it("Should update user role", async function () {
      await userRegistry.connect(user1).updateUserRole(IUserRegistry.UserRole.Homeowner);
      expect(await userRegistry.getUserRole(user1.address)).to.equal(IUserRegistry.UserRole.Homeowner);
    });

    it("Should revert if user not registered", async function () {
      await expect(
        userRegistry.connect(user2).updateUserRole(IUserRegistry.UserRole.Homeowner)
      ).to.be.revertedWith("UserRegistry: User not registered");
    });

    it("Should revert if role is None", async function () {
      await expect(
        userRegistry.connect(user1).updateUserRole(IUserRegistry.UserRole.None)
      ).to.be.revertedWith("UserRegistry: Invalid role");
    });
  });

  describe("Profile Management", function () {
    const NEW_PROFILE_HASH = "QmNewProfileHash987654321";

    beforeEach(async function () {
      await userRegistry.connect(user1).registerUser(
        IUserRegistry.UserRole.Renter,
        PROFILE_HASH
      );
    });

    it("Should update profile hash", async function () {
      await userRegistry.connect(user1).updateProfile(NEW_PROFILE_HASH);
      
      const profile = await userRegistry.getUserProfile(user1.address);
      expect(profile.profileHash).to.equal(NEW_PROFILE_HASH);
    });

    it("Should revert if user not registered", async function () {
      await expect(
        userRegistry.connect(user2).updateProfile(NEW_PROFILE_HASH)
      ).to.be.revertedWith("UserRegistry: User not registered");
    });

    it("Should revert if profile hash is empty", async function () {
      await expect(
        userRegistry.connect(user1).updateProfile("")
      ).to.be.revertedWith("UserRegistry: Profile hash required");
    });
  });

  describe("Reputation System", function () {
    beforeEach(async function () {
      await userRegistry.connect(user1).registerUser(
        IUserRegistry.UserRole.Renter,
        PROFILE_HASH
      );
    });

    it("Should increase reputation score", async function () {
      await userRegistry.updateReputationScore(user1.address, 50);
      
      const profile = await userRegistry.getUserProfile(user1.address);
      expect(profile.reputationScore).to.equal(550);
    });

    it("Should decrease reputation score", async function () {
      await userRegistry.updateReputationScore(user1.address, -30);
      
      const profile = await userRegistry.getUserProfile(user1.address);
      expect(profile.reputationScore).to.equal(470);
    });

    it("Should cap reputation at maximum", async function () {
      await userRegistry.updateReputationScore(user1.address, 600);
      
      const profile = await userRegistry.getUserProfile(user1.address);
      expect(profile.reputationScore).to.equal(1000); // MAX_REPUTATION_SCORE
    });

    it("Should floor reputation at minimum", async function () {
      await userRegistry.updateReputationScore(user1.address, -600);
      
      const profile = await userRegistry.getUserProfile(user1.address);
      expect(profile.reputationScore).to.equal(0); // MIN_REPUTATION_SCORE
    });

    it("Should revert if reputation change too large", async function () {
      await expect(
        userRegistry.updateReputationScore(user1.address, 150)
      ).to.be.revertedWith("UserRegistry: Reputation change too large");
    });

    it("Should revert if user not registered", async function () {
      await expect(
        userRegistry.updateReputationScore(user2.address, 50)
      ).to.be.revertedWith("UserRegistry: User not registered");
    });
  });

  describe("Transaction Count", function () {
    beforeEach(async function () {
      await userRegistry.connect(user1).registerUser(
        IUserRegistry.UserRole.Renter,
        PROFILE_HASH
      );
    });

    it("Should increment transaction count", async function () {
      await userRegistry.incrementTransactionCount(user1.address);
      
      const profile = await userRegistry.getUserProfile(user1.address);
      expect(profile.totalTransactions).to.equal(1);
    });

    it("Should increment multiple times", async function () {
      await userRegistry.incrementTransactionCount(user1.address);
      await userRegistry.incrementTransactionCount(user1.address);
      await userRegistry.incrementTransactionCount(user1.address);
      
      const profile = await userRegistry.getUserProfile(user1.address);
      expect(profile.totalTransactions).to.equal(3);
    });
  });

  describe("User Deactivation", function () {
    beforeEach(async function () {
      await userRegistry.connect(user1).registerUser(
        IUserRegistry.UserRole.Renter,
        PROFILE_HASH
      );
    });

    it("Should deactivate user (owner only)", async function () {
      await userRegistry.connect(owner).deactivateUser(user1.address);
      
      const profile = await userRegistry.getUserProfile(user1.address);
      expect(profile.isActive).to.be.false;
    });

    it("Should revert if non-owner tries to deactivate", async function () {
      await expect(
        userRegistry.connect(user2).deactivateUser(user1.address)
      ).to.be.revertedWithCustomError(userRegistry, "OwnableUnauthorizedAccount");
    });

    it("Should revert if user not registered", async function () {
      await expect(
        userRegistry.connect(owner).deactivateUser(user2.address)
      ).to.be.revertedWith("UserRegistry: User not registered");
    });

    it("Should revert if user already inactive", async function () {
      await userRegistry.connect(owner).deactivateUser(user1.address);
      
      await expect(
        userRegistry.connect(owner).deactivateUser(user1.address)
      ).to.be.revertedWith("UserRegistry: User already inactive");
    });
  });

  describe("Role Checking", function () {
    beforeEach(async function () {
      await userRegistry.connect(user1).registerUser(
        IUserRegistry.UserRole.Renter,
        PROFILE_HASH
      );
      
      await userRegistry.connect(user2).registerUser(
        IUserRegistry.UserRole.Homeowner,
        PROFILE_HASH
      );
      
      await userRegistry.connect(user3).registerUser(
        IUserRegistry.UserRole.Both,
        PROFILE_HASH
      );
    });

    it("Should correctly check Renter role", async function () {
      expect(await userRegistry.hasRole(user1.address, IUserRegistry.UserRole.Renter)).to.be.true;
      expect(await userRegistry.hasRole(user1.address, IUserRegistry.UserRole.Homeowner)).to.be.false;
    });

    it("Should correctly check Homeowner role", async function () {
      expect(await userRegistry.hasRole(user2.address, IUserRegistry.UserRole.Homeowner)).to.be.true;
      expect(await userRegistry.hasRole(user2.address, IUserRegistry.UserRole.Renter)).to.be.false;
    });

    it("Should correctly check Both role", async function () {
      expect(await userRegistry.hasRole(user3.address, IUserRegistry.UserRole.Renter)).to.be.true;
      expect(await userRegistry.hasRole(user3.address, IUserRegistry.UserRole.Homeowner)).to.be.true;
    });

    it("Should return false for unregistered users", async function () {
      const unregisteredUser = ethers.Wallet.createRandom();
      expect(await userRegistry.hasRole(unregisteredUser.address, IUserRegistry.UserRole.Renter)).to.be.false;
    });
  });

  describe("Property Permissions", function () {
    beforeEach(async function () {
      await userRegistry.connect(user1).registerUser(
        IUserRegistry.UserRole.Renter,
        PROFILE_HASH
      );
      
      await userRegistry.connect(user2).registerUser(
        IUserRegistry.UserRole.Homeowner,
        PROFILE_HASH
      );
      
      await userRegistry.connect(user3).registerUser(
        IUserRegistry.UserRole.Both,
        PROFILE_HASH
      );
    });

    it("Should allow homeowners to list properties", async function () {
      expect(await userRegistry.canListProperties(user2.address)).to.be.true;
      expect(await userRegistry.canListProperties(user3.address)).to.be.true;
    });

    it("Should not allow renters to list properties", async function () {
      expect(await userRegistry.canListProperties(user1.address)).to.be.false;
    });

    it("Should allow renters to rent properties", async function () {
      expect(await userRegistry.canRentProperties(user1.address)).to.be.true;
      expect(await userRegistry.canRentProperties(user3.address)).to.be.true;
    });

    it("Should not allow homeowners to rent properties", async function () {
      expect(await userRegistry.canRentProperties(user2.address)).to.be.false;
    });
  });

  describe("Pausable Functionality", function () {
    beforeEach(async function () {
      await userRegistry.connect(user1).registerUser(
        IUserRegistry.UserRole.Renter,
        PROFILE_HASH
      );
    });

    it("Should pause and unpause (owner only)", async function () {
      await userRegistry.connect(owner).pause();
      expect(await userRegistry.paused()).to.be.true;

      await userRegistry.connect(owner).unpause();
      expect(await userRegistry.paused()).to.be.false;
    });

    it("Should revert operations when paused", async function () {
      await userRegistry.connect(owner).pause();

      await expect(
        userRegistry.connect(user2).registerUser(
          IUserRegistry.UserRole.Renter,
          PROFILE_HASH
        )
      ).to.be.revertedWith("Pausable: paused");

      await expect(
        userRegistry.connect(user1).updateUserRole(IUserRegistry.UserRole.Homeowner)
      ).to.be.revertedWith("Pausable: paused");
    });

    it("Should revert if non-owner tries to pause", async function () {
      await expect(
        userRegistry.connect(user1).pause()
      ).to.be.revertedWithCustomError(userRegistry, "OwnableUnauthorizedAccount");
    });
  });

  describe("Events", function () {
    it("Should emit UserRegistered event", async function () {
      await expect(
        userRegistry.connect(user1).registerUser(
          IUserRegistry.UserRole.Renter,
          PROFILE_HASH
        )
      )
        .to.emit(userRegistry, "UserRegistered")
        .withArgs(user1.address, IUserRegistry.UserRole.Renter, await ethers.provider.getBlock("latest"));
    });

    it("Should emit UserRoleUpdated event", async function () {
      await userRegistry.connect(user1).registerUser(
        IUserRegistry.UserRole.Renter,
        PROFILE_HASH
      );

      await expect(
        userRegistry.connect(user1).updateUserRole(IUserRegistry.UserRole.Homeowner)
      )
        .to.emit(userRegistry, "UserRoleUpdated")
        .withArgs(user1.address, IUserRegistry.UserRole.Homeowner, await ethers.provider.getBlock("latest"));
    });

    it("Should emit ProfileUpdated event", async function () {
      await userRegistry.connect(user1).registerUser(
        IUserRegistry.UserRole.Renter,
        PROFILE_HASH
      );

      await expect(
        userRegistry.connect(user1).updateProfile("QmNewHash")
      )
        .to.emit(userRegistry, "ProfileUpdated")
        .withArgs(user1.address, await ethers.provider.getBlock("latest"));
    });
  });
}); 