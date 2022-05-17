/**
* @type import('hardhat/config').HardhatUserConfig
*/
require("@nomiclabs/hardhat-ethers");
module.exports = {
   solidity: "0.8.1",
   defaultNetwork: "ropsten",
   networks: {
      hardhat: {},
      ropsten: {
         url: "https://eth-ropsten.alchemyapi.io/v2/1iLmqnfiSYk0djEUkubWOMthkpIIcl1o",
         accounts: ['0x9fa994cb121cdc1401478ed553b5410cdeea8c75117a8c011299a003ce6a8e08']
      }
   },
}
