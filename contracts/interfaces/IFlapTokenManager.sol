// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity >=0.8.0;

interface IFlapTokenManager {

    function buy(address token, address recipient, uint256 minAmount) external payable returns (uint256 amount);
}
