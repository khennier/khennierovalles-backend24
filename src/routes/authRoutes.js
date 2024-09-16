import express from 'express';
import { registerUser, loginUser } from '../controllers/userController.js';

const router = express.Router();

// Ruta para el registro
router.post('/register', registerUser);

// Ruta para el login
router.post('/login', loginUser);

// Ruta para el logout
router.post('/logout', (req, res) => {
    res.clearCookie('token'); // Eliminar la cookie que contiene el token
    res.status(200).json({ message: 'Logout exitoso' });
});


export default router;
