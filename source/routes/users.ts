import express from 'express';
import controller from '../controllers/users';
import checkJwt from '../middleware/checkJWT';

const router = express.Router();

router.get('/validate', checkJwt, controller.validateToken);
router.post('/registar', controller.register);
router.post('/login', controller.login);
router.get('/get/all', controller.getAllUsers);

export default router;
