// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/cryptography/MerkleProof.sol";

interface ITokenLocker {
    function unlock(uint256 _seasonID,
        uint256 _index,
        address _account,
        uint256 _amount,
        bytes32[] calldata _merkleProof) external;

    event UnLock(uint256 seasonID, address indexed to, uint256 value);
}

contract TokenLocker is ITokenLocker, Ownable, ReentrancyGuard {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    IERC20 public token;

    mapping(uint256 => uint256) public startReleaseTimestamps;
    mapping(uint256 => bytes32) public merkleRoots;
    mapping(uint256 => mapping(address => uint8)) private claimed;

    constructor(address _token) public {
        token = IERC20(_token);
    }

    function addSeason(
        uint256 _seasonID, 
        uint256 _startReleaseTimestamp, 
        bytes32 _merkleRoot
    ) public onlyOwner {
        startReleaseTimestamps[_seasonID] = _startReleaseTimestamp;
        merkleRoots[_seasonID] = _merkleRoot;
    }

    function getClaimStatus(
        address userAddress,
        uint256[] memory seasonIDs
    ) public view returns (uint8[] memory) {
        uint8[] memory claimStatus = new uint8[](seasonIDs.length);
        for (uint256 index = 0; index < seasonIDs.length; index++) {
            claimStatus[index] = claimed[seasonIDs[index]][userAddress];
        }
        return claimStatus;
    }

    function unlock(
        uint256 _seasonID,
        uint256 _index,
        address _account,
        uint256 _amount,
        bytes32[] calldata _merkleProof
    ) external override nonReentrant {
        uint256 startReleaseTimestamp = startReleaseTimestamps[_seasonID];
        require(block.timestamp > startReleaseTimestamp, "still locked");
        require(claimed[_seasonID][_account] == 0, "Claimed once");
        // Verify the merkle proof.
        bytes32 node = keccak256(abi.encodePacked(_index, _account, _amount));
        require(
            MerkleProof.verify(_merkleProof, merkleRoots[_seasonID], node),
            "MerkleDistributor: Invalid proof."
        );
        
        _unlock(_seasonID, _account, _amount);
    }

    function updateRoot(uint256 _seasonID, bytes32 _merkleRoot) external onlyOwner {
        merkleRoots[_seasonID] = _merkleRoot;
    }

    function emergencyWithdraw(IERC20 _token, uint256 _amount)
        external
        onlyOwner
    {
        _safeTransfer(_token, owner(), _amount);
    }

    function _safeTransfer(
        IERC20 _token,
        address _to,
        uint256 _amount
    ) internal {
        if (_token == IERC20(0)) {
            (bool success, ) = _to.call{value: _amount}("");
            require(success, "transfer failed");
        } else {
            _token.safeTransfer(_to, _amount);
        }
    }

    function _unlock(uint256 _seasonID, address _account, uint256 _amount) internal {
        require(_amount > 0, "zero unlock");
        token.safeTransfer(_account, _amount);
        claimed[_seasonID][_account] = 1;
        emit UnLock(_seasonID, _account, _amount);
    }
}