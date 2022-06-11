// SPDX-License-Identifier: MIT

pragma solidity 0.8.7;

interface IAssets {
  function isInLease(uint256 tokenId) external view returns (bool);

  function balanceOf(address account) external view returns (uint256);
  function ownerOf(uint256 tokenId) external view returns (address);
  function tokenOfOwnerByIndex(address account, uint256 index) external view returns (uint256);
  function phantomOwner(uint256 tokenId) external view returns (address, uint256, uint8);
}