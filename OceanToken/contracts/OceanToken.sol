// // SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
// Import OpenZeppelin's ERC20 standard contract
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";



// 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4
// 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2
// 0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db
contract OceanToken is ERC20, ERC20Burnable, Pausable{

    address owner;
    mapping(address => bool) users;

    constructor(uint256 initSupply) ERC20("OCeanToken", "OCT"){
        owner = msg.sender;
       _mint(msg.sender, initSupply *  (10 ** decimals()));
    }

    function mint(address to, uint256 value) external  onlyOwner{
       _mint(to, value * (10 ** decimals()));
    }


    function toggleUser() external  onlyOwner{
        users[msg.sender] = !users[msg.sender];
    }

    function isInActive() external  onlyOwner view returns(bool){
       return users[msg.sender];
    }

    function pause() external onlyOwner(){
        _pause();
    }

    function unPause() external onlyOwner(){
        _unpause();
    }
    // function _beforeTokenTransfer(address from, address to, uint256 amount)
    //         internal
    //         override(ERC20)   // explicitly specify which parent you override
    //     {
    //         super._beforeTokenTransfer(from, to, amount); // call parent ERC20 version
    //     require(!paused(), "Token transfers are paused");

    // }
    modifier  onlyOwner{
        require(msg.sender  == owner, "Only Owner Can Access this");
        _;
    }


}
