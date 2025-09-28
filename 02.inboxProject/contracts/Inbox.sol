// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

contract Inbox {
    address public owner;
    string public message;
    event MessageUpdated(string newMessage, uint256 timestamp);

    constructor(string memory initialMessage)  {
        owner = msg.sender;
        message = initialMessage;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    function setMessage(string memory newMessage) public onlyOwner {
        require(bytes(newMessage).length > 0, "Message cannot be empty");
        message = newMessage;
        emit MessageUpdated(newMessage, block.timestamp);
    }
}