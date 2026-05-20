import { defineConfig } from "hardhat/config";
import dotenv from "dotenv";
dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY || "";

export default defineConfig({
  solidity: {
    version: "0.8.28",
  },
  networks: {
    hardhat: {
      type: "edr-simulated",
    }, // local network
    amoy: {
      type: "http",
      url: `https://rpc-amoy.polygon.technology`,
      accounts: [PRIVATE_KEY],
      chainId: 80002,
    },
  },
});