# CPPNFT
CS 4800 Class Project, Ethereum Blockchain (Group 5)

BUILD & DEPLOYMENT INSTRUCTIONS:

Ensure that you have nodeJS installed on your device (https://nodejs.org/en/download/) and clone the project. Then from the project root rum "npm install" to install all necessary dependencies. There are two main scripts, deploy.js creates a new instance of the smart contract (no need to run this again); while nft_operations.js includes the three functions createNftListing(), transactFunds(), and transactNFT(). I've included an uncommented test case so navigate to the scripts folder and run "node nft_operations.js" which will return transaction hashes for createNftListing() and transactFunds(). You can also uncomment line 340 (and rerun the previous command) to transfer the NFT between wallets once it has been created. Paste the transaction hashes in the search bar of etherscan "https://ropsten.etherscan.io/" to observe the transactions, and you can also click on the contract and token ID to observe details of their transactions.

RELEASE NOTES:

Latest and final release.

Project Name - CPPNFT;
Release Number - 0.2.0;
Date of Release - 5/17/2022

This project includes all necessary scripts and configurations to:

- Create a smart contract based on the Ethereum ERC-721 standard (NFT token)
- Create new NFT tokens using this (or other) contracts on the Ethereum blockchain given its picture and metadata
- Transact ETH between a buyer and seller of the NFT (as payment)
- Transact the NFT token itself between the buyer and the seller 
 
The files CPPNFT.sol, deploy.js, and nft_operations.js are well commented if you're curious about the implementation. Also refer to our presentation slides for more details: https://docs.google.com/presentation/d/1pP4ynRh3clVOfZ4cIvDIluHHaNC28G0YYyny8qeFAXo/edit?usp=sharing

There are no fatal bugs provided valid testing data and sufficient funds/tokens in wallet (you must own the NFT to be able to send it). Please see the test cases at the bottom of "node_operations.js" for valid test data (valid public/private keys are provided for 2 wallets).

Bugs:

Possible race condition when testing the functions createNftListing() and transactNFT() simultaneously using the same token ID, where the calls are asynchronous and may try to send the NFT token before it has been created (this is dealt with in the given test case). This would also be handled using promises when being called from the web service and is not a bug in the functions themselves but rather their possbily unhandled usage in a test case. Network connectivity is required for API calls.

Security Vulmnerability:

Public and private keys are exposed (hard coded for testing), although this doesn't matter because the wallets only have the test NFTs and Ropsten test ETH which you can get from a faucet for free anyways.
