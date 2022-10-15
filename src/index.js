import 'idempotent-babel-polyfill';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import environment from '../environment';
import routes from './app/routes';
import path from 'path';
import mongoose from './config/mongoose';
import dotenv from 'dotenv';
import ejs from 'ejs';
import passport from 'passport'
dotenv.config()


// getting application environment
const env = process.env.NODE_ENV;

// getting application config based on environment
const envConfig = environment[env];

// setting port value
const PORT = envConfig.port || 3000;

const app = express();

app.use(passport.initialize());
app.set('view engine', 'ejs');

if (!global.status_codes)
    global.status_codes = require('./utils/statusCode');

if (!global.custom_message)
    global.custom_message = require('./config/message');

if (!global.Response)
    global.Response = require('./utils/responce');

if (!global.config)
    global.config = require('./config/config');

app.use(bodyParser.json({
    limit: '50mb'
}));

app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}));

// app.use(bodyParser.multipart());
app.use(express.static(path.join(__dirname, '/public/')));

// open mongoose connection
mongoose.connect(envConfig, env);

// CORS configuration 
app.use(cors({
    //origin: ['http://localhost:4200', 'https://flash90.iprojectlab.com', 'https://flash90-api.viitorcloud.in/', 'http://192.168.1.182:4200/'],
    origin: '*',
    //credentials: true,
    allowedHeaders: [
        'Content-Type',
        'Cookie',
        'set-cookie',
        'Authorization'
    ],
}));

// mount api routes
app.use('/', routes);

app.listen(PORT, () => {
    console.log("server listen on port:-", PORT)
});

//app.listen(PORT);
module.exports = app;