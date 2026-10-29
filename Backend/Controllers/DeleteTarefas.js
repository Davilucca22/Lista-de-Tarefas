import {List} from '../model/models.js'
import { canDeleteTask, isValidTaskId } from '../services/taskPermissions.js'

export const DeleteList = async (req,res) => {
    const {IdItem} = req.query

    if (!IdItem) return res.status(400).json({ msg: "ID nao enviado" });
    if (!isValidTaskId(IdItem)) return res.status(400).json({ msg: 'ID de tarefa inválido.' })

    const item = await List.findById(IdItem)
    if (!item) return res.status(404).json({msg:"Item nao encontrado no Banco de Dados"})
    if (!canDeleteTask(item, req.user)) return res.status(403).json({ msg: 'Você não pode excluir esta tarefa.' })

    await item.deleteOne()

    res.json({msg:"Item excluido"})
}
