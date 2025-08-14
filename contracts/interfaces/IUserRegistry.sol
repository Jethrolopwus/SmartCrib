// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IUserRegistry {
    event UserRegistered(
        address indexed user,
        UserRole role,
        uint256 timestamp
    );
    event UserRoleUpdated(
        address indexed user,
        UserRole newRole,
        uint256 timestamp
    );
    event ProfileUpdated(address indexed user, uint256 timestamp);

    enum UserRole {
        None,
        Renter,
        Homeowner,
        Both
    }

    struct UserProfile {
        UserRole role;
        uint256 reputationScore;
        uint256 totalTransactions;
        uint256 registrationDate;
        bool isActive;
        string profileHash;
    }

    function registerUser(UserRole role, string calldata profileHash) external;

    function updateUserRole(UserRole newRole) external;

    function updateProfile(string calldata profileHash) external;

    function getUserProfile(
        address user
    ) external view returns (UserProfile memory);

    function getUserRole(address user) external view returns (UserRole);

    function isUserRegistered(address user) external view returns (bool);

    function updateReputationScore(address user, int256 scoreChange) external;

    function incrementTransactionCount(address user) external;

    function deactivateUser(address user) external;

    function canListProperties(address user) external view returns (bool);

    function canRentProperties(address user) external view returns (bool);
}
