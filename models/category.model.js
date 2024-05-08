import { Schema, model } from 'mongoose'

const categorySchema=new Schema({
code:{type:String,required:true},
description:{type:String,required:true},
recipes: [{ 
    name: { type: String, required: true }, 
    id: { type: Number, required: true } 
}]})
export const Category=model('categories',categorySchema)