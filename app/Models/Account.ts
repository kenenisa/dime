import { DateTime } from 'luxon'
import { BaseModel, HasMany, HasOne, column, hasMany, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Transaction from './Transaction'
import Business from './Business'
import Prediction from './Prediction'
import ReserveVote from './ReserveVote'
import Loan from './Loan'
import Webhook from './Webhook'

export default class Account extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public address: string

  @column()
  public publicKey: string

  @column()
  public balance: number

  @column()
  public currency: string

  @column()
  public highestDeposit: number

  @column()
  public creditLimit: number

  @column()
  public creditScore: number

  @column()
  public loaner: boolean
  
  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Transaction, { serializeAs: null })
  public transactions: HasMany<typeof Transaction>

  @hasOne(() => Business, { serializeAs: null })
  public business: HasOne<typeof Business>

  @hasOne(() => ReserveVote, { serializeAs: null })
  public vote: HasOne<typeof ReserveVote>

  @hasOne(() => Loan, { serializeAs: null })
  public loan: HasOne<typeof Loan>

  @hasOne(() => Webhook, { serializeAs: null })
  public webhook: HasOne<typeof Webhook>

  @hasMany(() => Prediction,{serializeAs:null})
  public predictions: HasMany<typeof Prediction>

}
