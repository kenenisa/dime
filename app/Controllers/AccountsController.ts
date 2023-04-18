import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Account from 'App/Models/Account';
import Loan from 'App/Models/Loan';
import CreateAccountValidator from 'App/Validators/CreateAccountValidator'
import LoanRequestValidator from 'App/Validators/LoanRequestValidator';
import { createHash } from 'node:crypto';
//
export default class AccountsController {
    public async create({ request }: HttpContextContract) {
        const { publicKey } = await request.validate(CreateAccountValidator);
        const hash = createHash("sha256");
        hash.update(publicKey);
        const address = hash.digest("hex");
        const account = await Account.firstOrCreate({
            address,
        }, {
            address,
            publicKey,
            balance: 0,
            currency: "ETB"
        })
        return account;
    }
    public async info({ params }: HttpContextContract) {
        const { address } = params;
        const account = await Account.findByOrFail('address', address);
        await account.load('transactions')
        return {
            amount: account.balance,
            transactions: account.transactions
        }
    }
    public async loan({ request }: HttpContextContract) {
        const { name, kebeleId, uniId, uniPhotoFront, uniPhotoBack, photo } = await request.validate(LoanRequestValidator);
        await Loan.updateOrCreate({ name, kebeleId, uniId }, {
            name,
            kebeleId,
            uniId,
            uniPhotoBack,
            uniPhotoFront,
            photo
        })
        return {
            success: true,
            message: "registered for a loan"
        }
    }

}
