/**
 *Submitted for verification at celoscan.io on 2025-10-17
*/

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract HelloVoteV3 {
    string public name = "VoteToken";
    string public symbol = "VOTE";
    uint8 public decimals = 18;
    uint256 public totalSupply;
    uint256 public constant MAX_SUPPLY = 20_000_000_000 * 10**18;
    uint256 public rewardPerVote = 100 * 10**18;
    uint256 public constant CREATOR_REWARD_PER_10 = 10_000 * 10**18;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    address public owner;
    bool public paused;
    uint256 private _status;
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;

    struct Poll {
        string title;
        address creator;
        uint256 createdAt;
        uint256 endTime;
        bool ended;
        string[] options;
        uint256[] votes;
        mapping(address => bool) hasVoted;
    }

    mapping(uint256 => Poll) private polls;
    uint256 public pollCount;

    mapping(address => uint256) public dailyPollsCreated;
    mapping(address => uint256) public lastPollTimestamp;
    mapping(address => uint256) public totalPollsCreated;
    mapping(address => uint256) public pendingCreatorRewards;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event PollCreated(uint256 indexed pollId, string title, uint256 endTime, address creator);
    event PollEnded(uint256 indexed pollId, string title);
    event Voted(uint256 indexed pollId, uint256 indexed optionIndex, address indexed voter, uint256 reward);
    event CreatorRewardMinted(address indexed creator, uint256 totalPollsCreated, uint256 rewardAmount);

    modifier onlyOwner() { require(msg.sender == owner, "Not owner"); _; }
    modifier whenNotPaused() { require(!paused, "Paused"); _; }
    modifier nonReentrant() { require(_status != _ENTERED, "Reentrant"); _status = _ENTERED; _; _status = _NOT_ENTERED; }

    uint256 public constant MAX_DAILY_POLLS_PER_USER = 20;
    uint256 public constant POLL_DURATION = 7 days;

    constructor() {
        owner = msg.sender;
        _status = _NOT_ENTERED;
    }

    function _mint(address to, uint256 amount) internal {
        require(totalSupply + amount <= MAX_SUPPLY, "Max supply");
        totalSupply += amount;
        balanceOf[to] += amount;
        emit Transfer(address(0), to, amount);
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");
        unchecked { balanceOf[msg.sender] -= amount; balanceOf[to] += amount; }
        emit Transfer(msg.sender, to, amount);
        return true;
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        require(balanceOf[from] >= amount, "Insufficient balance");
        require(allowance[from][msg.sender] >= amount, "Allowance exceeded");
        unchecked {
            allowance[from][msg.sender] -= amount;
            balanceOf[from] -= amount;
            balanceOf[to] += amount;
        }
        emit Transfer(from, to, amount);
        return true;
    }

    function createPoll(string memory _title, string[] memory _options) external whenNotPaused returns (uint256) {
        if (block.timestamp - lastPollTimestamp[msg.sender] >= 1 days) {
            dailyPollsCreated[msg.sender] = 0;
            lastPollTimestamp[msg.sender] = block.timestamp;
        } else if (lastPollTimestamp[msg.sender] == 0) {
            lastPollTimestamp[msg.sender] = block.timestamp;
        }

        require(dailyPollsCreated[msg.sender] < MAX_DAILY_POLLS_PER_USER, "Daily limit");
        require(bytes(_title).length > 0, "Empty title");
        require(_options.length >= 2 && _options.length <= 10, "2-10 options");

        Poll storage p = polls[pollCount];
        p.title = _title;
        p.creator = msg.sender;
        p.createdAt = block.timestamp;
        p.endTime = block.timestamp + POLL_DURATION;
        p.ended = false;

        for (uint256 i = 0; i < _options.length; i++) {
            p.options.push(_options[i]);
            p.votes.push(0);
        }

        dailyPollsCreated[msg.sender]++;
        totalPollsCreated[msg.sender]++;

        if (totalPollsCreated[msg.sender] % 10 == 0) {
            uint256 rewardAmount = CREATOR_REWARD_PER_10;
            if (totalSupply + rewardAmount > MAX_SUPPLY) rewardAmount = MAX_SUPPLY - totalSupply;
            if (rewardAmount > 0) pendingCreatorRewards[msg.sender] += rewardAmount;
        }

        emit PollCreated(pollCount, _title, p.endTime, msg.sender);
        pollCount++;
        return pollCount - 1;
    }

    function vote(uint256 _pollId, uint256 _optionIndex) external whenNotPaused nonReentrant {
        require(_pollId < pollCount, "Poll not found");
        Poll storage p = polls[_pollId];

        if (!p.ended && block.timestamp >= p.endTime) {
            p.ended = true;
            emit PollEnded(_pollId, p.title);
        }

        require(!p.ended, "Poll ended");
        require(_optionIndex < p.options.length, "Invalid option");
        require(!p.hasVoted[msg.sender], "Already voted");

        p.votes[_optionIndex]++;
        p.hasVoted[msg.sender] = true;

        uint256 reward = rewardPerVote;
        if (totalSupply + reward > MAX_SUPPLY) reward = MAX_SUPPLY - totalSupply;
        if (reward > 0) _mint(msg.sender, reward);

        emit Voted(_pollId, _optionIndex, msg.sender, reward);
    }

    function claimCreatorReward() external whenNotPaused nonReentrant {
        uint256 reward = pendingCreatorRewards[msg.sender];
        require(reward > 0, "No reward");
        require(totalSupply + reward <= MAX_SUPPLY, "Exceeds max supply");
        pendingCreatorRewards[msg.sender] = 0;
        _mint(msg.sender, reward);
        emit CreatorRewardMinted(msg.sender, totalPollsCreated[msg.sender], reward);
    }

    function getPollOptionsWithVotes(uint256 _pollId) external view returns (string[] memory optionNames, uint256[] memory voteCounts) {
        require(_pollId < pollCount, "Poll not found");
        Poll storage p = polls[_pollId];
        optionNames = new string[](p.options.length);
        voteCounts = new uint256[](p.votes.length);
        for (uint256 i = 0; i < p.options.length; i++) {
            optionNames[i] = p.options[i];
            voteCounts[i] = p.votes[i];
        }
    }

    function hasUserVoted(uint256 _pollId, address _user) external view returns (bool) {
        require(_pollId < pollCount, "Poll not found");
        return polls[_pollId].hasVoted[_user];
    }

    function getPollInfo(uint256 _pollId) external view returns (string memory title, address creator, bool ended, uint256 endTime, uint256 totalVotes) {
        require(_pollId < pollCount, "Poll not found");
        Poll storage p = polls[_pollId];
        uint256 sumVotes = 0;
        for (uint256 i = 0; i < p.votes.length; i++) sumVotes += p.votes[i];
        return (p.title, p.creator, p.ended, p.endTime, sumVotes);
    }

    // Admin
    function pause() external onlyOwner { paused = true; }
    function unpause() external onlyOwner { paused = false; }
    function setRewardPerVote(uint256 _amount) external onlyOwner { rewardPerVote = _amount; }
    function ownerMint(address _to, uint256 _amount) external onlyOwner { _mint(_to, _amount); }
}