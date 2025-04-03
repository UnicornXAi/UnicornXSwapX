// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity >=0.8.0;

interface IFourTokenManager {
    // v1
    function purchaseTokenAMAP(address token, uint256 funds, uint256 minAmount) payable external;

    // v2
    function buyTokenAMAP(address token, address to, uint256 funds, uint256 minAmount) payable external;

    function sellToken(address token, uint256 amount) external;
}
