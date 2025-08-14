// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./interfaces/IUserRegistry.sol";

contract UserRegistry is IUserRegistry, Ownable, Pausable, ReentrancyGuard {
    using Strings for uint256;

    mapping(address => UserProfile) private _userProfiles;
    mapping(address => bool) private _registeredUsers;
    uint256 private _totalUsers;

    uint256 public constant MIN_REPUTATION_SCORE = 0;
    uint256 public constant MAX_REPUTATION_SCORE = 1000;
    uint256 public constant REPUTATION_CHANGE_LIMIT = 100;

    modifier onlyRegisteredUser() {
        require(
            _registeredUsers[msg.sender],
            "UserRegistry: User not registered"
        );
        _;
    }

    modifier onlyValidRole(UserRole role) {
        require(role != UserRole.None, "UserRegistry: Invalid role");
        _;
    }

    modifier onlyValidReputationChange(int256 scoreChange) {
        require(
            scoreChange >= -int256(REPUTATION_CHANGE_LIMIT) &&
                scoreChange <= int256(REPUTATION_CHANGE_LIMIT),
            "UserRegistry: Reputation change too large"
        );
        _;
    }

    constructor() Ownable(msg.sender) {}

    function registerUser(
        UserRole role,
        string calldata profileHash
    ) external override whenNotPaused nonReentrant onlyValidRole(role) {
        require(
            !_registeredUsers[msg.sender],
            "UserRegistry: User already registered"
        );
        require(
            bytes(profileHash).length > 0,
            "UserRegistry: Profile hash required"
        );

        UserProfile memory newProfile = UserProfile({
            role: role,
            reputationScore: 500,
            totalTransactions: 0,
            registrationDate: block.timestamp,
            isActive: true,
            profileHash: profileHash
        });

        _userProfiles[msg.sender] = newProfile;
        _registeredUsers[msg.sender] = true;
        _totalUsers++;

        emit UserRegistered(msg.sender, role, block.timestamp);
    }

    function registerUserByCore(
        address user,
        UserRole role,
        string calldata profileHash
    ) external whenNotPaused onlyValidRole(role) {
        require(
            msg.sender == owner(),
            "UserRegistry: Only owner can register users"
        );
        require(
            !_registeredUsers[user],
            "UserRegistry: User already registered"
        );
        require(
            bytes(profileHash).length > 0,
            "UserRegistry: Profile hash required"
        );

        UserProfile memory newProfile = UserProfile({
            role: role,
            reputationScore: 500,
            totalTransactions: 0,
            registrationDate: block.timestamp,
            isActive: true,
            profileHash: profileHash
        });

        _userProfiles[user] = newProfile;
        _registeredUsers[user] = true;
        _totalUsers++;

        emit UserRegistered(user, role, block.timestamp);
    }

    function updateUserRole(
        UserRole newRole
    )
        external
        override
        whenNotPaused
        onlyRegisteredUser
        onlyValidRole(newRole)
    {
        require(
            _userProfiles[msg.sender].isActive,
            "UserRegistry: User account inactive"
        );

        UserProfile storage profile = _userProfiles[msg.sender];
        profile.role = newRole;

        emit UserRoleUpdated(msg.sender, newRole, block.timestamp);
    }

    function updateUserRoleByCore(
        address user,
        UserRole newRole
    ) external whenNotPaused onlyValidRole(newRole) {
        require(
            msg.sender == owner(),
            "UserRegistry: Only owner can update user roles"
        );
        require(_registeredUsers[user], "UserRegistry: User not registered");
        require(
            _userProfiles[user].isActive,
            "UserRegistry: User account inactive"
        );

        UserProfile storage profile = _userProfiles[user];
        profile.role = newRole;

        emit UserRoleUpdated(user, newRole, block.timestamp);
    }

    function updateProfile(
        string calldata profileHash
    ) external override whenNotPaused onlyRegisteredUser {
        require(
            bytes(profileHash).length > 0,
            "UserRegistry: Profile hash required"
        );
        require(
            _userProfiles[msg.sender].isActive,
            "UserRegistry: User account inactive"
        );

        _userProfiles[msg.sender].profileHash = profileHash;

        emit ProfileUpdated(msg.sender, block.timestamp);
    }

    function updateProfileByCore(
        address user,
        string calldata profileHash
    ) external whenNotPaused {
        require(
            msg.sender == owner(),
            "UserRegistry: Only owner can update user profiles"
        );
        require(_registeredUsers[user], "UserRegistry: User not registered");
        require(
            bytes(profileHash).length > 0,
            "UserRegistry: Profile hash required"
        );
        require(
            _userProfiles[user].isActive,
            "UserRegistry: User account inactive"
        );

        _userProfiles[user].profileHash = profileHash;

        emit ProfileUpdated(user, block.timestamp);
    }

    function getUserProfile(
        address user
    ) external view override returns (UserProfile memory) {
        require(_registeredUsers[user], "UserRegistry: User not registered");
        return _userProfiles[user];
    }

    function getUserRole(
        address user
    ) external view override returns (UserRole) {
        require(_registeredUsers[user], "UserRegistry: User not registered");
        return _userProfiles[user].role;
    }

    function isUserRegistered(
        address user
    ) external view override returns (bool) {
        return _registeredUsers[user];
    }

    function updateReputationScore(
        address user,
        int256 scoreChange
    ) external override whenNotPaused onlyValidReputationChange(scoreChange) {
        require(_registeredUsers[user], "UserRegistry: User not registered");
        require(
            _userProfiles[user].isActive,
            "UserRegistry: User account inactive"
        );

        UserProfile storage profile = _userProfiles[user];

        if (scoreChange > 0) {
            profile.reputationScore = uint256(
                int256(profile.reputationScore) + scoreChange
            );
            if (profile.reputationScore > MAX_REPUTATION_SCORE) {
                profile.reputationScore = MAX_REPUTATION_SCORE;
            }
        } else {
            uint256 decrease = uint256(-scoreChange);
            if (profile.reputationScore > decrease) {
                profile.reputationScore -= decrease;
            } else {
                profile.reputationScore = MIN_REPUTATION_SCORE;
            }
        }
    }

    function incrementTransactionCount(
        address user
    ) external override whenNotPaused {
        require(_registeredUsers[user], "UserRegistry: User not registered");
        require(
            _userProfiles[user].isActive,
            "UserRegistry: User account inactive"
        );

        _userProfiles[user].totalTransactions++;
    }

    function deactivateUser(address user) external override onlyOwner {
        require(_registeredUsers[user], "UserRegistry: User not registered");
        require(
            _userProfiles[user].isActive,
            "UserRegistry: User already inactive"
        );

        _userProfiles[user].isActive = false;
    }

    function getTotalUsers() external view returns (uint256) {
        return _totalUsers;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function hasRole(address user, UserRole role) external view returns (bool) {
        if (!_registeredUsers[user]) return false;
        UserProfile memory profile = _userProfiles[user];
        return
            profile.isActive &&
            (profile.role == role || profile.role == UserRole.Both);
    }

    function canListProperties(address user) external view override returns (bool) {
        if (!_registeredUsers[user]) return false;
        UserProfile memory profile = _userProfiles[user];
        return
            profile.isActive &&
            (profile.role == UserRole.Homeowner ||
                profile.role == UserRole.Both);
    }

    function canRentProperties(address user) external view override returns (bool) {
        if (!_registeredUsers[user]) return false;
        UserProfile memory profile = _userProfiles[user];
        return
            profile.isActive &&
            (profile.role == UserRole.Renter || profile.role == UserRole.Both);
    }
}
