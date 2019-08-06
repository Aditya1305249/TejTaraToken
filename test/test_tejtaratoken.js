const TejTaraToken =  artifacts.require("TejTaraToken")



contract("TejTaraToken",(accounts)=>{
  let tokenInstance;

  it("assign correct value",()=>{
   
        return TejTaraToken.deployed().then(instance=>{
            tokenInstance=instance;
        return tokenInstance.name(); 
        }).then(name=>{
            assert.equal(name,"TejTara Token","name has to be correct");
            return tokenInstance.symbol();
        }).then(symbol=>{
            assert.equal(symbol,"TejTara","symbol has to be correct");
            return tokenInstance.standard();
        }).then(standard=>{
            assert.equal(standard,"TejTara version 1.0","standard has to be correct");
        })
   });


   it("initial supply value",()=>{
       return TejTaraToken.deployed().then(instance=>{
           tokenInstance=instance;
         return tokenInstance.totalSupply();  
       }).then(totalSupply=>{
           assert.equal(totalSupply,1000000,"total token supply");
          return tokenInstance.balanceOf(accounts[0]); 
       }).then(balance=>{
           assert.equal(balance,1000000,"total token assign to admin");
       })
   });

  it("transerfer the ownership of the token",()=>{
       return TejTaraToken.deployed().then(instance=>{
         tokenInstance= instance;
         return tokenInstance.transfer(accounts[1],999999999999);            
       }).then(assert.fail).catch(error=>{
           assert(error.message.indexOf('revert')>=0,"revert haas to be fired");

           return tokenInstance.transfer.call(accounts[1],50000,{from:accounts[0]})
       }).then(sucess=>{
           assert.equal(sucess,true,"transaction completed sucessfully");
          return tokenInstance.transfer(accounts[1],500000)
       }).then(receipt=>{
           //console.log(receipt);
           assert.equal(receipt.logs.length,1,"triggerd one event");
           assert.equal(receipt.logs[0].event,"Transfer","should be the 'transfer' event");
           assert.equal(receipt.logs[0].args.from,accounts[0],"logs the account the tokens transfer from");
           assert.equal(receipt.logs[0].args.to,accounts[1],"logs the accounts the tokens trnsfer to");
           assert.equal(receipt.logs[0].args.value,500000,"logs the tranfer amount");
           return tokenInstance.balanceOf(accounts[0])
       }).then(balance=>{
           assert.equal(balance,500000,"Balance of admin");
           return tokenInstance.balanceOf(accounts[1])
       }).then(balance=>{
           assert.equal(balance,500000,"Balance of accounts1");
       }) 
  })

 
   it('approve owner for deligate tranfer',()=>{
            return   TejTaraToken.deployed().then(instance=>{
                tokenInstance=instance;
        
            return tokenInstance.approval.call(accounts[1],100)
            }).then(sucess=>{
                assert.equal(sucess,true,'approval done sucessfully');
              return tokenInstance.approval(accounts[1],100,{from:accounts[0]})
            }).then(receipt=>{
                assert.equal(receipt.logs.length,1,'only one approval Event triggerd');
                assert.equal(receipt.logs[0].event,"Approval","should be the 'Approval' event");
                assert.equal(receipt.logs[0].args.owner,accounts[0],"logs the account the tokens transfer from");
                assert.equal(receipt.logs[0].args.spender,accounts[1],"logs the accounts the tokens trnsfer to");
                assert.equal(receipt.logs[0].args.value,100,"logs the tranfer amount");
                return tokenInstance.allowance(accounts[0],accounts[1])
            }).then(allowance=>{
                assert.equal(allowance,100,'amount allowed to spender');
            })
   });
   
   
  it('handels deligates token transfer',()=>{
        return TejTaraToken.deployed().then(instance=>{
            tokenInstance=instance;
           fromAccount = accounts[2];
           toAccount = accounts[3];
           spendingAccount = accounts[4];
           //transfer some token to fromAccount
           return tokenInstance.transfer(fromAccount,100,{from:accounts[0]})
        }).then(receipt=>{
         // appprove spending account to spend 50 token from fromAccount

         return tokenInstance.approval(spendingAccount,50,{from:fromAccount})
        }).then(receipt=>{
            //trying to transfer larger thean value
          return tokenInstance.transferFrom(fromAccount,toAccount,9999,{from:spendingAccount})
        }).then(assert.fail).catch(error=>{
            assert(error.message.indexOf('revert')>=0,'cant transfer value larger then account' )
            return tokenInstance.transferFrom(fromAccount,toAccount,60,{from:spendingAccount})
        }).then(assert.fail).catch(error=>{
            assert(error.message.indexOf('revert')>=0,'cant transfer value larger then approve amount' )
            return tokenInstance.transferFrom.call(fromAccount,toAccount,50,{from:spendingAccount})
        }).then(sucess=>{
            assert.equal(sucess,true);
            return tokenInstance.transferFrom(fromAccount,toAccount,50,{from:spendingAccount})
        }).then(receipt=>{
            assert.equal(receipt.logs.length,1,"triggerd one event");
           assert.equal(receipt.logs[0].event,"Transfer","should be the 'transfer' event");
           assert.equal(receipt.logs[0].args.from,fromAccount,"logs the account the tokens transfer from");
           assert.equal(receipt.logs[0].args.to,toAccount,"logs the accounts the tokens trnsfer to");
           assert.equal(receipt.logs[0].args.value,50,"logs the tranfer amount");
           return tokenInstance.balanceOf(fromAccount)
        }).then(balance=>{
            assert.equal(balance,50,'balance after transfer');
            return tokenInstance.balanceOf(toAccount)
        }).then(balance=>{
            assert.equal(balance,50,'balance after transfer');
            return tokenInstance.allowance(fromAccount,spendingAccount)
        }).then(balance=>{
            assert.equal(balance,0,'balance of allowance')
        })

  })



})
