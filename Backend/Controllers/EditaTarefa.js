import { List } from '../model/models.js'

export const EditList = async (req, res) => {
    const { form } = req.body

    if (!form?.TITULO) return res.status(400).json({ msg: "formulario nao fornecido" })

    const Item = await List.findById(form._id)
    if (!Item) return res.json({ msg: "Tarefa nao encontrada" })

    Item.TITULO = form.TITULO
    Item.DESCRICAO = form.DESCRICAO
    Item.PRIORIDADE = form.PRIORIDADE
    Item.STATUS = form.STATUS

    await Item.save()
    res.json({ msg: "Tarefa Alterada!", Item })
}
