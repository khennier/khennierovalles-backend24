import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
    const token = req.cookies.token; // Obtener el token de las cookies

    if (token) {
        try {
            // Verificar el token JWT
            const decoded = jwt.verify(token, 'backend'); // Usa la clave secreta que utilizaste para firmar el token
            req.user = decoded; // Guardar la información del usuario en req.user
        } catch (err) {
            console.error('Token verification failed:', err.message);
        }
    }
    console.log('Cookies:', req.cookies);
    console.log('Usuario decodificado:', req.user);

    next(); // Permitir el acceso a la siguiente ruta
};
