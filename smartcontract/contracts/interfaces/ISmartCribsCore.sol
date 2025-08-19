// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./IUserRegistry.sol";

interface ISmartCribsCore {
    event PlatformInitialized(address indexed owner, uint256 timestamp);
    event FeeUpdated(uint256 newFee, uint256 timestamp);
    event EmergencyPaused(address indexed pauser, uint256 timestamp);
    event EmergencyUnpaused(address indexed unpauser, uint256 timestamp);

    struct PlatformStats {
        uint256 totalUsers;
        uint256 totalListings;
        uint256 totalTransactions;
        uint256 totalRevenue;
    }

    function initialize() external;

    function registerUser(
        IUserRegistry.UserRole role,
        string calldata profileHash
    ) external;

    function updateUserRole(IUserRegistry.UserRole newRole) external;

    function updateProfile(string calldata profileHash) external;

    function getUserProfile(
        address user
    ) external view returns (IUserRegistry.UserProfile memory);

    function isUserRegistered(address user) external view returns (bool);

    function getPlatformStats() external view returns (PlatformStats memory);

    function updatePlatformFee(uint256 newFee) external;

    function withdrawFees() external;

    function pause() external;

    function unpause() external;

    function isPaused() external view returns (bool);
}
