import { SearchList } from '../Backend/Controllers/BuscaTarefas.js'
import { withDatabase } from '../Backend/services/serverless.js'

export default withDatabase(SearchList, { protectedRoute: true })
