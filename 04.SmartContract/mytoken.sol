// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MyToken {
    string public name = "MyToken";
    string public symbol = "MTK";
    uint8 public decimals = 18;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    constructor(uint256 initialSupply){
        totalSupply = initialSupply * (10 ** decimals);
        balanceOf[msg.sender] = totalSupply;
    }

    function transfer(address _to, uint256 amount) public returns (bool){
        require(balanceOf[msg.sender] >= amount, "Insufficient Balance");
        balanceOf[msg.sender] -= amount;
        balanceOf[_to] += amount;
        emit Transfer(msg.sender, _to, amount);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 amount) public returns (bool){
        require(balanceOf[_from] >= amount, "Insufficient Balance");
        require(allowance[_from][msg.sender] >= amount, "Allowance Exceeded");
        balanceOf[_from] -= amount;
        balanceOf[_to] += amount;
        allowance[_from][msg.sender] -= amount;
        emit Transfer(_from, _to, amount);
        return true;
    }

    function approve(address _spender, uint256 _amount) public returns (bool) {
        allowance[msg.sender][_spender] = _amount;
        emit Approval(msg.sender, _spender, _amount);
        return true;
    }
}
