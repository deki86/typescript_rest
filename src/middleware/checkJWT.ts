import { Request, Response, NextFunction } from 'express';
import logging from '../utils/logging';
import jwt from 'jsonwebtoken';
import config from '../config/config';

const NAMESPACE = 'Auth';

const checkJWT = (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Validating token');

    const cookies = req.cookies;
    if (!cookies.jwt) return res.status(401).json({ message: 'Unauthorized' });

    let token = cookies.jwt;

    jwt.verify(token, config.server.token.secret, (error: any, decoded: any) => {
        if (error) return res.status(403).json({ message: 'Invalid token' });
        res.locals.user = decoded;
        next();
    });
};

export default checkJWT;
