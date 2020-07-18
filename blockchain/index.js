const Block = require('./Block');

class Blockchain {
    constructor() {
        this.chain = [Block.genesis()];
    }

    addBlock(data) {
        const block = Block.mineBlock(this.chain[this.chain.length - 1], data)
        this.chain.push(block);
        return block;
    }

    isValidChain(chain) {
        if (chain.length <= this.chain.length) return false;
        if (JSON.stringify(chain[0]) !== JSON.stringify(this.chain[0])) return false;

        for (let i = 1; i < chain.length; i++) {
            const block = chain[i];
            const lastBlock = chain[i - 1];
            if (block.hash !== Block.blockHash(block) ||
                block.lastHash !== lastBlock.hash) {
                return false;
            }
        }
        return true;
    }

    replaceChain(newChain) {
        if (newChain.length <= this.chain.length) {
            console.log('============>>>> incoming chain is smaller than we have');
            return;
        }
        else if (!this.isValidChain(newChain)) {
            console.log('===========>>>> incoming chain is not a valid chain');
            return;
        }
        else {
            console.log('Successfully replaced the current chain with incoming chain');
            this.chain = newChain;
        }
        return;
    }

}

module.exports = Blockchain;

