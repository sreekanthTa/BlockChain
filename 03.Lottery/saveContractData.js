const fs = require('fs');
const compiledContract = require('./compile');

// Get contract interface details
const contract = compiledContract.contracts['lottery.sol'].Lottery;
if (!contract) {
    console.error('Compiled contract structure is not in the expected format');
    process.exit(1);
}

const contractData = {
    abi: contract.abi,
    bytecode: contract.evm.bytecode.object
};

// Save to a file
fs.writeFileSync(
    'lottery-contract-data.json',
    JSON.stringify(contractData, null, 2)
);

console.log('Contract ABI and bytecode saved to lottery-contract-data.json');