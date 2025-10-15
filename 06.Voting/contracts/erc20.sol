// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";

contract VoteErc20 is ERC20 {

    constructor() ERC20("VoteToken", "VT") {
        // Mint initial supply to deployer (owner)
        _mint(msg.sender, 10000000 * 10 ** decimals());
    }

    // Mint tokens to any address (only owner can call)
    function mintTo(address to, uint256 value) external  {
        _mint(to, value);
    }

    // Transfer tokens from owner to another address
    function transferTokens(address to, uint256 value) external  {
        _transfer(msg.sender, to, value);
    }
}
