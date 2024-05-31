import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from 'config'
import AppError from "../utils/appError";

export const deserializeUser = async (
    req: Request,
    res:Response,
    next: NextFunction
) => {
    let access_token ='';
    if(req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        access_token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.access_token) {
        access_token = req.cookies.access_token;
    }

    if(!access_token)
        next(new AppError(401, 'You are not logged in'))    

    const privateKey = config.get<string>('jwtAccessToken');
    const decode = jwt.verify(access_token, privateKey);

    if(!decode)
        return next(new AppError(401, 'Invalid token or user does not exist')); 
    
    res.locals.userId = decode.sub
    
    next()
}