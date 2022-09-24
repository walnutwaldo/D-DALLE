import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

import dotenv from "dotenv";
dotenv.config();

const HDWalletProvider = require("truffle-hdwallet-provider-klaytn");

const PRIVATE_KEY = process.env.PRIVATE_KEY;

const testnetHDWallet = new HDWalletProvider(PRIVATE_KEY, "https://your.baobab.en.url:8651");
console.log(testnetHDWallet);

const mainnetHDWallet = new HDWalletProvider(PRIVATE_KEY, "https://your.cypress.en.url:8651");
console.log(mainnetHDWallet);

const config: HardhatUserConfig = {
  solidity: "0.5.6",
  networks: {
    testnet: {
      accounts: testnetHDWallet,
      chainId: 1001, //Klaytn baobab testnet's network id
      gas: 8500000
    },
    mainnet: {
      accounts: mainnetHDWallet,
      chainId: 8217, //Klaytn mainnet's network id
      gas: 8500000,
    }
  },
};

export default config;
