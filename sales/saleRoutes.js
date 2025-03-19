import express from 'express';
const router = express.Router();

import saleController from './saleController.js';
import { verifyToken } from '../authentication/authentication.js';

router.post('/', verifyToken, saleController.saveSale);
router.get('/findById/:saleId', verifyToken, saleController.getSaleDetails);
router.get('/findByDate/:dateToSearch', verifyToken, saleController.getSalesPerDay);

export default router;
