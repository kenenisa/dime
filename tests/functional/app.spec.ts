import { TestContext, test } from '@japa/runner'
import crypto from "node:crypto";
//crypt stuff
const prime_length = 2048;
const diffHell = crypto.createDiffieHellman(prime_length);


declare module '@japa/runner' {

  // Interface must match the class name
  interface TestContext {
    address: string
  }

}
test('Create account', async ({ client }) => {
  diffHell.generateKeys('base64');
  const response = await client.post('/account/create').json({
    publicKey: diffHell.getPublicKey('base64')
  });
  const address = response.body().address
  TestContext.getter('address',()=>{
    return address
  })
  response.assertAgainstApiSpec();
});

test('Get account info', async ({ client,address }) => {
  const response = await client.get('/wallet/info/'+address)
  response.assertAgainstApiSpec();
});


