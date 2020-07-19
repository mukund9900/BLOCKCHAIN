/**
 *
 * 17/july/2020
 * Mukund raj S T
 * */
const Wallet = require('./index');
const Transaction = require('./transaction');
const chainUtil = require('../util/chain-util');
const TransactionPool = require('./transaction-pool');


/**
 * test  wallet class and transactions
 * */
const _myWallet = new Wallet();
const _mywallet1 = new Wallet();
console.log(_myWallet);
const recipient = 'R3C1P13N7';
const amount = 100;

const transaction = Transaction.newTransaction(_myWallet, recipient, amount)
const transaction1 = Transaction.newTransaction(_mywallet1, _myWallet.publicKey, 200);
const transaction_sig = Transaction.signTransaction(transaction, _myWallet);
const transaction_sig1 = Transaction.signTransaction(transaction1, _mywallet1);

// const verifyTransaction = Transaction.verifyTransaction(transaction);
console.log('===========my first transaction and sig and very ======',transaction);
const tp = new TransactionPool();
tp.upsertTransactionPool(transaction);
    transaction.update(_myWallet, 'NewR3C1P13N7', 200);
const verifyTransaction = Transaction.verifyTransaction(transaction);
const verifyTransaction1 = Transaction.verifyTransaction(transaction1);
tp.upsertTransactionPool(transaction);
tp.upsertTransactionPool(transaction1);
console.log('================ >> after updating transaction ====>>', transaction, verifyTransaction);

// console.log('================= >>>>>>>>>> ', JSON.stringify(tp.transactionPool));

_myWallet.createTransaction('MAMAMAMA', 50, tp);
_mywallet1.createTransaction(_myWallet.publicKey, 10, tp)

console.log('================ >>>>>>>>>>', JSON.stringify(tp.transactionPool));
