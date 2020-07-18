const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const blockChain = require('../blockchain/index');
const http_port = process.env.HTTP_PORT || 3009;
const P2P_SERVER = require('./p2pserver');

const _bc = new blockChain();

const p2p = new P2P_SERVER(_bc);

app.use(bodyParser.json())

app.get('/blocks', (req, res, next) => {
    res.json(_bc.chain);
})

app.post('/mine', (req, res, next) => {
    _bc.addBlock(req.body.data);
    p2p.syncChain();
    res.redirect('/blocks');
})

app.listen(http_port, () => console.log('loading on this port =>' + http_port));
p2p.listen();