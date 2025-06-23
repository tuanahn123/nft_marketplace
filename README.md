# NFT Marketplace

## Technology Stack & Tools

- Solidity (Writing Smart Contract)
- Javascript (React & Testing)
- [Ethers](https://docs.ethers.io/v5/) (Blockchain Interaction)
- [Hardhat](https://hardhat.org/) (Development Framework)
- [Ipfs](https://ipfs.io/) (Metadata storage)
- [React routers](https://v5.reactrouter.com/) (Navigational components)

## Requirements For Initial Setup
- Install [NodeJS](https://nodejs.org/en/), should work with any node version below 16.5.0
- Install [Hardhat](https://hardhat.org/)

## Setting Up
### 1. Clone/Download the Repository

### 2. Install Dependencies:
```
$ cd nft_marketplace
$ npm install
$ npx hardhat node
```
### 3. Redirect to src/backend
```
$ npx hardhat run scripts/deploy.js --network localhost
```
### 3. Redirect to src/frontend
```
$ npm run start
```
### 4. Connect development blockchain accounts to Metamask (extension metamask)
- Đăng kí, đặng nhập
- Add a custom network
- network name: Hardhat local, RPC url: http://127.0.0.1:8545, chain ID: 31337, ETH
- Copy private key ở chỗ chạy npx hardhat node và import vào Add account or hardware wallet
### 7. Launch Frontend
`$ npm run start`

License
----
MIT

