const TejTaraTokenSale = artifacts.require("TejTaraTokenSale");

contract('TejTaraTokenSale',accounts=>{
  let contractInstance;
  const tokenPrice = 1000000000000000;
    it('intiazling the contract', ()=>{
        return TejTaraTokenSale.deployed().then(instance=>{
            contractInstance=instance;
        return  contractInstance.adddress;   
        }).then(address=>{

            assert.notEqual(address,0x0,'contract address');
            return contractInstance.tokenContract()
        }).then(address=>{
            assert.notEqual(address,0x0,'token contract address')
            return contractInstance.tokenPrice();
        }).then(price=>{
            assert.equal(price,tokenPrice,'price of each token')
        })
    })


})