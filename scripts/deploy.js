import { ethers } from "ethers";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

// Read artifact
const artifactPath = join(__dirname, "../artifacts/contracts/Voting.sol/Voting.json");
const artifact = JSON.parse(readFileSync(artifactPath, "utf-8"));
const { abi, bytecode } = artifact;

// Connect to Amoy
const provider = new ethers.JsonRpcProvider("https://rpc-amoy.polygon.technology");

const privateKey = process.env.PRIVATE_KEY;
if (!privateKey) {
  console.error("❌ PRIVATE_KEY not found in .env");
  process.exit(1);
}
const wallet = new ethers.Wallet(privateKey, provider);

console.log("Deploying from address:", wallet.address);

// Deploy with fixed gas price (50 gwei)
const factory = new ethers.ContractFactory(abi, bytecode, wallet);
const voting = await factory.deploy({
  gasPrice: ethers.parseUnits("50", "gwei"),
});
console.log("⏳ Waiting for deployment...");
await voting.waitForDeployment();

const address = await voting.getAddress();
console.log(`✅ Voting deployed at: ${address}`);
console.log(`🔎 View on https://amoy.polygonscan.com/address/${address}`);