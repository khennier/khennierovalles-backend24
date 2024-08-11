import express from 'express';
import { renderHome, renderProductDetails, renderCart } from '../controllers/viewsController.js';

const router = express.Router();

router.get('/', renderHome);
router.get('/products/:pid', renderProductDetails);
router.get('/carts/:cid', renderCart);

export default router;
