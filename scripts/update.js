const fs = require("fs");
const { generateContractABI, OfficialContracts } = require("@iost/client");
const iost = require("./iost");
const wallet = require("./wallet");

(async function () {
  const contractConfigFile = `${__dirname}/../config/contract.json`;
  const { address } = require(contractConfigFile);
  if (!address) {
    throw new Error("contract not deloyed");
  }
  const source = fs.readFileSync(`${__dirname}/../contract/Contract.js`, "utf-8");
  const abi = generateContractABI(source);

  const tx = iost.createTransaction({ gasLimit: 500000 });
  await iost.setServerTimeDiff();
  tx.setTime(1000, 0, iost.serverTimeDiff);

  const contracts = new OfficialContracts(tx);
  contracts.system.updateCode(source, abi, address, "");

  iost.sign(wallet, tx, wallet.accounts[1], []);
  iost.send(tx, { irreversible: true })
    .on("pending", (res) => {
      console.log(res.hash);
    })
    .on("irreversible", (res) => {
      console.log(res.transaction.tx_receipt);
    })
    .on("failed", (res) => {
      console.log(res);
    });
})();
