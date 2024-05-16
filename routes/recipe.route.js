import express from 'express'
import {addRecipe,deleteRecipe,getAllRecipes,getReciepeByPreparationTime,getRecipeById,getRecipeByUserId,updateRecipe} from '../controllers/recipe.controller.js'

const router=express.Router();

router.post('/',addRecipe);
router.delete('/',deleteRecipe);
router.get('/',getAllRecipes);
router.get('/recipeByPreparationTime',getReciepeByPreparationTime);
router.get('/:id',getRecipeById);
router.get('/recipeByUserId',getRecipeByUserId);
router.put('/:id',updateRecipe);

export default router