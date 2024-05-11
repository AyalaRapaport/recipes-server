import { Schema, model } from 'mongoose'

const recipeSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    categories:{type:[String]},
    preparationTime: { type: Number, required: true },
    difficulty: { type: Number, required: true, min: 1, max: 5 },
    dateAdded: { type: Date, default: Date.now() },
    layers: [{
        description: { type: String, required: true },
        ingredients: { type: [String], required: true },
    }],
    preparationInstructions: { type: String, required: true },
    image: { type: [String] },
    private: { type: Boolean, default: false },
    addedBy: {_id: {type: Schema.Types.ObjectId, ref: 'User', required: true}
    ,name:{type:String,required:true}
 }
})
export const Recipe = model('recipes', recipeSchema)