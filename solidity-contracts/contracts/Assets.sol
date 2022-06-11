// SPDX-License-Identifier: MIT

pragma solidity 0.8.7;

import "@openzeppelin/contracts/access/Ownable.sol";
import '@openzeppelin/contracts/utils/Address.sol';
import '@openzeppelin/contracts/utils/Context.sol';
import '@openzeppelin/contracts/utils/Strings.sol';
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

/// @title A ghost NFT asset
/// @notice Generated from AssetsFactory
contract NftAsset is Ownable{
  using Address for address;
  using Strings for uint256;

  /// @notice Emitted when a lessor lists an NFT
  /// @param tokenId NFT id
  /// @param lessor Lessor
  /// @param expiration Unix timestamp of lease end point
  /// @param fee Rent amount
  /// @param payToken Rent token
  event PutUpForLease(uint256 indexed tokenId, address indexed lessor, uint256 expiration, uint256 fee, address payToken);

  /// @notice Emitted when a tenant borrows an listed NFT
  /// @param tokenId NFT id
  /// @param tenant Tenant
  /// @param fee Rent amount
  /// @param payToken Rent token
  event LeaseFrom(uint256 indexed tokenId, address indexed tenant, uint256 fee, address payToken);

  /// @dev Struct of a single level lease
  struct SingleLease {

    /// @dev Tenant address
    address tenant;

    /// @dev Rent amount required by the lessor
    uint256 fee;

    /// @dev Exparation in Unix timestamp
    uint256 expiration;
  }

  /// @dev Lease info of a tokenId
  struct LeaseInfo {
    /// @dev Real owner when lease starts
    address startOwner;

    /// @dev Whether in lease currently
    bool inLease;

    /// @dev Current lease level
    uint8 curLevel;

    /// @dev Rent token required by lessor
    address payToken;

    /// @dev Guarantee payed by the real owner
    uint256 guarantee;

    /// @dev Total Rent paid by tenants 
    uint256 totalFee;

    /// @dev level => single lease struct
    mapping (uint8 => SingleLease) leases;
  }

  /// @dev Struct to support balanceOf and tokenOfOwnerByIndex
  struct UserBalance {
    /// @dev All tokens a user has borrowed
    uint256[] tokens;

    /// @dev Expiration of each token
    mapping(uint256 => uint256) expiration;
  }

  /// @dev Maximum sub lease level
  uint8 public constant MAX_SUB_LEVEL= 3;

  /// @dev Blame reward supervisor percent
  // uint256 public constant BLAME_REWARD_SUPERVISOR_PERCENT = 20;

  /// @dev Blame reward tenant percent
  // uint256 public constant BLAME_REWARD_TENANT_PERCENT = 40;

  /// @dev Blame reward dapp percent
  // uint256 public constant BLAME_REWARD_DAPP_PERCENT = 20;

  /// @dev Address of origin nft
  address public immutable originNftAddress;

  /// @dev Minimum lease period in seconds
  uint256 public immutable minLeasePeriod;

  /// @dev Address of guarantee token;
  address public immutable guaranteeAddress;

  /// @dev Vault address
  address public immutable vault;

  /// @dev Guarantee amount a lessor need to lock
  uint256 public guarantee;

  /// @dev Reward percent a supervisor will get when blame
  uint256 public blameRewardPercentage;

  /// @dev Fee ratio of borrowing an nft is platformFeeBase / 10000
  uint256 public platformFeeBase;

  /// @dev User address => UserBalance
  mapping(address => UserBalance) userBalance;

  /// @dev TokenId => LeaseInfo
  mapping(uint256 => LeaseInfo) leaseInfo;

  /// @dev Fee balance for users to withdraw
  /// @dev User address => (payToken => balance)
  mapping(address => mapping(address => uint256)) balances;

  /// @dev User address => guarantee balance
  mapping(address => uint256) guaranteeBalances;

  /// @dev All listed tokenIds for rental
  uint256[] listed;

  modifier inLease(uint256 tokenId) {
    require(leaseInfo[tokenId].inLease, "Asset: Token is not in lease");
    _;
  }

  modifier notInLease(uint256 tokenId) {
    require(!leaseInfo[tokenId].inLease, "Asset: Token is in lease");
    _;
  }

  constructor(
    address originNftAddress_,
    address guaranteeAddress_,
    uint256 minLeasePeriod_,
    uint256 guarantee_,
    uint256 platformFeeBase_,
    address vault_,
    uint256 blameRewardPercenteage_) 
  {
    originNftAddress = originNftAddress_;
    guaranteeAddress = guaranteeAddress_;
    minLeasePeriod = minLeasePeriod_;
    guarantee = guarantee_;
    platformFeeBase = platformFeeBase_;
    vault = vault_;
    blameRewardPercentage = blameRewardPercenteage_;

    // {TODO: transfer owner?}
  }

  //=============================================
  //              Internal functions
  //=============================================

  function _removeLevels(uint256 tokenId, uint8 reserveLevel) internal {
    LeaseInfo storage leaseInfo_ = leaseInfo[tokenId];
    for(uint8 level = leaseInfo_.curLevel; level > reserveLevel; level--) {
      if(level > reserveLevel && leaseInfo_.leases[level].expiration > 0) {
        leaseInfo_.leases[level].tenant = address(0);
        leaseInfo_.leases[level].fee = 0;
        leaseInfo_.leases[level].expiration = 0;
        delete leaseInfo_.leases[level];
      }
    }
    leaseInfo_.curLevel = reserveLevel;
    if(reserveLevel == 0) {
      leaseInfo[tokenId].inLease = false;
      leaseInfo[tokenId].payToken = address(0);
      leaseInfo[tokenId].totalFee = 0;
    }
  }

  function _removeListed(uint256 tokenId) internal {
    uint256 size = listed.length;
    for(uint i=0; i< size; i++) {
      if(listed[i] == tokenId) {
        listed[i] = listed[size - 1];
        listed.pop();
        return;
      }
    }
  }

  function _addUserTokenBalance(address account, uint256 tokenId, uint256 expiration) internal {
    UserBalance storage userBalance_ = userBalance[account];
    userBalance_.tokens.push(tokenId);
    userBalance_.expiration[tokenId] = expiration;
  }

  function _removeUserTokenBalance(uint256 tokenId) internal {
    (address account, , ) = phantomOwner(tokenId);
    if(account != address(0)) {
      UserBalance storage userBalance_ = userBalance[account];
      for(uint256 i = 0; i< userBalance_.tokens.length; i++) {
        if(userBalance_.tokens[i] == tokenId) {
          userBalance_.tokens[i] = userBalance_.tokens[userBalance_.tokens.length - 1];
          userBalance_.tokens.pop();
          userBalance_.expiration[tokenId] = 0;
        }
      }
    }
  }

  function _distribute(address[] memory receivers, uint256[] memory shares, uint256 total, address token) internal {
    require(shares[0] != 0, "Asset: Can not distribute");
    uint256 totalShare = 0;
    for(uint256 i = 0; i < shares.length; i++) {
      if(shares[i] == 0) {
        break;
      }
      totalShare += shares[i];
    }
    if(token == guaranteeAddress) {
      for(uint256 i = 0; i < receivers.length; i++) {
        if(shares[i] == 0) {
          break;
        }
        guaranteeBalances[receivers[i]] += total * shares[i] / totalShare;
      }
    } else {
      for(uint256 i = 0; i < receivers.length; i++) {
        if(shares[i] == 0) {
          break;
        }
        balances[receivers[i]][token] += total * shares[i] / totalShare;
      }
    }
  }

  function _getValidLease(
    uint256 tokenId
  ) 
    internal view returns 
  (
    address[] memory, 
    uint256[] memory, 
    uint8, 
    uint8
  ) {
    address[] memory receivers = new address[](3);
    uint256[] memory shares = new uint256[](3);
    uint8 minValidLevel;
    uint8 maxValidLevel = 0;

    if(ERC721(originNftAddress).ownerOf(tokenId) == leaseInfo[tokenId].startOwner) {
      minValidLevel = 0;
    } else {
      minValidLevel = 1;
    }

    LeaseInfo storage leaseInfo_ = leaseInfo[tokenId];

    uint256 index = 0;
    for(uint8 level = leaseInfo_.curLevel; level > minValidLevel; level --) {
      if(leaseInfo_.leases[level].expiration > block.timestamp && leaseInfo_.leases[level].tenant != address(0)) {

        shares[index] = leaseInfo_.leases[level].fee;

        if(level == 1) {
          receivers[index] = leaseInfo_.startOwner;
        } else {
          receivers[index] = leaseInfo_.leases[level - 1].tenant;
        }
        index++;

        if(maxValidLevel == 0) {
          maxValidLevel = level;
        }
      }
    }

    return (receivers, shares, minValidLevel, maxValidLevel);
  }

  //=============================================
  //              External functions
  //=============================================

  /// @dev Set guarantee amount due to token value variation
  function setGuarantee(uint256 guarantee_) external onlyOwner {
    require(msg.sender == owner());
    require(guarantee_ >= 5 ether, "Asset: guarantee too small");

    guarantee = guarantee_;
  }


  /// @dev Check Whether the tokenId is listed
  function isInLease(uint256 tokenId) external view returns (bool) {
    return leaseInfo[tokenId].inLease;
  }

  /// @dev Alternative of NFT balanceOf
  function balanceOf(address account) external view returns (uint256) {
    uint256 count = 0;
    UserBalance storage userBalance_ = userBalance[account];
    for(uint256 i = 0; i <  userBalance_.tokens.length; i++) {
      if(userBalance_.expiration[userBalance_.tokens[i]] > block.timestamp) {
        count ++;
      }
    }
    return count;
  }

  /// @dev Alternative of NFT ownerOf
  function ownerOf(uint256 tokenId) external view returns (address) {
    (address owner_, , ) = phantomOwner(tokenId);
    return owner_;
  }

  /// @dev Alternative of NFT tokenOfOwnerByIndex
  function tokenOfOwnerByIndex(address account, uint256 index) external view returns (uint256) {
    uint256 count = 0;
    UserBalance storage userBalance_ = userBalance[account];
    for(uint256 i = 0; i< userBalance_.tokens.length; i++) {
      if(userBalance_.expiration[userBalance_.tokens[i]] > block.timestamp) {
        if(count == index) {
          return userBalance_.tokens[i];
        }
        count ++;
      }
    }
    return 0;
  }

  /// @dev Get all tokens listed for rental
  function getListedTokenId() external view returns (uint256[] memory) {
    return listed;
  }

  /// @dev Get pay token required by lessor
  function getPayToken(uint256 tokenId) public view returns (address) {
    (address phantom, , ) = phantomOwner(tokenId);
    if(phantom == address(0)) {
      return address(0);
    } else {
      return leaseInfo[tokenId].payToken;
    }
  }

  /// @dev Get tenant of a tokenId
  /// @dev If returns address(0), the token is not in rent or rental period is end.
  /// @return 1. Tenant address, 2. expiration, 3. rent level
  function phantomOwner(uint256 tokenId) public view returns (address, uint256, uint8) {
    LeaseInfo storage leaseInfo_ = leaseInfo[tokenId];
    
    for(uint8 level = leaseInfo_.curLevel; level > 0; level--) {
      if(leaseInfo_.leases[level].expiration > block.timestamp && leaseInfo_.leases[level].tenant != address(0)) {
        return (leaseInfo_.leases[level].tenant, leaseInfo_.leases[level].expiration, level);
      }
    }

    return (address(0), 0, 0);
  }

  /// @dev A lessor use this function to list his NFT for rent
  /// @param tokenId NFT id
  /// @param expiration Unix timestamp in seconds at which the rental period ends
  /// @param fee Rent amount a tenant should pay
  /// @param payToken Rent token
  function putUpForLease(
    uint256 tokenId, 
    uint256 expiration, 
    uint256 fee, 
    address payToken) external notInLease(tokenId)
  {
    (address phantom, , uint8 level) = phantomOwner(tokenId);
    require(level <= MAX_SUB_LEVEL, "Asset: Lease level exceeded");
    if(phantom != address(0)) {
      // Already leased at some level
      require(phantom == msg.sender, "Asset: Wrong user0");
    } else {
      // Not been leased
      require(ERC721(originNftAddress).ownerOf(tokenId) == msg.sender, "Asset: Wrong user1");
      require(payToken != address(0), "Asset: Invalid pay token");
      leaseInfo[tokenId].startOwner = msg.sender;
      leaseInfo[tokenId].payToken = payToken;
    }
    console.log("time: ", expiration, block.timestamp);
    require(expiration - block.timestamp >= minLeasePeriod, "Asset: Lease period too short");

    if(level < leaseInfo[tokenId].curLevel) {
      _removeLevels(tokenId, level);
    }

    ERC20(guaranteeAddress).transferFrom(msg.sender, address(this), guarantee);
    guaranteeBalances[msg.sender] = guarantee;

    uint8 nextLevel = leaseInfo[tokenId].curLevel + 1;
    leaseInfo[tokenId].leases[nextLevel].fee = fee;
    leaseInfo[tokenId].leases[nextLevel].expiration = expiration;
    leaseInfo[tokenId].curLevel = nextLevel;
    leaseInfo[tokenId].inLease = true;

    listed.push(tokenId);

    emit PutUpForLease(tokenId, msg.sender, expiration, fee, payToken);
  }

  /// @dev A function to end a lease after the rental period
  function endLease(
    uint256 tokenId
  ) external {

    // Check whether this lease is finished.
    require(leaseInfo[tokenId].curLevel > 0, "Asset: Can not end lease");
    require(block.timestamp > leaseInfo[tokenId].leases[1].expiration, "Asset: Lease in progress");

    // Check whether the caller is one of the valid lessors/tenants.
    bool valid = false;
    uint8 level;
    for(level = leaseInfo[tokenId].curLevel; level > 0; level--) {
      if(leaseInfo[tokenId].leases[level].tenant == msg.sender) {
        valid = true;
        break;
      }
    }
    bool isOwner = leaseInfo[tokenId].startOwner == msg.sender && ERC721(originNftAddress).ownerOf(tokenId) == msg.sender;
    require(valid || isOwner, "Asset: Not valid user");

    (address[] memory receivers, uint256[] memory shares, , uint8 maxValidLevel) = _getValidLease(tokenId);

    // Remove unused structs.
    _removeLevels(tokenId, maxValidLevel);

    // Distribute lease fee and guarantee if necesary.
    if(receivers.length > 0) {
      _distribute(receivers, shares, leaseInfo[tokenId].totalFee, leaseInfo[tokenId].payToken);
    }

    if(isOwner) {
      guaranteeBalances[msg.sender] += leaseInfo[tokenId].guarantee;
    } else {
      // Distribute guarantee.
      _distribute(receivers, shares, leaseInfo[tokenId].guarantee, guaranteeAddress);
    }

    // Remove unused structs.
    _removeLevels(tokenId, 0);
    _removeUserTokenBalance(tokenId);
    _removeListed(tokenId);
  }

  /// @dev Tenants use this function to rent a listed NFT
  function leaseFrom(uint256 tokenId) external inLease(tokenId) {
    require(ERC721(originNftAddress).ownerOf(tokenId) != msg.sender, "Asset lease: You can not rent");
    require(leaseInfo[tokenId].inLease, "Asset lease: Not in lease");
    LeaseInfo storage leaseInfo_ = leaseInfo[tokenId];
    uint8 level = leaseInfo[tokenId].curLevel;

    uint256 fee = leaseInfo_.leases[level].fee;
    ERC20(leaseInfo_.payToken).transferFrom(msg.sender, address(this), fee);
    ERC20(leaseInfo_.payToken).transferFrom(msg.sender, vault, fee * platformFeeBase / 10000);

    leaseInfo_.totalFee += fee;
    leaseInfo_.inLease = false;
    leaseInfo_.leases[level].tenant = msg.sender;
    _addUserTokenBalance(msg.sender, tokenId, leaseInfo_.leases[level].expiration);

    emit LeaseFrom(tokenId, msg.sender, fee, leaseInfo_.payToken);
  }

  /// @dev Supervisors can use this function to blame a violation of rule from a lessor
  function blame(uint256 tokenId) external {
    // Check whether origin nft has transfered
    require(ERC721(originNftAddress).ownerOf(tokenId) == leaseInfo[tokenId].startOwner, "Asset: Nothing to blame");

    (address[] memory receivers, uint256[] memory shares, , ) = _getValidLease(tokenId);

    // Distribute fee
    _distribute(receivers, shares, leaseInfo[tokenId].totalFee, leaseInfo[tokenId].payToken);

    // Distribute guarantee
    uint256 guarantee_ = leaseInfo[tokenId].guarantee;
    uint256 blameReward = guarantee_ * blameRewardPercentage / 100;
    guaranteeBalances[msg.sender] += blameReward;
    _distribute(receivers, shares, guarantee_ - blameReward, guaranteeAddress);
    _removeUserTokenBalance(tokenId);
    _removeListed(tokenId);
  }

  /// @dev Lessors can use this function to withdraw guarantee
  /// @dev Tenants can use this function to withdraw compensation
  /// @dev Dapp team can use this function to withdraw compensation
  function withdraw(address tokenAddress) external {
    if(tokenAddress == guaranteeAddress) {
      uint256 balance = guaranteeBalances[msg.sender];
      require(balance > 0, "Asset: You have nothing to withdraw");
      guaranteeBalances[msg.sender] = 0;
      ERC20(tokenAddress).transfer(msg.sender, balance);
    } else {
      uint256 balance = balances[msg.sender][tokenAddress];
      require(balance > 0, "Asset: You have nothing to withdraw");
      balances[msg.sender][tokenAddress] = 0;
      ERC20(tokenAddress).transfer(msg.sender, balance);
    }
  }

}