import express from 'express';
import controller from '../controllers/users';
import extractJwt from '../middleware/extractJWT';

const router = express.Router();

router.get('/validate', extractJwt, controller.validateToken);
router.post('/registar', controller.register);
router.post('/login', controller.login);
router.get('/get/all', controller.getAllUsers);

export default router;
