import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class PredictionsController {
    public async getPredictionTraining({ }: HttpContextContract) {
        return ["hey"]
    }

}
