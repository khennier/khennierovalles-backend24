import express from 'express';
import { getProducts, addProduct, deleteProduct, updateProduct } from '../controllers/productController.js';

const router = express.Router();

router.get('/', getProducts);
router.post('/', (req, res) => {
    addProduct(req.body, req.app.get('socketio'));
    res.redirect('/');
});
router.delete('/:id', (req, res) => {
    deleteProduct(req.params.id, req.app.get('socketio'));
    res.redirect('/');
});
router.put('/:id', (req, res) => {
    updateProduct(req.params.id, req.body, req.app.get('socketio'));
    res.redirect('/');
});

export default router;
