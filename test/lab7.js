const {
	time,
	loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const {
	anyValue
} = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const {
	expect
} = require("chai");
const {
	ethers,
	network
} = require("hardhat");
const usdcAddress = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
const compoundUsdcAddress = "0xc3d688b66703497daa19211eedff47f25384cdc3";
const wethAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const aliceAddress = "0x55FE002aefF02F77364de339a1292923A15844B8";// Circle's USDC address
const bobAddress = "0x189B9cBd4AfF470aF2C0102f365FC1823d857965";// ETH Whale address
const aliceUsdcAmount = ethers.utils.parseUnits("1000", 6);// Alice provides liquidity (1000 USDC) into the Compound USDC contract

describe("311551185_Lab7", function() {
    it("What happens when Compound has no liquidity", async function() {
        // Impersonating Alice's account
        await network.provider.request({
          method: "hardhat_impersonateAccount",
          params: [aliceAddress],
        });
        // Make Aliec the signer
        const signerAlice = await ethers.getSigner(aliceAddress);

        // Impersonating Bob's account
        await network.provider.request({
          method: "hardhat_impersonateAccount",
          params: [bobAddress],
        });
        // Make Bob the signer
        const signerBob = await ethers.getSigner(bobAddress);

        // Get USDC contract
        const usdc = await ethers.getContractAt("IERC20", usdcAddress);
        // Get Compound USDC contract
        const compoundUsdc = await ethers.getContractAt("CErc20Interface", compoundUsdcAddress);

        
        // Print the USDC balance in the Compound USDC contract
        const balanceBefore = await usdc.balanceOf(compoundUsdcAddress);
        console.log(`-- USDC balance before Alice supplies: ${ethers.utils.formatUnits(balanceBefore, 6)} (usdc) --`);

        // Alice's USDC balance before supplying
        const aliceUsdcBalanceBefore = await usdc.balanceOf(aliceAddress);
        console.log(`Alice's USDC balance balance before supplying: ${ethers.utils.formatUnits(aliceUsdcBalanceBefore, 6)} (usdc)\n`);

        // Approve the Compound USDC contract to spend USDC from Alice's account
        await usdc.connect(signerAlice).approve(compoundUsdcAddress, aliceUsdcAmount);
        // Alice supplies 1000 USDC to the Compound USDC contract
        await compoundUsdc.connect(signerAlice).supply(usdcAddress, aliceUsdcAmount);

        // Print the USDC balance in the Compound USDC contract after Alice supplies
        const balanceAfterSupply = await usdc.balanceOf(compoundUsdcAddress);
        // BalanceBefore + 1000(Alice provides 1000 USDC into the Compound USDC contract) == balanceAfterSupply
        expect(Number(balanceBefore.add(aliceUsdcAmount))).to.equal(Number(balanceAfterSupply));
        console.log(`-- USDC balance after Alice supplied: ${ethers.utils.formatUnits(balanceAfterSupply, 6)} (usdc) --`);

        // Update Alice's USDC balance after Alice supplies
        const aliceUsdcBalanceAfter = await usdc.balanceOf(aliceAddress);
        console.log(`Alice's USDC balance after supplying: ${ethers.utils.formatUnits(aliceUsdcBalanceAfter, 6)} (usdc)\n`);
        
        // Bob's ETH Balance
        const bobEthBalance = await ethers.provider.getBalance(bobAddress);
        //console.log(`Bob's ETH balance: ${ethers.utils.formatEther(bobEthBalance)}`);
        const bobEthAmount = ethers.utils.parseEther("40000");// 40000 eth can borrow all usdc in the compound contract
        // Check Bob's ETH balance has enough eth to wrap to weth 
        expect(Number(bobEthBalance)).to.be.gte(Number(bobEthAmount));
        
        // Get WETH contract
        const weth = await ethers.getContractAt("IWETH", wethAddress);
        // Bob wraps ETH to WETH
        await weth.connect(signerBob).deposit({ value: bobEthAmount });// ETH -> WETH

        // Bob's WETH balance before supplying WETH
        const bobWethBalanceBeforeSupply = await weth.balanceOf(bobAddress);
        console.log(`Bob's WETH balance before supplying: ${ethers.utils.formatUnits(bobWethBalanceBeforeSupply, 18)} (weth)`);

        // Bob approves the Compound USDC contract to spend his WETH
        await weth.connect(signerBob).approve(compoundUsdcAddress, bobEthAmount);

        // Bob supplies WETH collateral to the Compound WETH contract
        await compoundUsdc.connect(signerBob).supply(weth.address, bobEthAmount);

        // Bob's WETH balance after supplying WETH
        const bobWethBalanceAfterSupply = await weth.balanceOf(bobAddress);
        console.log(`Bob's WETH balance after supplying: ${ethers.utils.formatUnits(bobWethBalanceAfterSupply, 18)} (weth)\n`);
        
        // Bob's USDC balance after borrowing
        const bobUsdcBalancBeforeBorrow = await usdc.balanceOf(bobAddress);
        console.log(`Bob's USDC balance before borrowing: ${ethers.utils.formatUnits(bobUsdcBalancBeforeBorrow, 6)} (usdc)`);

        // Print the USDC balance in the Compound USDC contract after Alice supplies
        const usdcBalanceBeforeBorrow = await usdc.balanceOf(compoundUsdcAddress);
        console.log(`-- USDC balance in Compound USDC contract before Bob borrows: ${ethers.utils.formatUnits(usdcBalanceBeforeBorrow, 6)} (usdc) --`);

        const baseAssetMantissa = 1e6; // USDC has 6 decimal places
        const borrowSize = 46964238.052894;// Empty all usdc assets
        
        // Borrow all usdc assets
        let tx = await compoundUsdc.connect(signerBob).withdraw(usdcAddress, (borrowSize * baseAssetMantissa).toString());
        await tx.wait(1);

        // Bob's USDC balance after borrowing
        const bobUsdcBalanceAfterBorrow = await usdc.balanceOf(bobAddress);
        console.log(`Bob's USDC balance after borrowing: ${ethers.utils.formatUnits(bobUsdcBalanceAfterBorrow, 6)} (usdc)`);

        // Print the USDC balance in the Compound USDC contract after Bob's borrow
        const balanceAfterBorrow = await usdc.balanceOf(compoundUsdcAddress);
        //After Bob borrowed all USDC , USDC balance in Compound USDC contract should be 0
        expect(Number(balanceAfterBorrow)).to.equal(0);
        console.log(`-- USDC balance in Compound USDC contract after Bob borrowed: ${ethers.utils.formatUnits(balanceAfterBorrow, 6)} (usdc) --\n`);
        
        // Update Alice's USDC balance before withdrawing
        const aliceUsdcBalancebefore = await usdc.balanceOf(aliceAddress);
        console.log(`Alice's USDC balance before withdrawing: ${ethers.utils.formatUnits(aliceUsdcBalancebefore, 6)} (usdc)`);

        // Alice withdraws the supplied USDC from the Compound USDC contract, and it reverts with "ERC20: transfer amount exceeds balance"
        try {
          await compoundUsdc.connect(signerAlice).withdraw(usdcAddress, aliceUsdcAmount);
        } catch (error) {
          console.log("Alice's Withdrawal error:", error.message);
        }
        await expect(
          compoundUsdc.connect(signerAlice).withdraw(usdcAddress, aliceUsdcAmount)
        ).to.be.revertedWith("ERC20: transfer amount exceeds balance");

        // Update Alice's USDC balance after withdrawing
        const aliceUsdcBalanceFinal = await usdc.balanceOf(aliceAddress);
        console.log(`Alice's USDC balance after withdrawing: ${ethers.utils.formatUnits(aliceUsdcBalanceFinal, 6)} (usdc) (The balance is still same as the balance before withdrawing)`);
        // Alice's USDC balance is still the same as the balance before withdrawing, which means she didn't withdraw successfully
        expect(aliceUsdcBalancebefore).to.eq(aliceUsdcBalanceFinal);

    });
});