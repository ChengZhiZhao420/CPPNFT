// Jack Peabody, Group 5, Ethereum Blockchain
// This file contains the functions createNftListing(), transactFunds(), transactNFT(), and helpers

// Required to communicate with Ethereum blockchain
const { createAlchemyWeb3 } = require("@alch/alchemy-web3")

// Required for NFT Transfer
const { ethers } = require("ethers");

// URL of the Alchemy API for the NFT project
const API_URL = "https://eth-ropsten.alchemyapi.io/v2/1iLmqnfiSYk0djEUkubWOMthkpIIcl1o"
const web3 = createAlchemyWeb3(API_URL)

// Access smart contract instance
const contract = require("../artifacts/contracts/CPPNFT.sol/CPPNFT.json")
const contractAddress = "0x94615db13f4586e2b67919e0fb47194258a4839e"
const nftContract = new web3.eth.Contract(contract.abi, contractAddress)

// Used to retrieve NFT picture from file stream
const fs = require('fs');

// Connect to Pinata IPFS
const pinataSDK = require('@pinata/sdk');
const pinata = pinataSDK('609f5c3b4c163b3c4de6', '2c4efeb24680e490f1734656ff3f66af1cedd65daa32986583c11687ebc7fc7b');

// Function to return promise from NFT picture pin
function getPictureHash(picture_name){

    // Access NFT picture from file stream (stored in NFT_Photos folder)
    picture_fp = '../NFT_Photos/' + picture_name;
    picture_fs = fs.createReadStream(picture_fp);

    // Pin NFT picture to Pinata and get the IPFS Hash
    return new Promise(function(resolve, reject) { 
        pinata.pinFileToIPFS(picture_fs).then(
            (response) => {
                var result = 'ipfs://' + response.IpfsHash;
                // console.log(result);
                resolve(result);
        },
            (error) => {
                console.log("Error pinning NFT picture to Pinata");
                console.log(error);
                reject(error);
            }
        );
    });
}

// Function to return promise from JSON metadata pin
function getJsonHash(price, description, picture_hash, title){

    // Format parameter data into JSON
    body = {
        "attributes": [
          {
            "trait_type": "Price",
            "value": price
          },
        ],
        "description": description,
        "image": picture_hash,
        "name": title
    };

    return new Promise(function(resolve, reject) { 
        pinata.pinJSONToIPFS(body).then(
            (response) => {
                var result = 'ipfs://' + response.IpfsHash;
                // console.log(result);
                resolve(result);
        },
            (error) => {
                console.log("Error pinning NFT JSON metadata to Pinata");
                console.log(error);
                reject(error);
            }
        );
    });
}

// This function takes in the following parameters to mint an NFT onto the blockchain:
//      public_key - string, the public key of the NFT owner (the person who is listing it)
//      private_key - string, the private key of the NFT owner (the person who is listing it)
//      title - string, the name or title of the NFT listing
//      picture_name - string, the name of the jpg or png picture stored in the NFT_Photos folder
//      price - number, the floating point price of the NFT (in ETH)
//      description - string, relevant details to include with the NFT
async function createNftListing(public_key, private_key, title, picture_name, price, description) {

    // Check if successfully connecting to Pinata API
    pinata.testAuthentication().then((result) => {
        // console.log(result);
    }).catch((err) => {
        console.log("Error connecting to the Pinata API");
        console.log(err);
    });

    // Await the picture hash from asynchronous call to pin picture to Pinata
    var picture_hash = await getPictureHash(picture_name);
    // console.log(picture_hash);

    // Await the JSON metadata hash from asynchronous call to pin data to Pinata
    var json_hash = await getJsonHash(price, description, picture_hash, title);

    // Get the nonce for the account, which is the number of transactions sent from address (security purposes)
    const nonce = await web3.eth.getTransactionCount(public_key, "latest");

    // Format the transaction to mint the NFT to the address public_key
    // The field "to" takes the address of the contract
    // The field "nonce" increments the number of transactions from the wallet address
    // The field "gas" contains an upper limit for the gas fee
    // The field "data" mints the NFT given the public key of the creator and the hash of the JSON uploaded to Pinata above
    const tx = {
        from: public_key,
        to: contractAddress,
        nonce: nonce,
        gas: 500000,
        data: nftContract.methods.mintNFT(public_key, json_hash).encodeABI(),
    }

    // Sign the transaction using private key to complete it
    var transaction_hash = '';
    const signPromise = web3.eth.accounts.signTransaction(tx, private_key)
  signPromise
    .then((signedTx) => {
      web3.eth.sendSignedTransaction(
        signedTx.rawTransaction,
        function (err, hash) {
          if (!err) {
            console.log("Transaction Hash: ", hash)
            transaction_hash = hash;
          } else {
            console.log("Error signing transaction")
            console.log(err)
          }
        }
      )
    })
    .catch((err) => {
      console.log("Failed promise: ", err)
    })

    return transaction_hash;    
}

// This function takes in the following parameters to transfer funds between wallets:
//      seller_public_key - string, the public key of the NFT owner (the person who is selling it)
//      seller_private_key - string, the private key of the NFT owner (the person who is selling it)
//      buyer_public_key - string, the public key of the receiving wallet (the person buying the NFT)
//      buyer_private_key - string, the private key of the receiving wallet (the person buying the NFT)
//      price - number, the integer price of the NFT (in Wei, where 10^18 Wei = 1 ETH)
async function transactFunds(seller_public_key, buyer_public_key, buyer_private_key, price){

  // Get the nonce for the buyer account, which is the number of transactions sent from address (security purposes)
  const nonce = await web3.eth.getTransactionCount(buyer_public_key, "latest");

  // Format the transaction to send funds from the buyer to the seller
  // The field "to" takes the address of the seller
  // The field "value" is the price of the NFT
  // The field "gas" contains an upper limit for the gas fee
  // The field "nonce" increments the number of transactions from the wallet address
  const tx = {
    'to': seller_public_key,
    'value': price,
    'gas': 50000,
    'nonce': nonce,
   };

   // Sign the transaction object with buyer's private key
   const signedTx = await web3.eth.accounts.signTransaction(tx, buyer_private_key);
   
   // Send the signed transaction to the blockchain
   var funds_transaction_hash = '';
   web3.eth.sendSignedTransaction(signedTx.rawTransaction, function(error, hash) {
    if (!error) {
      console.log("Funds Transaction Hash: ", hash)
      funds_transaction_hash = hash;
    } else {
      console.log("Error sending signed transaction")
      console.log(error)
    }
   });

   // Return the transaction hash
   return funds_transaction_hash;
}

// This function takes in the following parameters to transfer NFT between wallets:
//      seller_public_key - string, the public key of the NFT owner (the person who is selling it)
//      seller_private_key - string, the private key of the NFT owner (the person who is selling it)
//      buyer_public_key - string, the public key of the receiving wallet (the person buying the NFT)
//      token_id - number, the integer token ID of the NFT being transferred
async function transactNFT(seller_public_key, seller_private_key, buyer_public_key, token_id){

  // Access JSON data from API
  const json_provider = new ethers.providers.JsonRpcProvider(API_URL);

  // Access the seller's wallet (the current owner of the NFT)
  const seller_wallet = new ethers.Wallet(seller_private_key, json_provider);

  //Store the current gas price
  const gasPrice = await json_provider.getGasPrice();

  // Create an instance of the NFT contract
  const nft_contract = new ethers.Contract(
    contractAddress,
    contract.abi,
    seller_wallet
  );

  // Get an estimation for the gas price of this transaction
  const gasLimit = await nft_contract.estimateGas["safeTransferFrom(address,address,uint256)"](seller_public_key, buyer_public_key, token_id, { gasPrice });

  // Initiate the safe transfer of the NFT from the buyer to the seller
  const transaction = await nft_contract["safeTransferFrom(address,address,uint256)"](seller_public_key, buyer_public_key, token_id, { gasLimit });

  // Log the transaction hash once the transaction finishes
  await transaction.wait();
  console.log("NFT Transaction Hash: ", transaction.hash);

  return transaction.hash;
}

// Test createListing() 1
/*
t1_public_key = "0x905e5f64F25ab06276411a18412c081b72d479E4"
t1_private_key = "9fa994cb121cdc1401478ed553b5410cdeea8c75117a8c011299a003ce6a8e08"
t1_title = 'Green Shirt'
t1_picture_name = 'green_shirt.jpg'
t1_price = 0.001;
t1_description = 'This green shirt is a men\'s size medium and is made out of 100% cotton.'
var transaction1 = createNftListing(t1_public_key, t1_private_key, t1_title, t1_picture_name, t1_price, t1_description);
console.log(transaction1);
*/

// Test createListing() 2 - different wallet
/*
t2_public_key = "0xC96Fa927e2ABF46ECD46c4174Be59Cc0d56aa4B4"
t2_private_key = "e2aba35926dcf7b761f4808160e65017205116caa452c7547e5f27f7fcc81e19"
t2_title = 'Red Shirt'
t2_picture_name = 'red_shirt.jpg'
t2_price = 0.002;
t2_description = 'This red shirt is a men\'s size large and is made out of 100% polyester.'
var transaction2 = createNftListing(t2_public_key, t2_private_key, t2_title, t2_picture_name, t2_price, t2_description);
console.log(transaction2);
*/

// Test transactFunds()
/*
t3_seller_public_key = "0x905e5f64F25ab06276411a18412c081b72d479E4"
t3_buyer_public_key = "0xC96Fa927e2ABF46ECD46c4174Be59Cc0d56aa4B4"
t3_buyer_private_key = "e2aba35926dcf7b761f4808160e65017205116caa452c7547e5f27f7fcc81e19"
t3_price = 1000000000000000
var transaction3 = transactFunds(t3_seller_public_key, t3_buyer_public_key, t3_buyer_private_key, t3_price)
console.log(transaction3); 
*/

// Test transactNFT()
/*
t4_seller_public_key = "0xC96Fa927e2ABF46ECD46c4174Be59Cc0d56aa4B4"
t4_seller_private_key = "e2aba35926dcf7b761f4808160e65017205116caa452c7547e5f27f7fcc81e19"
t4_buyer_public_key = "0x905e5f64F25ab06276411a18412c081b72d479E4"
t4_token_id = 2
var transaction4 = transactNFT(t4_seller_public_key, t4_seller_private_key, t4_buyer_public_key, t4_token_id)
// console.log(transaction4);
*/

// Test createListing(), transactFunds(), and transactNFT()
// The seller creates an NFT and transfers it to the buyer after receiving funds
/*
// First create the listing for the seller, this creates a ERC-721 token with ID 3
t5_seller_public_key = "0xC96Fa927e2ABF46ECD46c4174Be59Cc0d56aa4B4"
t5_seller_private_key = "e2aba35926dcf7b761f4808160e65017205116caa452c7547e5f27f7fcc81e19"
t5_title = 'Blue Shirt'
t5_picture_name = 'blue_shirt.jpg'
t5_price = 0.003;
t5_description = 'This blue shirt is a men\'s size size and is made out of 100% wool.'
var create_transaction5 = createNftListing(t5_seller_public_key, t5_seller_private_key, t5_title, t5_picture_name, t5_price, t5_description);
// console.log(create_transaction5);

// Next sends funds from the buyer to the seller
t5_buyer_public_key = "0x905e5f64F25ab06276411a18412c081b72d479E4"
t5_buyer_private_key = "9fa994cb121cdc1401478ed553b5410cdeea8c75117a8c011299a003ce6a8e08"
t5_price = 1000000000000000
var funds_transaction5 = transactFunds(t5_seller_public_key, t5_buyer_public_key, t5_buyer_private_key, t5_price)
// console.log(funds_transaction5); 

// Finally send the NFT from the seller to the buyer
t5_token_id = 3
var nft_transaction5 = transactNFT(t5_seller_public_key, t5_seller_private_key, t5_buyer_public_key, t5_token_id)
// console.log(nft_transaction5);
*/

// Class Demo
/*
// First create the listing for the seller, this creates a ERC-721 token with ID 4
t6_seller_public_key = "0x905e5f64F25ab06276411a18412c081b72d479E4"
t6_seller_private_key = "9fa994cb121cdc1401478ed553b5410cdeea8c75117a8c011299a003ce6a8e08"
t6_title = 'Grey Shirt'
t6_picture_name = 'grey_shirt.jpg'
t6_price = 0.004;
t6_description = 'This grey shirt is a men\'s size small and is made out of 100% cotton.'
var create_transaction6 = createNftListing(t6_seller_public_key, t6_seller_private_key, t6_title, t6_picture_name, t6_price, t6_description);
// console.log(create_transaction6);

// Next sends funds from the buyer to the seller
t6_buyer_public_key = "0xC96Fa927e2ABF46ECD46c4174Be59Cc0d56aa4B4"
t6_buyer_private_key = "e2aba35926dcf7b761f4808160e65017205116caa452c7547e5f27f7fcc81e19"
t6_price = 1000000000000000
// var funds_transaction6 = transactFunds(t6_seller_public_key, t6_buyer_public_key, t6_buyer_private_key, t6_price)
// console.log(funds_transaction6); 

// Finally send the NFT from the seller to the buyer
t6_token_id = 6
// var nft_transaction6 = transactNFT(t6_seller_public_key, t6_seller_private_key, t6_buyer_public_key, t6_token_id)
// console.log(nft_transaction6);
*/

// How to Run Test Case
// First create the listing for the seller, this creates an ERC-721 token with ID 7
t7_seller_public_key = "0x905e5f64F25ab06276411a18412c081b72d479E4"
t7_seller_private_key = "9fa994cb121cdc1401478ed553b5410cdeea8c75117a8c011299a003ce6a8e08"
t7_title = 'Black Shirt'
t7_picture_name = 'black_shirt.jpg'
t7_price = 0.007;
t7_description = 'This black shirt is a men\'s size XL and is made out of 100% polyester.'
var create_transaction7 = createNftListing(t7_seller_public_key, t7_seller_private_key, t7_title, t7_picture_name, t7_price, t7_description);
// console.log(create_transaction7);

// Next sends funds from the buyer to the seller
t7_buyer_public_key = "0xC96Fa927e2ABF46ECD46c4174Be59Cc0d56aa4B4"
t7_buyer_private_key = "e2aba35926dcf7b761f4808160e65017205116caa452c7547e5f27f7fcc81e19"
t7_price = 1000000000000000
var funds_transaction7 = transactFunds(t7_seller_public_key, t7_buyer_public_key, t7_buyer_private_key, t7_price)
// console.log(funds_transaction7); 

// Finally send the NFT from the seller to the buyer
t7_token_id = 7
// var nft_transaction7 = transactNFT(t7_seller_public_key, t7_seller_private_key, t7_buyer_public_key, t7_token_id)
// console.log(nft_transaction7);
