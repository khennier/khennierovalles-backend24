import path from 'path';
import { readFile, writeFile } from '../utils/fileUtils.js';

const productFilePath = path.join(process.cwd(), '/src/data/products.json');

export const getProducts = (req, res) => {
    readFile(productFilePath, (err, products) => {
        if (err) {
            console.error(`Failed to read products data at getProducts: ${err.message}`);
            return res.status(500).json({ error: 'Failed to read products data' });
        }
        res.json(products);
    });
};

export const addProduct = (product, io) => {
    readFile(productFilePath, (err, products) => {
        if (err) {
            console.error(`Failed to read products data at addProduct: ${err.message}`);
            return;
        }
        if (products.some(p => p.code === product.code)) {
            console.error(`Product with code ${product.code} already exists.`);
            return;
        }
        const newId = products.length ? products[products.length - 1].id + 1 : 1;
        const newProduct = { id: newId, ...product, status: true, thumbnails: ['S/N'] };
        products.push(newProduct);
        writeFile(productFilePath, products, (err) => {
            if (err) {
                console.error(`Failed to save new product at addProduct: ${err.message}`);
                return;
            }
            io.emit('updateProducts', newProduct);
        });
    });
};

export const deleteProduct = (productId, io) => {
    readFile(productFilePath, (err, products) => {
        if (err) {
            console.error(`Failed to read products data at deleteProduct: ${err.message}`);
            return;
        }
        const updatedProducts = products.filter(product => product.id !== parseInt(productId));
        writeFile(productFilePath, updatedProducts, (err) => {
            if (err) {
                console.error(`Failed to delete product at deleteProduct: ${err.message}`);
                return;
            }
            io.emit('removeProduct', productId);
        });
    });
};

export const updateProduct = (productId, updatedProduct, io) => {
    readFile(productFilePath, (err, products) => {
        if (err) {
            console.error(`Failed to read products data at updateProduct: ${err.message}`);
            return;
        }
        const productIndex = products.findIndex(product => product.id === parseInt(productId));
        if (productIndex === -1) {
            console.error(`Product not found: ${productId}`);
            return;
        }
        products[productIndex] = { ...products[productIndex], ...updatedProduct };
        writeFile(productFilePath, products, (err) => {
            if (err) {
                console.error(`Failed to update product at updateProduct: ${err.message}`);
                return;
            }
            io.emit('updateProducts', products[productIndex]);
        });
    });
};