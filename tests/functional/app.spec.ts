import { TestContext, test } from '@japa/runner'
import crypto from "node:crypto";
import { generateSignature } from './../../util';
//crypt stuff
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

declare module '@japa/runner' {

  // Interface must match the class name
  interface TestContext {
    address: string
  }

}

const master = keyPair()
test('Create account', async ({ client }) => {

  const response = await client.post('/account/create').json({
    publicKey: master.publicKey
  });
  const address = response.body().address
  TestContext.getter('address', () => {
    return address
  })
  response.assertAgainstApiSpec();
});
test('Transfer Funds to other accounts', async ({ client, address, assert }) => {
  const address_list: string[] = [address]
  for (let i = 0; i < 1; i++) {

    const keys = keyPair()
    const response = await client.post('/account/create').json({
      publicKey: keys.publicKey
    });
    const myAddress = response.body().address
    address_list.push(myAddress)

    for (let j = 0; j < address_list.length; j++) {
      const buyRes = await client.get("/wallet/buy/" + myAddress) // get money
      for (let k = 0; k < 1; k++) {
        assert.assert(buyRes.body().success, "Buying money not working")
        const obj = {
          publicAddress: myAddress,
          receiverAddress: address_list[j],
          date: new Date().toDateString(),
          amount: Math.floor(Math.random() * 100),
          uniqueTransactionToken: Math.random().toString()
        }

        const signature = generateSignature(keys.privateKey, JSON.stringify(obj))
        // make the transaction
        const rp = await client.post("/wallet/send").json({
          ...obj,
          signature,
          publicKey: keys.publicKey
        })

        rp.assertAgainstApiSpec();
      }
    }
  }
}).disableTimeout();

test('Get account info', async ({ client, address }) => {
  const response = await client.get('/wallet/info/' + address)
  response.assertAgainstApiSpec();
});


test('Register for loan', async ({ client, address }) => {
  const response = await client.post('/wallet/loan').json({
    address,
    name: "Kenenisa",
    kebeleId: "1234",
    uniId: "ETS2343/2",
    uniPhotoFront: "base64",
    uniPhotoBack: "base64",
    photo: "base64",
  })
  response.assertAgainstApiSpec();
});

test('Get activity for the last 3 days', async ({ client, address }) => {
  const response = await client.get(`/activity/${address}/${3}`);
  response.assertAgainstApiSpec();
});

test('Cast a vote', async ({ client, address }) => {
  const obj = {
    publicAddress: address,
    value: 0.85
  }
  const response = await client.post('/vote').json({
    ...obj,
    signature: generateSignature(master.privateKey, JSON.stringify(obj))
  });
  response.assertAgainstApiSpec();
});

test('Set a webhook', async ({ client, address }) => {
  const response = await client.post('/webhook').json({
    address,
    url: "https://google.com"
  });

  response.assertAgainstApiSpec();
});



