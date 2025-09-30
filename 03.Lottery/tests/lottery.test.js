const ganache = require('ganache-cli');
const Web3 = require('web3'); // remove curly braces
const assert = require('assert');
const compiledContract = require('../compile');

const ganacheProvider = ganache.provider({
    gasLimit: 8000000,
    gasPrice: 20000000000, // 20 Gwei
    hardfork: 'istanbul'
});

const web3 = new Web3(ganacheProvider);

let accounts;
let lottery;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    console.log("Available accounts:", accounts);

    const deploy = new web3.eth.Contract(compiledContract.Lottery.abi)
        .deploy({
            data: '0x' + compiledContract.Lottery.evm.bytecode.object,
            arguments: [] // Add constructor args if needed
        });

    const gas = await deploy.estimateGas();
    console.log('Estimated gas:', gas);

    const gasLimit = Number(gas) + 5000;

    lottery = await deploy.send({
        from: accounts[0],
        gas: gasLimit,
        gasPrice: '20000000000'
    });
});



beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    lottery = await new web3.eth.Contract(compiledLottery.Lottery.abi)
        .deploy({ 
            data: '0x' + compiledLottery.Lottery.evm.bytecode.object,
            arguments: [] // Add constructor args if needed
        })
        .send({ from: accounts[0], gas: '1000000', gasPrice: '20000000000' });
});

describe('Lottery Contract', () => {

    it('deploys the contract', () => {
        assert.ok(lottery.options.address);
    });

    it('marks caller as manager', async () => {
        const manager = await lottery.methods.viewManager().call();
        assert.equal(manager, accounts[0]);
    });

    it('allows players to enter', async () => {
        await lottery.methods.enterPlayer_().send({ from: accounts[1], value: web3.utils.toWei('1', 'gwei') });
        const players = await lottery.methods.viewPlayers().call();
        assert.equal(players[0], accounts[1]);
    });

    it('requires a minimum amount of Ether to enter', async () => {
        try {
            await lottery.methods.enterPlayer_().send({ from: accounts[2], value: web3.utils.toWei('0.5', 'gwei') });
            assert(false); // Should not reach here
        } catch (err) {
            assert(err); // Expect an error
        }
    });

    it('only manager can pick winner', async () => {
        try {
            await lottery.methods.pickWinner().send({ from: accounts[1] });
            assert(false);
        } catch (err) {
            assert(err);
        }
    });

    it('sends money to the winner and resets players', async () => {
        // Enter multiple players
        await lottery.methods.enterPlayer_().send({ from: accounts[1], value: web3.utils.toWei('1', 'gwei') });
        await lottery.methods.enterPlayer_().send({ from: accounts[2], value: web3.utils.toWei('1', 'gwei') });

        const balanceBefore = await web3.eth.getBalance(accounts[1]);

        // Listen to the event
        const receipt = await lottery.methods.pickWinner().send({ from: accounts[0] });

        const winnerEvent = receipt.events.WinnerPaid;
        assert.ok(winnerEvent);

        const winner = winnerEvent.returnValues.winner;
        const amount = winnerEvent.returnValues.amount;

        const balanceAfter = await web3.eth.getBalance(winner);

        assert(Number(balanceAfter) > Number(balanceBefore));

        const players = await lottery.methods.viewPlayers().call();
        assert.equal(players.length, 0); // Reset done
    });

});

