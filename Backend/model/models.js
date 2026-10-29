import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    NAME:{
        type:String,
        required:true,
        trim:true
    },
    EMAIL:{
        type:String,
        required:true,
        trim:true,
        lowercase:true
    },
    PASSWORD:{
        type:String,
        required:true
    },
    ROLE:{
        type:String,
        enum:['manager','member'],
        default:'member'
    },
    TEAM:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Team',
        default:null
    }
}, { timestamps:true })

export const Userr = mongoose.model('Userr',UserSchema)

const TeamSchema = new mongoose.Schema({
    NAME:{ type:String, required:true, trim:true },
    MANAGER:{ type:mongoose.Schema.Types.ObjectId, ref:'Userr', required:true }
}, { timestamps:true })

export const Team = mongoose.model('Team', TeamSchema)

const TeamInviteSchema = new mongoose.Schema({
    TEAM:{ type:mongoose.Schema.Types.ObjectId, ref:'Team', required:true },
    USER:{ type:mongoose.Schema.Types.ObjectId, ref:'Userr', required:true },
    INVITED_BY:{ type:mongoose.Schema.Types.ObjectId, ref:'Userr', required:true },
    STATUS:{ type:String, enum:['pending','accepted','declined'], default:'pending' }
}, { timestamps:true })

export const TeamInvite = mongoose.model('TeamInvite', TeamInviteSchema)

const ListSchema = new mongoose.Schema({
    ID_USER:{
        type: mongoose.Types.ObjectId,
        ref:'Userr',
        required:true
    },
    TEAM:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Team',
        default:null
    },
    ASSIGNED_TO:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Userr',
        default:null
    },
    TITULO:{
        type: String,
        required: true,
        trim:true,
        maxlength:80
    },
    DESCRICAO:{
        type: String,
        required: false,
        maxlength:300
    },
    PRIORIDADE:{
        type: String,
        required: true,
        enum:['Alta','Média','Baixa']
    },
    STATUS:{
        type: String,
        required: true,
        enum:['Pendente','Concluida','Concluída']
    },
    CATEGORY:{
        type:String,
        trim:true,
        default:'Geral',
        maxlength:40
    },
    DUE_DATE:{
        type:String,
        default:''
    },
    CATEGORIA:{
        type:String,
        trim:true,
        default:'Geral',
        maxlength:40
    },
    DATA_VENCIMENTO:{
        type:Date,
        default:null
    }
}, { timestamps:true })

export const List = mongoose.model('list', ListSchema)