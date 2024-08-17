import express from 'express';
import { renderHome, renderProductDetails, renderCart, renderRealTimeProducts } from '../controllers/viewsController.js';

const router = express.Router();

// Ruta para la página principal
router.get('/', renderHome);

// Ruta para los detalles de un producto específico
router.get('/products/:pid', renderProductDetails);

// Ruta para ver un carrito específico
router.get('/carts/:cid', renderCart);

// Ruta para la vista en tiempo real de productos
router.get('/realtimeproducts', renderRealTimeProducts);

export default router;
