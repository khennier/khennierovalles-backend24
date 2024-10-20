import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
    if (req.session.token) {
        try {
            const decoded = jwt.verify(req.session.token, 'backend');  // Verifica el token
            req.user = decoded;  // Asigna el usuario decodificado a req.user
            console.log('Authenticated user:', req.user);  // Verificar si req.user está presente
            next();  // Continúa al siguiente middleware o controlador
        } catch (err) {
            console.error('Token verification failed:', err.message);
            res.status(401).json({ error: 'Token inválido o expirado' });
        }
    } else {
        res.status(401).json({ error: 'No autenticado' });
    }
};

