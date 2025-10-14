import React from "react";
import { ethers } from "ethers";

 

const ConnectWallet = ({ account, setAccount }) => {
  const connectWallet = async () => {
    if (!window.ethereum) return alert("Install MetaMask!");
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    setAccount(accounts[0]);
  };

  return (
    <div>
      {account ? (
        <p>Connected: {account}</p>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
    </div>
  );
};

export default ConnectWallet;
