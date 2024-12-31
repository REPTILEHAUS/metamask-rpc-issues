// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

interface GiveawayClaimInterface {
    event ProceedsWithdrawn(address indexed receiver, uint256 amount);
    event ContractInitialized();
    event PrizeClaimed(address indexed winner, uint256 amount);
    event ClaimsActivated(); 
    event FundsReceived(address indexed from, uint256 amount); // admin deposited

    error InvalidProof();
    error ClaimsNotActive();
    error WithdrawalFailed();
    error ClaimTransferFailed();
    error InsufficientContractBalance();
    error InvalidAddress(address account);
    error AccessDenied();
    error PrizeAlreadyClaimed();
}


import "@openzeppelin/contracts/utils/Strings.sol";

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

contract GiveawayClaim is
    GiveawayClaimInterface,
    ReentrancyGuard,
    AccessControlUpgradeable
{
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN");
    bytes32 public merkleRoot;
    mapping(address => uint256) public claimsPerAddress;
    uint256 public totalClaims; // Counter for successful claims
    enum ClaimsState {
        DISABLED,
        ENABLED
    }

    ClaimsState public claimsState;

    modifier onlyAdmin() {
        if (!hasRole(ADMIN_ROLE, msg.sender)) revert AccessDenied();
        _;
    }

    constructor(address admin) {
        if (admin == address(0)) revert InvalidAddress(admin);
        _grantRole(ADMIN_ROLE, admin);
        _setRoleAdmin(ADMIN_ROLE, ADMIN_ROLE);
        emit ContractInitialized();
    }

    function setEnabled(bool _active) public onlyAdmin {
        claimsState = _active ? ClaimsState.ENABLED : ClaimsState.DISABLED;
        emit ClaimsActivated();
    }

    function setMerkleRoot(bytes32 _merkleRoot) public onlyAdmin {
        if (claimsState != ClaimsState.ENABLED) revert ClaimsNotActive();
        merkleRoot = _merkleRoot;
        emit ClaimsActivated();
    }

    function claimPrizeTest(
        bytes calldata data,
        bytes32[] calldata merkleProof
    ) public pure returns (uint256, uint256) {
        (uint256 index, uint256 prizeValue) = abi.decode(
            data,
            (uint256, uint256)
        );

        return (index, prizeValue);
    }
}
