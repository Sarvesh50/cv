// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Dappazon {
    struct Item{
        uint id;
        string name;
        string category;
        string image;
        uint cost;
        uint rating ;
        uint stock;
    }
    struct Order{
        uint time;
        Item item;
    }
    address public owner;
    mapping(uint => Item) public items;
    mapping(address  => uint) public orderCount;
    mapping(address  => mapping(uint  => Order)) public orders;
    
    modifier onlyOwner(){
        // owner only can call this function
        require(msg.sender == owner);
        _;    // this represent require will execite first before function logic    
    }
    event List(string name,uint cost,uint quantity);
    event Buy(address buyer,uint orderId,uint itemId);
    constructor() {
    owner = msg.sender;
    }

    function productList(
        uint id,string memory name,
        string memory category,string memory image,
        uint cost,uint rating ,uint stock) public onlyOwner{
            Item memory item = Item(id,name,category,image,cost,rating,stock);
            items[id] = item;
            //Emit an event
            emit List(name,cost,stock);
    }

    function buy(uint id) public payable{
        //fetch item
        Item memory item = items[id];

        // require enough ehter to buy items
        require(msg.value >= item.cost);
        require(item.stock > 0);
        // create an order
        Order memory order = Order(block.timestamp , item);

        //save order to chain
        orderCount[msg.sender]++;
        orders[msg.sender][orderCount[msg.sender]] = order;

        //Subtract stock
        items[id].stock = item.stock - 1; 
        emit Buy(msg.sender, orderCount[msg.sender] , item.id);
    }
    //withdraw funds
    function withdraw() public onlyOwner{
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success);
    }
}
