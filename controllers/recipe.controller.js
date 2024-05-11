import mongoose from 'mongoose';
import { Recipe } from '../models/recipe.model.js'
import { Category } from '../models/category.model.js'

export async function getAllRecipes(req, res, next) {
    let { search, page, perPage } = req.query;
    search ??= '';
    page ??= '';
    perPage ??= '';

    try {
        const recipes = await Recipe.find({ name: new RegExp(search) })
            .skip((page - 1) * perPage)
            .limit(perPage)
            .select('-__v');
        return res.json(recipes);
    } catch (error) {
        next(error);
    }
}

export async function getRecipeById(req, res, next) {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id))
        next({ message: 'id is not valid' })
    else
        Recipe.findById(id, { __v: false })
            .then(recipe => {
                res.json(recipe);
            })
            .catch(err => {
                next({ message: 'recipe not found', status: 404 })
            })
}

export async function getRecipeByUserId(req, res, next) {
    try {
        const { id } = req.params;
        const recipes = await Recipe.find({ 'user.id': id }).select('-__v');
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
        newRecipe.categories.forEach(async category => {
            let c = await Category.findOne({ name: category })
            if (!c) {
                try {
                    const newCategory = new Category({ name: c, recipes: [] });
                    await newCategory.save();
                    c = newCategory;
                } catch (err) {
                    next(err);
                }
            }
            category.recipes.push({ _id: newRecipe._id, name: newRecipe.name })
            await category.save();
        })
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

