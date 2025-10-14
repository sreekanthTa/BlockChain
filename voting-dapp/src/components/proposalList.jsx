 import React from "react";
 
const ProposalList = ({ proposals }) => {
  return (
    <div>
      <h2>Proposals</h2>
      <ul>
        {proposals.map((p, idx) => (
          <li key={idx}>
            {p.title} - Votes: {p.voteCount}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProposalList;
