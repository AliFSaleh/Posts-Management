import config from 'config';
import fs from 'fs'
import jwt, {SignOptions} from 'jsonwebtoken'

export const signJWT = (
    payload: Object,
    options: SignOptions 
) => {
    const privateKey = config.get<string>('jwtAccessToken')

    const token = jwt.sign(payload, privateKey, {
        ... (options && options)
    })
    
    return token
}