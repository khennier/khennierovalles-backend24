import express from 'express';
import { renderHome, renderProductDetails, renderCart, renderRealTimeProducts } from '../controllers/viewsController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';
import passport from 'passport';


const router = express.Router();

router.get('/', authMiddleware, renderHome);
router.get('/products/:pid', renderProductDetails);
router.get('/carts/:cid', renderCart);
router.get('/realtimeproducts', authMiddleware, roleMiddleware('ADMIN'), renderRealTimeProducts);
router.get('/current', authMiddleware, (req, res) => {
    if (!req.user) {
        return res.status(401).json({ status: 'error', message: 'Usuario no autenticado' });
    }

    res.status(200).json({ status: 'success', user: req.user });
});

router.get('/register', (req, res) => {
    res.render('register'); 
});

router.get('/login', (req, res) => {
    res.render('login'); 
});


// Ruta para obtener el usuario actual basado en el JWT
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({ user: req.user });
});



export default router;
