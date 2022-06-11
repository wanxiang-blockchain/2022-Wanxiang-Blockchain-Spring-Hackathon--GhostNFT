const { utils } = require("ethers");
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  const player1 = "0x0C2C18aA0F6f77e96F120642F13bA74E4cF8090E";
  const player2 = "0xd3DDC425CFC5376c0873213969F3Ff3496Ec49d0";

  console.log("Deploying contracts with the account:", deployer.address);

  // // GSTN Token
  // GSTNToken = await ethers.getContractFactory("GSTNToken");
  // token = await GSTNToken.deploy(
  //   utils.parseEther("10000000000")
  //   // , {
  //   //   gasPrice: 1000000000,
  //   //   gasLimit: 4000000,
  //   // }
  // );
  // await token.connect(deployer).transfer(player1, utils.parseEther("100000"));
  // // await token.connect(deployer).transfer(player2, utils.parseEther("10000"));
  // console.log("GSTN address:", token.address);

  // // USDT Token
  // const Usdt = await ethers.getContractFactory("USDT");
  // usdt = await Usdt.deploy(
  //   utils.parseEther("10000000000")
  //   // , {
  //   //   gasPrice: 5000000000,
  //   //   gasLimit: 4000000,
  //   // }
  // );
  // await usdt.connect(deployer).transfer(
  //   player1,
  //   utils.parseEther("10000")
  //   // , {
  //   //   gasPrice: 5000000000,
  //   //   gasLimit: 4000000,
  //   // }
  // );
  // await usdt.connect(deployer).transfer(
  //   player2,
  //   utils.parseEther("10000")
  //   // , {
  //   //   gasPrice: 5000000000,
  //   //   gasLimit: 4000000,
  //   // }
  // );
  // console.log("USDT address:", usdt.address);

  // Game item NFT
  GameItem = await ethers.getContractFactory("GameItem");
  gameItem = await GameItem.deploy();
  for (i = 0; i < 5; i++) {
    await gameItem.awardItem(
      player1,
      "test"
      // , {
      //   gasPrice: 5000000000,
      //   gasLimit: 4000000,
      // }
    );
  }
  for (i = 0; i < 2; i++) {
    await gameItem.awardItem(
      player2,
      "test"
      // , {
      //   gasPrice: 5000000000,
      //   gasLimit: 4000000,
      // }
    );
  }
  console.log("GameItem address:", gameItem.address);
  /*
   */
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
