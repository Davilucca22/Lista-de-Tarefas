import { DeleteList } from '../Backend/Controllers/DeleteTarefas.js'
import { withDatabase } from '../Backend/services/serverless.js'

export default withDatabase(DeleteList, { protectedRoute: true })
