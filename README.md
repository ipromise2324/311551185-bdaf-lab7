# 311551185-bdaf-lab7

On block number 17228670, [Compound USDC contract](https://etherscan.io/address/0xc3d688B66703497DAA19211EEdff47f25384cdc3#readProxyContract) roughly has 458k in Liquidity.

Write a test script that simulates two actors that do the following actions:

- Alice provides liquidity (1000 USDC) into the Compound USDC contract
- Bob borrows out all the liquidity from Compound USDC contract.
  - There are some setup required : )
- Alice tries to withdraw, what happens here?

# Flow chart
<img width="501" alt="image" src="https://github.com/ipromise2324/311551185-bdaf-lab7/assets/87699256/a17e0d0d-c418-4e02-8f76-3055f40c6ee4">

# Install
```shell
git clone git@github.com:ipromise2324/311551185-bdaf-lab7.git
npm install
npx hardhat test
```
# Result
<img width="1176" alt="image" src="https://github.com/ipromise2324/311551185-bdaf-lab7/assets/87699256/eef4e9c7-80db-4341-9092-e9016e95189a">
