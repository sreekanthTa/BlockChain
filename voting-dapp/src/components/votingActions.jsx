import React, { useState } from "react";
import { ethers } from "ethers";
import { getVotingContract } from "../utils/contract";
 

const VotingActions = ({ signer, refreshProposals }) => {
  const [proposalName, setProposalName] = useState("");
  const [voteIndex, setVoteIndex] = useState(0);

  const addProposal = async () => {
    const voting = getVotingContract(signer);
    await voting.addProposals(proposalName);
    setProposalName("");
    refreshProposals();
  };

  const vote = async () => {
    const voting = getVotingContract(signer);
    await voting.vote(voteIndex);
    refreshProposals();
  };

  return (
    <div>
      <h2>Actions</h2>
      <div>
        <input
          type="text"
          placeholder="Proposal Name"
          value={proposalName}
          onChange={(e) => setProposalName(e.target.value)}
        />
        <button onClick={addProposal}>Add Proposal</button>
      </div>
      <div>
        <input
          type="number"
          placeholder="Vote Index"
          value={voteIndex}
          onChange={(e) => setVoteIndex(Number(e.target.value))}
        />
        <button onClick={vote}>Vote</button>
      </div>
    </div>
  );
};

export default VotingActions;
