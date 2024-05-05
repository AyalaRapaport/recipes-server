const mongoose = require('mongoose')

const recipeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    categoryName: { type: String, required: true },
    preparationTime: { type: Number, required: true },
    difficulty: { type: Number, required: true, min: 1, max: 5 },
    dateAdded: { type: Date, default: Date.now },
    layers: [{
        description: { type: String, required: true },
        ingredients: { type: [String], required: true },
    }],
    preparationInstructions: { type: String, required: true },
    image: { type: String },
    private: { type: Boolean, default: false },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
})
module.exports.Recipe = mongoose.model('recipes', recipeSchema)