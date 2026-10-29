import { List } from "../model/models.js";
import { taskVisibilityFilter } from '../services/taskPermissions.js'

export const SearchList = async (req, res) => {
  try {
    const list = await List.find(taskVisibilityFilter(req.user))
      .populate('ASSIGNED_TO', 'NAME EMAIL')
      .sort({ createdAt: -1 })
    return res.json({ list })
  } catch (err) {
    console.error('Erro ao buscar tarefas:', err)
    return res.status(500).json({ msg: 'Erro ao buscar tarefas' })
  }
}
