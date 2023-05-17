const { ethers, network } = require("hardhat");
const usdcAddress = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
const compoundUsdcAddress = "0xc3d688b66703497daa19211eedff47f25384cdc3";
const provider = new ethers.providers.getDefaultProvider('http://127.0.0.1:8545/')
const aliceAddress = "0x203520F4ec42Ea39b03F62B20e20Cf17DB5fdfA7"// 9449.67 usdc
const bobAddress = "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B"; // Bob的地址
async function main() {

  //  impersonating Alice's account
  await network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [aliceAddress],
  });

  //   make Aliec the signer
  const signerAlice = await ethers.getSigner(aliceAddress);

  console.log(
    "Alice account :",
    ethers.utils.formatEther(await signerAlice.getBalance())
  );

  //  impersonating Bob's account
  await network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [bobAddress],
  });

  //   make Bob the signer
  const signerBob = await ethers.getSigner(bobAddress);

  console.log(
    "Bob account :",
    ethers.utils.formatEther(await signerBob.getBalance())
  );
 
  const wallet = new ethers.Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80")
  const connectWallet = wallet.connect(provider)
  // Get USDC and Compound USDC contracts
  const usdc = await ethers.getContractAt("IERC20", usdcAddress);
  const compoundUsdc = await ethers.getContractAt("CErc20Interface", compoundUsdcAddress);
  const abi = require('./abi.json')
  // Print the USDC balance in the Compound USDC contract
  const balanceBefore = await usdc.balanceOf(compoundUsdcAddress);
  console.log(`USDC balance before: ${ethers.utils.formatUnits(balanceBefore, 6)}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });