/**
 * 18/july/2020
 * Mukund raj S T
 * */

'use strict';
const Wallet = require('../wallet');
const Transaction = require('../wallet/transaction');
class Miner {

    constructor(blockChain, transactionPool, wallet, p2pServer) {
        this.blockChain = blockChain;
        this.transactionPool = transactionPool;
        this.wallet = wallet;
        this.p2pServer = p2pServer;
    }

    mine() {
        /**
         *
         *1 Get all the valid transaction from transactions pool.
         *
         *2 set a reward for the miner for all the competitive work.
         *
         *3 create a block consisting of a valid transaction.
         *
         *4 sync the chains in p2p server.
         *
         *5 broadcast to every miner to clear their transactions pool
         *
         * */

        const validTransactions = this.transactionPool.validaTransactions();
        validTransactions.push(
            Transaction.rewardTransaction(this.wallet, Wallet.blockChainWallet())
        );
        const block = this.blockChain.addBlock(validTransactions);
        this.p2pServer.syncChain();
        this.transactionPool.clearPool();
        this.p2pServer._broadCastClearTransactions();

        return block;
    }
}

module.exports = Miner;