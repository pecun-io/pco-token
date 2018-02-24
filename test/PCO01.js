const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const Compiler = require('../compile');
 
const provider = ganache.provider();
const web3 = new Web3(provider);
 

const { interface, bytecode } = Compiler.compile('PCO01.sol', 'PCO01');
 

let accounts;
let inbox;
 
beforeEach(async () => {
    // Get a list of all accounts
    accounts = await web3.eth.getAccounts();

    // Use one of those accounts to deploy the contract
    inbox = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode, arguments: [] })
        .send({ from: accounts[0], gas: '1000000' });
    
    inbox.setProvider(provider);
});
 
describe('PCO01 - Tests', () => {

    it('deploys a contract', () => {
        assert.ok(inbox.options.address);
    });

    it('has a default supply of 10^16 separate units', async () => {
        const message = await inbox.methods.totalSupply().call();
        const expTotalSupply = 10000000000000000;
        console.log(message);
        console.log(expTotalSupply);
        assert.equal(parseInt(message), expTotalSupply);
    });

    it('has a default decimals of 8', async () => {
        const message = await inbox.methods.DECIMALS().call();
        assert.equal(message, 8);
    });

    // Further contracts missing
});