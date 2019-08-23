App ={
    web3Provider:null,
    contracts:{},
    account:'0x0',
    loading:false,
    tokenPrice: 0,
    tokenSold:0,
    tokenAvailable:75000,

    init: ()=>{
        console.log("App initialize....");
         return App.initWeb3();
    },

    initWeb3: ()=>{
        if(typeof web3!= 'undefined') {
            App.web3Provider = web3.currentProvider;
            web3 = new Web3(web3.currentProvider);
        }else {
            App.web3Provider = new Web3.provider.HttpProvider('http://localhost:7545');
            web3 = new Web3(App.web3Provider);
        }
        App.initContracts();
    },

    initContracts: ()=>{
        $.getJSON("TejTaraTokenSale.json",(tejTaraTokenSale)=>{
            App.contracts.TejTaraTokenSale = TruffleContract(tejTaraTokenSale);
            App.contracts.TejTaraTokenSale.setProvider(App.web3Provider);
            App.contracts.TejTaraTokenSale.deployed().then((tejTaraTokenSale)=>{
                console.log("Token sale address:", tejTaraTokenSale.address);
            });
            return App.render();
        }).done(()=>{
            $.getJSON("TejTaraToken.json",(tejTaraToken)=>{
                App.contracts.TejTaraToken = TruffleContract(tejTaraToken);
                App.contracts.TejTaraToken.setProvider(App.web3Provider);
                App.contracts.TejTaraToken.deployed().then((tejTaraToken)=>{
                    console.log("Token address:", tejTaraToken.address);
                });
        })
        return App.render();
        })
       
    },

  render: () =>{
      if(App.loading){
          return;
      }
      App.loading = true;

      let loader = $("#loader");
      let content = $("#content");

      loader.show();
      content.hide();

      web3.eth.getCoinbase((err,account)=>{
          App.account = account;
         $("#accountAddress").html("your account: "+ account); 
      })
        // console.log(App.contracts.TejTaraToken);
      // console.log("tokenPrice:"+ App.tokenPrice);

      //load token sale contract
      App.contracts.TejTaraTokenSale.deployed().then((instance)=>{
          tokenSaleInstance = instance;
        return tokenSaleInstance.tokenPrice()  
      }).then(tokenPrice=>{
          App.tokenPrice =tokenPrice;
          console.log("tokenPrice:"+ App.tokenPrice);
          $(".token-price").html(web3.fromWei(App.tokenPrice,"ether").toNumber());
          return tokenSaleInstance.tokenSold();
      }).then(tokenSold=>{
         App.tokenSold = tokenSold.toNumber();
          console.log(App.tokenSold);
          $(".tokens-sold").html(App.tokenSold);
          $(".tokens-available").html(App.tokenAvailable);

         
         const progressPercent = (App.tokenSold / App.tokenAvailable)*100;
         console.log(progressPercent);
         $("#progress").css("width",progressPercent + '%');

       //load token contract
 
       App.contracts.TejTaraToken.deployed().then(instance=>{
           tokenInstance = instance;
           return tokenInstance.balanceOf(App.account)
       }).then(balance=>{
           $(".tejtara-balance").html(balance.toNumber());
       
           App.loading= false;
           loader.hide();
           content.show(); 
       
       
        })

      })
   
  }  
  
}


$(()=>{
    $(window).on("load",()=>{
        App.init()
    })
})