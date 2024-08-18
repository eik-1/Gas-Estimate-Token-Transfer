const { ethers, run, network } = require("hardhat");
const getCCIPConfig = require("../ccip.config");

async function deployAndVerifyReceiver() {
  const { router, cometAddress, usdcToken } = getCCIPConfig(network.name);
  const fauceteer = "0x68793eA49297eB75DFB4610B68e076D2A5c7646C";

  console.log(`Deploying SwapTestnetUSDC contract first on ${network.name}...`);
  const SwapTestnetUSDC = await ethers.getContractFactory("SwapTestnetUSDC");
  const swapTestnetUSDC = await SwapTestnetUSDC.deploy(
    usdcToken,
    usdcToken,
    fauceteer
  );
  await swapTestnetUSDC.waitForDeployment();

  const swapTestnetUSDCAddress = await swapTestnetUSDC.getAddress();

  console.log("SwapTestnetUSDC contract deployed at:", swapTestnetUSDCAddress);

  console.log(`Deploying Receiver contract on ${network.name}...`);
  const Receiver = await ethers.getContractFactory("CrossChainReceiver");
  const receiver = await Receiver.deploy(
    router,
    cometAddress,
    swapTestnetUSDCAddress
  );
  await receiver.waitForDeployment();

  let tx = receiver.deploymentTransaction();
  if (tx) {
    console.log("wait for 5 blocks");
    await tx.wait(5);
    const receiverAddress = await receiver.getAddress();
    console.log("Receiver contract deployed at:", receiverAddress);

    console.log("Allowlisting sourceChain on Receiver contract...");
    tx = await receiver.allowlistSourceChain("14767482510784806043", true);
    await tx.wait(5);

    console.log("Allowlisting sender on Receiver contract...");
    tx = await receiver.allowlistSender(
      "0x28e90E7B71D51cd619F57326ec703F05c6fa8f3e",
      true
    );
    await tx.wait(5);

    console.log(`Verifying Receiver contract on ${network.name}...`);
    try {
      await run("verify:verify", {
        address: receiverAddress,
        constructorArguments: [router, cometAddress, swapTestnetUSDCAddress],
      });
      console.log(`Receiver contract verified on ${network.name}!`);
    } catch (error) {
      console.error("Error verifying Receiver contract:", error);
    }
  }
}

deployAndVerifyReceiver()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment script encountered an error:", error);
    process.exit(1);
  });
