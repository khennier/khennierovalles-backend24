import express from 'express';
import { createCart, deleteProductFromCart, updateCart, updateProductQuantityInCart, clearCart, getCart, addProductToCart } from '../controllers/cartController.js';

const router = express.Router();


router.post('/', createCart);
router.delete('/:cid/products/:pid', deleteProductFromCart);
router.put('/:cid', updateCart);
router.put('/:cid/products/:pid', updateProductQuantityInCart);
router.post('/:cid/products/:pid', addProductToCart);
router.delete('/:cid', clearCart);
router.get('/:cid', getCart);

export default router;
