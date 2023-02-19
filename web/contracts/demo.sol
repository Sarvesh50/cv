//SPDX-Licence-Identifier: UNLICENCED

pragma solidity 0.8.18;

contract demo{
    uint number;
    function set(uint num) public{
        number = num+1;
    }
    function get() public returns(uint){
        return number;
    }
    
}