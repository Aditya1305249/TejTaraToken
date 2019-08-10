const TejTaraToken = artifacts.require("TejTaraToken");
const TejTaraTokenSale = artifacts.require("TejTaraTokenSale");


contract('TejTaraTokenSale',accounts=>{
  let tokenSaleInstance;
  let tokenInstance;
  const tokenPrice = 1000000000000000;
  const admin=accounts[0];
  const buyer=accounts[1];
  const tokensAvailable = 750000;
  const numberOfTokens=10;

    it('intiazling the contract with the correct value', ()=>{    
        return TejTaraTokenSale.deployed().then(instance=>{
            tokenSaleInstance=instance;
        return  tokenSaleInstance.adddress;   
        }).then(address=>{

            assert.notEqual(address,0x0,'contract address');
            return tokenSaleInstance.tokenContract()
        }).then(address=>{
            assert.notEqual(address,0x0,'token contract address')
            return tokenSaleInstance.tokenPrice();
        }).then(price=>{
            assert.equal(price,tokenPrice,'price of each token')
        })
    })



   it('facilitates tokens buying',()=>{
    
    return TejTaraToken.deployed().then(instance=>{
        //token instance
        tokenInstance=instance;
       return TejTaraTokenSale.deployed();
       }).then(instance=>{
           //token sale instance
           tokenSaleInstance=instance;
       //provision 75% of token to token sale
       return tokenInstance.transfer(tokenSaleInstance.address,tokensAvailable,{from:admin})
       }).then(receipt=>{
        return tokenSaleInstance.buyTokens(numberOfTokens,{from:buyer,value:numberOfTokens*tokenPrice})   
       }).then(receipt=>{
            assert.equal(receipt.logs.length,1,'only 1 event triggered');
            assert.equal(receipt.logs[0].event,'Sell','event name ');
            assert.equal(receipt.logs[0].args.buyer,buyer,'logs the account that purchase the tokens')
            assert.equal(receipt.logs[0].args.amount,numberOfTokens,'number of token sell')
           return tokenSaleInstance.tokenSold()
       }).then(balance=>{
           assert.equal(balance,numberOfTokens,'number of tokens sold');
            return tokenInstance.balanceOf(buyer);
       }).then(balance=> {
           assert.equal(balance,numberOfTokens,'balance of buyer') 
           return tokenInstance.balanceOf(tokenSaleInstance.address);
        }).then(balance=> {
            assert.equal(balance,tokensAvailable-numberOfTokens,'balance of buyer') 
           return tokenSaleInstance.buyTokens(numberOfTokens,{from:buyer,value:1})
          }).then(assert.fail).catch(error=>{
           assert(error.message.indexOf('revert')>=0,'buying token with less value');
          return tokenSaleInstance.buyTokens(8000000,{from:buyer,value:numberOfTokens*tokenPrice})
         }).then(assert.fail).catch(error=>{
           assert(error.message.indexOf('revert')>=0,'buying token more  than available');
  
     })
    })


    it('end token sale',()=>{

       return TejTaraToken.deployed().then(instance=>{
           tokenInstance=instance;
          
         return TejTaraTokenSale.deployed()  
       }).then(instance=>{
           tokenSaleInstance=instance;

          return tokenSaleInstance.endSale({from:buyer}) 
       }).then(assert.fail).catch(error=>{
           assert(error.message.indexOf('revert')>=0,'end sale other than admin')
           return tokenSaleInstance.endSale({from:admin})
       }).then(receipt=>{
           return tokenInstance.balanceOf(admin)
       }).then(balance=>{
           assert.equal(balance.toNumber(),999990,'remaining balance')
            return tokenInstance.balanceOf(tokenSaleInstance.address)
       }).then(balance=>{
           assert.equal(balance,0,'balance of contractToken Sale')
       })    

    })



})