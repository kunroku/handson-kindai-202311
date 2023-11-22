const iost = require('./iost');
const parse_args = require('./parse_args');

(async function () {
  const { id } = parse_args({
    id: value => value
  });

  iost.rpc.getBalance(id).then((res) => {
    console.log(res.balance);
  });
})();
