const { Ed25519, Bs58, OfficialContracts } = require("@iost/client");
const fs = require("fs");
const iost = require("./iost");
const wallet = require("./wallet");
const parse_args = require("./parse_args");

(async function () {
  const { id } = parse_args({
    id: (value) => {
      return value;
    }
  });

  const kp = Ed25519.randomKeyPair();
  const tx = iost.createTransaction({ gasLimit: 500000 });
  await iost.setServerTimeDiff();
  tx.setTime(1000, 0, iost.serverTimeDiff);
  const contracts = new OfficialContracts(tx);
  contracts.auth.signUp(id, Bs58.encode(kp.pubkey), Bs58.encode(kp.pubkey));
  contracts.gas.pledge(wallet.accounts[0], id, "3000");
  contracts.ram.buy(wallet.accounts[0], id, 4096);
  contracts.token.transfer("iost", wallet.accounts[0], id, "10000", "initial transfer");
  tx.addApprove("*");
  iost.sign(wallet, tx, wallet.accounts[0], []);
  iost.send(tx, { irreversible: true })
    .on("pending", (res) => {
      console.log(res.hash);
    })
    .on("irreversible", (res) => {
      console.log(res.transaction.tx_receipt);
      if (res.transaction.tx_receipt.status_code === "SUCCESS") {
        const fileName = `${__dirname}/../config/accounts.json`;
        const data = require(fileName);
        data.push({ name: id, seckey: Bs58.encode(kp.seckey) });
        fs.writeFileSync(fileName, JSON.stringify(data, null, 2), "utf-8");  
      }
    })
    .on("failed", (res) => {
      console.log(res);
    });
})();
