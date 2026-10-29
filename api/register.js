import { Register } from '../Backend/Controllers/RegisterController.js'
import { withDatabase } from '../Backend/services/serverless.js'

export default withDatabase(Register)
