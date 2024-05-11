import express from 'express'
import { getAllUsers, signIn, signUp } from '../controllers/user.controller.js'
import { isAdmin } from '../middlewares/auth.js'

const router = express.Router();

router.post('/signin', signIn);
router.post('/signup', signUp);
router.get('/', isAdmin, getAllUsers)

export default router