import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Account from './Account'

export default class Webhook extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public accountId: number

  @column()
  public url: string
  
  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Account)
  public account: BelongsTo<typeof Account>
}
