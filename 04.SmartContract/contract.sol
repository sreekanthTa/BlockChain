// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

contract Campaign {
    
    struct campaign {
        address owner;
        string title;
        uint targetAmount;
        uint collectedAmount;
        uint deadLine;
        mapping (address => uint) donators;
        address[] donatorsList;
        bool withdrawn;
        bool requestWithDrawn;

    }
    

    address public manager;
    
    mapping(uint => campaign) public campaings;

    uint public capmaignCount;

    constructor(){
        manager = msg.sender;
    }


    // Events
    event campaignCreated(uint campaignId, address owner);
    event donationReceived(uint campaignId, address donator, uint amount);
    event withdrawn(uint campaignId, address owner);
    event requestWithDrawCalled(uint campaignId, address owner);
    event refunded(uint campaignId, address donator, uint amount);


    //Contracts
    function createCampaign( string memory title_, uint  targetAmount_, uint  deadLine_ ) external {
            capmaignCount++;
            campaign storage camp  = campaings[capmaignCount];
            camp.owner = msg.sender;
            camp.title = title_;
            camp.targetAmount = targetAmount_;
            camp.deadLine = block.timestamp +  deadLine_;
            camp.collectedAmount = 0;
            camp.withdrawn = false;
            camp.requestWithDrawn = false;
            emit campaignCreated(capmaignCount, msg.sender);
     }

    function donateToCampaign(uint campaignId) external payable {
           campaign storage camp = campaings[campaignId];
           camp.collectedAmount += msg.value;
           camp.donators[msg.sender] += msg.value;
           camp.donatorsList.push(msg.sender);
           emit donationReceived(campaignId, msg.sender, msg.value);
    }

    modifier  isOwner(){
        require(msg.sender == manager);
        _;
    }


    function withDrawn(uint campaignId) external isOwner  {
       campaign storage camp = campaings[campaignId];
       require(camp.requestWithDrawn, "No request to withdrawn");

       (bool success, ) = payable(camp.owner).call{value:camp.collectedAmount}("");

       require(success, "Transfer Failed");
       camp.collectedAmount = 0;
       camp.withdrawn = true;

       emit withdrawn(campaignId, msg.sender);

    }

    function requestWithDraw(uint campaignId) external {
        campaign storage camp = campaings[campaignId];
        require(!camp.withdrawn, "Already withDrawnCompleted");
        require(msg.sender == camp.owner, "Only owner can make request to withdraw");
        camp.requestWithDrawn = true;
        emit requestWithDrawCalled(campaignId, msg.sender);

    }

    function refund(uint campaignId) external isOwner {
        campaign storage camp = campaings[campaignId];

        for(uint i = 0; i < camp.donatorsList.length; i++){
            address donator = camp.donatorsList[i];
            uint amount = camp.donators[donator];
            (bool success, ) = payable(donator).call{value:amount}("");
           

            require(success, "Transfer Failed");
            emit refunded(campaignId, donator, amount);


        }
    }
}