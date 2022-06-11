require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require("@nomiclabs/hardhat-etherscan");
const fs = require("fs");

function get_key(f) {
  const key = fs.readFileSync(f, "utf8").trim();
  return key;
}

const ALCHEMY_ROPSTEN_API_KEY = get_key("./keys/alchemy_ropsten");
const ALCHEMY_GOERLI_API_KEY = get_key("./keys/alchemy_goerli");
const LOCAL_PRIVATE_KEY = get_key("./keys/local");
const FORK_PRIVATE_KEY = get_key("./keys/fork");
const ROPSTEN_PRIVATE_KEY = get_key("./keys/ropsten");
const GOERLI_PRIVATE_KEY = get_key("./keys/goerli");
const ALCHEMY_MUMBAI_API_KEY = get_key("./keys/mumbai");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: "0.8.7",
    settings: {
      optimizer: {
        enabled: process.env.DEBUG ? false : true,
        runs: 1000,
      },
    },
  },
  networks: {
    localhost: {
      url: "http://localhost:7545",
      accounts: [`0x${LOCAL_PRIVATE_KEY}`],
      chainId: 1337,
    },
    fork: {
      url: "http://127.0.0.1:9876",
      accounts: [`0x${FORK_PRIVATE_KEY}`],
    },
    hardhat: {
      chainId: 1337,
    },

    ropsten: {
      url: `https://eth-ropsten.alchemyapi.io/v2/${ALCHEMY_ROPSTEN_API_KEY}`,
      accounts: [`0x${ROPSTEN_PRIVATE_KEY}`],
    },

    goerli: {
      url: `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_GOERLI_API_KEY}`,
      accounts: [`0x${GOERLI_PRIVATE_KEY}`],
    },

    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_MUMBAI_API_KEY}`,
      accounts: [`0x${GOERLI_PRIVATE_KEY}`]
    }
  },
};
