pragma solidity ^0.5.0;


contract TejTaraToken {

  string public name="TejTara Token";
  string public symbol="TejTara";
  string public standard="TejTara version 1.0";

  uint256 public totalSupply;
  mapping(address=>uint256) public balanceOf;
  mapping(address=>mapping(address=>uint256)) public allowance;

  event Transfer(address indexed from,address indexed to,uint256 value);
  event Approval(address indexed owner,address indexed spender,uint256 value);
   

  constructor(uint256 initialSupply) public {
        balanceOf[msg.sender]=initialSupply;
        totalSupply=initialSupply;
   }

   function transfer(address to,uint256 value) public returns(bool sucess){
       require(balanceOf[msg.sender]>=value);
       balanceOf[msg.sender] -= value;
       balanceOf[to] += value;
   
     emit Transfer(msg.sender,to,value);

     return true;

   }

  function approval(address spender,uint256 value) public returns(bool sucess) {

      allowance[msg.sender][spender]=value;
   
     emit Approval(msg.sender,spender,value);
    return true;
  }

  function transferFrom(address from,address to,uint256 value) public returns(bool sucess){

    balanceOf[from] -=value;
    balanceOf[to] +=value;

    allowance[msg.sender][from] -=value;

     emit Transfer(from,to,value);
    return true;
  }


}
