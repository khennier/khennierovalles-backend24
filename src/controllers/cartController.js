import { readFile, writeFile } from '../utils/fileUtils.js';
import path from 'path';

const cartFilePath = path.join(process.cwd(), '../data/cart.json');

export const getCarts = (req, res) => {
    readFile(cartFilePath, (err, carts) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read carts data' });
        }
        res.json(carts);
    });
};

export const addCart = (req, res) => {
    const newCart = req.body;
    readFile(cartFilePath, (err, carts) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read carts data' });
        }
        carts.push(newCart);
        writeFile(cartFilePath, carts, (err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to save new cart' });
            }
            res.status(201).json(newCart);
        });
    });
};

export const deleteCart = (req, res) => {
    const cartId = parseInt(req.params.id, 10);
    readFile(cartFilePath, (err, carts) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read carts data' });
        }
        const updatedCarts = carts.filter(cart => cart.id !== cartId);
        writeFile(cartFilePath, updatedCarts, (err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to delete cart' });
            }
            res.json({ message: 'Cart deleted' });
        });
    });
};
