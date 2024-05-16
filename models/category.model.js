import { Schema, model } from 'mongoose'
import mongoose from 'mongoose'

const recipeSchema = new Schema({
    _id: { type: mongoose.Types.ObjectId,ref: 'Recipe' },
    name: { type: String },
})
const categorySchema = new Schema({
    name: { type: String, required: true },
    recipes:{type:[recipeSchema]}
})
export const Category=model('categories',categorySchema)