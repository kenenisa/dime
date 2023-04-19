import Database from '@ioc:Adonis/Lucid/Database'
import Account from 'App/Models/Account'
import { BaseTask } from 'adonis5-scheduler/build'

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
			let highestDeposit = transactions.map(v=>v.amount).reduce((a, b) => { return Math.max(a, b) });
			if(account.balance > 0){
				account.creditScore += CREDIT_CONSTANT
			}else{
				account.creditScore -= CREDIT_CONSTANT
			}
			if (account.creditScore > 1){
				account.creditScore = 1
			}else if (account.creditScore < -1){
				account.creditScore = -1
			}
			if(account.creditScore > 0){
				account.creditLimit = account.creditScore * highestDeposit;
			}else{
				account.creditLimit = 0
			}
			await account.save();
		})
		this.logger.info('Handled')
	}
}
