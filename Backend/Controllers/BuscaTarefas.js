import { List } from "../model/models.js";

export const SearchList = async (req, res) => {
  try {
    const id = req.query?.id;

    if (!id) return res.status(400).json({ msg: "ID nao enviado" });

    const list = await List.find({ ID_USER: id });

    if (!list || list.length === 0) return res.json({ msg: "Nenhuma Tarefa Encontrada" });

    return res.json({ list });

  } catch (err) {
    console.error('Erro:', err);
    return res.status(500).json({ msg: 'Erro ao buscar tarefas' });
  }
};
