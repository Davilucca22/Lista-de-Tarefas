import { TeamDashboard } from '../../Backend/Controllers/TeamController.js'
import { withDatabase } from '../../Backend/services/serverless.js'

export default withDatabase(TeamDashboard, { protectedRoute: true })
