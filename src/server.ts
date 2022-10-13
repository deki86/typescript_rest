import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import logging from './utils/logging';
import config from './config/config';
import userRoutes from './routes/users';
import indexRoutes from './routes/index';
import loginRoutes from './routes/login';

import mongoose from 'mongoose';
// import dotenv from 'dotenv';
import path from 'path';

const NAMESPACE = 'Server';

// dotenv.config();

const app = express();

// Setting the view engine
app.set('view engine', 'ejs');
// Setting for the root path for views directory
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname + '/css')));

/** Parse request */
app.use(express.urlencoded({ extended: true }));

/** Connect to mongo */

mongoose
    .connect(config.mongo.url, config.mongo.options)
    .then((result) => {
        logging.info(NAMESPACE, 'Conncted to mongoDB');
    })
    .catch((error) => {
        logging.error(NAMESPACE, error.message, error);
    });

/** Logging */
app.use((req, res, next) => {
    logging.info(NAMESPACE, `METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}]`);

    res.on('finish', () => {
        logging.info(NAMESPACE, `METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}], STATUS - [${res.statusCode}]`);
    });

    next();
});

/** Rules of API */
app.use((req, res, next) => {
    res.header('Access-Controll-Allow-Origin', '*');
    res.header('Access-Controll-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method == 'OPTIONS') {
        res.header('Access-Controll-Allow-Methods', 'GET PATCH DELETE POST PUT');
        return res.status(200).json({});
    }

    next();
});

/** Routes */
app.use('/', indexRoutes);
app.use('/', loginRoutes);
app.use('/users', userRoutes);

/** Error Handling */
app.use((req, res, next) => {
    const error = new Error('not found');

    return res.status(404).json({
        message: error.message
    });
});

/** Create Server */

const httpServer = http.createServer(app);
httpServer.listen(config.server.port, () => logging.info(NAMESPACE, `Server runing on  ${config.server.hostname}: ${config.server.port}`));
