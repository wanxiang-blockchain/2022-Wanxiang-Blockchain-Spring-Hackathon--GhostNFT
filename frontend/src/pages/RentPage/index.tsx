import { Link } from "umi";
import styles from "./index.less";

import classNames from "classnames";
import HeaderSearch from "@/components/HeaderSearch";
import Footer from "@/components/Footer";
import gameImg from "@/assets/images/08-1.png";
import contentImg from "@/assets/images/04-2.png";
import heartSrc from "@/assets/images/heart.svg";
import { useState, useEffect } from "react";
import { ethers } from "ethers";

import NFTAsset from "../../../contract/abi/NftAsset.json";
import GSTNAsset from "../../../contract/abi/GSTNToken.json";
import { message, notification } from "antd";

declare let window: any;
interface props {}
export default function RentPage(props: any) {
  const assetsAddress = "0x24895c35D651F14c7C7d7A8563fdD27F0e6405f5";
  const usdtAddress = "0xBB647627b6334Be3789Bf5B3ABE30EDA36ef6538";
  const [tokenid, setTokenId] = useState();
  const [allowance, setAllowance] = useState(false);

  const MsgConfrimTransaction = "Confirm this transaction in your wallet";
  const MsgTransactionSubmitted = "Transaction Submitted";
  const MsgTransactionSuccessed = "Transaction Successed!";

  useEffect(() => {
    const ethEnabled = async () => {
      try {
        console.log("tokenid:", props.location.state.tokenid);
        setTokenId(props.location.state.tokenid);
      } catch (e) {
        message.info("tokenid is null ,please check first");
      }

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
        }
      }
    };

    erc20Allowance();

    ethEnabled();
  }, []);

  const RentNow = async () => {
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
      const transaction = await Assetcontract.leaseFrom(tokenid);
      if (transaction) {
        Notify("Message", MsgTransactionSubmitted, 5);
      }
      await transaction.wait();
      Notify("Message", MsgTransactionSuccessed, 5);
    } else {
      const hide = message.error("Please connect to MetaMask.", 0);
      setTimeout(hide, 2000);
    }
  };

  const Notify = (message: any, description: any, duration: any) => {
    notification.open({
      message: message,
      description: description,
      duration: duration,
    });
  };

  const maxApproved = "10000000";

  const erc20Allowance = async () => {
    if (window.ethereum) {
      const [account] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        usdtAddress,
        GSTNAsset.abi,
        provider
      );
      const result = await contract.allowance(account, assetsAddress);
      console.log("result:", result);

      if (result > 0) {
        setAllowance(true);
      } else {
        setAllowance(false);
      }
    }
  };

  const Approve = async () => {
    if (window.ethereum) {
      const [account] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const singer = provider.getSigner();
      const contract = new ethers.Contract(usdtAddress, GSTNAsset.abi, singer);
      Notify("Message", MsgConfrimTransaction, 5);
      try {
        const transaction = await contract.approve(
          assetsAddress,
          ethers.utils.parseEther(maxApproved)
        );
        if (transaction) {
          Notify("Message", MsgTransactionSubmitted, 5);
        }
        await transaction.wait();
        setAllowance(true);
        Notify("Message", MsgTransactionSuccessed, 5);
      } catch (error) {
        console.log(JSON.stringify(error));
      }
    }
    false;
  };

  return (
    <div className={styles["rent-page"]}>
      <Link to="/home">
        <HeaderSearch bgColor="#1C1C1C"></HeaderSearch>
      </Link>
      <div className={`${styles["top-info"]} f-c`}>
        <img className={styles["game-img"]} src={gameImg} alt="game" />
        <div className={styles["game-info"]}>
          <div className={`${styles["game-info-top"]} f-s`}>
            <h1>
              <span>Lucky Axe</span>
              <img src={heartSrc} alt="icon" />
              <em>163</em>
            </h1>

            {allowance ? (
              <button
                className={classNames(styles["btn-one"], "fill-button")}
                onClick={() => {
                  RentNow();
                }}
              >
                Rent Now
              </button>
            ) : (
              <button
                className={classNames(styles["btn-one"], "fill-button")}
                onClick={() => {
                  Approve();
                }}
              >
                Approve
              </button>
            )}
          </div>
          <div className={styles["game-info-center"]}>
            Mxnsters, a collection from GHXSTS. The Mxnster Cards allow you to
            secure 1s from the uocomina cal.,Mxnsters, a collection from GHXSTS.
            Mxnsters, a collection from GHXSTS. The Mxnster Cards allow you to
            secure 1s from the uocomina cal.,Mxnsters, a collection from GHXSTS.
          </div>
          <div className={styles["game-info-bottom"]}>
            <div>
              <h3>Expiration</h3>
              <p>2022/07/01 00:00:00</p>
            </div>
            <div>
              <h3>Countdown</h3>
              <p> 0 month 17 days</p>
            </div>
            <div>
              <h3>Rent</h3>
              <p>100 USDT</p>
            </div>
            <div>
              <h3>Owner reputation</h3>
              <p>85</p>
            </div>
            <div>
              <h3>Properties</h3>
              <p> properties123456</p>
            </div>
          </div>
        </div>
      </div>
      <div className={styles["content-info"]}>
        <img src={contentImg} alt="content" />
      </div>
      <Footer></Footer>
    </div>
  );
}
