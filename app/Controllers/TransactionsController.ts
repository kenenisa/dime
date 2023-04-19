import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database';
import Account from 'App/Models/Account';
import Transaction from 'App/Models/Transaction';
import WalletSendValidator from 'App/Validators/WalletSendValidator';
import { createHash, publicDecrypt } from 'node:crypto';


export default class TransactionsController {

    public validateSignature(publicKey: string, signature: string, object: any) {
        const incomingHash = publicDecrypt(publicKey, Buffer.from(signature, "utf-8")).toString();
        const generatedData = JSON.stringify(object)
        const hash = createHash("sha256");
        hash.update(generatedData)
        const generatedHash = hash.digest("hex");
        return incomingHash === generatedHash
    }
    public async send({ request, response }: HttpContextContract) {
        const { publicKey, publicAddress, receiverAddress, amount, signature, date, uniqueTransactionToken } = await request.validate(WalletSendValidator);
        const owner = await Account.findByOrFail('address', publicAddress);
        if (owner.balance < amount) {
            response.status(403)
            return {
                success: false,
                message: "Inefficient balance"
            }
        }
        if (this.validateSignature(publicKey, signature, {
            publicKey,
            publicAddress,
            receiverAddress,
            date,
            amount,
            uniqueTransactionToken
        })) {
            const tx = await Transaction.findBy("uniqueTransactionToken", uniqueTransactionToken);
            if (!tx) {
                const receiver = await Account.findByOrFail("address", receiverAddress);

                receiver.balance += amount;
                await receiver.save();

                owner.balance -= amount;
                await owner.save();

                await Transaction.create({
                    accountId: owner.id,
                    receiverAddress,
                    amount,
                    signature,
                    uniqueTransactionToken,
                    deposit: false,
                })
            }
            return {
                success: true,
                message: "Transaction successful"
            }
        }
        response.status(403)
        return {
            success: false,
            message: "Invalid signature"
        }
    }
    public async activity({ params }: HttpContextContract) {
        const { address, days } = params;
        const owner = await Account.findByOrFail("address", address)
        const d = new Date();
        d.setDate(d.getDate() - days);
        const ago = d.toDateString()
        return Database
            .from('transactions')
            .where("account_id", owner.id)
            .where('created_at', '>', ago)
    }
    public async buy({params}:HttpContextContract){
        const {address} = params
        const owner = await Account.findByOrFail("address",address);
        owner.balance += 1000;
        await owner.save();
        return {
            success:true
        }
    }
}
