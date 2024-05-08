import { Category } from '../models/category.model.js'
import mongoose from 'mongoose';

export async function getAllCategories(req, res, next) {
    try {
        const categories = await Category.find().select('-__v');
        return res.json(categories);
    } catch (error) {
        next(error);
    }
}

export async function getAllRecipesByCategory(req,res,next){

}

export async function getCategoryById(req, res, next) {
    const id = req.params.id;
   
    if (!mongoose.Types.ObjectId.isValid(id))
        next({ message: 'id is not valid' })

    else {
        Category.findById(id, { __v: false })
            .then(c => {
                res.json(c);
            })
            .catch(err => {
                next({ message: 'category not found', status: 404 })
            })
    }
}