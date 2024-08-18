const { ethers, run, network } = require("hardhat");
const getCCIPConfig = require("../ccip.config");

async function deployAndVerifySender() {
  const { router, linkToken, usdcToken } = getCCIPConfig(network.name);

  console.log(`Deploying Sender contract on ${network.name}...`);
  const Sender = await ethers.getContractFactory("TransferUSDC");
  const sender = await Sender.deploy(router, linkToken, usdcToken);
  await sender.waitForDeployment();

  let tx = sender.deploymentTransaction();
  if (tx) {
    console.log("wait for 20 blocks");
    await tx.wait(20);

    const senderAddress = await sender.getAddress();
    console.log("Sender contract deployed at:", senderAddress);

    console.log("Allowlisting destination chain on TransferUSDC contract...");
    tx = await sender.allowlistDestinationChain("16015286601757825753", true);
    await tx.wait(20);

    console.log(`Verifying Sender contract on ${network.name}...`);
    try {
      await run("verify:verify", {
        address: senderAddress,
        constructorArguments: [router, linkToken, usdcToken],
      });
      console.log(`Sender contract verified on ${network.name}!`);
    } catch (error) {
      console.error("Error verifying Sender contract:", error);
    }
  }
}

deployAndVerifySender()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment script encountered an error:", error);
    process.exit(1);
  });
