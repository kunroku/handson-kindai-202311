const iost = require("./iost");
const MyContract = require("./contract");
const wallet = require("./wallet");
const parse_args = require("./parse_args");

(async function () {
  const { msg } = parse_args({
    msg: (value) => {
      return value;
    }
  });
  
  const tx = iost.createTransaction({ gasLimit: 500000 });
  await iost.setServerTimeDiff();
  tx.setTime(1000, 0, iost.serverTimeDiff);

  const contract = new MyContract(tx);
  contract.change(msg);

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
