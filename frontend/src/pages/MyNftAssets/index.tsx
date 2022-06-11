import { Link } from "umi";
import styles from "./index.less";
import HeaderSearch from "@/components/HeaderSearch";
import Footer from "@/components/Footer";
import cardOneImg from "@/assets/images/03-2.png";
import cardTwoImg from "@/assets/images/03-3.png";
import cardThreeImg from "@/assets/images/03-4.png";
import cardFourImg from "@/assets/images/03-5.png";
import cardFiveImg from "@/assets/images/03-6.png";
import nftImg1 from "@/assets/images/nft1.png";
import nftImg2 from "@/assets/images/nft2.png";
import nftImg3 from "@/assets/images/nft3.png";
import nftImg4 from "@/assets/images/nft4.png";
import nftImg5 from "@/assets/images/nft5.png";
import nftImg6 from "@/assets/images/nft6.png";
import nftImg7 from "@/assets/images/nft7.png";
import starImg from "@/assets/images/stars.svg";
import { useState, useEffect } from "react";
import { ethers } from "ethers";

import {
  Tabs,
  notification,
  Modal,
  DatePicker,
  Select,
  Input,
  message,
} from "antd";
import GameItem from "../../../contract/abi/GameItem.json";
import NFTAsset from "../../../contract/abi/NftAsset.json";
import GSTNAsset from "../../../contract/abi/GSTNToken.json";

const { Option } = Select;
const { TabPane } = Tabs;
declare let window: any;

export default function MyNftsPage() {
  const initialValue: {
    id: any;
    name: string;
    image: any;
    discription: string;
    contract: string;
    hasRent: boolean;
  }[] = [];

  const gameItemAddress = "0xAAcaDbd12383cBe114C2Bee5faa9e791580279A1";
  const assetsAddress = "0x24895c35D651F14c7C7d7A8563fdD27F0e6405f5";
  const gstnAddress = "0x4b301fA7510BAbCf52102e3358dAE10eeBc7DEa9";
  const usdtAddress = "0xBB647627b6334Be3789Bf5B3ABE30EDA36ef6538";

  const MsgConfrimTransaction = "Confirm this transaction in your wallet";
  const MsgTransactionSubmitted = "Transaction Submitted";
  const MsgTransactionSuccessed = "Transaction Successed!";

  const [gameNFTMap, setGameNFTMap] = useState(initialValue);
  const [borrowedMap, setBorrowedMap] = useState(initialValue);

  const [visible, setIsModalVisible] = useState(false);
  const [expiration, setExpiration] = useState(0);
  const [tokenid, setRentId] = useState();

  const [fee, setFee] = useState();
  const [allowance, setAllowance] = useState(false);

  useEffect(() => {
    const ethEnabled = async () => {
      let currentAccount: null = null;
      window.ethereum
        .request({ method: "eth_accounts" })
        .then(handleAccountsChanged)
        .catch((err: any) => {
          console.error(err);
        });

      window.ethereum.on("accountsChanged", handleAccountsChanged);

      function handleAccountsChanged(accounts: string | any[]) {
        if (accounts.length === 0) {
          const hide = message.error("Please connect to MetaMask.", 0);
          setTimeout(hide, 2000);
        } else if (accounts[0] !== currentAccount) {
          currentAccount = accounts[0];
          fetchDataFromBlockchain();
        }
      }
    };
    erc20Allowance();
    ethEnabled();
  }, []);

  const fetchDataFromBlockchain = async () => {
    if (window.ethereum) {
      const [account] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("account:", account);

      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const contract = new ethers.Contract(
        gameItemAddress,
        GameItem.abi,
        provider
      );

      const Assetcontract = new ethers.Contract(
        assetsAddress,
        NFTAsset.abi,
        provider
      );

      let balance = await contract.balanceOf(account);
      // async (value: any) => {
      //   const balance = value;
      console.log("balance:", balance);
      let gameItemMaps: {
        id: any;
        name: string;
        image: any;
        discription: string;
        contract: string;
        hasRent: boolean;
      }[] = [];
      for (let j = 0; j < balance; j++) {
        let tokenId = await contract.tokenOfOwnerByIndex(account, j);
        let [rentAddress, ,] = await Assetcontract.phantomOwner(tokenId);
        let inLease = await Assetcontract.isInLease(tokenId);
        console.log("rentAddress:", rentAddress);
        let _hasRent = false;
        if (
          rentAddress != 0x0000000000000000000000000000000000000000 ||
          inLease
        ) {
          _hasRent = true;
        }
        console.log("===tokenId:", tokenId, "has rent: ", _hasRent);
        gameItemMaps.push({
          id: tokenId.toString(),
          name: "ghost#" + tokenId,
          discription:
            "Mxnsters a collection from GHXSTS. The Mxnster Card allow you to secure from the uncomina cal",
          image: "",
          hasRent: _hasRent,
          contract: gameItemAddress,
        });
      }
      console.log(gameItemMaps);
      setGameNFTMap(gameItemMaps);
      // },
      // (error: any) => {
      //   console.log(error);
      // }
      // );

      await Assetcontract.balanceOf(account).then(
        async (value: any) => {
          const balance = value;
          console.log("balance-borrowed:", balance);
          let borrowedMaps: {
            id: any;
            name: string;
            image: any;
            discription: string;
            contract: string;
            hasRent: boolean;
          }[] = [];
          for (let j = 0; j < balance; j++) {
            let tokenId = await Assetcontract.tokenOfOwnerByIndex(account, j);
            console.log("borrowed - tokenId:", tokenId);
            if (tokenId == 0) {
              continue;
            }
            borrowedMaps.push({
              id: tokenId.toString(),
              name: "ghost#" + tokenId,
              discription:
                "Mxnsters a collection from GHXSTS. The Mxnster Card allow you to secure from the uncomina cal",
              image: "",
              hasRent: false,
              contract: gameItemAddress,
            });
          }
          console.log(borrowedMaps);
          setBorrowedMap(borrowedMaps);
        },
        (error: any) => {
          console.log(error);
        }
      );
    } else {
      const hide = message.error("Please connect to MetaMask.", 0);
      setTimeout(hide, 2000);
    }
  };

  const listNFT = async (id: any) => {
    setIsModalVisible(true);
    setRentId(id);
  };

  const rentNFT = async () => {
    console.log("tokenId: ", tokenid);
    if (window.ethereum) {
      const [account] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const singer = provider.getSigner();
      const Assetcontract = new ethers.Contract(
        assetsAddress,
        NFTAsset.abi,
        singer
      );
      var feeTxt = document.getElementById("fee")?.value;
      const fee = ethers.utils.parseEther(feeTxt);
      console.log(tokenid);
      console.log(expiration);
      console.log(fee);
      console.log(usdtAddress);
      const transaction = await Assetcontract.putUpForLease(
        tokenid,
        expiration,
        fee,
        usdtAddress
      );
      if (transaction) {
        Notify("Message", MsgTransactionSubmitted, 5);
      }
      await transaction.wait();
      Notify("Message", MsgTransactionSuccessed, 5);
      setIsModalVisible(false);
    } else {
      const hide = message.error("Please connect to MetaMask.", 0);
      setTimeout(hide, 2000);
    }
  };

  const erc20Allowance = async () => {
    if (window.ethereum) {
      const [account] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        gstnAddress,
        GSTNAsset.abi,
        provider
      );
      const result = await contract.allowance(account, assetsAddress);
      console.log("allowance - result:", result);
      if (result > 0) {
        setAllowance(true);
      } else {
        setAllowance(false);
      }
    }
  };

  const maxApproved = "10000000";
  const Approve = async () => {
    if (window.ethereum) {
      const [account] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const singer = provider.getSigner();
      const gstnContract = new ethers.Contract(
        gstnAddress,
        GSTNAsset.abi,
        singer
      );
      Notify("Message", MsgConfrimTransaction, 5);
      try {
        const transaction = await gstnContract.approve(
          assetsAddress,
          ethers.utils.parseEther(maxApproved)
        );
        if (transaction) {
          Notify("Message", MsgTransactionSubmitted, 5);
        }
        await transaction.wait();
        Notify("Message", MsgTransactionSuccessed, 5);
        setAllowance(true);
      } catch (error) {
        console.log(JSON.stringify(error));
      }
    }
    false;
  };

  const Notify = (message: any, description: any, duration: any) => {
    notification.open({
      message: message,
      description: description,
      duration: duration,
    });
  };

  const onChange = (key: string) => {};
  const onChangeDate = (date: any, dateString: any) => {
    var d = new Date(dateString);
    var time = d.getTime() / 1000;
    console.log(time);
    setExpiration(time);
  };
  const onChangeSelect = (value: string) => {
    console.log(`selected ${value}`);
  };
  const onSearch = (value: string) => {
    console.log("search:", value);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const returnImage = (id: number) => {
    if (id == 1) return nftImg1;
    if (id == 2) return nftImg2;
    if (id == 3) return nftImg3;
    if (id == 4) return nftImg4;
    if (id == 5) return nftImg5;
    if (id == 6) return nftImg6;
    if (id == 7) return nftImg7;
    return nftImg7;
  };

  return (
    <div className={styles.mynfts}>
      <Link to="/home">
        <HeaderSearch />
      </Link>
      <div className={styles.nftsTitle}>
        <p>My NFT &nbsp;</p>
        <span> Assets</span>
      </div>
      <Tabs defaultActiveKey="1" onChange={onChange}>
        <TabPane tab="My NFTs" key="1">
          <div className={styles.cardWrap}>
            {gameNFTMap.length > 0
              ? gameNFTMap.map((item, index) => (
                  <div
                    className={
                      item.hasRent ? styles.cardItemGrey : styles.cardItem
                    }
                  >
                    <img src={returnImage(item.id)} alt="icon" />
                    <div className={styles.cardContent}>
                      <p>{item.name}</p>
                      <div>{item.discription}</div>
                    </div>
                    {item.hasRent ? (
                      <div className={styles.listBtn}>Rent out</div>
                    ) : (
                      <div
                        className={styles.listBtn}
                        onClick={() => {
                          listNFT(item.id);
                        }}
                      >
                        List NFT
                      </div>
                    )}
                  </div>
                ))
              : ""}
            {gameNFTMap.length == 0 ? "No NFTS" : ""}
          </div>
        </TabPane>

        <TabPane tab="My Borrowed NFTS" key="2">
          <div className={styles.cardWrap}>
            {borrowedMap.length > 0
              ? borrowedMap.map((item, index) => (
                  <div className={styles.cardItemBorrowed}>
                    <img src={returnImage(item.id)} alt="icon" />
                    <div className={styles.cardContent}>
                      <p>{item.name}</p>
                      <span>
                        by <em>&nbsp;Gxng YangNFT</em>
                      </span>
                      <div>{item.discription}</div>
                      <div className={styles.expiration}>
                        <span>Expiration</span> 2022/07/01 00:00:00
                      </div>
                    </div>
                  </div>
                ))
              : ""}
            {borrowedMap.length == 0 ? "No NFTS" : ""}
          </div>
        </TabPane>
      </Tabs>
      {allowance ? (
        <Modal
          visible={visible}
          title="List NFT"
          onCancel={handleCancel}
          footer={[
            <div
              className={styles.confirmBtn}
              onClick={() => {
                rentNFT();
              }}
            >
              Confirm
            </div>,
          ]}
        >
          <div className={styles.listTitle}>
            <p>Renting Expiration</p>
            <DatePicker size="large" onChange={onChangeDate} picker="date" />
          </div>
          <div className={styles.listTitle}>
            <p>Renting Token</p>
            <Select
              showSearch
              placeholder="Select a token"
              optionFilterProp="children"
              onChange={onChangeSelect}
              onSearch={onSearch}
              filterOption={(input, option) =>
                (option!.children as unknown as string)
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            >
              <Option value="USDT">USDT</Option>
              <Option value="GSTN">GSTN</Option>
            </Select>
          </div>
          <div className={styles.listTitle}>
            <p>Renting Free</p>
            <Input placeholder="" id="fee" />
          </div>
        </Modal>
      ) : (
        <Modal
          visible={visible}
          title="List NFT"
          onCancel={handleCancel}
          footer={[
            <div
              className={styles.confirmBtn}
              onClick={() => {
                Approve();
              }}
            >
              Approve
            </div>,
          ]}
        >
          <div className={styles.listTitle}>
            <p>Renting Expiration</p>
            <DatePicker size="large" onChange={onChangeDate} picker="date" />
          </div>
          <div className={styles.listTitle}>
            <p>Renting Token</p>
            <Select
              showSearch
              placeholder="Select a token"
              optionFilterProp="children"
              onChange={onChangeSelect}
              onSearch={onSearch}
              filterOption={(input, option) =>
                (option!.children as unknown as string)
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            >
              <Option value="USDT">USDT</Option>
              <Option value="GSTN">GSTN</Option>
            </Select>
          </div>
          <div className={styles.listTitle}>
            <p>Renting Free</p>
            <Input placeholder="" id="fee" />
          </div>
        </Modal>
      )}
      <Footer />
    </div>
  );
}
