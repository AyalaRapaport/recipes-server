import express from 'express'
import { addRecipe, deleteRecipe, getAllRecipes, getReciepeByPreparationTime, getRecipeById, getRecipeByUserId, updateRecipe } from '../controllers/recipe.controller.js'
import { isRegisteredUser } from '../middlewares/auth.js';

const router = express.Router();
router.post('/', isRegisteredUser, addRecipe);
router.delete('/:id', deleteRecipe);
router.get('/', getAllRecipes);
router.get('/recipeByPreparationTime', getReciepeByPreparationTime);
router.get('/:id', getRecipeById);
router.get('/recipeByUserId/:id', getRecipeByUserId);
router.put('/:id', updateRecipe);

export default router