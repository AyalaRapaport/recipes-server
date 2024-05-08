import mongoose from 'mongoose';
import { Recipe } from '../models/recipe.model.js'

export async function getAllRecipes(req, res, next) {
    try {
        const recipes = await Recipe.find().select('-__v');
        return res.json(recipes);
    } catch (error) {
        next(error);
    }
}

export async function getRecipeById(req, res, next) {
    try {
        const recipeId = req.params.recipeId;
        const recipe = await Recipe.findById(recipeId).select('-__v');
        if (!recipe) {
            return next('Recipe not found');
        }
        return res.json(recipe);
    } catch (error) {
        next(error);
    }
}

export async function getRecipeByUserId(req, res, next) {
    try {
        const { userId } = req.params;
        const recipes = await Recipe.find({ userId: userId }).select('-__v');
        return res.json(recipes);
    } catch (error) {
        next(error);
    }
}

export async function getReciepeByPreparationTime(req, res, next) {
    const { preparationTime } = req.params;
    try {
        // const preparationTime = req.query.preparationTime;
        const recipes = await Recipe.find({ preparationTime: { $lte: preparationTime } }).select('-__v');
        return res.json(recipes);
    } catch (error) {
        next(error);
    }
}

export async function addRecipe(req, res, next) {
    try {
        const newRecipe = new Recipe(req.body);
        await newRecipe.save();
        return res.status(201).json(newRecipe);
    } catch (error) {
        next(error);
    }
}

export async function updateRecipe(req, res, next) {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id))
        next({ message: 'id is not valid' })

    try {
        const recipe = await Recipe.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true }
        )
        return res.json(recipe);
    } catch (error) {
        next(error)
    }
}

export async function deleteRecipe(req, res, next) {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id))
        next({ message: 'id is not valid' })
    try {
        if (!(await Recipe.findById(id)))
            return next({ message: 'recipe not found', status: 404 })

        await Recipe.findByIdAndDelete(id)
        return res.status(204).send();
    } catch (error) {
        next(error)
    }
}

