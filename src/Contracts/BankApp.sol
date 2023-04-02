// SPDX-License-Identifier: UNLICENSED  

pragma solidity ^0.8.0;
contract BankApp{
    mapping (address=>uint256) UserAccount; 
    mapping (address=>bool) UserExists;
    
    function createAcc() public returns (bool)
    {
        require(UserExists[msg.sender]==false,'User already Exists'); UserExists[msg.sender]=true; return true;
    }
    function transferEther(address payable reciever, uint256 transferAmount) public payable{    
        require((UserExists[reciever]== true)&&(UserExists[msg.sender]== true)&&(transferAmount>0)); require( transferAmount < UserAccount[msg.sender] );
        UserAccount[msg.sender] = UserAccount[msg.sender] - transferAmount;
        UserAccount[reciever]+= transferAmount;
        
    }

    function deposit() public payable
    {
        UserAccount[msg.sender] = UserAccount[msg.sender] + msg.value;
    }


   
   


   
}