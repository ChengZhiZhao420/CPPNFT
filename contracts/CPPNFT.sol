// Contract based on [https://docs.openzeppelin.com/contracts/3.x/erc721](https://docs.openzeppelin.com/contracts/3.x/erc721)
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Import smart contract classes
// Inherit functions of ERC-721 standard
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// Keep track of NFT IDs
import "@openzeppelin/contracts/utils/Counters.sol";
// Set access of NFT creation
import "@openzeppelin/contracts/access/Ownable.sol";
// Used for storing metadata
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract CPPNFT is ERC721URIStorage {

    // Increment Token ID for each NFT minted
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Contruct the NFT using the contract "CPPNFT" with symbol "CPP"
    constructor() ERC721("CPPNFT", "CPP") {}

    // Implement inherited function to mint an NFT given the address of the recipient and the JSON metadata
    function mintNFT(address recipient, string memory tokenURI)
        public
        returns (uint256)
    {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);

        return newItemId;
    }
}
