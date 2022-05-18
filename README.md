# CPPNFT
CS 4800 Class Project, Ethereum Blockchain (Group 5)

BUILD & DEPLOYMENT INSTRUCTIONS:

Ensure that you have nodeJS installed on your device (https://nodejs.org/en/download/) and clone the project. Then from the project root rum "npm install" to install all necessary dependencies. There are two main scripts, deploy.js creates a new instance of the smart contract (no need to run this again); while nft_operations.js includes the three functions createNftListing(), transactFunds(), and transactNFT(). I've included an uncommented test case so navigate the scripts folder and run "node nft_operations.js" which will return transaction hashes for createNftListing() and transactFunds(). You can also uncomment line 340 to transfer the NFT between wallets once it has been created. Paste the transaction hashes in the search bar of etherscan "https://ropsten.etherscan.io/" to observe the transactions, and you can also click on the contract and token ID to observe details of their transactions.

RELEASE NOTES:

Project Name - CPPNFT
Release Number - 1
Date of Release - 5/17/2022

This project includes all necessary scripts and configurations to create a smart contract based on the Ethereum ERC-721 standard (NFT token), create new NFT tokens using this (or other) contracts on the Ethereum blockchain given its picture and metadata, transact ETH between a buyer and seller of the NFT (as payment), and transact the NFT token itself between the buyer and the seller. The files CPPNFT.sol, deploy.js, and nft_operations.js are well commented if you're curious about the implementation. Also refer to our presentation slides for more details: https://docs.google.com/presentation/d/1pP4ynRh3clVOfZ4cIvDIluHHaNC28G0YYyny8qeFAXo/edit?usp=sharing
