import {z, object, string, optional} from 'zod'
import { RoleEnumType } from '../entities/users.entity';

export const createUserSchema = object({
    body: object({
        name: string({
            required_error: 'Name is required'
        }),

        email: string({
            required_error: 'Email is required',
        }).email('Invalid email address'),

        password: string({
            required_error: 'Password is required'
        })
        .min(6, 'Password must be more than 6 characters')
        .max(12, 'Password must be less than 12 characters'),
    
        passwordConfirm: string({
            required_error: 'Password confirmation is required'
        }),

        role: optional(z.nativeEnum(RoleEnumType))
    }).refine((data)=> data.password === data.passwordConfirm, {
        path: ['passwordConfirm'],
        message: 'Passwords do not match',
    }),
});

export const loginUserSchema = object({
    body: object({
        email: string({
            required_error: 'Email is required'
        }).email('Invalid email address'),

        password: string({
            required_error: 'Password is required'
        })
    })
})
