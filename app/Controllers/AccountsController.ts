import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Account from 'App/Models/Account';
import Loan from 'App/Models/Loan';
import CreateAccountValidator from 'App/Validators/CreateAccountValidator'
import LoanRequestValidator from 'App/Validators/LoanRequestValidator';
import VoteRequestValidator from 'App/Validators/VoteRequestValidator';
import { createHash } from 'node:crypto';
import TransactionsController from './TransactionsController';
import ReserveVote from 'App/Models/ReserveVote';
import WebhookRequestValidator from 'App/Validators/WebhookRequestValidator';
import Webhook from 'App/Models/Webhook';
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
        const { name, kebeleId, uniId, uniPhotoFront, uniPhotoBack, photo, address } = await request.validate(LoanRequestValidator);
        const owner = await Account.findByOrFail("address", address);

        await Loan.updateOrCreate({ name, kebeleId, uniId }, {
            accountId: owner.id,
            name,
            kebeleId,
            uniId,
            uniPhotoBack,
            uniPhotoFront,
            photo
        })
        owner.loaner = true;
        await owner.save()
        return {
            success: true,
            message: "registered for a loan"
        }
    }

    public async vote({ request }: HttpContextContract) {
        const { publicAddress, signature, value } = await request.validate(VoteRequestValidator);
        const owner = await Account.findByOrFail("address", publicAddress);
        if (new TransactionsController().validateSignature(owner.publicKey, signature, {
            publicAddress,
            value
        }) && value > 0.5 && value <= 1) {
            await ReserveVote.updateOrCreate({
                accountId: owner.id
            }, {
                accountId: owner.id,
                signature,
                value
            })
            return {
                success: true,
                message: "OK :)"
            }
        }
        return {
            success: false,
            message: "Signature Invalid or Invalid vote value"
        }
    }
    public async setWebhook({ request }: HttpContextContract) {
        const { url, address } = await request.validate(WebhookRequestValidator);
        const owner = await Account.findByOrFail("address", address);
        await Webhook.updateOrCreate({
            accountId: owner.id
        }, {
            accountId: owner.id,
            url
        })
        return {
            success: true,
            message: "Webhook set"
        }
    }

}
