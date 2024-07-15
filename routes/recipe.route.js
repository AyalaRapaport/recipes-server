import express from 'express'
import { addRecipe, deleteRecipe, getAllRecipes, getPrivateRecipeByUserId, getReciepeByPreparationTime, getRecipeById, updateRecipe } from '../controllers/recipe.controller.js'
import { isRegisteredUser } from '../middlewares/auth.js';
import multer from 'multer';

const router = express.Router();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});
const upload = multer({ storage: storage })


router.post('/', isRegisteredUser, upload.single('image'), addRecipe);
router.delete('/:id', deleteRecipe);
router.get('/', getAllRecipes);
router.get('/recipeByPreparationTime', getReciepeByPreparationTime);
router.get('/:id', getRecipeById);
router.get('/recipeByUserId/:id', getPrivateRecipeByUserId);
router.put('/:id', upload.single('image'), updateRecipe);

export default router