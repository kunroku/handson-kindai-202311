const fs = require("fs");
const { generateContractABI, OfficialContracts } = require('@iost/client');
const iost = require("./iost");
const wallet = require("./wallet");

(async function () {
  const contractConfigFile = `${__dirname}/../config/contract.json`;
  const { address } = require(contractConfigFile);
  if (address !== null) {
    throw new Error("contract already deloyed");
  }
  const source = fs.readFileSync(`${__dirname}/../contract/Contract.js`, 'utf-8');
  const abi = generateContractABI(source);

  const tx = iost.createTransaction({ gasLimit: 500000 });
  await iost.setServerTimeDiff();
  tx.setTime(1000, 0, iost.serverTimeDiff);

  const contracts = new OfficialContracts(tx);
  contracts.system.setCode(source, abi);

  iost.sign(wallet, tx, wallet.accounts[1], []);
  iost.send(tx, { irreversible: true })
    .on("pending", (res) => {
      console.log(res.hash);
    })
    .on("irreversible", (res) => {
      console.log(res.transaction.tx_receipt);
      if (res.transaction.tx_receipt.status_code === "SUCCESS") {
        const address = JSON.parse(res.transaction.tx_receipt.returns[0])[0];
        fs.writeFileSync(
          contractConfigFile,
          JSON.stringify({ address: address }, null, 2),
          "utf-8",
        );  
      }
    })
    .on("failed", (res) => {
      console.log(res);
    });
})();
