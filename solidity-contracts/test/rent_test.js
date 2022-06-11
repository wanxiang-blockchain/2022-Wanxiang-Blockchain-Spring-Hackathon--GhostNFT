const { expect } = require("chai");
const { utils } = require("ethers");
const { ethers } = require("hardhat");

describe("Asset contract test", function () {
  beforeEach(async function () {
    [owner, ...addrs] = await ethers.getSigners();

    // GSTN Token
    const GSTNToken = await ethers.getContractFactory("GSTNToken");
    token = await GSTNToken.deploy(utils.parseEther("1000000000"));
    token.connect(owner).transfer(addrs[1].address, utils.parseEther("10000"));
    token.connect(owner).transfer(addrs[2].address, utils.parseEther("10000"));

    // USDT Token
    const Usdt = await ethers.getContractFactory("USDT");
    usdt = await Usdt.deploy(utils.parseEther("1000000000"));
    await usdt
      .connect(owner)
      .transfer(addrs[1].address, utils.parseEther("10000"));
    await usdt
      .connect(owner)
      .transfer(addrs[2].address, utils.parseEther("10000"));

    // NFT
    const GameItem = await ethers.getContractFactory("GameItem");
    gameItem = await GameItem.deploy();
    for (i = 0; i < 5; i++) {
      await gameItem.awardItem(addrs[1].address, "test");
    }
    for (i = 0; i < 5; i++) {
      await gameItem.awardItem(addrs[2].address, "test");
    }

    // Rental
    Assets = await ethers.getContractFactory("NftAsset");
    assets = await Assets.deploy(
      gameItem.address,
      token.address,
      18000,
      utils.parseEther("100"),
      100,
      owner.address,
      20
    );

    await token
      .connect(addrs[1])
      .approve(assets.address, utils.parseEther("10000"));
    await token
      .connect(addrs[2])
      .approve(assets.address, utils.parseEther("10000"));
    await usdt
      .connect(addrs[1])
      .approve(assets.address, utils.parseEther("10000"));
    await usdt
      .connect(addrs[2])
      .approve(assets.address, utils.parseEther("10000"));
  });

  it("CASE 0", async function () {
    await assets
      .connect(addrs[1])
      .putUpForLease(2, 1656604800, utils.parseEther("100"), usdt.address);
    await ethers.provider.send("evm_increaseTime", [14]);

    await assets
      .connect(addrs[1])
      .putUpForLease(3, 1656604800, utils.parseEther("100"), usdt.address);
    await ethers.provider.send("evm_increaseTime", [14]);

    await assets
      .connect(addrs[1])
      .putUpForLease(5, 1656604800, utils.parseEther("100"), usdt.address);
    await ethers.provider.send("evm_increaseTime", [14]);

    await assets.connect(addrs[2]).leaseFrom(5);
    await ethers.provider.send("evm_increaseTime", [14]);
    info = await assets.connect(owner).phantomOwner(5);
    await ethers.provider.send("evm_increaseTime", [14]);
    balance = await assets.connect(owner).balanceOf(addrs[2].address);
    console.log(addrs[2].address);
    console.log(balance);
    console.log(info);
  });
});
