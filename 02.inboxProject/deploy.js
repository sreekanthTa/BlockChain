const HDWalletProvider = require('@truffle/hdwallet-provider');
const { Web3 } = require('web3');
const compiledContract = require('./compile');

// Get contract interface details
const contract = compiledContract.contracts['Inbox.sol'].Inbox;
const abi = contract.abi;
const bytecode = contract.evm.bytecode.object;

// Configure provider with your mnemonic and Infura URL
const provider = new HDWalletProvider(
 'Menonic phrase',
 'Api Endpoint'
);

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
                arguments: ['Hi There!']
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

        console.log('Contract deployed to:', result.options.address);
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
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });