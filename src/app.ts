require('dotenv').config()
import express from 'express';
import { AppDataSource } from './utils/data-source';

AppDataSource.initialize().then(() => {
    const app = express();
    const port = process.env.APP_PORT

    app.listen(port, ()=>{
        console.log(`Server is listening on port ${port}`);
    })
})