// SPDX-License-Identifier: MIT

pragma solidity 0.8.7;

import "./Assets.sol";

/// @title NFT asset factory
/// @notice Third party dapp team use this contract to generate a rental contract
contract NftAssetFactory is Ownable {
  /// @dev Fee ratio of borrowing an nft is platformFeeBase / 10000.
  uint256 constant platformFeeBase = 100;

  /// @dev When a user blames, he/she gets blameRewardPercenteage percents of the guarantee
  uint256 constant blameRewardPercenteage = 20;
  
  /// @dev Where fee goes 
  // {TODO: Change vault address}
  address vault = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;

  // {TODO: Dapp vault}

  /// @dev Guarantee token address
  // {TODO: Change vault address}
  address guaranteeAddress = 0xe719F6369c67d749E9f676baC907fD15930AfE5A;

  /// @dev Total rental contract
  uint256 totalDeployed = 0;

  /// @notice Emitted when a rental contract is deployed
  /// @param deployer the deployer address
  /// @param nftAddress the NFT assert address
  /// @param contractAddress the address of this rental contract just deployed 
  event Deploy(address indexed deployer, address indexed nftAddress, address indexed contractAddress);

  constructor() {

  }

  /// @dev Change vault address
  function setVault(address newVaultAddress) external onlyOwner {
    vault = newVaultAddress;
  }

  /// @dev Deploy a rental contract
  /// @param originNftAddress_ The NFT contract address
  /// @param minLeasePeriod_ Minimum lease period in seconds
  /// @param guarantee_ Guarantee amount a lessor need to lock
  function deploy(
    address originNftAddress_,
    uint256 minLeasePeriod_,
    uint256 guarantee_
  ) external {
    address rentalContractAddress = address(
      new NftAsset(
        originNftAddress_,
        guaranteeAddress,
        minLeasePeriod_,
        guarantee_,
        platformFeeBase,
        vault,
        blameRewardPercenteage
      )
    );

    emit Deploy(msg.sender, originNftAddress_, rentalContractAddress);
  }
}
