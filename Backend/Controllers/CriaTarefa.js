import { List } from "../model/models.js";

export const CriaTarefa = async (req,res) => {
    //const {form} = req.body

    const form = { //exemplo do que vem do front
        id:"6a16d169a5f5684e65eef1d0",
        titulo:"TESTE2",
        descricao:"Ola, Mundo!",
        prioridade:"Média",
        status:"Pendente"
    }

    if(!form.titulo) return res.status(400).json({msg:"informe o Titulo!"})

    const addToList = await List.create({
        ID_USER: form.id,
        TITULO:form.titulo,
        DESCRICAO: form.descricao,
        PRIORIDADE: form.prioridade,
        STATUS: form.status
    })

    res.json({msg:"Tarefa Adicionada!", addToList})

}