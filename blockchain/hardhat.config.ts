import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

import dotenv from "dotenv";
dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY!;
const CYPRESS_URL = process.env.CYPRESS_URL!;
const BAOBAB_URL = process.env.BAOBAB_URL!;

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.12",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    testnet: {
      url: BAOBAB_URL,
      gasPrice: 25000000000,
      accounts: [PRIVATE_KEY],
    },
    mainnet: {
      url: CYPRESS_URL,
      gasPrice: 25000000000,
      accounts: [PRIVATE_KEY],
    }
  },
};

export default config;
