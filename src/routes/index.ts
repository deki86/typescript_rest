import express from 'express';
import indexController from '../controllers/index';
import loginController from '../controllers/login';

const router = express.Router();

router.get('/', loginController.withUser, indexController.home);

export default router;
