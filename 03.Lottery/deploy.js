const HDWalletProvider = require('@truffle/hdwallet-provider');
const { Web3 } = require('web3');
const compiledContract = require('./compile');

// Get contract interface details
const contract = compiledContract.contracts['lottery.sol'].Lottery;
if (!contract) {
    console.error('Compiled contract structure:', JSON.stringify(compiledContract, null, 2));
    throw new Error('Contract compilation output is not in the expected format');
}

const abi = contract.abi;
const bytecode = contract.evm.bytecode.object;

// Configure provider with your mnemonic and Infura WebSocket URL
const provider = new HDWalletProvider({
    mnemonic: 'Your Mnemonic',
    providerOrUrl: 'Test Netwokr Url',
    pollingInterval: 8000, // 8 seconds
    networkCheckTimeout: 10000, // 10 seconds
    timeoutBlocks: 200
});

// Configure Web3 with timeout and connection options
const web3 = new Web3(provider, null, {
    transactionBlockTimeout: 50,
    transactionPollingTimeout: 480,
    timeoutBlocks: 50,
    reconnect: {
        auto: true,
        delay: 5000, // ms
        maxAttempts: 5,
        onTimeout: true
    }
});

// Verify connection before proceeding
const verifyConnection = async () => {
    try {
        await web3.eth.net.isListening();
        const networkId = await web3.eth.net.getId();
        console.log('Connected to network ID:', networkId);
        return true;
    } catch (error) {
        console.error('Connection failed:', error.message);
        return false;
    }
};

// Simple delay function to help with rate limiting
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const deploy = async () => {
    try {
        // Add delay before starting to help with rate limiting
        await delay(1000);
        
        // Verify connection first
        const isConnected = await verifyConnection();
        if (!isConnected) {
            throw new Error('Failed to connect to the network');
        }

        // Get list of accounts
        const accounts = await web3.eth.getAccounts();
        console.log('Attempting to deploy from account', accounts[0]);

        // Create deployment transaction
        const deploy = new web3.eth.Contract(abi)
            .deploy({
                data: '0x' + bytecode,
                arguments: [] // No constructor arguments for Lottery contract
            });

        // Estimate gas for deployment
        const gas = await deploy.estimateGas();
        console.log('Estimated gas:', gas);

        // Calculate gas with buffer
        const gasLimit = Number(gas) + 50000;

        // Deploy the contract
        const result = await deploy.send({
            from: accounts[0],
            gas: gasLimit,
            gasPrice: '20000000000',
            type: '0x0' // legacy transaction type
        });
          console.log("Byte code is", bytecode)
          console.log('Contract deployed to', result.options.address);
  
  // Verify deployment with retries
  let retries = 3;
  const verifyDeployment = async () => {
    while (retries > 0) {
      try {
        const blockNumber = await web3.eth.getBlockNumber();
        console.log('Current block number:', blockNumber);
        break;
      } catch (error) {
        console.log('Error getting block number, retries left:', retries - 1);
        if (retries === 1) {
          console.error('Failed to get block number:', error.message);
        }
        retries--;
        // Wait 5 seconds before retry
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
  };

  await verifyDeployment();

        // Clean up provider
        provider.engine.stop();
        return result;
    } catch (error) {
        console.error('Deployment failed:', error);
        throw error;
    } finally {
        // Clean up provider after a short delay to ensure all requests complete
        setTimeout(() => {
            provider.engine.stop();
            console.log('Provider connection closed');
        }, 1000);
    }
};

// Execute deployment
deploy()
    .then(() => {
        console.log('Deployment completed successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Deployment failed:', error);
        process.exit(1);
    });