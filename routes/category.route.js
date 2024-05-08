import express from 'express'
import { getAllCategories,getAllRecipesByCategory,getCategoryById } from '../controllers/category.controller.js'

const router = express.Router();

router.post('/categories', getAllCategories);
router.post('/recipesByCategory', getAllRecipesByCategory);
router.get('/:id',getCategoryById)

export default router