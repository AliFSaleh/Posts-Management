import express from 'express'
import { getMySubscriptions } from '../controllers/package.controller'
import { deserializeUser } from '../middlewares/deserializeUser'

const router = express.Router()

router.use(deserializeUser)

router.get('/', getMySubscriptions)

export default router