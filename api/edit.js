import { EditList } from '../Backend/Controllers/EditaTarefa.js'
import { withDatabase } from '../Backend/services/serverless.js'

export default withDatabase(EditList, { protectedRoute: true })
