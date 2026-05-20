import { ethers } from "ethers";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

const artifactPath = join(__dirname, "../artifacts/contracts/Voting.sol/Voting.json");
const artifact = JSON.parse(readFileSync(artifactPath, "utf-8"));
const { abi } = artifact;

const provider = new ethers.JsonRpcProvider("https://rpc-amoy.polygon.technology");
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const CONTRACT_ADDRESS = "0x56675FB45d67F818f36B42f74dDaA3B969D04726";
const voting = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);

async function add() {
  console.log("Adding candidates...");
  const tx1 = await voting.addCandidate("Alice");
  await tx1.wait();
  console.log("Added Alice");

  const tx2 = await voting.addCandidate("Bob");
  await tx2.wait();
  console.log("Added Bob");

  console.log("Done!");
}
add().catch(console.error);