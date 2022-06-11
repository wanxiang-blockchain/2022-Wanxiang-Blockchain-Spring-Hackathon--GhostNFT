import styles from "./index.less";
import HeaderSearch from "@/components/HeaderSearch";
import Footer from "@/components/Footer";
import equipOne from "@/assets/images/09-2.png";
import equipTwo from "@/assets/images/09-3.png";
import equipFour from "@/assets/images/09-4.png";
import equipAdd from "@/assets/images/09-add.svg";
import NFTAsset from "../../../contract/abi/NftAsset.json";
import { useState, useEffect } from "react";
import { message } from "antd";
import { ethers } from "ethers";
import { Link } from "umi";

declare let window: any;

export default function GamesPage() {
  const assetsAddress = "0x24895c35D651F14c7C7d7A8563fdD27F0e6405f5";
  const [match, setMatch] = useState(false);

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
      const Assetcontract = new ethers.Contract(
        assetsAddress,
        NFTAsset.abi,
        provider
      );
      const result = await Assetcontract.ownerOf(5);
      if (account.toString().toLowerCase() == result.toString().toLowerCase()) {
        setMatch(true);
      } else {
        setMatch(false);
      }
    } else {
      const hide = message.error("Please connect to MetaMask.", 0);
      setTimeout(hide, 2000);
    }
  };

  return (
    <>
      <div className={styles.games}>
        <Link to="/home">
          <HeaderSearch bgColor="#1C1C1C"></HeaderSearch>
        </Link>
        <div className={styles.gamesPage}>
          <div className={styles.startWrap}>
            <p>
              You need *ALL * <span>3 NFT</span> to start game!
            </p>
            <div className={styles.equipment}>
              <img src={equipOne} alt="icon" />
              <img src={equipTwo} alt="icon" />
              {match ? (
                <img src={equipFour} alt="icon" />
              ) : (
                <img src={equipAdd} alt="icon" />
              )}
            </div>
            <div className={styles.startBtn}>Start</div>
          </div>
        </div>
        <Footer></Footer>
      </div>
    </>
  );
}
