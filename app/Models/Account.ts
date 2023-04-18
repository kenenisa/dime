import { DateTime } from 'luxon'
import { BaseModel, HasMany, HasOne, column, hasMany, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Transaction from './Transaction'
import Business from './Business'
import Prediction from './Prediction'

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

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Transaction)
  public transactions: HasMany<typeof Transaction>

  @hasOne(() => Business)
  public business: HasOne<typeof Business>

  @hasMany(() => Prediction)
  public predictions: HasMany<typeof Prediction>

}
