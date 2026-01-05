const mongoose = require ('mongoose');

// Define Note Schema
const noteSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    folder:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Folder',
        default:null
    },
    title:{
        type:String,
        required:true,
        trim:true
    },
    content:{
        type:String,
        required:true
    }
},{timestamps:true});

module.exports=mongoose.model('Note',noteSchema);
