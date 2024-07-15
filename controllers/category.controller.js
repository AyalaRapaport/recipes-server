import { Category } from '../models/category.model.js'
import mongoose, { get } from 'mongoose';

export async function getAllCategories(req, res, next) {
    try {
        const categories = await Category.find({}, { _id: 1, name: 1 }).select('-__v');
        return res.json(categories);
    } catch (error) {
        next(error);
    }
}

export async function getAllRecipesByCategory(req, res, next) {
    try {
        const categories = await Category.find().select('-__v');
        return res.json(categories);
    } catch (error) {
        next(error);
    }
}

export async function getCategoryById(req, res, next) {
    const id = req.params.id;
    console.log(mongoose.Types.ObjectId.isValid(id));
    if (!mongoose.Types.ObjectId.isValid(id))
        next({ message: 'id is not valid' })
    else {
        Category.findById(id, { __v: false }).populate("recipes").select("-__v")
            .then(c => {
                res.json(c);
            })
            .catch(err => {
                next({ message: 'category not found', status: 404 })
            })
    }
}

export async function getCategoriesWithRecipes(req, res, next) {
    try {
        const categories = await Category.find().populate("recipes").select("-__v");
        return res.json(categories);
    } catch (error) {
        next(error);
    }
};