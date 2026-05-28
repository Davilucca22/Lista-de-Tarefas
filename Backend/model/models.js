import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    NAME:{
        type:String,
        required:true
    },
    EMAIL:{
        type:String,
        required:true
    },
    PASSWORD:{
        type:String,
        required:true
    }
})

export const Userr = mongoose.model('Userr',UserSchema)


const ListSchema = new mongoose.Schema({
    ID_USER:{
        type: mongoose.Types.ObjectId,
        ref:'Userr'
    },
    TITULO:{
        type: String,
        required: true
    },
    DESCRICAO:{
        type: String,
        required: false
    },
    PRIORIDADE:{
        type: String,
        required: true
    },
    STATUS:{
        type: String,
        required: true
    }
})

export const List = mongoose.model('list', ListSchema)