import classNames from "classnames";
import styles from "./index.less";
import HeaderSearch from "@/components/HeaderSearch";
import Footer from "@/components/Footer";
import { Tabs, Select, Input, message } from "antd";
import Card from "./components/card";
import { CardItem } from "./type";

import searchSrc from "@/assets/images/search-gray.svg";
import starsSrc from "@/assets/images/stars.svg";
import chromeSrc from "@/assets/images/chrome-fill.svg";
import instagramSrc from "@/assets/images/instagram-fill.svg";
import twitterSrc from "@/assets/images/twitter-fill.svg";
import facebookSrc from "@/assets/images/facebook-fill.svg";
import { useState, useEffect } from "react";
import { ethers } from "ethers";

import NFTAsset from "../../../contract/abi/NftAsset.json";
import { Link } from "umi";

const assetsAddress = "0x24895c35D651F14c7C7d7A8563fdD27F0e6405f5";

const { TabPane } = Tabs;
const { Search } = Input;
const { Option } = Select;

declare let window: any;

const cardList: CardItem[] = [
  {
    imgUrl: require("@/assets/images/03-2.png"),
    expiration: "2022/07/01 00:00:00",
    countdown: "0 mon 17 day",
    rent: "100 USDT",
    owner: "reputation 85",
  },
  {
    imgUrl: require("@/assets/images/03-3.png"),
    expiration: "2022/07/01 00:00:00",
    countdown: "0 mon 17 day",
    rent: "100 USDT",
    owner: "reputation 85",
  },
  {
    imgUrl: require("@/assets/images/03-4.png"),
    expiration: "2022/07/01 00:00:00",
    countdown: "0 month 17 days",
    rent: "100 USDT",
    owner: "reputation 85",
  },
  {
    imgUrl: require("@/assets/images/03-5.png"),
    expiration: "2022/07/01 00:00:00",
    countdown: "0 month 17 days",
    rent: "100 USDT",
    owner: "reputation 85",
  },
  {
    imgUrl: require("@/assets/images/03-6.png"),
    expiration: "2022/07/01 00:00:00",
    countdown: "0 month 17 days",
    rent: "100 USDT",
    owner: "reputation 85",
  },
  {
    imgUrl: require("@/assets/images/03-7.png"),
    expiration: "2022/07/01 00:00:00",
    countdown: "0 month 17 days",
    rent: "100 USDT",
    owner: "reputation 85",
  },
  {
    imgUrl: require("@/assets/images/03-8.png"),
    expiration: "2022/07/01 00:00:00",
    countdown: "0 month 17 days",
    rent: "100 USDT",
    owner: "reputation 85",
  },
  {
    imgUrl: require("@/assets/images/03-9.png"),
    expiration: "2022/07/01 00:00:00",
    countdown: "0 month 17 days",
    rent: "100 USDT",
    owner: "reputation 85",
  },
];

export default function SingleNftPage() {
  const initialValue: {
    id: any;
    imgUrl: string;
    expiration: string;
    countdown: string;
    rent: string;
    owner: string;
  }[] = [];

  const [gameNFTMap, setGameNFTMap] = useState(initialValue);

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
    ethEnabled();
  }, []);

  const fetchDataFromBlockchain = async () => {
    if (window.ethereum) {
      const [account] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        assetsAddress,
        NFTAsset.abi,
        provider
      );
      let gameItemMaps: {
        id: any;
        imgUrl: string;
        expiration: string;
        countdown: string;
        rent: string;
        owner: string;
      }[] = [];

      let result = await contract.getListedTokenId();
      console.log(result);

      for (let j = 0; j < result.length; j++) {
        var tokenId = result[j];
        let [rentAddress, ,] = await contract.phantomOwner(tokenId);
        console.log("rentAddress:", rentAddress);
        if (rentAddress != 0x0000000000000000000000000000000000000000) {
          continue;
        }
        gameItemMaps.push({
          id: result[j].toString(),
          imgUrl: require("@/assets/images/nft" + tokenId + ".png"),
          expiration: "2022/07/01 00:00:00",
          countdown: "0 mon 17 days",
          rent: "100 USDT",
          owner: "reputation 85",
        });
      }
      console.log(gameItemMaps);
      setGameNFTMap(gameItemMaps);
    } else {
      const hide = message.error("Please connect to MetaMask.", 0);
      setTimeout(hide, 2000);
    }
  };

  const onChange = (key: any) => {
    console.log(key);
  };

  return (
    <div className={styles["single-nft"]}>
      <div className={styles["banner-content"]}>
        <Link to="/home">
          <HeaderSearch
            bgColor="transparent"
            inputBgColor="rgba(54,54,54,0.73)"
          ></HeaderSearch>
        </Link>
        <div className={styles["info-box"]}>
          <div className={`${styles["top"]} f-s`}>
            <div className={styles["game-user"]}>
              <h2 className="f-c">
                The Game
                <img src={starsSrc} alt="icon" />
              </h2>
              <p>
                Created by &nbsp;<em>yyy</em>
              </p>
            </div>
            <ul className={`${styles["num-box"]} f-c`}>
              <li>
                <h1>345</h1>
                <p>iteams</p>
              </li>
              <li>
                <h1>112</h1>
                <p>Owners</p>
              </li>
              <li>
                <h1>32</h1>
                <p>floor price</p>
              </li>
              <li>
                <h1>11.2k</h1>
                <p>volume traded</p>
              </li>
            </ul>
          </div>

          <div className={styles.center}>
            Mxnsters, a collection from GHXSTS. The Mxnster Cards allow you to
            secure 1s from the uocomina cal.,Mxnsters, a collection from GHXSTS.
            The Mxnster Cards allow you to secure 1s from the uocomina
            cal.,Mxnsters, a collection from GHXSTS. The Mxnster Cards allow you
            to secure 1s from the uocomina cal.,
          </div>

          <div className={classNames(styles["bottom"], "f-v")}>
            <button className={classNames(styles["btn-one"], "fill-button")}>
              + Watchlist
            </button>
            <div className={classNames(styles["icon-box"], "f-v")}>
              <a>
                <img src={chromeSrc} alt="icon" />
              </a>
              <a>
                <img src={instagramSrc} alt="icon" />
              </a>
              <a>
                <img src={twitterSrc} alt="icon" />
              </a>
              <a>
                <img src={facebookSrc} alt="icon" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className={styles["card-wrap"]}>
        <div className={classNames(styles["option-box"], "f-s")}>
          <Input.Group
            compact
            style={{ background: "#fff", width: "593px", marginLeft: 0 }}
          >
            <Input
              placeholder="Search itemes,collections,and accounts"
              bordered={false}
              onChange={onChange}
              className={styles["header-input"]}
            />
            <img className="header-input-icon" src={searchSrc} alt="icon" />
          </Input.Group>
          <div>
            <Select
              defaultValue="Trait"
              style={{ width: 120 }}
              bordered={false}
            >
              <Option value="Trait">Trait</Option>
            </Select>
            <Select
              defaultValue="Price Low to High"
              style={{ width: 180 }}
              bordered={false}
            >
              <Option value="Price Low to High">Price Low to High</Option>
            </Select>
          </div>
        </div>

        <div className={styles["card-list"]}>
          {gameNFTMap.map((item, index) => (
            <Card key={index} cardItem={item}></Card>
          ))}
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}
