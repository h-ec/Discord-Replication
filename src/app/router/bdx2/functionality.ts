import { AES, MD5, RC4, SHA1, SHA224, SHA256, SHA3, SHA384, SHA512 } from "crypto-js";

const encodeString = async ( str: string ) => {
    if(str === null || !str) return console.log('Unknown argument! Please check the entered value.');
    let strArray: string[] = str.split('');

    strArray.reverse();
    strArray.shift();
    strArray.reverse();
    strArray.pop();
    strArray.reverse();

    const firstCryptoHash    = btoa(strArray.toString());        // Base64
    const secondCryptoHash   = MD5(firstCryptoHash);             // MD5
    const thirdCryptoHash    = MD5(secondCryptoHash);            // MD5
    const forthCryptoHash    = SHA1(thirdCryptoHash);            // SHA1
    const fivthCryptoHash    = SHA224(forthCryptoHash);          // SHA224
    const sixthCryptoHash    = SHA256(fivthCryptoHash);          // SHA256
    const seventhCryptoHash  = SHA3(sixthCryptoHash);            // SHA3
    const eighthCryptoHash   = SHA384(seventhCryptoHash);        // SHA348
    const ninethCryptoHash   = SHA384(eighthCryptoHash);         // SHA384
    const tenthCryptoHash    = SHA512(ninethCryptoHash);         // SHA512
    const eleventhCryptoHash = btoa(tenthCryptoHash.toString()); // Base64
    const twelvethCryptoHash = MD5(eleventhCryptoHash);          // MD5
    return twelvethCryptoHash.toString();
};

export {
    encodeString
}