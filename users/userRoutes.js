import express from 'express';
const router = express.Router();

import userController from './userController.js';
import { verifyIfAdminUser, verifyToken } from '../authentication/authentication.js';

router.post('/login', userController.login);

router.post('/', userController.saveUser);
router.get('/', verifyToken, verifyIfAdminUser, userController.getAllUsers);

router.route("/:id")
    .get(verifyToken, verifyIfAdminUser, userController.getUser)
    .delete(verifyToken, verifyIfAdminUser, userController.deleteUser)
    .put(verifyToken, verifyIfAdminUser, userController.updateUser);

export default router;