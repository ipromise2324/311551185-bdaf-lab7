# 311551185-bdaf-lab7

On block number 17228670, [Compound USDC contract](https://etherscan.io/address/0xc3d688B66703497DAA19211EEdff47f25384cdc3#readProxyContract) roughly has 458k in Liquidity.

Write a test script that simulates two actors that do the following actions:

- Alice provides liquidity (1000 USDC) into the Compound USDC contract
- Bob borrows out all the liquidity from Compound USDC contract.
  - There are some setup required : )
- Alice tries to withdraw, what happens here?

```shell
git clone git@github.com:ipromise2324/311551185-bdaf-lab7.git
npm install
npx hardhat test
```
