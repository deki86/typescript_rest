import { Request, Response, NextFunction } from 'express';
import logging from '../config/logging';
import bcrypt, { hash } from 'bcryptjs';
import mongoose from 'mongoose';
import User from '../models/user';
import singJwt from '../functions/singJWT';

const NAMESPACE = 'User';

const validateToken = (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Token validated, user authorized');

    return res.status(200).json({
        message: 'Authorized'
    });
};

const register = (req: Request, res: Response, next: NextFunction) => {
    let { username, password } = req.body;

    bcrypt.hash(password, 10, (hasError, hash) => {
        if (hasError) {
            return res.status(500).json({
                message: hasError.message,
                error: hasError
            });
        }

        const _user = new User({
            _id: new mongoose.Types.ObjectId(),
            username,
            password: hash
        });

        return _user
            .save()
            .then((user) => {
                return res.status(201).json({
                    user
                });
            })
            .catch((error) => {
                return res.status(500).json({
                    message: error.message,
                    error
                });
            });
    });
};

const login = (req: Request, res: Response, next: NextFunction) => {
    let { username, password } = req.body;

    User.find({ username })
        .exec()
        .then((user) => {
            if (user.length !== 1) {
                return res.status(401).json({
                    message: 'Unauthorized'
                });
            }

            bcrypt.compare(password, user[0].password, (error, result) => {
                if (error) {
                    logging.error(NAMESPACE, error.message, error);

                    return res.status(401).json({
                        message: 'Unauthorized'
                    });
                } else if (result) {
                    singJwt(user[0], (error, token) => {
                        if (error) {
                            logging.error(NAMESPACE, 'Unable to sign token: ', error);

                            return res.status(401).json({
                                message: 'Unauthorized',
                                error
                            });
                        } else if (token) {
                            return res.status(200).json({
                                message: 'Auth Succesfull',
                                token,
                                user: user[0]
                            });
                        }
                    });
                }
            });
        })
        .catch((error) => {
            return res.status(500).json({
                message: error.message,
                error
            });
        });
};

const getAllUsers = (req: Request, res: Response, next: NextFunction) => {
    User.find()
        .select('-password')
        .exec()
        .then((users) => {
            if (users.length === 0) {
                return res.status(200).json({
                    message: 'No users in database'
                });
            }
            return res.status(200).json({
                users,
                count: users.length
            });
        })
        .catch((error) => {
            return res.status(500).json({
                message: error.message,
                error
            });
        });
};

const getOneUser = (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    User.findById(id)
        .select('-password')
        .exec()
        .then((user) => {
            return res.status(200).json({
                user
            });
        })
        .catch((error) => {
            return res.status(500).json({
                message: error.message,
                error
            });
        });
};

export default { validateToken, register, login, getAllUsers, getOneUser };
