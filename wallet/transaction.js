const chainUtil = require('../util/chain-util');
const {MINER_REWARD} = require('../config/block_config');

class Transaction {
    constructor() {
        this.id = chainUtil.id();
        this.input = null;
        this.output = [];
    }

    update(senderWallet, recipient, amount) {
        const senderOutput = this.output.find(out => out.address === senderWallet.publicKey);
        if (amount > senderOutput.amount) {
            console.log(`Insufficient fund`);
            return;
        }
        senderOutput.amount = senderOutput.amount - amount;
        this.output.push({amount, address: recipient});
        senderWallet.balance = senderOutput.amount;
        Transaction.signTransaction(this, senderWallet);

        if(Transaction.verifyTransaction(this)){
            return this;
        }
    }

    static transactionWithOutputs(senderWallet, output) {
        const transaction = new this();
        transaction.output.push(...output);
        Transaction.signTransaction(transaction, senderWallet);
        return transaction
    }

    static newTransaction(senderWallet, recipient, amount) {
        if (amount > senderWallet.balance) {
            console.log(`Insufficient fund -- current Balance is ${senderWallet.balance}`);
            return;
        }
        return Transaction.transactionWithOutputs(senderWallet, [
            {
                amount: senderWallet.balance - amount,
                address: senderWallet.publicKey
            },
            {
                amount: amount,
                address: recipient
            }
        ])
    }

    static rewardTransaction(minerWallet, blockChainWallet) {
        return Transaction.transactionWithOutputs(blockChainWallet, [{
            amount: MINER_REWARD, address: minerWallet.publicKey
        }])
    }

    static signTransaction(transaction, senderWallet) {
        transaction.input = {
            timestamp: Date.now(),
            amount: senderWallet.balance,
            address: senderWallet.publicKey,
            signature: senderWallet.sign(chainUtil.hash(transaction.output))
        }
    }

    static verifyTransaction(transaction) {
        return chainUtil.verifySignature(
            transaction.input.address,
            transaction.input.signature,
            chainUtil.hash(transaction.output)
        );
    }
}

module.exports = Transaction;