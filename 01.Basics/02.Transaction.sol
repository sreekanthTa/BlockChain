// As a developer using Web3.js to connect with the Ethereum network...
// Web3.js is responsible for:
//   1. Creating a transaction object
//   2. Sending the transaction object to the Ethereum (or test) network
//   3. Waiting until the transaction is mined (completed) and returning the response

// 1) Why do we wait?
// When you send a transaction, it is broadcast to one of the nodes in the network.
// If multiple people send transactions at the same time, the node collects these
// transactions into a block. The block is then validated (mined) by the network.
// This process takes time, which is why we wait for confirmation before getting the result.

// 2) What is "Validation Logic"?
// This is commonly called "mining". Mining involves solving cryptographic puzzles
// and reaching consensus to add the block (containing your transaction) to the blockchain.
