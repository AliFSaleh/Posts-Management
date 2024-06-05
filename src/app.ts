require('dotenv').config()
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import config from 'config'
import path from 'path'
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { AppDataSource } from './utils/data-source';

import authRouter from './routes/auth.route'
import userRouter from './routes/user.route'
import postRouter from './routes/post.route'

import AppError from './utils/appError';

AppDataSource.initialize().then(() => {
    const app = express();
    const port = process.env.APP_PORT

    app.set('view engine', 'pug');
    app.set('views', path.join(__dirname, `/views`));

    app.use(bodyParser.json())
    app.use(cookieParser())
    app.use(express.urlencoded({ extended: true }))
    
    app.use(cors({
        origin: config.get<string>('origin'),
        credentials: true
    }))

    app.use('/storage', express.static('src/uploads'))

    app.use('/api/auth', authRouter)
    app.use('/api/users', userRouter)
    app.use('/api/posts', postRouter)

    
    app.all('*', (req: Request, res: Response, next: NextFunction) => {
        next(new AppError(404, `Route ${req.originalUrl} not found`))
    })

    app.use(
        (error: AppError, req: Request, res: Response, next: NextFunction) => {
          error.status = error.status || 'error';
          error.statusCode = error.statusCode || 500;
  
          res.status(error.statusCode).json({
            status: error.status,
            message: error.message,
          });
        }
    );

    app.listen(port, ()=>{
        console.log(`Server is listening on port ${port}`);
    })
})