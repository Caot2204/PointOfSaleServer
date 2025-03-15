import express from 'express';
const router = express.Router();

import saleController from '../controller/saleController.js';
import { verifyToken } from '../authentication/authentication.js';

router.post('/', verifyToken, saleController.saveSale);
router.get('/findById/:saleId', saleController.getSaleDetails);
router.get('/findByDate/:dateToSearch', saleController.getSalesPerDay);

export default router;
