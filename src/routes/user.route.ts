import express from 'express'
import {deserializeUser} from '../middlewares/deserializeUser'
import { getMyProfile } from '../controllers/users.controller'

const router = express.Router()

router.route('/me')
        .get(deserializeUser, getMyProfile)

export default router