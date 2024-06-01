import {User} from '../entities/users.entity'
import { Request, Response, NextFunction } from 'express'
import { AppDataSource } from '../utils/data-source'
import { findUserById } from '../services/user.service'

const userRepository = AppDataSource.getRepository(User)

export const getMyProfile = async (
    req: Request,
    res: Response,
    next:NextFunction
) => {
    const id = res.locals.userId
    const user = await findUserById(id)

    res.status(200).json({
        status: "SUCCESS",
        data: {
            user
        }
    })
}