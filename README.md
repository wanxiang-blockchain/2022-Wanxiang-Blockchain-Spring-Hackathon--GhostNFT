# 2022-Wanxiang-Blockchain-Spring-Hackathon--GhostNFT

## A <strong>collateral-free</strong>, <strong>non-owner-transfer</strong> NFT rental protocol

The rental process is as following:

1)The lessors register their willing to rent out their NFTs and lock some guarantee on the platform in case they transfer the NFTs during the rental period.<br>
2)The borrowers lock rent to the platform.<br>
3)If any lessor transfer the NFT he/she promise to rent out, any account except the lessor can report to the platform by calling the smart contract. As a reward, the reporter can get a portion of the guarantee. The remainning guarantee goes to the dapp wallet and the borrower to cover their loss.<br>
4)If the lessor never transfer his/her registered NFT during the rental period, he/she can take the rent after the period ends.<br>

![image](https://github.com/yijie37/ghostnft-protocol/blob/main/misc/non-collateral.png)<br>

## 1.To run frontend:<br>

<br>
1). cd frontend<br>
2). yarn<br>
3). yarn start<br>
<br>
<br>

## 2.To deploy smart contract<br>

<br>
1).Write deployer private key file into keys/goerli, see hardhat.config.js<br>
2).cd contract<br>
3).Write two play address into scripts/deploy_gstn.js player1 and player2.<br>
4).npx hardhat run scripts/deploy_gstn.js --network goerli<br>
5).npx hardhat run scripts/deploy_assets.js --network goerli<br>


## 3. Demo video
https://www.bilibili.com/video/BV1C94y117Z2/?vd_source=312de9d5563646001937afd364d52a14<br>
