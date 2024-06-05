export default {
    postgresConfig: {
      host: 'POSTGRES_HOST',
      port: 'POSTGRES_PORT',
      username: 'POSTGRES_USER',
      password: 'POSTGRES_PASSWORD',
      database: 'DB_NAME',
    },
    
    origin: 'ORIGIN',
    accessTokenExpiresIn: 'ACCESS_TOKEN_EXPIRES_IN',
    refreshTokenExpiresIn: 'REFRESH_TOKEN_EXPIRES_IN',
    emailFrom: 'EMAIL_FROM',

    jwtAccessToken: 'JWT_SECRET_TOKEN',

    smtp: {
      host: 'EMAIL_HOST',
      pass: 'EMAIL_PASS',
      port: 'EMAIL_PORT',
      user: 'EMAIL_USER',
    },
  };
  