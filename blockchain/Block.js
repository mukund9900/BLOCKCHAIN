var sha256 = require('crypto-js/sha256');




/**
 * PROOF OF WORK :
 *
 * CREATING A NOUNCE VALUE, WHERE IT CAN INCREMENTED UNTIL A HASH IS MATCHING IT DIFFICULTY.
 *
 * */
const DIFFICULTY = 0;

class Block {

    constructor(hash, lastHash, timestamp, data, nonce) {
        this.hash = hash;
        this.lastHash = lastHash;
        this.timestamp = timestamp;
        this.data = data;
        this.nonce = nonce;
    }
    toString() {
        return `Block -
      Hash      : ${this.hash.substring(0, 10)}
      Last Hash : ${this.lastHash.substring(0, 10)}
      Timestamp : ${this.timestamp}
      Data      : ${this.data}
      Nonce    : ${this.nonce}`;
    }

    static genesis() {
        return new this('first>hash001', '-----', 'timestamp', 'Consciousness', 0);
    }

    static mineBlock(lastBlock, data) {
        const lastHash = lastBlock.hash;
        let hash, timestamp;
        let nonce = 0;
        do {
            nonce++;
            timestamp = Date.now();
            hash = this.hash(lastHash, timestamp, data, nonce);
        }while(hash.substring(0, DIFFICULTY) !== '0'.repeat(DIFFICULTY))

        return new this(hash, lastHash, timestamp, data, nonce);
    }

    static hash(lastHash, timestamp, data, nonce) {
        return sha256(`${lastHash}${timestamp}${data}${nonce}`).toString();
    }

    static blockHash(block) {
        return this.hash(block.lastHash, block.timestamp, block.data, block.nonce);
    }
}

module.exports = Block;