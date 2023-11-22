const { OfficialContracts } = require("@iost/client");
const iost = require("./iost");
const wallet = require("./wallet");
const parse_args = require("./parse_args");


(async function () {
  const { amount } = parse_args({
    amount: (value) => {
      if (Number.isNaN(Number(value))) {
        throw new Error("amount is required number type");
      }
      return value;
    }
  });

  const tx = iost.createTransaction({ gasLimit: 500000 });
  await iost.setServerTimeDiff();
  tx.setTime(1000, 0, iost.serverTimeDiff);

  const contracts = new OfficialContracts(tx);
  contracts.gas.pledge(wallet.accounts[0], wallet.accounts[1], amount);
  tx.addApprove("*");

  iost.sign(wallet, tx, wallet.accounts[0], []);
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
