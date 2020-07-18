const Block = require('./Block');
const blockChain = require('./index');

const Block1 = new Block('saldjasld', 'kasjhdkasd', new Date(), 'Mukund');
console.log('=================>>>>>>>>', Block1.toString());
console.log('==============((((())))', Block.genesis().toString());
console.log('============== >>>>>', Block.mineBlock(Block.genesis(), 'mine'));


console.log('================= my blockchain =====', new blockChain());
var blockchain1 = new blockChain();
blockchain1.addBlock('foo');
blockchain1.addBlock('bar');
console.log('================= my blockchain =====', blockchain1);


