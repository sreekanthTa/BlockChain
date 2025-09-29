const ganache = require('ganache-cli');
const { Web3 } = require('web3');
const assert = require('assert');
const compiledContract = require('../compile');


// ### 🔧 Gas Limit
// > **Definition:** The **maximum amount of gas** you are willing to let the transaction consume  
// > **Purpose:** Prevents infinite execution and limits how much computation can be performed  
// > **Analogy:** Think of it like the **fuel tank capacity** of your car — it limits how far you can go  
// This means the transaction can use up to 1,000,000 gas units.
// If the contract needs less, you get refunded for unused gas.
// If it needs more, the transaction fails with an "out of gas" error.



// Gas Price
// Definition: The amount of ETH you are willing to pay per unit of gas
// Unit: Typically set in Gwei (1 Gwei = 10⁹ wei)
// Purpose: Incentivizes miners/validators to include your transaction
// Analogy: Think of it like the price per liter of fuel — pay more to get mined faster
// // Configure Ganache provider with specific options

// Transaction Fee = Gas Used × Gas Price
// | Example        | Value                           |
// | -------------- | ------------------------------- |
// | Gas Used       | `21000`                         |
// | Gas Price      | `20 Gwei`                       |
// | Total Fee Paid | `21000 × 20 Gwei = 0.00042 ETH` |


// A "unit of gas" is just a measurement of computational work.
// Think of it like how electricity is measured in kilowatt-hours (kWh) — gas units measure how much computation is used.

// 🔑 Key Points:

// 1 unit of gas = the smallest amount of computation tracked by the EVM.

// Different operations consume different amounts of gas.

// Example:

// Storing data in storage costs 20,000 gas

// Adding two numbers costs 3 gas

// Sending ETH costs 21,000 gas (minimum base for a transaction)


// Example Calculation

// Gas Limit = 10 → You allow a maximum of 10 units of gas.

// Gas Price = 5 (wei or gwei) → You are willing to pay 5 per gas unit.

const ganacheProvider = ganache.provider({
  gasLimit: 8000000,
  gasPrice: 20000000000,
  hardfork: 'istanbul', // Use a stable hardfork
  accounts: [
    {
      balance: '0x1000000000000000000000' // Provide enough balance
    }
  ]
});

// Get the contract interface details
const contract = compiledContract.contracts['Inbox.sol'].Inbox;
const abi = contract.abi;
const bytecode = contract.evm.bytecode.object;

// Connect to Ganache local blockchain with configured provider
const web3 = new Web3(ganacheProvider);

let accounts;
let inbox;

beforeEach(async () => {
  try {
    // Get a list of all test accounts
    accounts = await web3.eth.getAccounts();
    console.log("Available accounts:", accounts);

    // Deploy the contract
    const deploy = new web3.eth.Contract(abi)
      .deploy({
        data: '0x' + bytecode,
        arguments: ['Hi There!']
      });

    // Estimate gas for deployment
    const gas = await deploy.estimateGas();
    console.log('Estimated gas:', gas);

    // Calculate gas with buffer (converting BigInt to number safely)
    const gasLimit = Number(gas) + 50000; // Add fixed buffer instead of multiplication

    // Deploy with calculated gas
    inbox = await deploy.send({
      from: accounts[0],
      gas: gasLimit,
      gasPrice: '20000000000'
    });
    
    console.log('Contract deployed successfully');
  } catch (error) {
    console.error('Deployment error:', error);
    throw error;
  }
});

describe('Inbox', () => {
  it('deploys a contract', () => {
    assert.ok(inbox.options.address); // check if deployed
    console.log("Contract deployed at:", inbox.options.address);
  });

  it('has a default message', async () => {
    const message = await inbox.methods.message().call();
    assert.equal(message, 'Hi There!');
  });

  it('can change the message', async () => {
    await inbox.methods.setMessage('New Message')
      .send({ 
        from: accounts[0],
        gas: '200000',
        gasPrice: '20000000000',
        type: '0x0' // legacy transaction type
      });
    const message = await inbox.methods.message().call();
    assert.equal(message, 'New Message');
  });
});
