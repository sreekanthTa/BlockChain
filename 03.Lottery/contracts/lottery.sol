// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

contract Lottery {
    address public manager;
    address[] public players;

    constructor() {
        manager = msg.sender;
    }

    function viewManager() public view returns (address) {
        return manager;
    }

    function viewPlayers() public view returns (address[] memory) {
        return players;
    }

    function enterPlayer_() public payable {
        require(msg.value >= 1 gwei, "Not enough Ether");
        players.push(msg.sender);
    }

    modifier restrictManager() {
        require(msg.sender == manager, "No Access");
        _;
    }

    function randomNumber() private view returns (uint) {
        return uint(
            keccak256(
                abi.encodePacked(block.prevrandao, block.timestamp, players)
            )
        );
    }

    function viewBalance() public view returns (uint) {
        return address(this).balance;
    }

    event WinnerPaid(address winner, uint amount);

    function pickWinner() public restrictManager {
        require(players.length > 0, "No players yet");

        uint winnerIndex = randomNumber() % players.length;
        address winner = players[winnerIndex];

        // Capture prize before sending
        uint prizeAmount = address(this).balance;

        // Safe transfer
        (bool success, ) = payable(winner).call{value: prizeAmount}("");
        require(success, "Transfer failed");

        emit WinnerPaid(winner, prizeAmount);

        // Reset players array
        players = new address[](0) ;
    }
}
