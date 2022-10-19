import express from 'express';
import indexController from '../controllers/index';
import checkJWT from '../middleware/checkJWT';

const router = express.Router();

router.get('/', indexController.home);
router.get('/dashboard', checkJWT, indexController.dashboard);

export default router;
