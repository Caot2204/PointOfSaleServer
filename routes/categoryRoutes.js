import express from 'express';
const router = express.Router();

import categoryController from "../controller/categoryController.js";
import { verifyIfAdminUser, verifyToken } from '../authentication/authentication.js';

router.post('/', verifyToken, verifyIfAdminUser, categoryController.saveCategory);
router.get('/', verifyToken, verifyIfAdminUser, categoryController.getAllCategories);

router.route('/:id')
    .put(verifyToken, verifyIfAdminUser, categoryController.updateCategory)
    .delete(verifyToken, verifyIfAdminUser, categoryController.deleteCategory);

export default router;