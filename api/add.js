import { CriaTarefa } from '../Backend/Controllers/CriaTarefa.js'
import { withDatabase } from '../Backend/services/serverless.js'

export default withDatabase(CriaTarefa, { protectedRoute: true })
