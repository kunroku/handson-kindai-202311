const { Wallet, Account, Ed25519, Bs58 } = require("@iost/client");
const accounts = require("../config/accounts.json");

const wallet = new Wallet(
  accounts.map((account) =>
    new Account(account.name)
      .addKeyPair("active", Ed25519.fromSecretKey(Bs58.decode(account.seckey)))
  ),
);

module.exports = wallet;
