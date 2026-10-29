import { RespondToInvite } from '../../../Backend/Controllers/TeamController.js'
import { withDatabase } from '../../../Backend/services/serverless.js'

export default withDatabase(RespondToInvite, { protectedRoute: true })
