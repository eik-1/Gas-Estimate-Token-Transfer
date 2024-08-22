# Sample Hardhat Project

This is for CCIP Bootcamp Homework Day#3

You have to fill in the environment variables from `.env.example`
Then run the `sendMessage.js` script
```
npx hardhat run .\scripts\sendMessage.js --network avalancheFuji
```

## Output
```
Estimating gas for transferUsdc() on TransferUSDC contract from avalancheFuji
Estimated gas: 418479
Calling transferUsdc() on TransferUSDC contract from avalancheFuji
Transaction hash: 0x203e981a4939ad8a8e6791bf4c647debe39e3505c1147d1951cbd1934911e2ab
Waiting for transaction confirmation...
Transaction confirmed
MessageId: 0x2d13a59e6154f15bf067b1958782f7df8528b3a77a240f16090c1252cb5d8aad
```

