"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeString = void 0;
const crypto_js_1 = require("crypto-js");
const encodeString = async (str) => {
    if (str === null || !str)
        return console.log('Unknown argument! Please check the entered value.');
    let strArray = str.split('');
    strArray.reverse();
    strArray.shift();
    strArray.reverse();
    strArray.pop();
    strArray.reverse();
    const firstCryptoHash = btoa(strArray.toString()); // Base64
    const secondCryptoHash = (0, crypto_js_1.MD5)(firstCryptoHash); // MD5
    const thirdCryptoHash = (0, crypto_js_1.MD5)(secondCryptoHash); // MD5
    const forthCryptoHash = (0, crypto_js_1.SHA1)(thirdCryptoHash); // SHA1
    const fivthCryptoHash = (0, crypto_js_1.SHA224)(forthCryptoHash); // SHA224
    const sixthCryptoHash = (0, crypto_js_1.SHA256)(fivthCryptoHash); // SHA256
    const seventhCryptoHash = (0, crypto_js_1.SHA3)(sixthCryptoHash); // SHA3
    const eighthCryptoHash = (0, crypto_js_1.SHA384)(seventhCryptoHash); // SHA348
    const ninethCryptoHash = (0, crypto_js_1.SHA384)(eighthCryptoHash); // SHA384
    const tenthCryptoHash = (0, crypto_js_1.SHA512)(ninethCryptoHash); // SHA512
    const eleventhCryptoHash = btoa(tenthCryptoHash.toString()); // Base64
    const twelvethCryptoHash = (0, crypto_js_1.MD5)(eleventhCryptoHash); // MD5
    return twelvethCryptoHash.toString();
};
exports.encodeString = encodeString;
