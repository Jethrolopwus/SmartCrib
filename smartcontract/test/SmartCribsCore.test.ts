import { expect } from "chai";
import { ethers } from "hardhat";
import { SmartCribsCore, IUserRegistry } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("SmartCribsCore", function () {
  let smartCribsCore: SmartCribsCore;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let user3: SignerWithAddress;

  const PROFILE_HASH = "QmTestProfileHash123456789";

  beforeEach(async function () {
    [owner, user1, user2, user3] = await ethers.getSigners();
    
    const SmartCribsCoreFactory = await ethers.getContractFactory("SmartCribsCore");
    smartCribsCore = await SmartCribsCoreFactory.deploy();
  });

  describe("Deployment", function () {
    it("Should set the correct owner", async function () {
      expect(await smartCribsCore.owner()).to.equal(owner.address);
    });

    it("Should deploy UserRegistry", async function () {
      const userRegistryAddress = await smartCribsCore.getUserRegistryAddress();
      expect(userRegistryAddress).to.not.equal(ethers.ZeroAddress);
    });

    it("Should set default platform fee", async function () {
      expect(await smartCribsCore.platformFee()).to.equal(250); // 2.5%
    });

    it("Should support native token by default", async function () {
      expect(await smartCribsCore.supportedTokens(ethers.ZeroAddress)).to.be.true;
    });

    it("Should start with 0 platform stats", async function () {
      const stats = await smartCribsCore.getPlatformStats();
      expect(stats.totalUsers).to.equal(0);
      expect(stats.totalListings).to.equal(0);
      expect(stats.totalTransactions).to.equal(0);
      expect(stats.totalRevenue).to.equal(0);
    });
  });

  describe("Initialization", function () {
    it("Should initialize successfully", async function () {
      await expect(smartCribsCore.initialize())
        .to.emit(smartCribsCore, "PlatformInitialized")
        .withArgs(owner.address, await ethers.provider.getBlock("latest"));
    });

    it("Should revert if already initialized", async function () {
      await smartCribsCore.initialize();
      
      await expect(smartCribsCore.initialize()).to.be.revertedWith("SmartCribsCore: Already initialized");
    });
  });

  describe("User Registration", function () {
    it("Should register user through core contract", async function () {
      await smartCribsCore.connect(user1).registerUser(
        IUserRegistry.UserRole.Renter,
        PROFILE_HASH
      );

      expect(await smartCribsCore.isUserRegistered(user1.address)).to.be.true;
      
      const stats = await smartCribsCore.getPlatformStats();
      expect(stats.totalUsers).to.equal(1);
    });

    it("Should register multiple users", async function () {
      await smartCribsCore.connect(user1).registerUser(
        IUserRegistry.UserRole.Renter,
        PROFILE_HASH
      );

      await smartCribsCore.connect(user2).registerUser(
        IUserRegistry.UserRole.Homeowner,
        PROFILE_HASH
      );

      const stats = await smartCribsCore.getPlatformStats();
      expect(stats.totalUsers).to.equal(2);
    });

    it("Should get user profile through core contract", async function () {
      await smartCribsCore.connect(user1).registerUser(
        IUserRegistry.UserRole.Renter,
        PROFILE_HASH
      );

      const profile = await smartCribsCore.getUserProfile(user1.address);
      expect(profile.role).to.equal(IUserRegistry.UserRole.Renter);
      expect(profile.profileHash).to.equal(PROFILE_HASH);
    });
  });

  describe("Role Management", function () {
    beforeEach(async function () {
      await smartCribsCore.connect(user1).registerUser(
        IUserRegistry.UserRole.Renter,
        PROFILE_HASH
      );
    });

    it("Should update user role through core contract", async function () {
      await smartCribsCore.connect(user1).updateUserRole(IUserRegistry.UserRole.Homeowner);
      
      const profile = await smartCribsCore.getUserProfile(user1.address);
      expect(profile.role).to.equal(IUserRegistry.UserRole.Homeowner);
    });

    it("Should update profile through core contract", async function () {
      const newProfileHash = "QmNewProfileHash987654321";
      await smartCribsCore.connect(user1).updateProfile(newProfileHash);
      
      const profile = await smartCribsCore.getUserProfile(user1.address);
      expect(profile.profileHash).to.equal(newProfileHash);
    });
  });

  describe("Platform Fee Management", function () {
    it("Should update platform fee (owner only)", async function () {
      await smartCribsCore.connect(owner).updatePlatformFee(300); // 3%
      expect(await smartCribsCore.platformFee()).to.equal(300);
    });

    it("Should revert if non-owner tries to update fee", async function () {
      await expect(
        smartCribsCore.connect(user1).updatePlatformFee(300)
      ).to.be.revertedWithCustomError(smartCribsCore, "OwnableUnauthorizedAccount");
    });

    it("Should revert if fee too high", async function () {
      await expect(
        smartCribsCore.connect(owner).updatePlatformFee(600) // 6%
      ).to.be.revertedWith("SmartCribsCore: Fee too high");
    });

    it("Should calculate fee correctly", async function () {
      const amount = ethers.parseEther("1.0"); // 1 ETH
      const fee = await smartCribsCore.calculateFee(amount);
      expect(fee).to.equal(ethers.parseEther("0.025")); // 2.5% of 1 ETH
    });

    it("Should emit FeeUpdated event", async function () {
      await expect(smartCribsCore.connect(owner).updatePlatformFee(300))
        .to.emit(smartCribsCore, "FeeUpdated")
        .withArgs(300, await ethers.provider.getBlock("latest"));
    });
  });

  describe("Token Support", function () {
    const mockTokenAddress = "0x1234567890123456789012345678901234567890";

    it("Should add token support (owner only)", async function () {
      await smartCribsCore.connect(owner).setTokenSupport(mockTokenAddress, true);
      expect(await smartCribsCore.supportedTokens(mockTokenAddress)).to.be.true;
    });

    it("Should remove token support", async function () {
      await smartCribsCore.connect(owner).setTokenSupport(mockTokenAddress, true);
      await smartCribsCore.connect(owner).setTokenSupport(mockTokenAddress, false);
      expect(await smartCribsCore.supportedTokens(mockTokenAddress)).to.be.false;
    });

    it("Should revert if non-owner tries to set token support", async function () {
      await expect(
        smartCribsCore.connect(user1).setTokenSupport(mockTokenAddress, true)
      ).to.be.revertedWithCustomError(smartCribsCore, "OwnableUnauthorizedAccount");
    });

    it("Should revert if trying to modify native token support", async function () {
      await expect(
        smartCribsCore.connect(owner).setTokenSupport(ethers.ZeroAddress, false)
      ).to.be.revertedWith("SmartCribsCore: Cannot modify native token support");
    });

    it("Should emit TokenSupported event", async function () {
      await expect(smartCribsCore.connect(owner).setTokenSupport(mockTokenAddress, true))
        .to.emit(smartCribsCore, "TokenSupported")
        .withArgs(mockTokenAddress, true, await ethers.provider.getBlock("latest"));
    });
  });

  describe("Platform Statistics", function () {
    it("Should update platform stats", async function () {
      await smartCribsCore.updatePlatformStats(5, 10, ethers.parseEther("1.0"));
      
      const stats = await smartCribsCore.getPlatformStats();
      expect(stats.totalListings).to.equal(5);
      expect(stats.totalTransactions).to.equal(10);
      expect(stats.totalRevenue).to.equal(ethers.parseEther("1.0"));
    });

    it("Should handle negative changes", async function () {
      await smartCribsCore.updatePlatformStats(10, 20, ethers.parseEther("2.0"));
      await smartCribsCore.updatePlatformStats(-3, -5, ethers.parseEther("0.5"));
      
      const stats = await smartCribsCore.getPlatformStats();
      expect(stats.totalListings).to.equal(7);
      expect(stats.totalTransactions).to.equal(15);
      expect(stats.totalRevenue).to.equal(ethers.parseEther("2.5"));
    });
  });

  describe("Property Permissions", function () {
    beforeEach(async function () {
      await smartCribsCore.connect(user1).registerUser(
        IUserRegistry.UserRole.Renter,
        PROFILE_HASH
      );
      
      await smartCribsCore.connect(user2).registerUser(
        IUserRegistry.UserRole.Homeowner,
        PROFILE_HASH
      );
      
      await smartCribsCore.connect(user3).registerUser(
        IUserRegistry.UserRole.Both,
        PROFILE_HASH
      );
    });

    it("Should check if user can list properties", async function () {
      expect(await smartCribsCore.canListProperties(user1.address)).to.be.false; // Renter
      expect(await smartCribsCore.canListProperties(user2.address)).to.be.true;  // Homeowner
      expect(await smartCribsCore.canListProperties(user3.address)).to.be.true;  // Both
    });

    it("Should check if user can rent properties", async function () {
      expect(await smartCribsCore.canRentProperties(user1.address)).to.be.true;  // Renter
      expect(await smartCribsCore.canRentProperties(user2.address)).to.be.false; // Homeowner
      expect(await smartCribsCore.canRentProperties(user3.address)).to.be.true;  // Both
    });
  });

  describe("Pausable Functionality", function () {
    it("Should pause and unpause (owner only)", async function () {
      await smartCribsCore.connect(owner).pause();
      expect(await smartCribsCore.isPaused()).to.be.true;

      await smartCribsCore.connect(owner).unpause();
      expect(await smartCribsCore.isPaused()).to.be.false;
    });

    it("Should revert operations when paused", async function () {
      await smartCribsCore.connect(owner).pause();

      await expect(
        smartCribsCore.connect(user1).registerUser(
          IUserRegistry.UserRole.Renter,
          PROFILE_HASH
        )
      ).to.be.revertedWith("Pausable: paused");
    });

    it("Should emit pause events", async function () {
      await expect(smartCribsCore.connect(owner).pause())
        .to.emit(smartCribsCore, "EmergencyPaused")
        .withArgs(owner.address, await ethers.provider.getBlock("latest"));

      await expect(smartCribsCore.connect(owner).unpause())
        .to.emit(smartCribsCore, "EmergencyUnpaused")
        .withArgs(owner.address, await ethers.provider.getBlock("latest"));
    });
  });

  describe("Fee Withdrawal", function () {
    it("Should withdraw native token fees", async function () {
      // Send some ETH to the contract
      await owner.sendTransaction({
        to: await smartCribsCore.getAddress(),
        value: ethers.parseEther("1.0")
      });

      const initialBalance = await ethers.provider.getBalance(owner.address);
      await smartCribsCore.connect(owner).withdrawFees();
      const finalBalance = await ethers.provider.getBalance(owner.address);

      expect(finalBalance).to.be.gt(initialBalance);
    });

    it("Should revert if no fees to withdraw", async function () {
      await expect(
        smartCribsCore.connect(owner).withdrawFees()
      ).to.be.revertedWith("SmartCribsCore: No fees to withdraw");
    });
  });

  describe("Emergency Recovery", function () {
    it("Should recover native tokens", async function () {
      // Send some ETH to the contract
      await owner.sendTransaction({
        to: await smartCribsCore.getAddress(),
        value: ethers.parseEther("1.0")
      });

      const initialBalance = await ethers.provider.getBalance(user1.address);
      await smartCribsCore.connect(owner).emergencyRecover(
        ethers.ZeroAddress,
        user1.address,
        ethers.parseEther("0.5")
      );
      const finalBalance = await ethers.provider.getBalance(user1.address);

      expect(finalBalance).to.equal(initialBalance + ethers.parseEther("0.5"));
    });

    it("Should revert if invalid recipient", async function () {
      await expect(
        smartCribsCore.connect(owner).emergencyRecover(
          ethers.ZeroAddress,
          ethers.ZeroAddress,
          ethers.parseEther("0.1")
        )
      ).to.be.revertedWith("SmartCribsCore: Invalid recipient");
    });
  });

  describe("Receive Function", function () {
    it("Should accept native token payments", async function () {
      const contractAddress = await smartCribsCore.getAddress();
      const initialBalance = await ethers.provider.getBalance(contractAddress);

      await owner.sendTransaction({
        to: contractAddress,
        value: ethers.parseEther("1.0")
      });

      const finalBalance = await ethers.provider.getBalance(contractAddress);
      expect(finalBalance).to.equal(initialBalance + ethers.parseEther("1.0"));
    });
  });

  describe("Integration Tests", function () {
    it("Should handle complete user lifecycle", async function () {
      // Register user
      await smartCribsCore.connect(user1).registerUser(
        IUserRegistry.UserRole.Renter,
        PROFILE_HASH
      );

      // Update role
      await smartCribsCore.connect(user1).updateUserRole(IUserRegistry.UserRole.Both);

      // Update profile
      await smartCribsCore.connect(user1).updateProfile("QmNewHash");

      // Verify final state
      const profile = await smartCribsCore.getUserProfile(user1.address);
      expect(profile.role).to.equal(IUserRegistry.UserRole.Both);
      expect(profile.profileHash).to.equal("QmNewHash");
      expect(await smartCribsCore.canListProperties(user1.address)).to.be.true;
      expect(await smartCribsCore.canRentProperties(user1.address)).to.be.true;
    });

    it("Should maintain correct statistics", async function () {
      // Register users
      await smartCribsCore.connect(user1).registerUser(
        IUserRegistry.UserRole.Renter,
        PROFILE_HASH
      );
      await smartCribsCore.connect(user2).registerUser(
        IUserRegistry.UserRole.Homeowner,
        PROFILE_HASH
      );

      // Update stats
      await smartCribsCore.updatePlatformStats(5, 10, ethers.parseEther("1.0"));

      const stats = await smartCribsCore.getPlatformStats();
      expect(stats.totalUsers).to.equal(2);
      expect(stats.totalListings).to.equal(5);
      expect(stats.totalTransactions).to.equal(10);
      expect(stats.totalRevenue).to.equal(ethers.parseEther("1.0"));
    });
  });
}); 