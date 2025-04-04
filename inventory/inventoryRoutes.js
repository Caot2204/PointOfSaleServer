import express from 'express';
const router = express.Router();

import inventoryController from './inventoryController.js';
import { verifyIfAdminUser, verifyToken } from '../authentication/authentication.js';

router.post('/', verifyToken, verifyIfAdminUser, inventoryController.saveProduct);
router.get('/', verifyToken, inventoryController.getInventory);

router.get('/findByCode/:productCode', verifyToken, inventoryController.getProductByCode);
router.get('/findByName/:productName', verifyToken, inventoryController.searchProductsByName);

router.post('/increaseStockOf/:productCode', verifyToken, inventoryController.increaseStockOfProduct);

router.route('/:productCode')
    .put(verifyToken, verifyIfAdminUser, inventoryController.updateProduct)
    .delete(verifyToken, verifyIfAdminUser, inventoryController.deleteProduct);

export default router;