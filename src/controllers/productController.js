import path from 'path';
import { readFile, writeFile } from '../utils/fileUtils.js';

const productFilePath = path.join(process.cwd(), '/src/data/products.json');

export const getProducts = (req, res) => {
    readFile(productFilePath, (err, products) => {
        if (err) {
            console.error(`Failed to read products data: ${err.message}`);
            return res.status(500).json({ error: 'Failed to read products data' });
        }
        res.json(products);
    });
};

export const renderHome = (req, res) => {
    readFile(productFilePath, (err, products) => {
        if (err) {
            console.error(`Failed to read products data: ${err.message}`);
            return res.status(500).json({ error: 'Failed to read products data' });
        }
        res.render('home', { title: 'Home Page', products });
    });
};

export const renderRealTimeProducts = (req, res) => {
    readFile(productFilePath, (err, products) => {
        if (err) {
            console.error(`Failed to read products data: ${err.message}`);
            return res.status(500).json({ error: 'Failed to read products data' });
        }
        res.render('realTimeProducts', { title: 'Real Time Products', products });
    });
};

export const addProduct = (product, io) => {
    readFile(productFilePath, (err, products) => {
        if (err) {
            console.error(`Failed to read products data: ${err.message}`);
            return;
        }
        const newId = products.length ? products[products.length - 1].id + 1 : 1;
        const newProduct = { id: newId, ...product, status: true, thumbnails: ['S/N'] };
        products.push(newProduct);
        writeFile(productFilePath, products, (err) => {
            if (err) {
                console.error(`Failed to save new product: ${err.message}`);
                return;
            }
            io.emit('updateProducts', newProduct);
        });
    });
};

export const deleteProduct = (productId, io) => {
    readFile(productFilePath, (err, products) => {
        if (err) {
            console.error(`Failed to read products data: ${err.message}`);
            return;
        }
        const updatedProducts = products.filter(product => product.id !== productId);
        writeFile(productFilePath, updatedProducts, (err) => {
            if (err) {
                console.error(`Failed to delete product: ${err.message}`);
                return;
            }
            io.emit('removeProduct', productId);
        });
    });
};
