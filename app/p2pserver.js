/**
 *
 * 16/july/2020
 * Mukund raj S T
 * */

const Websocket = require('ws');

const P2P_PORT = process.env.P2P_PORT || 5001;

const PEERS = process.env.PEERS ? process.env.PEERS.split(',') : [];
const MESSAGE_TYPE = {
    chain: 'CHAIN',
    transaction: 'TRANSACTION',
    clear_transactions: 'CLEAR_TRANSACTIONS'
}

class P2PSERVER {

    constructor(blockchain, transactions) {
        this.blockchain = blockchain;
        this.transactions = transactions;
        this.socket = [];
    }

    connectSocket(socket) {
        this.socket.push(socket);
        console.log('Socket incoming <<<=====>>>');
        this.messageHandler(socket);
        this.sendChain(socket);
    }

    connectToPeers() {
        PEERS.forEach((peer) => {
            //ws://localhost:3001
            const socket = new Websocket(peer);
            socket.on('open', () => {
                this.connectSocket(socket);
            });

        })
    }

    sendChain(socket) {
        socket.send(JSON.stringify({
            type: MESSAGE_TYPE.chain,
            chain: this.blockchain.chain
        }))
    }

    sendTransaction(socket, transaction) {
        socket.send(JSON.stringify({
            type: MESSAGE_TYPE.transaction,
            transaction
        }))
    }

    messageHandler(socket) {
        socket.on('message', message => {
            const data = JSON.parse(message);
            switch (data.type) {
                case MESSAGE_TYPE.chain:
                    this.blockchain.replaceChain(data.chain);
                    break;
                case MESSAGE_TYPE.transaction:
                    this.transactions.upsertTransactionPool(data.transaction);
                    break;
                case MESSAGE_TYPE.clear_transactions:
                    this.transactions.clearPool();
                    break;

                default:
                    return;
            }
        });
    }

    syncChain() {
        this.socket.forEach(socket => {
            this.sendChain(socket);
        })
    }

    _broadCastTransaction (transaction){
        this.socket.forEach(socket => {
            this.sendTransaction(socket, transaction);
        })
    }

    _broadCastClearTransactions() {
        this.socket.forEach(socket => socket.send(JSON.stringify({
            type: MESSAGE_TYPE.clear_transactions
        })));
    }

    listen() {
        const server = new Websocket.Server({port: P2P_PORT});
        server.on('connection', (socket) => {
            this.connectSocket(socket)
        });
        console.log('listening p 2 p connection on port', P2P_PORT);
        this.connectToPeers();
    }
}

module.exports = P2PSERVER;