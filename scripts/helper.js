const fs = require("fs");

async function createOrUpdateConfigFile(
  network,
  { senderAddress, receiverAddress }
) {
  const deployedContracts = "./scripts/generatedData.json";
  let config = {};

  if (fs.existsSync(deployedContracts)) {
    const configFileData = fs.readFileSync(deployedContracts, "utf-8");
    config = JSON.parse(configFileData);

    config[network] = config[network] || {};
    if (senderAddress) config[network].sender = senderAddress;
    if (receiverAddress) config[network].receiver = receiverAddress;
  } else {
    if (senderAddress) {
      config = {
        [network]: {
          sender: senderAddress,
        },
      };
    }
    if (receiverAddress) {
      config = {
        [network]: {
          receiver: receiverAddress,
        },
      };
    }
  }
  console.log("Writing to config file:", deployedContracts, config);
  fs.writeFileSync(deployedContracts, JSON.stringify(config, null, 2));
}

module.exports = {
  createOrUpdateConfigFile,
};
