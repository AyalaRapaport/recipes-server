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
        const recipes = await Recipe.find({ 'addedBy._id': id }).select('-__v');
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

        const categoryPromises = newRecipe.categories.map(async category => {
            let c = await Category.findOne({ name: category });
            console.log(c);
            if (!c) {
                try {
                    c = new Category({ name: category, recipes: [] });
                     await c.save();
                } catch (err) {
                    console.log(err);
                    next(err);
                }
            }
            c.recipes.push({ _id: newRecipe._id, name: newRecipe.name });
           await c.save();
        });

        await Promise.all(categoryPromises);

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
        let recipe = await Recipe.findById(id);
        if (!recipe)
            return next({ message: 'recipe not found', status: 404 })
        recipe.categories.forEach(async c => {
            try {
                await Category.updateOne(
                    { name: c },
                    { $pull: { recipes: { _id: recipe._id } } }
                )
                let category = await Category.findOne({ name: c }).then(c => {
                    return c;
                })
                    .catch(err => {
                        next({ message: 'category not found', status: 404 })
                    });
                if (category.recipes.length === 0)
                    await Category.findByIdAndDelete(category._id);
            } catch (error) {
                next(error)
            }
        })

        await Recipe.findByIdAndDelete(id)
        return res.status(204).send();
    } catch (error) {
        next(error)
    }
}

