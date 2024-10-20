import express from 'express';
import { getProducts, addProduct, deleteProduct, updateProduct } from '../controllers/productController.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';  

const router = express.Router();

router.get('/', getProducts);

// Solo los administradores pueden agregar productos
router.post('/', adminMiddleware, (req, res) => {
    addProduct(req.body, req.app.get('socketio'));
    res.redirect('/');
});

// Solo los administradores pueden eliminar productos
router.delete('/:id', adminMiddleware, (req, res) => {
    deleteProduct(req.params.id, req.app.get('socketio'));
    res.redirect('/');
});

// Solo los administradores pueden actualizar productos
router.put('/:id', adminMiddleware, (req, res) => {
    updateProduct(req.params.id, req.body, req.app.get('socketio'));
    res.redirect('/');
});

export default router;
