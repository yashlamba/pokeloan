// SPDX-License-Identifier: Unlicensed

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";

contract PokeLoan is Ownable {
    address public pokecoin = 0x5FbDB2315678afecb367f032d93F642f64180aa3;
    uint256 public interest;
    uint256 public ethToPoke = 10;

    constructor(uint256 _interest) {
        require(_interest > 0, "Invalid Interest");
        interest = _interest;
    }

    function pokeBalance() external view returns (uint256) {
        IERC20 token = IERC20(pokecoin);
        uint256 balance = token.balanceOf(address(this));
        return balance;
    }

    event Borrow(
        address indexed borrower,
        uint256 amount,
        uint256 issue_amount,
        uint256 timestamp
    );

    function borrow() external payable {
        uint256 amount = msg.value;
        IERC20 token = IERC20(pokecoin);
        uint256 balance = token.balanceOf(address(this));
        uint256 issue_amount = amount * ethToPoke;

        require(
            amount > 0 && issue_amount <= balance,
            "Don't have enough PokeStable"
        );

        token.transfer(msg.sender, issue_amount);

        emit Borrow(msg.sender, amount, issue_amount, block.timestamp);
    }

    event Repay(
        address indexed borrower,
        uint256 amount,
        uint256 repay_amount,
        uint256 timestamp
    );

    function repay(uint256 _amount) external {
        uint256 repayAmount = ((_amount - ((_amount * interest) / 100)) /
            ethToPoke);

        require(
            address(this).balance >= repayAmount,
            "Insufficient ETH Balance"
        );

        IERC20 token = IERC20(pokecoin);
        // token.approve(msg.sender, _amount);
        token.transferFrom(msg.sender, address(this), _amount);
        payable(msg.sender).transfer(repayAmount);

        emit Repay(msg.sender, _amount, repayAmount, block.timestamp);
    }
}
