const Block = require('./Block');
const blockChain = require('./index');


const Wallet = require('../wallet/index');
const Transaction = require('../wallet/transaction');

/**
 * Test all block chain and it's utils
 * */
// const Block1 = new Block('saldjasld', 'kasjhdkasd', new Date(), 'Mukund');
// console.log('=================>>>>>>>>', Block1.toString());
// console.log('==============((((())))', Block.genesis().toString());
// console.log('============== >>>>>', Block.mineBlock(Block.genesis(), 'mine'));
//
//
// console.log('================= my blockchain =====', new blockChain());
// var blockchain1 = new blockChain();
// blockchain1.addBlock('foo');
// blockchain1.addBlock('bar');
// console.log('================= my blockchain =====', blockchain1);


/**
 * test  wallet class and transactions
 * */
const _myWallet = new Wallet();
console.log(_myWallet);
const recipient = 'R3C1P13N7';
const amount = 100;

const transaction = Transaction.newTransaction(_myWallet, recipient, amount)

const transaction_sig = Transaction.signTransaction(transaction, _myWallet);

// const verifyTransaction = Transaction.verifyTransaction(transaction);
console.log('===========my first transaction and sig and very ======',transaction);


transaction.update(_myWallet, 'NewR3C1P13N7', 200);
const verifyTransaction = Transaction.verifyTransaction(transaction);

console.log('================ >> after updating transaction ====>>', transaction, verifyTransaction);



