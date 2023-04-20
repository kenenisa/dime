import Database from '@ioc:Adonis/Lucid/Database'
import Account from 'App/Models/Account'
import Reserve from 'App/Models/Reserve'
import ReserveVote from 'App/Models/ReserveVote'
import { BaseTask } from 'adonis5-scheduler/build'
import fetch from 'cross-fetch'

const CREDIT_CONSTANT = 0.01
export default class EvaluateCredit extends BaseTask {
	logger: any
	public static get schedule() {
		return '0 0 * * * ls >/dev/null 2>&1'
	}
	/**
	 * Set enable use .lock file for block run retry task
	 * Lock file save to `build/tmpTaskLock`
	 */
	public static get useLock() {
		return false
	}

	public async handle() {
		(await Account.all()).map(async account => {
			const transactions = await Database
				.from('transactions')
				.where("account_id", account.id)
				.where("deposit", true)
				.exec()
			let highestDeposit = transactions.map(v => v.amount).reduce((a, b) => { return Math.max(a, b) });
			if (account.balance > 0) {
				account.creditScore += CREDIT_CONSTANT
			} else {
				account.creditScore -= CREDIT_CONSTANT
			}
			if (account.creditScore > 1) {
				account.creditScore = 1
			} else if (account.creditScore < -1) {
				account.creditScore = -1
			}
			if (account.creditScore > 0) {
				account.creditLimit = account.creditScore * highestDeposit;
			} else {
				account.creditLimit = 0
			}
			await account.save();
		})
		const votes = await ReserveVote.all()
		let reserveTotal = 0;
		let x = votes.length;
		let totalVotes = 0
		for (let vote of votes) {
			const account = await Account.findByOrFail("id", vote.accountId);
			reserveTotal += vote.value * account.balance
			totalVotes += vote.value
		}
		await Reserve.create({
			final: reserveTotal.toString(),
			vote: (totalVotes / x).toString()
		})
		await fetch("https://dime-ml.onrender.com").catch(console.log)
		this.logger.info('Handled')
	}
}
