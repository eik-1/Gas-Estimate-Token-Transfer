const networks = {
  sepolia: {
    router: "0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59",
    chainSelector: "16015286601757825753",
    linkToken: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
    usdcToken: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
    cometAddress: "0xAec1F48e02Cfb822Be958B68C7957156EB3F0b6e",
  },
  avalancheFuji: {
    router: "0xF694E193200268f9a4868e4Aa017A0118C9a8177",
    chainSelector: "14767482510784806043",
    linkToken: "0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846",
    usdcToken: "0x5425890298aed601595a70ab815c96711a31bc65",
  },
};

function getCCIPConfig(network) {
  if (networks[network]) {
    return networks[network];
  }
  throw new Error("Unknown network: " + network);
}

module.exports = getCCIPConfig;
