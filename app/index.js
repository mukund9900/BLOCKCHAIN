const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const blockChain = require('../blockchain/index');
const http_port = process.env.HTTP_PORT || 3009;
const P2P_SERVER = require('./p2pserver');

const _bc = new blockChain();


const Wallet = require('../wallet/index');
const TransactionPool = require('../wallet/transaction-pool');
const wallet = new Wallet();

const _tp = new TransactionPool();
const p2p = new P2P_SERVER(_bc, _tp);
const MINER = require('./miner');
const miner = new MINER(_bc, _tp, wallet, p2p);

app.use(bodyParser.json())

app.get('/blocks', (req, res, next) => {
    res.json(_bc.chain);
})

app.post('/mine', (req, res, next) => {
    _bc.addBlock(req.body.data);
    p2p.syncChain();
    res.redirect('/blocks');
})

/**
 * Transactions..
 * */

app.get('/transactions', (req, res)=>{
    res.json(_tp.transactionPool);
})

app.post('/transact', (req, res, next) => {
    const {recipient, amount} = req.body;
    const transaction = wallet.createTransaction(recipient, amount, _bc,_tp);
    p2p._broadCastTransaction(transaction);
    res.redirect('/transactions');
})

app.get('/public-key', (req, res, next) => {
    res.json({publicKey: wallet.publicKey});
})

app.get('/mine-transactions', (req, res)=>{
    const block = miner.mine();
    console.log(`================== >>>>>>>> added a new block ${block.toString()}`);
    res.redirect('/blocks');

})
app.listen(http_port, () => console.log('loading on this port =>' + http_port));
p2p.listen();