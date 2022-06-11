// SPDX-License-Identifier: MIT

pragma solidity 0.8.7;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interface/IAssets.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";



contract SampleApplication is Ownable {
  bool public useRental;

  IERC721 public nftContract;
  IAssets public rentalContract;

  uint256 interval = 3600;

  constructor(address nftAddress, address rentalAddress) {
    useRental = false;
    nftContract = IERC721(nftAddress);
    rentalContract = IAssets(rentalAddress);
  }

  function switchRental() external onlyOwner {
    useRental = !useRental;
  }

  function _doUseNFT(uint256 tokenId) internal {
    // business logic here
  }

  function useNFT(uint256 tokenId) external {
    if(!useRental) {
      /// if not use rental
      if(nftContract.ownerOf(tokenId) == msg.sender) {
        _doUseNFT(tokenId);
      }
    } else {
      /// if use rental
      (address borrower, uint256 expiration, /*uint8 level*/) = rentalContract.phantomOwner(tokenId);
      if(
        // if tokenId is lend to msg.sender
        (borrower == msg.sender && expiration - block.timestamp > interval)
        ||
        // or if msg.sender is real owner and tokenId is not rent out
        (nftContract.ownerOf(tokenId) == msg.sender && rentalContract.isInLease(tokenId) == false)
        ) {
          _doUseNFT(tokenId);
        }
    }
  }
}