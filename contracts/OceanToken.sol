// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract OceanToken is ERC20, ERC20Burnable, Pausable, Ownable {
    mapping(address => bool) private users;

    constructor(uint256 initSupply) ERC20("OceanToken", "OCT") Ownable(msg.sender) {
        _mint(msg.sender, initSupply * (10 ** decimals()));
    }

    function mint(address to, uint256 value) external onlyOwner {
        _mint(to, value * (10 ** decimals()));
    }

    function toggleUser(address user) external onlyOwner {
        users[user] = !users[user];
    }

    function isInactive(address user) external view returns(bool) {
        return users[user];
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function _update(
        address from,
        address to,
        uint256 value
    ) internal virtual override(ERC20) {
        require(!paused(), "Token transfers are paused");
        super._update(from, to, value);
    }


}
