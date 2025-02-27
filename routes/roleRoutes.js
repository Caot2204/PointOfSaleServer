import express from 'express';
const router = express.Router();

import roleController from '../controller/roleController.js';

router.post('/', roleController.save);
router.get('/', roleController.getAll);

router.route("/:id")
    .get(roleController.getOne)
    .put(roleController.update)
    .delete(roleController.delete);

export default router;