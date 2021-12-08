# Token distributor

Contract to distribute token using merkle proof

# Setup

- Cài đặt môi trường `yarn install`
- Cập nhật danh sách người dùng whitelist (e.g Angel.json.example)
- Thay đổi thông tin môi trường
```
PRIVATE_KEY (Khóa private của ví deployer)
CREATOR_DISTR_TOKEN_ADDRESS (Địa chỉ của SmartContract của reward token)

CREATOR_DISTR_ANGLE_START_TIME (Thời gian bắt đầu round)
CREATOR_DISTR_ANGLE_END_TIME (Thời gian kết thúc round)
CREATOR_DISTR_ANGLE_CLIFF_DURATION (Khoảng thời gian cliff)
CREATOR_DISTR_ANGLE_TGE (Phần trăm TGE)

ETHERSCAN_KEY (Key etherscan)
```
- Generate Merkleroot theo danh sách whitelist
`yarn generate-merkle-proof`
- Deploy TokenLockerCliff (Vesting tool smart contract)
`yarn hardhat run script/deploy/deploy-angel.js --network bsc`
- Verify TokenLockerCliff
`yarn hardhat verify {sc address} {CREATOR_DISTR_TOKEN_ADDRESS} {CREATOR_DISTR_ANGLE_START_TIME} {CREATOR_DISTR_ANGLE_END_TIME} {CREATOR_DISTR_ANGLE_CLIFF_DURATION} {CREATOR_DISTR_ANGLE_TGE} {MerkleRoot}`


Buy me a coffee: 0x2a9DC479b3fCC0F7904096c9dD888aAAdeDcdbA5 (Ethereum, BSC)
