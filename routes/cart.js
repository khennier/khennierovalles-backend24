import { Router } from "express";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


const cartRoutes = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cartsFilePath = path.join(__dirname, '../data/cart.json');
const productsFilePath = path.join(__dirname, '../data/products.json');

const readCarts = () => {
    const data = fs.readFileSync(cartsFilePath);
    return JSON.parse(data);
};

const writeCarts = (carts) => {
    fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2));
};

const readProductFromCart = () => {
    const data = fs.readFileSync(productsFilePath);
    return JSON.parse(data);
}

  cartRoutes.get('/', (req, res) => {
    const carts = readCarts()
    res.json(carts);
  });

cartRoutes.get('/:id', (req, res) => {
    const carts = readCarts()
    const id = parseInt(req.params.id);
    const cart = carts.find(c => c.id === id);
    if (cart) {
      res.json(cart);
    } else {
      res.status(404).send({ error: 'Carrito no encontrado' });
    }
});

cartRoutes.post('/', (req, res) => {
  const carts = readCarts();

  const newCart = {
    id: carts.length > 0 ? Math.max(...carts.map(c => c.id)) + 1 : 1,
    products: []
  };

  carts.push(newCart);
  writeCarts(carts);
  res.status(201).json(newCart);
});

cartRoutes.get('/:cid', (req, res) => {
  const carts = readCarts();
  const cid = parseInt(req.params.cid);
  const cart = carts.find(c => c.id === cid);

  if (cart) {
    res.json(cart.products);
  } else {
    res.status(404).send({ error: 'Carrito no encontrado' });
  }
});

cartRoutes.post('/:cid/product/:pid', (req, res) => {
  const carts = readCarts();
  const products = readProductFromCart();
  const cid = parseInt(req.params.cid);
  const pid = parseInt(req.params.pid);

  const cart = carts.find(c => c.id === cid);
  const product = products.find(p => p.id === pid);

  if (!cart) {
    return res.status(404).send({ error: 'Carrito no encontrado' });
  }

  if (!product) {
    return res.status(404).send({ error: 'Producto no encontrado' });
  }

  const productInCart = cart.products.find(p => p.product === pid);

  if (productInCart) {
    productInCart.quantity += 1;
  } else {
    cart.products.push({ product: pid, quantity: 1 });
  }

  writeCarts(carts);
  res.status(201).json(cart);
});

export default cartRoutes