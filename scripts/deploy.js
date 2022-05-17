// Function to deploy the smart contract onto the blockchain
async function main() {

  // Create instance of NFT contract
  const CPPNFT = await ethers.getContractFactory("CPPNFT")

  // Deploy and log the address of the contract
  const contract = await CPPNFT.deploy()
  await contract.deployed()
  console.log("Contract address:", contract.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

