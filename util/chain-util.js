'use strict';
var sha256 = require('crypto-js/sha256');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const uuidV1 = require('uuid').v1;

class ChianUtil {
    static genKeypair() {
        return ec.genKeyPair();
    }
    static id(){
        return uuidV1();
    }

    static hash(input){
        return sha256(JSON.stringify(input)).toString();
    }

    static verifySignature(publicKey, signature, dataHash){
        return ec.keyFromPublic(publicKey, 'hex').verify(dataHash, signature);
    }
}

module.exports = ChianUtil;
