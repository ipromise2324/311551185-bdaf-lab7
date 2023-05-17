// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface CErc20Interface {
    function balanceOf(address account) external view returns (uint);
    function mint(uint mintAmount) external returns (uint);
    function redeem(uint redeemTokens) external returns (uint);
    function balanceOfUnderlying(address owner) external returns (uint);
    function exchangeRateStored() external view returns (uint);
    function supply(address asset, uint amount) external;
    function withdraw(address asset, uint amount) external;
}
