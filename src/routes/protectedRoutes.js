import express from 'express';
import authenticateToken from '../middleware/authenticateToken.js';  // Middleware de autenticación

const router = express.Router();

// Ruta pública: Cargar la página home.handlebars sin autenticación
router.get('/', (req, res) => {
    res.render('home', {
        title: 'Página de Inicio',
        isAuthenticated: req.user ? true : false,  // Mostrar botones de login/registro según autenticación
        isAdmin: req.user && req.user.role === 'ADMIN'  // Mostrar funciones de admin si es admin
    });
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
    res.render('admin', { message: 'Bienvenido Admin' });
});

export default router;
