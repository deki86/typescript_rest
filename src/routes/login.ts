import express from 'express';
import { body } from 'express-validator';
import User from '../models/user';
import loginController from '../controllers/login';
import checkJwt from '../middleware/checkJWT';

const router = express.Router();

router.get('/validate', checkJwt, loginController.validateToken);
router.get('/register', loginController.registerView);
router.post(
    '/register',
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
    }),
    loginController.register
);
router.get('/login', loginController.loginView);
router.post('/login', loginController.login);
router.post('/logout', loginController.logout);

export default router;
