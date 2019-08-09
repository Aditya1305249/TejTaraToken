pragma solidity ^0.5.0;

import './TejTaraToken.sol';
contract  TejTaraTokenSale {
    
    address admin;
    TejTaraToken public tokenContract;
    uint256 public tokenPrice;
    uint256 public tokenSold;


    event Sell(address buyer,uint256 amount);

    constructor( TejTaraToken _address,uint256 _tokenPrice) public {
        admin=msg.sender;
        tokenContract= _address;
        tokenPrice = _tokenPrice;
    }

    function multiply(uint256 x,uint256 y) internal pure returns(uint256 z) {
        require(y==0 || (z= x*y)/y==x);
    }
  

    function buyTokens(uint256 numberOfTokens)public payable {
       require(msg.value == multiply(numberOfTokens,tokenPrice));
       require(tokenContract.balanceOf(address(this))>=numberOfTokens);
       require(tokenContract.transfer(msg.sender,numberOfTokens));

       tokenSold += numberOfTokens;

       emit Sell(msg.sender,numberOfTokens);

    }

} 