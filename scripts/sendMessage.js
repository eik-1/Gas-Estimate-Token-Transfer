const { ethers } = require("hardhat");
const getCCIPConfig = require("../ccip.config");

async function sendCCIPMessage() {
  const sepoliaConfig = getCCIPConfig("sepolia");

  const generatedContracts = {
    transferUsdcSender: "0x28e90E7B71D51cd619F57326ec703F05c6fa8f3e",
    crossChainReceiver: "0xad4c0A3434a9448E8C400B5D53A618186Cb56A08",
  };

  const transferUSDCAddress = generatedContracts.transferUsdcSender;
  const crossChainReceiverAddress = generatedContracts.crossChainReceiver;

  const transferUSDC = await ethers.getContractAt(
    "TransferUSDC",
    transferUSDCAddress
  );

  console.log(
    "Estimating gas for transferUsdc() on TransferUSDC contract from avalancheFuji"
  );

  // Estimate gas
  const gasEstimate = await transferUSDC.transferUsdc.estimateGas(
    sepoliaConfig.chainSelector,
    crossChainReceiverAddress,
    1000000,
    500000 // 500,000 gas limit (Value Hardcoded)
  );

  console.log(`Estimated gas: ${gasEstimate.toString()}`);
  // Estimated gas: 418479
  // Adding 10% buffer to the gas estimate: 418479 + 41847 = 460326

  const gasLimit = (gasEstimate * BigInt(110)) / BigInt(100);

  console.log(
    "Calling transferUsdc() on TransferUSDC contract from avalancheFuji"
  );
  let tx = await transferUSDC.transferUsdc(
    sepoliaConfig.chainSelector,
    crossChainReceiverAddress,
    1000000,
    gasLimit
  );
  console.log(`Transaction hash: ${tx.hash}`);

  console.log("Waiting for transaction confirmation...");
  const receipt = await tx.wait(10);
  console.log("Transaction confirmed");

  //Getting the messageId
  const usdcTransferredEvent = receipt.logs.find(
    (log) => log.eventName === "UsdcTransferred"
  );

  if (usdcTransferredEvent) {
    const messageId = usdcTransferredEvent.args.messageId;
    console.log(`MessageId: ${messageId}`);
  } else {
    console.log("UsdcTransferred event not found in the transaction logs");
  }
}

sendCCIPMessage()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment script encountered an error:", error);
    process.exit(1);
  });

/* CONSOLE OUTPUT
Estimating gas for transferUsdc() on TransferUSDC contract from avalancheFuji
Estimated gas: 418479
Calling transferUsdc() on TransferUSDC contract from avalancheFuji
Transaction hash: 0x203e981a4939ad8a8e6791bf4c647debe39e3505c1147d1951cbd1934911e2ab
Waiting for transaction confirmation...
Transaction confirmed
MessageId: 0x2d13a59e6154f15bf067b1958782f7df8528b3a77a240f16090c1252cb5d8aad
*/
