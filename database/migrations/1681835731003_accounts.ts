import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'accounts'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */

      table.string("address")
      table.text("public_key")
      table.float("balance")
      table.string("currency")
      table.float("highest_deposit").defaultTo(0)
      table.float("credit_score").defaultTo(0.1)
      table.float("credit_limit").defaultTo(0)
      table.float("loaner").defaultTo(false)

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
