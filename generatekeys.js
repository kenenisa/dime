const crypto = require("node:crypto")
const fs = require("fs")

const prime_length = 2048;

const keyPair = () => crypto.generateKeyPairSync('rsa', {
  modulusLength: prime_length,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem'
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
    cipher: 'aes-256-cbc',
    passphrase: ''
  }
});

fs.writeFileSync("./keys.json",JSON.stringify(keyPair()))