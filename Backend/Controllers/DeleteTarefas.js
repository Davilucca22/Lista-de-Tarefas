import {List} from '../model/models.js'

export const DeleteList = async (req,res) => {
    const {IdItem} = req.query

    if (!IdItem) return res.status(400).json({ msg: "ID nao enviado" });

    const DelItem = await List.findByIdAndDelete(IdItem)

    if(!DelItem) return res.json({msg:"Item nao encontrado no Banco de Dados"})

    res.json({msg:"Item excluido"})
}
