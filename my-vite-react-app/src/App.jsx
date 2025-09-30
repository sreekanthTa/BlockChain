import { useState, useEffect } from 'react'
import './App.css'
import web3 from "./web3"
import lottery from "./lottery"

function App() {
  const [manager, setManager] = useState('')
  const [accounts, setAccounts] = useState([])
  const [balance, setBalance] = useState('0')
  const [value, setValue] = useState('')
  const [message, setMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [players, setPlayers] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchAccounts = async () => {
    try {
      if (!web3) {
        throw new Error("Web3 is not initialized. Please install MetaMask!");
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      
      const accs = await web3.eth.getAccounts();
      console.log("Accounts:", accs);
      setAccounts(accs);
      
      return accs;
    } catch (error) {
      console.error("Error fetching accounts:", error);
      setErrorMessage(error.message);
    }
  }

  const fetchContractData = async () => {
    try {
      const managerAddress = await lottery.methods.manager().call();
      const balance = await web3.eth.getBalance(lottery.options.address);
      const playersList = await Promise.all(
        Array(10).fill().map((_, index) => 
          lottery.methods.players(index).call().catch(() => null)
        )
      );
      
      setManager(managerAddress);
      setBalance(web3.utils.fromWei(balance, 'ether'));
      setPlayers(playersList.filter(player => player !== null));
      
      console.log("Contract data loaded:", { managerAddress, balance, playersList });
    } catch (error) {
      console.error("Error fetching contract data:", error);
      setErrorMessage(error.message);
    }
  };

  const enterLottery = async (e) => {
    e.preventDefault();
    setMessage('Waiting on transaction...');
    setIsLoading(true);
    
    try {
      await lottery.methods.enterPlayer_().send({
        from: accounts[0],
        value: web3.utils.toWei(value, 'ether')
      });
      setMessage('You have been entered!');
      await fetchContractData(); // Refresh data
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
      setValue('');
    }
  };

  const pickWinner = async () => {
    setMessage('Picking a winner...');
    setIsLoading(true);
    
    try {
      await lottery.methods.pickWinner().send({
        from: accounts[0]
      });
      setMessage('A winner has been picked!');
      await fetchContractData(); // Refresh data
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      await fetchAccounts();
      await fetchContractData();

      // Setup event listener for MetaMask account changes
      if (window.ethereum) {
        window.ethereum.on('accountsChanged', accounts => {
          setAccounts(accounts);
        });
      }
    };
    
    init();

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', setAccounts);
      }
    };
  }, []); // Empty dependency array means this runs once on mount
  return (
    <div className="container">
      <h1>Lottery Contract</h1>
      
      {errorMessage && (
        <div className="error" style={{ color: 'red', marginBottom: '1rem' }}>
          {errorMessage}
        </div>
      )}
      
      {message && (
        <div className="message" style={{ color: 'green', marginBottom: '1rem' }}>
          {message}
        </div>
      )}

      <div className="contract-info" style={{ marginBottom: '2rem' }}>
        <h2>Contract Information</h2>
        <p><strong>Contract Manager:</strong> {manager}</p>
        <p><strong>Your Account:</strong> {accounts[0] || 'Not connected'}</p>
        <p><strong>Contract Balance:</strong> {balance} ETH</p>
        <p><strong>Number of Players:</strong> {players.length}</p>
      </div>

      {!accounts[0] ? (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <button onClick={fetchAccounts}>
            Connect Wallet
          </button>
        </div>
      ) : (
        <>
          <div className="enter-lottery" style={{ marginBottom: '2rem' }}>
            <h3>Want to try your luck?</h3>
            <form onSubmit={enterLottery}>
              <div style={{ marginBottom: '1rem' }}>
                <label>
                  Amount of ETH to enter:
                  <input
                    type="text"
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    style={{ marginLeft: '1rem' }}
                  />
                </label>
              </div>
              <button type="submit" disabled={isLoading}>
                {isLoading ? 'Processing...' : 'Enter Lottery'}
              </button>
            </form>
          </div>

          {accounts[0]?.toLowerCase() === manager?.toLowerCase() && (
            <div className="manager-section" style={{ marginBottom: '2rem' }}>
              <h3>Manager Section</h3>
              <button onClick={pickWinner} disabled={isLoading || players.length === 0}>
                {isLoading ? 'Processing...' : 'Pick Winner'}
              </button>
            </div>
          )}

          <div className="players-list">
            <h3>Current Players</h3>
            {players.length === 0 ? (
              <p>No players yet</p>
            ) : (
              <ul>
                {players.map((player, index) => (
                  <li key={index}>
                    {player}
                    {player?.toLowerCase() === accounts[0]?.toLowerCase() && ' (You)'}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default App
