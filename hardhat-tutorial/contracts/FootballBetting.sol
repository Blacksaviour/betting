// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FootballBetting {
    address public owner;
    uint public balance;

    enum Team {
        TeamA,
        TeamB 
    }
    struct Bet {
        Team team;
        uint amount;
    }

    mapping(address => Bet) public bets;

    event BetPlaced(address indexed user, Team team, uint amount);

    constructor() {
        owner = msg.sender;
    }
function placeBet(Team _team) public payable {
    require(msg.value >= 1e15 wei && msg.value <=  5e15 wei , "Invalid bet amount");
    bets[msg.sender] = Bet(_team, msg.value);
    balance += msg.value;
    payable(address(this)).transfer(msg.value);
    emit BetPlaced(msg.sender, _team, msg.value);
}

    function withdraw() public {
        require(msg.sender == owner, "Only the owner can withdraw");
        payable(owner).transfer(balance);
        balance = 0;
    }
}

