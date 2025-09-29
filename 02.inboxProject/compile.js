const path = require('path');
const fs = require('fs');
const solc = require('solc');

// Get path to contract file
const inboxPath = path.resolve(__dirname, 'contracts', 'Inbox.sol');
const source = fs.readFileSync(inboxPath, 'utf8');

// Solidity compiler input format
const input = {
    language: 'Solidity',
    sources: {
        'Inbox.sol': {
            content: source
        }
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['*']
            }
        },
        optimizer: {
            enabled: true,
            runs: 200
        },
        evmVersion: 'istanbul'
    }
};

function compileSolidity() {
    // Compile the contract
    const output = JSON.parse(solc.compile(JSON.stringify(input)));

    // Check for compilation errors
    if (output.errors) {
        const hasError = output.errors.some(error => error.severity === 'error');
        if (hasError) {
            output.errors.forEach(error => {
                console.error(error.formattedMessage);
            });
            throw new Error('Contract compilation failed');
        } else {
            // Log warnings but continue
            output.errors.forEach(error => {
                console.warn(error.formattedMessage);
            });
        }
    }

    return output;
}

// Export the compiled contract
module.exports = compileSolidity();
//             }
//         }
//     }
// }

// const output = JSON.parse(solc.compile(JSON.stringify(compileOptions)));
// // const contract = output.contracts['Inbox.sol']
// console.log(output.contracts['Inbox.sol'])

// module.exports = output.contracts['Inbox.sol']