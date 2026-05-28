import {List} from '../model/models.js'

export const EditList = async (req,res) => {

    //const { form } = req.body

    const form = { //exemplo do que vem do front
        _id:"6a177c89b988a16643e897b9",
        ID_USER:"6a1646432c9f62f5cd7b06d6",
        TITULO:"Noite",
        DESCRICAO:"Vigiar a cidade",
        PRIORIDADE:"Alta",
        STATUS:"Concluida"
    }

    if(!form.TITULO) return res.status(400).json({msg:"formulario nao fornecido"})

    const Item = await List.findById(form._id)

    if(!Item) return res.json({msg:"Tarefa nao encontrada"})

    Item.TITULO =  form.TITULO
    Item.DESCRICAO = form.DESCRICAO
    Item.PRIORIDADE = form.PRIORIDADE
    Item.STATUS = form.STATUS

    Item.save()

    res.json({msg:"Tarefa Alterada!", Item})

}