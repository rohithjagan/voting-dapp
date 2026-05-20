# 🗳️ Blockchain-Based Voting System

A tamper-proof, transparent, and secure voting dApp built on Polygon Amoy testnet. One person, one vote — enforced by an immutable smart contract. Real-time results, admin dashboard, and MetaMask integration.

![License](https://img.shields.io/badge/license-MIT-blue)
![Solidity](https://img.shields.io/badge/solidity-%5E0.8.28-lightgrey)
![React](https://img.shields.io/badge/react-19.2.6-61DAFB)

## ✨ Features

- **Secure vote casting** – each address can vote only once
- **Tamper-proof records** – votes are stored on-chain, immutable
- **Admin dashboard** – add candidates directly from the UI
- **Real-time results** – auto-updates via blockchain events
- **MetaMask wallet** – one-click login and transaction signing
- **Modern dark UI** – premium, production-grade interface

## 🛠 Tech Stack

| Layer        | Technology                      |
| ------------ | ------------------------------- |
| Smart Contract | Solidity (^0.8.28)              |
| Blockchain   | Polygon Amoy Testnet           |
| Development  | Hardhat 3, ethers.js v6        |
| Frontend     | React 19, Create React App     |
| Wallet       | MetaMask                       |

## 📦 Project Structure

# voting-dapp

```text
voting-dapp/
├── contracts/                 # Solidity contracts
│   └── Voting.sol
├── scripts/                   # Deployment & utility scripts
│   ├── deploy.js
│   ├── addCandidates.js
│   └── testVoting.js
├── src/                       # React frontend
│   ├── App.js
│   ├── contract.js            # Contract address
│   └── VotingABI.js           # Contract ABI
├── test/                      # (optional) JS tests
├── artifacts/                 # Hardhat compilation output
├── hardhat.config.ts          # Hardhat configuration
├── .env.example               # Environment variables template
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js ≥ 22.13.0
- MetaMask browser extension
- Git

---

## 📦 Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/voting-dapp.git
cd voting-dapp
```

### 2. Install dependencies

```bash
npm install --legacy-peer-deps
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env` and add your MetaMask wallet private key.

---

## ⚙️ Running the Project

### Start the Hardhat local node (optional)

```bash
npx hardhat node
```

### Compile smart contracts

```bash
npx hardhat build
```

### Deploy to Polygon Amoy Testnet

```bash
node scripts/deploy.js
```

Ensure your wallet has test POL from the Polygon faucet.

### Add candidates (admin only)

```bash
node scripts/addCandidates.js
```

### Start the React frontend

```bash
npm start
```

Open:

```text
http://localhost:3000
```

Then connect MetaMask.

---

## 🧪 Testing

### Local testing with Hardhat node

Terminal 1:

```bash
npx hardhat node
```

Terminal 2:

```bash
node scripts/testVoting.js
```

---

## 📄 Smart Contract

`Voting.sol` implements:

- `addCandidate(string name)` → Admin only
- `vote(uint candidateId)` → One vote per address
- `getCandidates()` → Returns all candidate data

### Events

- `Voted`
- `CandidateAdded`

### Deployed Contract Address (Amoy Testnet)

```text
0x56675FB45d67F818f36B42f74dDaA3B969D04726
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

See `CONTRIBUTING.md`.

---

## 📜 License

This project is licensed under the MIT License.

See `LICENSE`.

---

## 🔒 Security

Please review `SECURITY.md` for responsible disclosure guidelines.

---

## 📬 Contact

- Maintainer: Your Name
- Twitter: @your_handle