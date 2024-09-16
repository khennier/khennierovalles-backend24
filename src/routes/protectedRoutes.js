import express from 'express';
import passport from 'passport'; // Importa Passport
import { roleMiddleware } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Ruta protegida, solo accesible para usuarios con el rol ADMIN
router.get('/admin/product/:id', 
    passport.authenticate('jwt', { session: false }), // Autenticación JWT con Passport
    roleMiddleware(['ADMIN']), 
    (req, res) => {
        res.send('Ruta protegida para ADMIN');
    }
);

export default router;
