'use strict';
/**
 * todo Mukund
 * this is pool  where all our transaction can be dumped in but all would be unconfirmed transaction
 *
 * */
const _ = require('lodash');
const Transaction = require('../wallet/transaction');

class TransactionPool {
    constructor() {
        this.transactionPool = [];
    }

    /**
     *  Add or update transaction based on the id of transaction
     * */
    upsertTransactionPool(incomingTransaction) {
        var transactionWithId = this.transactionPool.find(t => t.id === incomingTransaction.id)
        if (!_.isEmpty(transactionWithId)) {
            this.transactionPool[this.transactionPool.indexOf(transactionWithId)] = incomingTransaction;
        } else {
            this.transactionPool.push(incomingTransaction);
        }
    }

    /**
     * check the transaction with address or public address
     * */
    existingTransaction(address) {
        return this.transactionPool.find(t => t.input.address === address);
    }

    validaTransactions() {
        return this.transactionPool.filter(transaction => {
            /** Validate the every transactions */
                // STEP 1 get all the sum output amount to initial balance.
            const outputTotal = transaction.output.reduce((total, output) => {
                    return total + output.amount;
                }, 0)
            // check if the totalSum is not equal inputTotal.
            if (transaction.input.amount !== outputTotal) {
                console.log(`invalid transaction output total sum is not equal to input amount`);
                return;
            }
            // STEP 2 check for the signature.
            if (!Transaction.verifyTransaction(transaction)) {
                console.log(`invalid transaction with invalid signature`);
                return;
            }
            return transaction;
        })
    }

    clearPool() {
        this.transactionPool = [];
    }


}

module.exports = TransactionPool;