import styles from "./index.less";

import { useState, useEffect } from "react";
import detectEthereumProvider from "@metamask/detect-provider";

import { Input, message } from "antd";
import classNames from "classnames";
import logoSrc from "@/assets/images/logo-small.svg";
import accountSrc from "@/assets/images/account.svg";
import walletSrc from "@/assets/images/wallet.svg";
import searchSrc from "@/assets/images/search.svg";
import { Link } from "umi";

const { Search } = Input;

declare let window: any;
const onChange = (value: any) => console.log(value);

interface props {}

type Network = {
  chainId: string;
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string; // 2-6 characters long
    decimals: 18;
  };
  rpcUrls: string[];
  blockExplorerUrls?: string[];
};

export default function HeaderSearch(props: any) {
  const [isInstalledMetamask, setIsInstalledMetamask] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [currentNetwork, setCurrentNetwork] = useState("");
  const [currentAccount, setCurrentAccount] = useState("");

  const ethereumMainnet: Network = {
    chainId: "0x1",
    chainName: "Etherum Mainnet",
    rpcUrls: ["https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"],
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    blockExplorerUrls: ["https://etherscan.io/"],
  };

  const mumbaiNetwork: Network = {
    chainId: "80001",
    chainName: "Mumbai",
    rpcUrls: ["https://matic-mumbai.chainstacklabs.com"],
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    blockExplorerUrls: ["https://mumbai.polygonscan.com"],
  };

  const bscNetwork: Network = {
    chainId: "0x38", // 0x61
    chainName: "Binance Smart Chain Mainnet",
    //chainName: 'Binance Smart Chain Testnet',
    rpcUrls: ["https://bsc-dataseed2.binance.org/"],
    //rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18,
    },
    blockExplorerUrls: ["https://bscscan.com/"],
    //blockExplorerUrls: ['https://testnet.bscscan.com'],
  };

  const EthereumNetworkName = "Ethereum";
  const MaticNetworkName = "Matic";

  function handleChainChanged(chainId: string) {
    if (chainId == "0x1" || chainId == "0x3") {
      setCurrentNetwork(EthereumNetworkName);
    } else if (chainId == "80001") {
      setCurrentNetwork(MaticNetworkName);
    }
    //window.location.reload();
  }

  function handleAccountsChanged(accounts: string | any[]) {
    if (accounts.length === 0) {
      message.info("Please connect to MetaMask.");
      setCurrentAccount("");
    } else if (accounts[0] !== currentAccount) {
      setCurrentAccount(accounts[0]);
    }
  }

  useEffect(() => {
    const ethEnabled = async () => {
      const provider = await detectEthereumProvider();
      console.log("provider:", provider);
      if (provider) {
        setIsInstalledMetamask(true);
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts && accounts.length) {
          setCurrentAccount(accounts[0]);
          setIsConnected(true);
        }
        const chainId = await window.ethereum.request({
          method: "eth_chainId",
        });
        if (chainId == "0x1" || chainId == "0x3") {
          setCurrentNetwork(EthereumNetworkName);
        } else if (chainId == "80001") {
          setCurrentNetwork(MaticNetworkName);
        }
        window.ethereum.on("accountsChanged", handleAccountsChanged);
        window.ethereum.on("chainChanged", handleChainChanged);
      } else {
        setIsInstalledMetamask(false);
        message.info("Please install MetaMask!");
      }
    };
    ethEnabled();
  }, []);

  const connectWallet = async (network: Network) => {
    const { chainId, chainName, rpcUrls, nativeCurrency, blockExplorerUrls } =
      network;
    console.log(chainId);
    console.log(chainName);
    console.log(rpcUrls);
    console.log(nativeCurrency);
    console.log(blockExplorerUrls);
    if (isInstalledMetamask) {
      try {
        let accounts = [];
        if (window.ethereum.chainId !== chainId) {
          accounts = await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId }],
          });
        } else {
          accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
        }
        if (accounts && accounts.length) {
          handleAccountsChanged(accounts);
          setIsConnected(true);
          handleChainChanged(chainId);
        }
      } catch (switchError) {
        if ((switchError as any).code === 4902) {
          try {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId,
                  chainName,
                  rpcUrls,
                  nativeCurrency,
                  blockExplorerUrls,
                },
              ],
            });
          } catch (addError) {}
        }
      }
    } else {
      console.log("not installed metamask");
    }
  };

  const disconnectWallet = async () => {
    handleAccountsChanged([]);
    setIsConnected(false);
    setCurrentNetwork("");
  };

  const markAddress = (address: string) => {
    if (!address) return "-";
    const len = address.length;
    return address.slice(0, 4) + "..." + address.slice(Math.max(4, len - 4));
  };

  return (
    <header
      className={classNames(styles["header-search"], "f-v")}
      style={{ background: props.bgColor }}
    >
      <div className={classNames(styles["header-content"], "f-v")}>
        <img className={styles.logo} src={logoSrc} alt="logo" />
        <Input.Group compact style={{ background: props.inputBgColor }}>
          <Input
            placeholder="Search itemes,collections,and accounts"
            bordered={false}
            onChange={onChange}
            className={styles["header-input"]}
          />
          <img className="header-input-icon" src={searchSrc} alt="icon" />
        </Input.Group>
      </div>
      <div className={classNames(styles["icon-box"], "f-c")}>
        {isConnected ? (
          <Link to="/MyNftAssets">
            <a>
              <img src={accountSrc} alt="icon" />
              {markAddress(currentAccount)}
            </a>
          </Link>
        ) : (
          <Link to="/MyNftAssets">
            <a>
              <img src={accountSrc} alt="icon" />
            </a>
          </Link>
        )}
        <a>
          <img
            src={walletSrc}
            alt="icon"
            onClick={async () => await connectWallet(mumbaiNetwork)}
          />
        </a>
      </div>
    </header>
  );
}
