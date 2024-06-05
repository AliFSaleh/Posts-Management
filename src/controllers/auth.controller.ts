import { Request, Response, NextFunction, CookieOptions } from "express";
import { User } from "../entities/users.entity";
import { signJWT } from "../utils/jwt";
import config from 'config'
import crypto from 'crypto'
import { 
    createNewUser,
    findUser,
    findUserByEmail,
    findUserById
} from "../services/user.service";
import AppError from "../utils/appError";
import { AppDataSource } from "../utils/data-source";
import Email from "../utils/email";

const userRepository = AppDataSource.getRepository(User)

const cookiesOptions: CookieOptions = {
    httpOnly: true,
    sameSite: 'lax',
};

const accessTokenCookieOptions: CookieOptions = {
    ...cookiesOptions,
    expires: new Date(
      Date.now() + config.get<number>('accessTokenExpiresIn') * 60 * 1000
    ),
    maxAge: config.get<number>('accessTokenExpiresIn') * 60 * 1000,
};

const refreshTokenCookieOptions: CookieOptions = {
    ...cookiesOptions,
    expires: new Date(
      Date.now() + config.get<number>('refreshTokenExpiresIn') * 60 * 1000
    ),
    maxAge: config.get<number>('refreshTokenExpiresIn') * 60 * 1000,
};

export const registerHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const {name, email, password} = req.body;

        const newUser = await createNewUser({
            name,
            email: email,
            password
        });

        const {verificationCode, hashedVerificationCode} = User.createVerificationCode()
        newUser.verificationCode = hashedVerificationCode;
        await newUser.save();

        const origin = config.get<string>('origin')
        const url = `${origin}/verifyEmail/${verificationCode}`
        
        try {
            await new Email(newUser, url).sendVerificationCode()

            res.status(201).json({
                status: 'success',
                message:
                  'An email with a verification code has been sent to your email',
              });
        } catch (err: any) {
            newUser.verificationCode = null;
            await newUser.save();

            return res.status(500).json({
                status: 'error',
                message: 'There was an error sending email, please try again',
            });
        }
    } catch (err: any) {
        if (err.code === '23505') {
            return res.status(409).json({
              status: 'fail',
              message: 'User with that email already exist',
            });
          }
          next(err);
    }
}

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const {email, password} = req.body
        const user = await findUserByEmail({ email });

        if(!user){
            return next(new AppError(400, 'Invalid email or password'))
        }

        if(!(await User.comparePassword(password, user.password))){
            return next(new AppError(400, 'Invalid email or password'))
        }

        const access_token = signJWT({sub: user.id}, {
            expiresIn: `${config.get<number>('accessTokenExpiresIn')}m`,
        })
        const refresh_token = signJWT({sub: user.id}, {
            expiresIn: `${config.get<number>('refreshTokenExpiresIn')}m`,
        })

        res.cookie('access_token', access_token, accessTokenCookieOptions)
        res.cookie('refresh_token', refresh_token, refreshTokenCookieOptions)
        res.cookie('logged_in', true, {
            ...accessTokenCookieOptions,
            httpOnly: false,
        });

        res.status(200).json({
            status: "SUCCESS",
            access_token
        })
    } catch (err: any) {
        next(err)
    }
}

export const logout = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const user = await findUserById(res.locals.userId)

    res.cookie('access_token', '', { maxAge: 1 });
    res.cookie('refresh_token', '', { maxAge: 1 });
    res.cookie('logged_in', '', { maxAge: 1 });

    res.status(200).json({
        status: "SUCCESS"
    })
}

export const test = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const users = await userRepository.find()
    res.json(
        users
    )
}

export const verifyEmailHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const verificationCode = crypto
            .createHash('sha256')
            .update(req.params.verificationCode)
            .digest('hex')

        const user = await findUser({ verificationCode });

        if (!user) {
        return next(new AppError(401, 'Could not verify email'));
        }

        user.verified = true;
        user.verificationCode = null;
        await user.save();

        res.status(200).json({
        status: 'success',
        message: 'Email verified successfully',
        });
    } catch (err: any) {
        next(err)
    }
}