import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Account from 'App/Models/Account'
import Prediction from 'App/Models/Prediction';
const average = array => array.reduce((a, b) => a + b) / array.length;
const max = array => array.reduce((a, b) => { return Math.max(a, b) });
const total = array => array.reduce((a, b) => { return a + b }, 0);

export default class PredictionsController {
    public async getPredictionTraining({ }: HttpContextContract) {
        const accounts = await Account.all()
        const result: any[] = []
        for (let account of accounts) {
            const transactions = await Database
                .from("transactions")
                .where("account_id", account.id)
                .exec()
            const df = {}
            transactions.forEach(tx => {
                const date = new Date(tx.created_at).toLocaleDateString()
                if (!df[date]) {
                    df[date] = { deposit: [], expense: [] }
                }
                if (tx.deposit) {
                    df[date].deposit.push(tx.amount)
                } else {
                    df[date].expense.push(tx.amount)
                }
            })
            const days: any = []
            for (let a in df) {
                days.push({
                    date: a,
                    deposit: {
                        total: total(df[a].deposit),
                        max: max(df[a].deposit),
                        average: average(df[a].deposit),
                    },
                    expense: {
                        total: total(df[a].expense),
                        max: max(df[a].expense),
                        average: average(df[a].expense),
                    }
                })
            }
            result.push({
                address: account.address,
                days
            })
        }
        return result
    }

    public async getReserveTraining({ }: HttpContextContract) {
        const accounts = await Account.all()
        const result: any[] = []
        for (let account of accounts) {
            const transactions = await Database
                .from("transactions")
                .where("account_id", account.id)
                .exec()

            const total_expense = total(transactions.filter(v => !v.deposit).map(item => item.amount));
            const total_deposit = total(transactions.filter(v => v.deposit).map(item => item.amount));
            const active = true;
            const credit_score = account.creditScore
            result.push({
                total_deposit,
                total_expense,
                active,
                credit_score,
                address: account.address
            })
        }
        return result
    }

    public async postPredictionTraining({ request }: HttpContextContract) {
        const { data } = request.all();

        for (let ac of data) {
            const account = await Account.findByOrFail("address", ac.address);
            for (let pr of ac.predictions) {
                await Prediction.create({
                    accountId: account.id,
                    futureDate: pr.future_date,
                    expense: pr.expense,
                    deposit: pr.deposit
                })
            }
        }
        return {
            success: true
        }
    }

    public async postReserveTraining({ request }: HttpContextContract) {
        const { high_spenders, low_spenders } = request.all();
        return {
            success: true,
            message: high_spenders - low_spenders
        }
    }
}
