const { utils } = require("ethers");
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  ropstenNftAddress = "0x457cc3bfc6bA5145703D217e6C3A18c607D2bD53";
  ropstenGSTNAddress = "0x4b301fA7510BAbCf52102e3358dAE10eeBc7DEa9";

  mumbaiNftAddress = "0x6c8A48960ca273ada078606338cF99e16240Ef7D";
  mumbaiGSTNAddress = "0xcb5Cec443e1365bf9c6cbC2064d80472F54103Fa";

  vaultAddress = "0xd3DDC425CFC5376c0873213969F3Ff3496Ec49d0";

  // NFT Asset Contract
  Assets = await ethers.getContractFactory("NftAsset");
  assets = await Assets.deploy(
    ropstenNftAddress, // nft
    ropstenGSTNAddress, // token
    // mumbaiNftAddress, // nft
    // mumbaiGSTNAddress, // token
    18000,
    utils.parseEther("100"),
    100,
    vaultAddress,
    20
    // ,
    // {
    //   gasPrice: 1000000000,
    //   gasLimit: 4000000,
    // }
  );
  console.log("NFT Asset address:", assets.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
