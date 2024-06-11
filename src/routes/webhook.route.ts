import express from 'express'
import { deserializeUser } from '../middlewares/deserializeUser'
import { webhookHandler } from '../controllers/package.controller'

const router = express.Router()

router.route('/')
        .post(deserializeUser, webhookHandler)

export default router