import express from 'express'
import {
    login,
    registerHandler,
    logout,
    test,
    verifyEmailHandler
} from '../controllers/auth.controller'
import {createUserSchema} from '../schemas/user.schema'
import { validate } from '../middlewares/validate'
import {deserializeUser} from '../middlewares/deserializeUser'

const router = express.Router()

router.route('/register')
        .post(validate(createUserSchema), registerHandler)
router.route('/login')
        .post(login)
router.route('/logout')
        .post(deserializeUser, logout)


router.get('/verifyEmail/:verificationCode', verifyEmailHandler);
        
router.route('/test')
        .post(test)

export default router