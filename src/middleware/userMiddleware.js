export const userMiddleware = (req, res, next) => {
    if (req.user && req.user.role === 'USER') {
        next();  // Si el usuario es "USER", permitir el acceso
    } else {
        return res.status(403).json({ error: 'Acceso denegado. Solo los usuarios pueden realizar esta acción.' });
    }
};
