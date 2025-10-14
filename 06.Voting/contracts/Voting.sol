// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Voting {
    address public owner;

    struct Proposal {
        string title;
        uint voteCount;
    }

    struct Voter {
        bool voted;
        uint vote;
    }

    Proposal[] public proposalMembers;
    mapping(address => Voter) public voterMembers;
    uint public totalVoters;

    enum Phase { NotStarted, Registration, Voting, Ended }
    Phase public phase;

    // Events
    event ProposalAdded(uint index, string name);
    event VoterAdded(address voterAddress);
    event Voted(address voterAddress, uint proposalId);
    event PhaseChanged(Phase newPhase);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call");
        _;
    }

    constructor(string[] memory proposalNames) {
        owner = msg.sender;
        phase = Phase.Registration;

        for (uint i = 0; i < proposalNames.length; i++) {
            proposalMembers.push(Proposal({
                title: proposalNames[i],
                voteCount: 0
            }));
            emit ProposalAdded(i, proposalNames[i]);
        }
    }

    // ✅ Only owner can add proposals, only during registration
    function addProposals(string memory proposalName)
        external
        onlyOwner
    {
        require(phase == Phase.Registration, "Not in registration phase");
        proposalMembers.push(Proposal({ title: proposalName, voteCount: 0 }));
        emit ProposalAdded(proposalMembers.length - 1, proposalName);
    }
    function getProposal(uint index) external view returns (string memory title, uint voteCount) {
        require(index < proposalMembers.length, "Invalid proposal index");
        Proposal storage p = proposalMembers[index];
        return (p.title, p.voteCount);
    }
    function getAllProposals() external view returns (Proposal[] memory) {
    return proposalMembers;
}


    // ✅ Only owner can add voters, during registration
    function addVoters(address voter)
        external
        onlyOwner
    {
        require(phase == Phase.Registration, "Not registration phase");
        require(voter != address(0), "Invalid address");

        Voter storage voteMember = voterMembers[voter];
        require(!voteMember.voted, "Already registered");

        voterMembers[voter] = Voter({ voted: false, vote: 0 });
        totalVoters++;

        emit VoterAdded(voter);
    }

    // ✅ Move to next phase (owner-controlled)
    function nextPhase() external onlyOwner {
        if (phase == Phase.Registration) {
            phase = Phase.Voting;
        } else if (phase == Phase.Voting) {
            phase = Phase.Ended;
        } else {
            revert("Voting already ended");
        }

        emit PhaseChanged(phase);
    }

    function getPhase()external view returns(string memory){
        if (phase == Phase.NotStarted) return "Not Started";
        else if (phase == Phase.Registration) return "Registration";
        else if (phase == Phase.Voting) return "Voting";
        else return "Ended";
    }

    function showProposals() external view returns(Proposal[] memory){
        return proposalMembers;
    }

    // ✅ Voting function
    function vote(uint index) external {
        require(phase == Phase.Voting, "Not in voting phase");
        require(index < proposalMembers.length, "Invalid proposal index");

        Voter storage voter = voterMembers[msg.sender];
        require(!voter.voted, "Already voted");

        voter.voted = true;
        voter.vote = index;

        proposalMembers[index].voteCount += 1;

        emit Voted(msg.sender, index);
    }

    // ✅ View winner (after voting ends)
    function pickWinner() external view returns (uint winnerIndex) {
        require(phase == Phase.Ended, "Voting not ended yet");

        uint highestVotes = 0;
        uint winner = 0;

        for (uint i = 0; i < proposalMembers.length; i++) {
            if (proposalMembers[i].voteCount > highestVotes) {
                highestVotes = proposalMembers[i].voteCount;
                winner = i;
            }
        }

        return winner;
    }

    // ✅ Get winner name
    function winnerName() external view returns (string memory) {
        uint winner = this.pickWinner();
        return proposalMembers[winner].title;
    }
}
