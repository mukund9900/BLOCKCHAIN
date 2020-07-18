const chainUtil = require('../util/chain-util');


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

    static newTransaction(senderWallet, recipient, amount) {
        const transaction = new this();
        if (amount > senderWallet.balance) {
            console.log(`Insufficient fund -- current Balance is ${senderWallet.balance}`);
            return;
        }
        transaction.output.push(...[
            {
                amount: senderWallet.balance - amount,
                address: senderWallet.publicKey
            },
            {
                amount: amount,
                address: recipient
            }
        ])
        senderWallet.balance = senderWallet.balance - amount;
        return transaction;
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