const { ContractInterface } = require('@iost/client');
const { address } = require('../config/contract.json');

if (!address) {
  throw new Error("contract not deloyed");
}

class MyContract extends ContractInterface {
  get id() {
    return address;
  }
  hello() {
    this.call('hello', []);
  }
  change(msg) {
    this.call('change', [msg]);
  }
}

module.exports = MyContract;
