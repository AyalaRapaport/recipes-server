import express from 'express'
import { getAllUsers, signIn, signUp } from '../controllers/user.controller.js'
import { isManager } from '../middlewares/auth.js'

const router = express.Router();

router.post('/signin', signIn);
router.post('/signup', signUp);
router.get('/users',isManager,getAllUsers)

export default router