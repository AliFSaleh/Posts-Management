import { cleanEnv, port, str } from 'envalid'

const validateEnv = () => {
    cleanEnv(process.env, {
        APP_PORT: port(),
        DB_TYPE: str(),
        POSTGRES_HOST: str(),
        POSTGRES_PORT: port(),
        DB_NAME: str(),
        POSTGRES_USER: str(),
        POSTGRES_PASSWORD: str(),
        ORIGIN: str(),
        ACCESS_TOKEN_EXPIRES_IN: str(),
        REFRESH_TOKEN_EXPIRES_IN: str(),
        EMAIL_FROM: str(),
        JWT_SECRET_TOKEN: str(),
        EMAIL_USER: str(),
        EMAIL_PASS: str(),
        EMAIL_HOST: str(),
        EMAIL_PORT: str(),
        STRIPE_SECRET: str()
    })
}

export default validateEnv