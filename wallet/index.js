const {INITIAL_BALANCE} = require('../config/block_config');
const ChainUtil = require('../util/chain-util');


class Wallet {
    constructor() {
        this.balance = INITIAL_BALANCE;
        this.keyPair = ChainUtil.genKeypair();
        this.publicKey = this.keyPair.getPublic().encode('hex');
    }

    toString() {
        return `Wallet -
        Balance    : ${this.balance}
        Public Key : ${this.publicKey} 
        `
    }

    sign(dataHash) {
        return this.keyPair.sign(dataHash);
    }
}

module.exports = Wallet;