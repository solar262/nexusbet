// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.usdc"; // Pseudo import, we'll interface it directly below for simplicity

interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function transfer(address recipient, uint256 amount) external returns (bool);
}

contract BettingEscrow {
    address public owner;
    address public treasury;
    uint256 public feeBasisPoints; // e.g., 250 = 2.5%
    IERC20 public usdcToken;

    struct Bet {
        string betId; // Ties back to our Prisma DB
        address maker;
        address taker;
        uint256 makerStake;
        uint256 takerStake;
        bool isMatched;
        bool isResolved;
    }

    mapping(string => Bet) public bets;

    event BetCreated(string betId, address maker, uint256 makerStake);
    event BetMatched(string betId, address taker, uint256 takerStake);
    event BetResolved(string betId, address winner, uint256 payout, uint256 feeTaken);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner (Oracle) can call this");
        _;
    }

    constructor(address _usdcToken, address _treasury, uint256 _feeBasisPoints) {
        owner = msg.sender;
        treasury = _treasury;
        feeBasisPoints = _feeBasisPoints;
        usdcToken = IERC20(_usdcToken);
    }

    // 1. Maker creates the bet and locks their USDC
    function createBet(string memory _betId, uint256 _makerStake) external {
        require(bets[_betId].maker == address(0), "Bet already exists");
        
        // Transfer USDC from Maker to this Escrow Contract
        require(usdcToken.transferFrom(msg.sender, address(this), _makerStake), "USDC transfer failed");

        bets[_betId] = Bet({
            betId: _betId,
            maker: msg.sender,
            taker: address(0),
            makerStake: _makerStake,
            takerStake: 0,
            isMatched: false,
            isResolved: false
        });

        emit BetCreated(_betId, msg.sender, _makerStake);
    }

    // 2. Taker accepts the bet and locks their USDC
    function matchBet(string memory _betId, uint256 _takerStake) external {
        Bet storage bet = bets[_betId];
        require(bet.maker != address(0), "Bet does not exist");
        require(!bet.isMatched, "Bet is already matched");

        require(usdcToken.transferFrom(msg.sender, address(this), _takerStake), "USDC transfer failed");

        bet.taker = msg.sender;
        bet.takerStake = _takerStake;
        bet.isMatched = true;

        emit BetMatched(_betId, msg.sender, _takerStake);
    }

    // 3. Oracle (Our Server) resolves the bet, takes the fee, and pays the winner
    function resolveBet(string memory _betId, address _winner) external onlyOwner {
        Bet storage bet = bets[_betId];
        require(bet.isMatched, "Bet must be matched to resolve");
        require(!bet.isResolved, "Bet already resolved");
        require(_winner == bet.maker || _winner == bet.taker, "Winner must be maker or taker");

        bet.isResolved = true;

        uint256 totalPool = bet.makerStake + bet.takerStake;
        
        // Calculate our platform fee!
        uint256 fee = (totalPool * feeBasisPoints) / 10000;
        uint256 payout = totalPool - fee;

        // Send Fee to our Treasury
        require(usdcToken.transfer(treasury, fee), "Fee transfer failed");
        
        // Send Payout to Winner
        require(usdcToken.transfer(_winner, payout), "Payout transfer failed");

        emit BetResolved(_betId, _winner, payout, fee);
    }

    // 4. Emergency / Dispute Resolution
    // If a game is cancelled, postponed, or disputed, the Admin can refund the users.
    function emergencyRefund(string memory _betId) external onlyOwner {
        Bet storage bet = bets[_betId];
        require(!bet.isResolved, "Bet already resolved");
        require(bet.maker != address(0), "Bet does not exist");

        bet.isResolved = true; // Mark as resolved so it can't be interacted with again

        // Refund Maker
        if (bet.makerStake > 0) {
            require(usdcToken.transfer(bet.maker, bet.makerStake), "Maker refund failed");
        }
        
        // Refund Taker if matched
        if (bet.isMatched && bet.takerStake > 0) {
            require(usdcToken.transfer(bet.taker, bet.takerStake), "Taker refund failed");
        }
    }
}
