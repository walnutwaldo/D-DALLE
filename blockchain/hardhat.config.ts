import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

import dotenv from "dotenv";
dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY!;
const CYPRESS_URL = process.env.CYPRESS_URL!;
const BAOBAB_URL = process.env.BAOBAB_URL!;

const config: HardhatUserConfig = {
  solidity: "0.8.12",
  networks: {
    testnet: {
      url: `${BAOBAB_URL}:8651`,
      gasPrice: 25000000000,
      accounts: [PRIVATE_KEY],
    },
    mainnet: {
      url: `${CYPRESS_URL}:8651`,
      gasPrice: 25000000000,
      accounts: [PRIVATE_KEY],
    }
  },
};

export default config;
