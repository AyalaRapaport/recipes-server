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
        const recipes = await Recipe.find({ preparationTime: { $lte: preparationTime } }).select('-__v');
        return res.json(recipes);
    } catch (error) {
        next(error);
    }
}

export async function addRecipe(req, res, next) {
    console.log("addrecipe");
    try {
        const { name, description, difficulity, preparationHours, preparationMinutes, isPrivate, image, categories, newCategories, layers, ingredients, preparationInstructions, user
        } = req.body;
        console.log(layers);
        const totalPreparationTime = (preparationHours * 60) + preparationMinutes;
        // const layers = [{
        //     description: 'Main Layer',
        //     ingredients: ingredients.map(ingredient => ingredient.name).filter(name => name) // המרת האובייקטים למחרוזות וסינון מחרוזות ריקות
        // }];
        const processedLayers = layers.map(layer => ({
            description: layer.description,
            ingredients: layer.ingredients.map(ingredient => ingredient.name).filter(name => name)
        }));
        const prepInstructionsArray = preparationInstructions.map(instr => instr.step).filter(step => step);

        const newRecipe = new Recipe({
            name,
            description,
            categories: categories,
            preparationTime: totalPreparationTime,
            difficulty: difficulity,
            addDate: new Date(),
            layers: processedLayers,
            preparationInstructions: prepInstructionsArray,
            image: [image],
            isPrivate: isPrivate === 'כן',
            addedBy: {
                _id: user._id,
                name: user.name
            }
        });
        await newRecipe.save();

        const categoryPromises = newRecipe.categories.map(async category => {
            let c = await Category.findOne({ name: category });
            if (!c) {
                c = new Category({ name: category, recipes: [] });
                await c.save();
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

// export async function addRecipe(req, res, next) {
//     console.log("addrecipe");
//     try {

//         console.log(req.body);
//         const layers = [{
//             description: 'Main Layer', 
//             ingredients: ingredients.map(ingredient => ingredient.name).filter(name => name) // המרת האובייקטים למחרוזות וסינון מחרוזות ריקות
//         }];
//         const prepInstructions = preparationInstructions.map(instr => instr.step).filter(step => step).join('\n');

//         const newRecipe = new Recipe(req.body);
//         await newRecipe.save();

//         const categoryPromises = newRecipe.categories.map(async category => {
//             let c = await Category.findOne({ name: category });
//             console.log(c);
//             if (!c) {
//                 try {
//                     c = new Category({ name: category, recipes: [] });
//                     await c.save();
//                 } catch (err) {
//                     console.log(err);
//                     next(err);
//                 }
//             }
//             c.recipes.push({ _id: newRecipe._id, name: newRecipe.name });
//             await c.save();
//         });

//         await Promise.all(categoryPromises);

//         return res.status(201).json(newRecipe);
//     } catch (error) {
//         next(error);
//     }
// }


export async function updateRecipe(req, res, next) {
    const id = req.params.id;
    console.log(id);
    if (!mongoose.Types.ObjectId.isValid(id))
        next({ message: 'id is not valid' })
    try {
        const { name, description, difficulity, preparationHours, preparationMinutes, isPrivate, image, categories, newCategories, layers, ingredients, preparationInstructions, user
        } = req.body;
        console.log(layers);
        const totalPreparationTime = (preparationHours * 60) + preparationMinutes;

        const processedLayers = layers.map(layer => ({
            description: layer.description,
            ingredients: layer.ingredients.map(ingredient => ingredient.name).filter(name => name)
        }));
        const prepInstructionsArray = preparationInstructions.map(instr => instr.step).filter(step => step);

        const newRecipe = new Recipe({
            _id:id,
            name,
            description,
            categories: categories,
            preparationTime: totalPreparationTime,
            difficulty: difficulity,
            addDate: new Date(),
            layers: processedLayers,
            preparationInstructions: prepInstructionsArray,
            image: [image],
            isPrivate: isPrivate === 'כן',
            addedBy: {
                _id: user._id,
                name: user.name
            }
        });
        const updatedFields = newRecipe.toObject();
        const recipe = await Recipe.findByIdAndUpdate(id,
            { $set: updatedFields }, { new: true });

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

