const mongoose=require('mongoose')

const categorySchema=new mongoose.Schema({
code:{type:String,required:true},
description:{type:String,required:true},
recipes: [{ 
    name: { type: String, required: true }, 
    id: { type: Number, required: true } 
}]})
module.exports.Category=mongoose.model('categories',categorySchema)