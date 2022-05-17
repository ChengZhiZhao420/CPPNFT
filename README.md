# CPPNFT
CS 4800 Class Project, Ethereum Blockchain (Group 5)

BUILD & DEPLOYMENT INSTRUCTIONS:

Ensure that you have nodeJS installed on your device (https://nodejs.org/en/download/) and clone the project. Then from the project root rum "npm install" to install all necessary dependencies. There are two main scripts, deploy.js creates a new instance of the smart contract (no need to run this again); while nft_operations.js includes the three functions createNftListing(), transactFunds(), and transactNFT(). I've included an uncommented test case so navigate the scripts folder and run "node nft_operations.js" which will return transaction hashes for createNftListing() and transactFunds(). You can also uncomment line 340 to transfer the NFT between wallets once it has been created. Paste the transaction hashes in the search bar of etherscan "https://ropsten.etherscan.io/" to observe the transactions, and you can also click on the contract and token ID to observe details of their transactions.

RELEASE NOTES:
