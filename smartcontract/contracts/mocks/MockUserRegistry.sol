// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "../interfaces/IUserRegistry.sol";

contract MockUserRegistry {
    mapping(address => bool) private _registeredUsers;
    mapping(address => IUserRegistry.UserProfile) private _userProfiles;

    function setUserRegistered(address user, bool registered) external {
        _registeredUsers[user] = registered;
        
        if (registered && _userProfiles[user].registrationDate == 0) {
            _userProfiles[user] = IUserRegistry.UserProfile({
                role: IUserRegistry.UserRole.Renter,
                reputationScore: 0,
                totalTransactions: 0,
                registrationDate: block.timestamp,
                isActive: true,
                profileHash: "profile_hash"
            });
        }
    }

    function isUserRegistered(address user) external view returns (bool) {
        return _registeredUsers[user];
    }

    function getUserProfile(address user) external view returns (IUserRegistry.UserProfile memory) {
        require(_registeredUsers[user], "User not registered");
        return _userProfiles[user];
    }

    function updateReputationScore(address user, int256 scoreChange) external {
        require(_registeredUsers[user], "User not registered");
        
        IUserRegistry.UserProfile storage profile = _userProfiles[user];
        
        if (scoreChange > 0) {
            profile.reputationScore += uint256(scoreChange);
        } else {
            uint256 decrease = uint256(-scoreChange);
            if (profile.reputationScore > decrease) {
                profile.reputationScore -= decrease;
            } else {
                profile.reputationScore = 0;
            }
        }
    }

    function getUserRole(address user) external view returns (IUserRegistry.UserRole) {
        require(_registeredUsers[user], "User not registered");
        return _userProfiles[user].role;
    }
} 