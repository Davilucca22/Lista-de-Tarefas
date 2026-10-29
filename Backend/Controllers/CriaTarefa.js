import { List } from "../model/models.js";
import { Userr } from "../model/models.js";
import { isValidDueDate, isValidPriorityAndStatus } from '../services/taskPermissions.js'

export const CriaTarefa = async (req, res) => {
    const { form } = req.body

    if (!form?.titulo?.trim()) return res.status(400).json({ msg: "informe o Titulo!" })
    const category = form.CATEGORIA ?? form.CATEGORY ?? form.category ?? form.categoria
    const dueDate = form.DATA_VENCIMENTO ?? form.DUE_DATE ?? form.dueDate ?? form.dataVencimento
    if (category != null && typeof category !== 'string') {
        return res.status(400).json({ msg: 'Categoria inválida.' })
    }
    if (category?.trim().length > 40) {
        return res.status(400).json({ msg: 'A categoria deve ter no máximo 40 caracteres.' })
    }
    if (!isValidDueDate(dueDate)) {
        return res.status(400).json({ msg: "Data de vencimento inválida." })
    }
    if (!isValidPriorityAndStatus(form.prioridade, form.status)) {
        return res.status(400).json({ msg: 'Prioridade ou status inválido.' })
    }

    const teamTask = req.user.ROLE === 'manager' && req.user.TEAM
    let assignedTo = null
    if (form.responsavel) {
        if (!teamTask) return res.status(403).json({ msg: 'Somente gestores podem atribuir tarefas.' })
        if (!await Userr.exists({ _id: form.responsavel, TEAM: req.user.TEAM })) {
            return res.status(400).json({ msg: 'O responsável não pertence à sua equipe.' })
        }
        assignedTo = form.responsavel
    }

    const addToList = await List.create({
        ID_USER: req.user.id,
        TEAM: teamTask ? req.user.TEAM : null,
        ASSIGNED_TO: assignedTo,
        TITULO: form.titulo.trim(),
        DESCRICAO: form.descricao || '',
        PRIORIDADE: form.prioridade,
        STATUS: form.status,
        CATEGORIA: category?.trim() || 'Geral',
        DATA_VENCIMENTO: dueDate ? new Date(`${dueDate}T00:00:00.000Z`) : null,
    })

    await addToList.populate('ASSIGNED_TO', 'NAME EMAIL')
    res.json({ msg: "Tarefa Adicionada!", addToList })
}
