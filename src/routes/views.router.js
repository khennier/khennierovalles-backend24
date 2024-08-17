import express from 'express';
import { renderHome, renderProductDetails, renderCart, renderRealTimeProducts } from '../controllers/viewsController.js';

const router = express.Router();

router.get('/', renderHome);
router.get('/products/:pid', renderProductDetails);
router.get('/carts/:cid', renderCart);
router.get('/realtimeproducts', renderRealTimeProducts);

export default router;
