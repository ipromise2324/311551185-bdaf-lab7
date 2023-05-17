require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    hardhat: {
      forking: {
        url: "https://eth-mainnet.g.alchemy.com/v2/sTzqqHK_uthLYdsaOVhTKWmycRThO3P2",
        blockNumber: 17228670
      }
    }
  }
};
