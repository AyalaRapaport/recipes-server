import { Schema, model } from 'mongoose'

const recipeSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    categories: { type: [String] },
    preparationTime: { type: Number, required: true },
    difficulty: { type: Number, required: true, min: 1, max: 5 },
    addDate: { type: Date, default: Date.now() },
    layers: [{
        description: { type: String },
        ingredients: { type: [String], required: true },
    }],
    preparationInstructions: { type: [String], required: true },
    imageName: { type: String },
    imageUrl: { type: String },
    isPrivate: { type: Boolean, default: false },
    addedBy: {
        _id: { type: Schema.Types.ObjectId, ref: 'User', required: true }
        , name: { type: String, required: true }
    }
})
export const Recipe = model('recipes', recipeSchema)