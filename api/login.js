import { Login } from '../Backend/Controllers/LoginController.js'
import { withDatabase } from '../Backend/services/serverless.js'

export default withDatabase(Login)
