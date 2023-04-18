import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Account from 'App/Models/Account';
import CreateAccountValidator from 'App/Validators/CreateAccountValidator'
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
    public async index(ctx: HttpContextContract) {
        return [
            {
                id: 1,
                title: 'Hello world',
            },
            {
                id: 2,
                title: 'Hello universe',
            },
        ]
    }
}
