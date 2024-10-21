import { addProduct, deleteProduct, updateProduct } from '../controllers/productController.js';
import jwt from 'jsonwebtoken';

export const setupSockets = (io) => {
    io.on('connection', (socket) => {
        console.log('New client connected');

        // Middleware para verificar el token y el rol de administrador
        const verifyAdminSocket = (token, callback) => {
            if (!token) {
                callback({ status: 'error', message: 'Token no proporcionado' });
                return false;
            }

            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET || 'backend');
                if (decoded.role !== 'ADMIN') {
                    callback({ status: 'error', message: 'Acceso denegado: Solo administradores pueden realizar esta acción' });
                    return false;
                }
                return decoded; // Devolver el usuario decodificado
            } catch (err) {
                console.error('Error verificando token:', err);
                callback({ status: 'error', message: 'Token inválido o expirado' });
                return false;
            }
        };

        // Evento para agregar un nuevo producto
        socket.on('newProduct', ({ product, token }, callback) => {
            const user = verifyAdminSocket(token, callback);
            if (user) {
                addProduct(product, io);
                callback({ status: 'success', message: 'Producto añadido' });
            }
        });

        // Evento para eliminar un producto
        socket.on('deleteProduct', ({ productId, token }, callback) => {
            const user = verifyAdminSocket(token, callback);
            if (user) {
                deleteProduct(productId, io);
                callback({ status: 'success', message: 'Producto eliminado' });
            }
        });

        // Evento para actualizar un producto
        socket.on('updateProduct', ({ productId, updatedProduct, token }, callback) => {
            const user = verifyAdminSocket(token, callback);
            if (user) {
                updateProduct(productId, updatedProduct, io);
                callback({ status: 'success', message: 'Producto actualizado' });
            }
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });
};
