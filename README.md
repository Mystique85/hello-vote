# 🚀 Hello Vote

Hello Vote is a decentralized voting system (DApp) running on the **Celo** blockchain.  
It allows users to create polls, vote, and earn rewards in **VOTE** tokens.

---

## ✨ DApp Features

- 📝 Create polls  
- 🗳️ Vote in polls  
- 📊 View poll results  
- 🎁 Earn rewards as a participant or poll creator  

---

## 🔗 Contract

- **Contract Address:** `0xd12B01c658c4B563ACaDfC84997ea8270afdDd64`  
- **CeloScan:** [View on CeloScan](https://celoscan.io/address/0xd12b01c658c4b563acadfc84997ea8270afddd64#code)

---

## 🪙 VOTE Token

- Symbol: **VOTE**  
- Full Name: **VoteToken**  
- Decimals: 18  
- Maximum Supply: 20,000,000,000 VOTE  
- Reward per vote: 100 VOTE  
- Creator reward every 10 polls created: 10,000 VOTE  

---

## 📜 Full Overview of HelloVoteV3 Contract

The **HelloVoteV3.sol** contract implements the **VOTE** token and the poll system logic:

### Polls

- Each poll has a title, creator, creation time, end time, and list of options  
- Polls last 7 days (`POLL_DURATION`)  
- Users can create up to 20 polls per day (`MAX_DAILY_POLLS_PER_USER`)  
- Each poll must have between 2 and 10 options  
- When a poll ends, a `PollEnded` event is emitted  

### Voting

- Each user can vote only once per poll  
- Every vote gives the voter `rewardPerVote` tokens  
- `Voted` event is emitted for each vote  

### Creator Rewards

- Every 10 polls created by a user gives them `CREATOR_REWARD_PER_10` tokens  
- Rewards are stored in `pendingCreatorRewards` and can be claimed via `claimCreatorReward()`  

### VOTE Token

- Implements standard ERC20 functions: `transfer`, `approve`, `transferFrom`  
- Maximum supply: `MAX_SUPPLY = 20,000,000,000 VOTE`  
- Owner can mint tokens manually  

### Administrative Functions

- `pause()` / `unpause()` – pause or resume contract operations  
- `setRewardPerVote(uint256)` – update vote reward amount  
- `ownerMint(address, uint256)` – manually mint tokens  

### Events

- `Transfer` and `Approval` – standard ERC20 events  
- `PollCreated` – poll creation  
- `PollEnded` – poll ended  
- `Voted` – vote cast  
- `CreatorRewardMinted` – creator reward claimed  

---

Hello Vote enables easy poll creation and rewards active participants and poll creators, fully on the Celo blockchain.
