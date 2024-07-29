import path from 'path';
import { readFile } from '../utils/fileUtils.js';

const productFilePath = path.join(process.cwd(), '/src/data/products.json');

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
            return res.status(500).json({ error: 'Failed to read products datasssss' });
        }
        res.render('realTimeProducts', { title: 'Real Time Products', products });
    });
};
