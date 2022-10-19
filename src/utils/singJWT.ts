import jwt from 'jsonwebtoken';
import config from '../config/config';
import logging from './logging';
import IUser from '../interfaces/user';

const NAMESPACE = 'Auth';

const singJWT = (user: IUser, callback: (error: Error | null, token: string | null) => void): void => {
    let timeSinchEpoch = new Date().getTime();
    let expirationTime = timeSinchEpoch + Number(config.server.token.exppireTime) * 100000;
    let expirationTimeInSeconds = Math.floor(expirationTime / 1000);

    logging.info(NAMESPACE, `Attemping to sing token for user ${user.email}`);

    try {
        jwt.sign(
            {
                username: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            },
            config.server.token.secret,
            {
                issuer: config.server.token.issuer,
                algorithm: 'HS256',
                expiresIn: expirationTimeInSeconds
            },
            (error, token) => {
                if (error) {
                    callback(error, null);
                } else if (token) {
                    callback(null, token);
                }
            }
        );
    } catch (error) {
        let errorMessage = 'Failed to do something exceptional';
        if (error instanceof Error) {
            errorMessage = error.message;
            logging.error(NAMESPACE, errorMessage, error);
            callback(error, null);
        } else {
            console.log('Unexpected error', error);
        }
    }
};

export default singJWT;
