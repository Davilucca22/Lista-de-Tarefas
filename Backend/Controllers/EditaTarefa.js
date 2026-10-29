import { List } from '../model/models.js'
import { Userr } from '../model/models.js'
import { canUpdateTask, isValidDueDate, isValidPriorityAndStatus, isValidTaskId } from '../services/taskPermissions.js'

export const EditList = async (req, res) => {
    const { form } = req.body

    if (!form?.TITULO?.trim()) return res.status(400).json({ msg: "formulario nao fornecido" })
    if (!isValidTaskId(form._id)) return res.status(400).json({ msg: 'ID de tarefa inválido.' })
    const dueDate = form.DATA_VENCIMENTO ?? form.DUE_DATE ?? ''
    const category = form.CATEGORIA ?? form.CATEGORY ?? 'Geral'
    if (!isValidDueDate(dueDate)) return res.status(400).json({ msg: 'Data de vencimento inválida.' })
    if (typeof category !== 'string' || category.trim().length > 40) {
        return res.status(400).json({ msg: 'Categoria inválida.' })
    }
    if (!isValidPriorityAndStatus(form.PRIORIDADE, form.STATUS)) {
        return res.status(400).json({ msg: 'Prioridade ou status inválido.' })
    }

    const Item = await List.findById(form._id)
    if (!Item) return res.status(404).json({ msg: "Tarefa não encontrada." })
    if (!canUpdateTask(Item, req.user)) return res.status(403).json({ msg: 'Você não pode alterar esta tarefa.' })

    Item.TITULO = form.TITULO.trim()
    Item.DESCRICAO = form.DESCRICAO ?? ''
    Item.PRIORIDADE = form.PRIORIDADE
    Item.STATUS = form.STATUS
    Item.CATEGORIA = category.trim() || 'Geral'
    Item.DATA_VENCIMENTO = dueDate ? new Date(`${dueDate}T00:00:00.000Z`) : null

    if (req.user.ROLE === 'manager' && Item.TEAM) {
        if (form.ASSIGNED_TO) {
            const assignedUser = await Userr.exists({ _id: form.ASSIGNED_TO, TEAM: req.user.TEAM })
            if (!assignedUser) return res.status(400).json({ msg: 'O responsável não pertence à sua equipe.' })
        }
        Item.ASSIGNED_TO = form.ASSIGNED_TO || null
    }

    await Item.save()
    await Item.populate('ASSIGNED_TO', 'NAME EMAIL')
    res.json({ msg: "Tarefa alterada!", Item })
}
