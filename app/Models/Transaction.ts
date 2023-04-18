import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Account from './Account'

export default class Transaction extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public accountId: number

  @column()
  public receiverAddress: string

  @column()
  public signature: string

  @column()
  public amount: number

  @column()
  public deposit: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Account)
  public account: BelongsTo<typeof Account>
}
