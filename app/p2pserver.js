const Websocket = require('ws');

const P2P_PORT = process.env.P2P_PORT || 5001;

const PEERS = process.env.PEERS ? process.env.PEERS.split(',') : [];


class P2PSERVER {

    constructor(blockchain) {
        this.blockchain = blockchain;
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
        socket.send(JSON.stringify(this.blockchain.chain))
    }

    messageHandler(socket) {
        socket.on('message', message => {
            const data = JSON.parse(message);
            this.blockchain.replaceChain(data);
        });
    }

    syncChain() {
        this.socket.forEach(socket => {
            this.sendChain(socket);
        })
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