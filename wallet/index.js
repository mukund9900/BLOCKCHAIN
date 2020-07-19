const {INITIAL_BALANCE} = require('../config/block_config');
const ChainUtil = require('../util/chain-util');
const _ = require('lodash');
const Transaction = require('./transaction');


class Wallet {
    constructor() {
        this.balance = INITIAL_BALANCE;
        this.keyPair = ChainUtil.genKeypair();
        this.publicKey = this.keyPair.getPublic().encode('hex');
    }

    toString() {
        return `Wallet -
        Balance    : ${this.balance}
        Public Key : ${this.publicKey} 
        `
    }

    sign(dataHash) {
        return this.keyPair.sign(dataHash);
    }

    createTransaction(recipient, amount, blockchain, transactionPool) {
        this.balance = this.calculateBalance(blockchain)
        if (amount > this.balance) {
            console.log(`Insufficient fund:: balance is ${this.balance}`);
            return;
        }
        let transaction = transactionPool.existingTransaction(this.publicKey);
        if (transaction) {
            transaction.update(this, recipient, amount);
        } else {
            transaction = Transaction.newTransaction(this, recipient, amount);
            transactionPool.upsertTransactionPool(transaction);
        }
        return transaction;
    }

    static blockChainWallet(){
        const blockChainWallet = new this();
        blockChainWallet.address = 'block-chain-publicKey'
        return blockChainWallet;

    }

    calculateBalance(blockchain){
        // get current balance from waller instance.
        let balance = this.balance;
        let transactions = [];

        // get all the transactions from the data in to transactions array
        blockchain.chain.forEach(block => {
            console.log('=============', block)
            block.data.forEach(transaction => {
                transactions.push(transaction)
            })
        });

        //walletInputTs == all inputs of transactions
        const walletInputTs = transactions.filter(transaction => transaction.input.address === this.publicKey);

        let startTime = 0;
        //recentInputT == in all of transactions getting the recent Transaction
        if (walletInputTs.length > 0) {
            const recentInputT = walletInputTs.reduce((prev, curr) => {
                return prev.input.timestamp > curr.input.timestamp ? prev : curr;
            });
            balance = _.get(recentInputT.output.forEach(out => out.address === this.publicKey), 'amount');
            startTime = recentInputT.input.timestamp;
        }

        transactions.forEach(transaction => {
            if (transaction.input.timestamp > startTime) {
                transaction.output.forEach(output => {
                    if (output.address === this.publicKey) {
                        balance += output.amount;
                    }
                });
            }
        });

        return balance;
    }



}

module.exports = Wallet;