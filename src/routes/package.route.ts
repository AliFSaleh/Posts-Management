import express from 'express'
import {
    createPackageHandler,
    deletePackageHandler,
    getPackageHandler,
    getPackagesHandler,
    subscribePackageHandler,
    updatePackageHandler
} from '../controllers/package.controller'
import { deserializeUser } from '../middlewares/deserializeUser'
import { validate } from '../middlewares/validate'
import { 
    CreatePackageSchema,
    updatePackageSchema
} from '../schemas/package.schema'


const router = express.Router()

router.use(deserializeUser)

router.route('/')
        .get(getPackagesHandler)
        .post(validate(CreatePackageSchema), createPackageHandler)

router.route('/:packageId')
        .get(getPackageHandler)
        .patch(validate(updatePackageSchema), updatePackageHandler)
        .delete(deletePackageHandler)


router.post('/:packageId/subscribe', subscribePackageHandler)

export default router 