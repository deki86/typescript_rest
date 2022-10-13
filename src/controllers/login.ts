import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import bcrypt, { hash } from 'bcryptjs';
import logging from '../utils/logging';
import singJwt from '../utils/singJWT';
import User from '../models/user';
const jwtKey = process.env['JWT_KEY'] || 'supersecret';

const NAMESPACE = 'Login';

const validateToken = (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Token validated, user authorized');

    return res.status(200).json({
        message: 'Authorized'
    });
};

const registerView = (req: Request, res: Response, next: NextFunction) => {
    const response = {
        title: 'Register',
        validationErrors: [],
        oldValue: {
            firstName: '',
            lastName: '',
            email: ''
        },
        statusMessage: ''
    };

    res.render('auth/register', response);
};

const register = async (req: Request, res: Response, next: NextFunction) => {
    const { firstName, lastName, email, password } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('auth/register', {
            path: '/register',
            validationErrors: errors.mapped(),
            oldValue: {
                firstName: firstName,
                lastName: lastName,
                email: email
            },
            statusMessage: ''
        });
    } else {
        bcrypt.hash(password, 10, async (hashError, hash) => {
            if (hashError) {
                return res.status(401).json({
                    message: hashError.message,
                    error: hashError
                });
            }

            try {
                let user = await User.create({
                    firstName,
                    lastName,
                    email,
                    password: hash
                });

                singJwt(user, (error, token) => {
                    return res.status(201).render('index', { message: 'Auth Succesfull', token, user: user });
                });
            } catch (err) {
                logging.error(NAMESPACE, 'Error on user create', err);
            }
        });
    }
};

const loginView = (req: Request, res: Response, next: NextFunction) => {
    const response = {
        title: 'Login',
        error: req.query.error
    };

    res.render('auth/login', response);
};

const login = (req: Request, res: Response, next: NextFunction) => {
    let { email, password } = req.body;

    User.find({ email })
        .exec()
        .then((user) => {
            if (user.length !== 1) {
                return res.status(422).render('auth/login', {
                    error: 'Username and password are incorect!'
                });
            }

            bcrypt.compare(password, user[0].password, (error, result) => {
                if (error) {
                    logging.error(NAMESPACE, error.message, error);

                    return res.status(422).render('auth/login', {
                        error: `Username and password are incorect! ${error}`
                    });
                } else if (result) {
                    singJwt(user[0], (error, token) => {
                        if (error) {
                            logging.error(NAMESPACE, 'Unable to sign token: ', error);

                            return res.status(422).render('auth/login', {
                                error: `Username and password are incorect! ${error}`
                            });
                        } else if (token) {
                            res.cookie('jwt', token);
                            return res.status(200).render('index', { message: 'Auth Succesfull', token, user: user[0] });
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

const logout = (req: Request, res: Response, next: NextFunction) => {};

const withUser = [
    cookieParser(),
    (req: Request, res: Response, next: NextFunction) => {
        const token = jwt.verify(req.cookies['jwt'], jwtKey);
        console.log('eeej', token);
        // let user = User.find({ token['username'] });
        // console.log('test user', user);
        next();
    }
];

export default { validateToken, register, login, registerView, loginView, logout, withUser };
