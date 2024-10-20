import express from 'express';
import { createCart, deleteProductFromCart, updateCart, updateProductQuantity, clearCart, getCart, addProductToCart, purchaseCart } from '../controllers/cartController.js';
import { userMiddleware } from '../middleware/userMiddleware.js';

const router = express.Router();

router.post('/', createCart);
router.delete('/:cid/products/:pid', deleteProductFromCart);
router.put('/:cid', updateCart);
router.put('/:cid/products/:pid', updateProductQuantity);

// Solo los usuarios pueden agregar productos al carrito
router.post('/:cid/products/:pid', userMiddleware, addProductToCart);

router.delete('/:cid', clearCart);
router.get('/:cid', getCart);

// Ruta para procesar la compra
router.post('/:cid/purchase', purchaseCart);

export default router;
