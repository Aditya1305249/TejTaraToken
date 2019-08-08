pragma solidity ^0.5.0;

import './TejTaraToken.sol';
contract  TejTaraTokenSale {
    
    address admin;
    TejTaraToken public tokenContract;
    uint256 public tokenPrice;

    constructor( TejTaraToken _address,uint256 _tokenPrice) public {
        admin=msg.sender;
        tokenContract= _address;
        tokenPrice = _tokenPrice;
    }
} 