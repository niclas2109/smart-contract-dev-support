const tc = artifacts.require("./Idioms/Checks-Effects-Interactions Pattern/ChecksEffectsInteractionsPattern");
const attacker_contract = artifacts.require('./Idioms/Checks-Effects-Interactions Pattern/Attacker2.sol');

contract('ChecksEffectsInteractionsPattern', async (accounts) => {

    let victim;

    
    before(async () => {
        victim = await tc.new();
    })

    it('TestContract balance should starts with 0 ETH', async () => {
        let balance = await web3.eth.getBalance(victim.address);
        assert.equal(balance, 0);
    })

    it('TestContract balance should have 11 ETH after deposit', async () => {
        let eleven_eth = web3.utils.toWei("11", "ether");
        await web3.eth.sendTransaction({from: accounts[1], to: victim.address, value: eleven_eth});
        let balance_wei = await web3.eth.getBalance(victim.address);
        let balance_ether = web3.utils.fromWei(balance_wei, "ether");
        assert.equal(balance_ether, 11);
    })

    it('Should be secured from Reentrancy', async () => {
        attacker = await attacker_contract.new(victim.address);
        let one_eth = web3.utils.toWei("1", "ether");
        await web3.eth.sendTransaction({from: accounts[1], to: attacker.address, value: one_eth});

        console.log(await web3.eth.getBalance(victim.address));
        console.log(await web3.eth.getBalance(attacker.address));
        await attacker.set_balance();
        result = await attacker.attack();
        //console.log(result)
        console.log(await web3.eth.getBalance(victim.address));
        console.log(await web3.eth.getBalance(attacker.address));
        assert.equal(one_eth, await web3.eth.getBalance(attacker.address));
    })    

})
