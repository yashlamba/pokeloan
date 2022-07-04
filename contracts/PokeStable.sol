// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract PokeStable is ERC20 {
    constructor(uint256 initialSupply) ERC20("PokeStable", "PKS") {
        _mint(msg.sender, initialSupply);
    }
}
