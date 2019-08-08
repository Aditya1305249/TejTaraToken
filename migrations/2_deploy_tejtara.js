const TejTaraToken = artifacts.require("TejTaraToken");
const TejTaraTokenSale =artifacts.require("TejTaraTokenSale")

module.exports = function(deployer) {

  //token price 0.001 Ether
  const tokenPrice = 1000000000000000;

  deployer.deploy(TejTaraToken,1000000).then(()=>{
    return deployer.deploy(TejTaraTokenSale,TejTaraToken.address,tokenPrice);
  });
 
};
