import { addProduct, deleteProduct, updateProduct } from '../controllers/productController.js';

export const setupSockets = (io) => {
    io.on('connection', (socket) => {
        console.log('New client connected');

        socket.on('newProduct', (product) => {
            addProduct(product, io);
        });

        socket.on('deleteProduct', (productId) => {
            deleteProduct(productId, io);
        });

        socket.on('updateProduct', (productId, updatedProduct) => {
            updateProduct(productId, updatedProduct, io);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });
};
