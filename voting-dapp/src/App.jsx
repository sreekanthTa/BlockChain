import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import React from "react";
import VotingAbi from "./Voting.json";
import { ethers } from "ethers";
import ProposalList from './components/proposalList';
import { getVotingContract } from './utils/contract';
import ConnectWallet from './components/connectWallet';
import VotingActions from './components/votingActions';

function App() {

const CONTRACT_ADDRESS = "0x1B4C223c92d1F77d76D75E9A40656aD0513c327b";


  const [account, setAccount] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [signer, setSigner] = useState(null);
  const [phase, setPhase] = useState(0);
  const [winner, setWinner] = useState(null);
  const [voteCount, setVoteCount] = useState(0);

  const loadProposals = async () => {
    if (!signer) return;
    const voting = getVotingContract(signer);
    const allProposals = await voting.getAllProposals();
    setProposals(allProposals);
  };

  React.useEffect(() => {
    if (account) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      provider.getSigner().then((s) => setSigner(s));
    }
  }, [account]);
    const getPhase = () =>{
    const voting = getVotingContract(signer);
    const phase = voting.getPhase();
    setPhase(phase);
  }

  const nextPhase=()=>{
     const voting = getVotingContract(signer);
    const phase = voting.nextPhase();
    getPhase()
  }

   
  const getWinner = async () => {
    if (!signer) return;
    const voting = getVotingContract(signer);
    const votes = await voting.pickWinner();
    const winnerName = await voting.winnerName();
    setWinner(winnerName);
    setVoteCount(votes);
  }


  React.useEffect(() => {
    if (signer) loadProposals();
  }, [signer]);



 return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>Voting DApp</h1>
      <ConnectWallet account={account} setAccount={setAccount} />
      {signer && (
        <>
          <ProposalList proposals={proposals} />
          <VotingActions signer={signer} refreshProposals={loadProposals} />
          <p>Current Phase: {phase}</p>
          <button onClick={    getPhase
}>GetPhase</button>
          <button onClick={nextPhase}>NextPhase</button>
          <button onClick={getWinner}>Get Winner</button>
          {winner && <p>Winner: {winner} with {voteCount} votes</p>}
        </>
      )}
    </div>
  )
}

export default App
