//SPDX-Licence-Identifier: UNLICENCED

pragma solidity 0.8.18;

contract demo{
    uint number;
    function set(uint num) public{
        number = num+2;
    }
    function get() public returns(uint){
        return number;
    }
    
}