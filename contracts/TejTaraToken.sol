pragma solidity ^0.5.0;


contract TejTaraToken {

  string public name="TejTara Token";
  string public symbol="TejTara";
  string public standard="TejTara version 1.0";

  uint256 public totalSupply;
  mapping(address=>uint256) public balanceOf;

  event transferEvent(address indexed from,address indexed to,uint256 value);
   

  constructor(uint256 initialSupply) public {
        balanceOf[msg.sender]=initialSupply;
        totalSupply=initialSupply;
   }

   function transfer(address to,uint256 value) public returns(uint256 sucess){
       require(balanceOf[msg.sender]>=value);
       balanceOf[msg.sender] -= value;
       balanceOf[to] += value;
   
     emit transferEvent(msg.sender,to,value);

   }

}
