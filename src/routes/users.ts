import express from 'express';
import controller from '../controllers/users';

const router = express.Router();

router.get('/:id', controller.getOneUser);
router.get('/all', controller.getAllUsers);

export default router;
