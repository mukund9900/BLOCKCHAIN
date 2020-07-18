var sha256 = require('crypto-js/sha256');
var block_config = require('../config/block_config');


/**
 * PROOF OF WORK :
 *
 * CREATING A NOUNCE VALUE, WHERE IT CAN INCREMENTED UNTIL A HASH IS MATCHING IT DIFFICULTY.
 *
 * */
const {DIFFICULTY, MINE_RATE} = block_config;

class Block {

    constructor(hash, lastHash, timestamp, data, nonce, difficulty) {
        this.hash = hash;
        this.lastHash = lastHash;
        this.timestamp = timestamp;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty || DIFFICULTY;
    }

    toString() {
        return `Block -
      Hash       : ${this.hash.substring(0, 10)}
      Last Hash  : ${this.lastHash.substring(0, 10)}
      Timestamp  : ${this.timestamp}
      Data       : ${this.data}
      Nonce      : ${this.nonce}
      Difficulty : ${this.difficulty}`;
    }

    static genesis() {
        return new this('first>hash001', '-----', 'timestamp', 'Consciousness', 0, DIFFICULTY);
    }

    static mineBlock(lastBlock, data) {
        const lastHash = lastBlock.hash;
        let hash, timestamp;
        let nonce = 0;
        let {difficulty} = lastBlock;
        do {
            nonce++;
            timestamp = Date.now();
            difficulty = this._adjustDifficulty(lastBlock, timestamp);
            hash = this.hash(lastHash, timestamp, data, nonce, difficulty);
        } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty))
        return new this(hash, lastHash, timestamp, data, nonce, difficulty);
    }

    static _adjustDifficulty(lastBlock, currenttime) {
        let {difficulty, timestamp} = lastBlock;
        difficulty = timestamp + MINE_RATE > currenttime ? difficulty + 1 : difficulty - 1;
        return difficulty;
    }

    static hash(lastHash, timestamp, data, nonce, difficulty) {
        return sha256(`${lastHash}${timestamp}${data}${nonce}${difficulty}`).toString();
    }

    static blockHash(block) {
        return this.hash(block.lastHash, block.timestamp, block.data, block.nonce, block.difficulty);
    }
}

module.exports = Block;