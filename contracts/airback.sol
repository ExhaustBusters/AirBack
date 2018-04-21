pragma solidity ^0.4.16;

contract AirBack {
    uint pollution;
    address public oracle;

    function AirBack() public {
        oracle = msg.sender;
    }

    function add_pollution(uint plt) public {
        pollution = pollution + plt;
    }

    function get_pollution() public view returns (uint plt){
        plt = pollution;
    }
}