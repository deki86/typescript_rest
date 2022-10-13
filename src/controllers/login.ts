import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import logging from '../utils/logging';
import bcrypt, { hash } from 'bcryptjs';
import User from '../models/user';
import singJwt from '../utils/singJWT';

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
                await User.create({
                    firstName,
                    lastName,
                    email,
                    password: hash
                });
            } catch (err) {
                logging.error(NAMESPACE, 'Error on user create', err);
            }

            res.status(201).render('auth/register', {
                path: '/register',
                validationErrors: [],
                oldValue: {
                    firstName: '',
                    lastName: '',
                    email: ''
                },
                statusMessage: 'You succesfuly create user, now you can log in!'
            });
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

                    return res.status(401).json({
                        message: 'Unauthorized'
                    });
                } else if (result) {
                    singJwt(user[0], (error, token) => {
                        if (error) {
                            logging.error(NAMESPACE, 'Unable to sign token: ', error);

                            // return res.status(401).json({
                            //     message: 'Unauthorized',
                            //     error
                            // });
                            return res.status(422).render('auth/login', {
                                error: `Username and password are incorect! ${error}`
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

const validate = (req: Request, res: Response, next: NextFunction) => {
    return [
        body('firstName', 'Please enter First Name with minumum 3 characters').isLength({ min: 3 }),
        body('lastName', 'Please enter Last Name with minumum 3 characters').isLength({ min: 3 }),
        body('email', 'Please enter a valid email')
            .isEmail()
            .custom(async (value, { req }) => {
                const userDB = await User.findOne({ email: value });
                if (userDB) {
                    return Promise.reject('Email already exists, pick another one!');
                }
            }),
        body('password', 'Please enter Password with minumum 6 characters').isLength({ min: 6 }),
        body('confirmPassword').custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Password must match');
            }
            return true;
        })
    ];

    next();
};

export default { validateToken, register, login, registerView, loginView, validate };
