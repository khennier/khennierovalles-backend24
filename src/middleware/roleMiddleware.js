export const roleMiddleware = (requiredRole) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).render('error', { message: 'No estás autenticado.' });
        }

        if (req.user.role !== requiredRole) {
            // Renderizar la vista de error si el usuario no tiene el rol requerido
            return res.status(403).render('error', { message: 'No puedes acceder a esta ruta.' });
        }

        next(); // El usuario tiene el rol requerido, continuar con la solicitud
    };
};
