import { Router } from 'express';
import { getCarts, addCart, deleteCart } from '../controllers/cartController.js';

const router = Router();

router.get('/', getCarts);
router.post('/', addCart);
router.delete('/:id', deleteCart);

export default router;
