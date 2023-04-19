import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Webhook from 'App/Models/Webhook'
// import fetch from "node-fetch"

export default class WebhookResolver {
  public async handle({ request, response }: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    await next();
    (await Webhook.all())
      .map(w => w.url).forEach(url => {
        // fetch(url, {
        //   method: "POST",
        //   body: JSON.stringify({ request, response })
        // })
      });

  }
}
