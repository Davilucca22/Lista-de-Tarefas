import { List } from "../model/models.js";

export const CriaTarefa = async (req, res) => {
    const { form } = req.body

    if (!form?.titulo) return res.status(400).json({ msg: "informe o Titulo!" })

    const addToList = await List.create({
        ID_USER: req.user.id,
        TITULO: form.titulo,
        DESCRICAO: form.descricao || '',
        PRIORIDADE: form.prioridade,
        STATUS: form.status
    })

    res.json({ msg: "Tarefa Adicionada!", addToList })
}
