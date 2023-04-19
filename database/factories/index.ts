import Factory from '@ioc:Adonis/Lucid/Factory'
import Account from 'App/Models/Account'



export const AccountFactory = Factory
  .define(Account, ({ faker }) => {
    return {
     
    }
  })
  .build()
