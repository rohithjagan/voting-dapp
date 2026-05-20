import { ethers } from "ethers";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Read the compiled contract artifact
const artifactPath = join(__dirname, "../artifacts/contracts/Voting.sol/Voting.json");
const artifact = JSON.parse(readFileSync(artifactPath, "utf-8"));

const { abi, bytecode } = artifact;

// Connect to the local Hardhat node
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

// We'll use the first three accounts provided by the node
const admin = await provider.getSigner(0);
const voter1 = await provider.getSigner(1);
const voter2 = await provider.getSigner(2);

// Deploy the contract
const VotingFactory = new ethers.ContractFactory(abi, bytecode, admin);
const voting = await VotingFactory.deploy();
console.log("Contract deployed at:", await voting.getAddress());

// Checks
console.assert(
  (await voting.admin()) === (await admin.getAddress()),
  "Admin mismatch"
);
console.log("✓ Admin is deployer");

await voting.connect(admin).addCandidate("Alice");
await voting.connect(admin).addCandidate("Bob");
let candidates = await voting.getCandidates();
console.assert(candidates.length === 2, "Should have 2 candidates");
console.log("✓ Candidates added:", candidates.map(c => c.name).join(", "));

// Non-admin fails
try {
  await voting.connect(voter1).addCandidate("Eve");
  console.error("✗ Non-admin should have been rejected");
} catch (e) {
  console.log("✓ Non-admin rejected");
}

// Vote once
await voting.connect(voter1).vote(1);
console.assert(
  (await voting.hasVoted(await voter1.getAddress())) === true,
  "Voter1 hasn't voted?"
);
console.log("✓ Voter1 voted for Alice");

// Double vote fails
try {
  await voting.connect(voter1).vote(2);
  console.error("✗ Double vote should have been rejected");
} catch (e) {
  console.log("✓ Double vote rejected");
}

// Second voter
await voting.connect(voter2).vote(2);
candidates = await voting.getCandidates();
console.assert(candidates[0].voteCount === 1n, "Alice vote count wrong");
console.assert(candidates[1].voteCount === 1n, "Bob vote count wrong");
console.assert((await voting.totalVotes()) === 2n, "Total votes wrong");
console.log("✓ Vote counts correct");

// Invalid candidate
try {
  await voting.connect(voter2).vote(99);
  console.error("✗ Invalid candidate should have been rejected");
} catch (e) {
  console.log("✓ Invalid candidate rejected");
}

console.log("\n✅ All tests passed!");

process.exit(0);