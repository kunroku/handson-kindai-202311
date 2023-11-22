const iost = require('./iost');
const MyContract = require("./contract");

(async function () {
  const address = new MyContract(iost.createTransaction()).id;
  iost.rpc.getContractStorage(address, "msg", null).then(({ data }) => {
    console.log(data);
  });
})();
