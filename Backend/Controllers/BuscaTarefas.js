import { List } from "../model/models.js";

export const SearchList = async (req, res) => {
  try {
    const list = await List.find({ ID_USER: req.user.id })
    return res.json({ list })
  } catch (err) {
    return res.status(500).json({ msg: 'Erro ao buscar tarefas' })
  }
}
