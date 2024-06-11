import express from 'express'
import { deserializeUser } from '../middlewares/deserializeUser'
import { createSessionHandler } from '../controllers/package.controller'

const router = express.Router()

router.route('/')
        .post(deserializeUser, createSessionHandler)

export default router