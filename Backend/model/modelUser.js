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