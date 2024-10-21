import express from 'express';
import { renderHome, renderProductDetails, renderCart, renderRealTimeProducts, addProduct } from '../controllers/viewsController.js';
import upload from '../middleware/upload.js'; 
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';
import authenticateToken from '../middleware/authenticateToken.js';  
import passport from 'passport';
import UserDTO from '../dto/UserDTO.js'; 
import Product from '../models/Product.js';


const router = express.Router();

// Ruta pública: Cargar la página home.handlebars sin autenticación
router.get('/', async (req, res) => {
    try {
        // Obtener todos los productos desde la base de datos
        const products = await Product.find();
        // Renderizar la página de inicio con los productos
        res.render('home', {
            title: 'Página de Inicio',
            products: products, // Pasar los productos a la vista
            isAuthenticated: req.user ? true : false,
            isAdmin: req.user && req.user.role === 'ADMIN'
        });

    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).send('Error al obtener los productos');
    }
});

// Ruta protegida para agregar al carrito
router.post('/api/carts/:cartId/products/:productId', authenticateToken, (req, res) => {
    // Aquí va la lógica para agregar productos al carrito
    res.json({ message: 'Producto añadido al carrito exitosamente', status: 'success' });
});

// Ruta protegida para acceder a funciones de administrador
router.get('/realtimeproducts', authenticateToken, (req, res) => {
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'No tienes permisos para acceder a esta página' });
    }
    // Aquí va la lógica para cargar la página de administrador
    res.render('ADMIN', { message: 'Bienvenido Admin' });
});

//Ruta para obtener Detalles de producto 
router.get('/products/:pid', renderProductDetails);

//Ruta para renderizar cart
router.get('/carts/:cid', renderCart);

//Ruta para obtejer usuario autenticado
router.get('/realtimeproducts', authMiddleware, roleMiddleware('ADMIN'), renderRealTimeProducts);

//Ruta para obtener el usuario autenticado
router.get('/current', authMiddleware, (req, res) => {
    if (req.user) {
        const userDTO = new UserDTO(req.user);
        return res.json(userDTO);
    } else {
        return res.status(401).json({ error: 'Usuario no autenticado' });
    }
});

//Ruta para registro
router.get('/register', (req, res) => {
    res.render('register'); 
});

//Ruta para login
router.get('/login', (req, res) => {
    res.render('login'); 
});


// Ruta para obtener el usuario actual basado en el JWT
router.get('/current', authenticateToken, (req, res) => {
    res.json({ message: 'Usuario autenticado', user: req.user });
});

//Ruta para postear imagenes
router.post('/realtimeproducts', authMiddleware, roleMiddleware('ADMIN'), upload.array('thumbnails', 5), addProduct);



export default router;
