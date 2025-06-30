# Crowdfunding dApp

A fullstack decentralized crowdfunding platform built with Solidity (Hardhat), React, and Material-UI. Users can create and donate to immutable campaigns on the blockchain. Campaigns cannot be edited or deleted after creation, but owners can mark them as closed.

## Features
- Create and close crowdfunding campaigns (no edit/delete after creation)
- Upload campaign images and add a detailed story
- Donate to campaigns with ETH
- View donation history and campaign details
- Campaign owner can close their campaign (mark as closed)
- Responsive, modern UI with Material-UI
- Social sharing and comments section

## Smart Contract
- Solidity contract in `thirdweb-contracts/contracts/CrowdFunding.sol`
- Stores campaign data (title, description, story, image, target, deadline, etc.)
- Only campaign owner can close their campaign
- Donations are tracked and visible
- Campaigns are immutable after creation (except for closing)

## Frontend
- React + Vite + Material-UI
- Connect with MetaMask
- Create, view, and manage campaigns
- Responsive grid layout for campaign cards

## Getting Started

### Prerequisites
- Node.js & npm
- MetaMask wallet

### Install dependencies
```
cd thirdweb-contracts
npm install
cd ../client
npm install
```

### Compile and Deploy Contract
```
cd ../thirdweb-contracts
npx hardhat compile
npx hardhat run scripts/deploy.js --network <your_network>
```
- Copy the deployed contract address and update it in `client/src/contract.js`
- Copy the ABI from `artifacts/contracts/CrowdFunding.sol/CrowdFunding.json` to `client/src/contract.js`

### Run the Frontend
```
cd ../client
npm run dev
```

## Customization
- Update theme and branding in `client/src/theme.css`
- Add more features or UI polish as needed

## License
MIT

---
Built with ❤️ using Solidity, Hardhat, React, and Material-UI.
