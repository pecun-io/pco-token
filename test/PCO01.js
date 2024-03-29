const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const Compiler = require('../compile');
 
const provider = ganache.provider();
const web3 = new Web3(provider); 

const { interface, bytecode } = Compiler.compile('PCO01.sol', 'PCO01');
//const { interface, bytecode } = Compiler.compile('SimpleToken.sol', 'SimpleToken');
 

let accounts,
    inbox;

let accountOwner, 
    accountUser1,
    accountUser2;

const expTotalSupply = 10000000000000000;
 
beforeEach(async () => {
    // Get a list of all accounts
    accounts = await web3.eth.getAccounts();
    accountOwner = accounts[0];
    accountUser1 = accounts[1];
    accountUser2 = accounts[2];
    
    // Use one of those accounts to deploy the contract
    inbox = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode, arguments: [] })
        .send({ from: accountOwner, gas: '1000000' });
    
    inbox.setProvider(provider);
});
 
describe('PCO01 - Tests', () => {

    it('deploys a contract', () => {
        assert.ok(inbox.options.address);
    });

    it('has a default supply of 10^16 separate units', async () => {
        const message = await inbox.methods.totalSupply().call();
        const expTotalSupply = 10000000000000000;
        assert.equal(parseInt(message), expTotalSupply);
    });
    
    it('has a default decimals of 8', async () => {
        const message = await inbox.methods.DECIMALS().call();
        assert.equal(message, 8);
    });

    it('contract owner owns all tokens', async () => {
        const balance = await inbox.methods.balanceOf(accountOwner).call();
        assert.equal(parseInt(balance), expTotalSupply);
    });

    it('send 10 tokens to user1 from contract owner', async () => {
        let sendAmount = 10;
        await inbox.methods.transfer(accountUser1, sendAmount).send({ from: accountOwner });
        const balanceUser1 = await inbox.methods.balanceOf(accountUser1).call();
        const balanceOwner = await inbox.methods.balanceOf(accountOwner).call();
        
        assert.equal(parseInt(balanceUser1), sendAmount);
        assert.equal(parseInt(balanceOwner), expTotalSupply-sendAmount);
    });

    /*
    it('who is owner', async () => {
        let sendAmount = 10;
        let owner = await inbox.methods.owner().call();
        console.log('owner: ' + owner);
        assert.equal('a', 'a');
        //assert.equal(parseInt(balanceOwner), expTotalSupply-sendAmount);
    });*/

/*    it('try overspend 20 tokens from user1 to user2', async () => {
        let sendAmount = 10;
        await inbox.methods.transfer(accountUser1, sendAmount).send({ from: accountOwner });
        const balanceUser1 = await inbox.methods.balanceOf(accountUser1).call();
        const balanceOwner = await inbox.methods.balanceOf(accountOwner).call();
        
        assert.equal(parseInt(balanceUser1), sendAmount);
        assert.equal(parseInt(balanceOwner), expTotalSupply-sendAmount);
    });
*/
});