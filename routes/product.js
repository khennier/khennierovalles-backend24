import { Router } from "express";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const productRoutes = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const productsFilePath = path.join(__dirname, '../data/products.json');


console.log(productsFilePath);

const readProducts = () => {
  const data = fs.readFileSync(productsFilePath);
  return JSON.parse(data);
};

const writeProducts = (products) => {
  fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
};

const generateId = () => {
    const products = readProducts()
    return products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
};

console.log(generateId());

productRoutes.get('/', (req, res) => {
  const products = readProducts();
    let limit = parseInt(req.query.limit);
    if (limit && limit > 0) {
      return res.json(products.slice(0, limit));
    }
    res.json(products);
});

productRoutes.get('/:pid', (req, res) => {
    const products = readProducts();
    const pid = parseInt(req.params.pid);  
    const product = products.find(p => p.id === pid);
    if (product) {
      res.json(product);
    } else {
      res.status(404).send({ error: 'Producto no encontrado' });
    }
});

productRoutes.post('/', (req, res) => {
    const products = readProducts();
    const { title, description, code, price, stock, category, thumbnails } = req.body;
    if (!title || !description || !code || !price || !stock || !category || !thumbnails) {
        return res.status(400).send({ error: 'Todos los campos son obligatorios' });
    }
    const newProduct = {
        id: generateId(),
        title,
        description,
        code,
        price,
        status: true,
        stock,
        category,
        thumbnails
    };
    products.push(newProduct);
    writeProducts(products);
    res.status(201).json(newProduct);
});

productRoutes.put('/:pid', (req, res) => {
  const products = readProducts();
  const pid = parseInt(req.params.pid);

  const productIndex = products.findIndex(p => p.id === pid);
  if (productIndex === -1) {
    return res.status(404).send({ error: 'Producto no encontrado' });
  }

  console.log('OK REQUEST', req.body);

  products[productIndex] = { ...products[productIndex], ...req.body, id: products[productIndex].id };

  writeProducts(products);
  res.json(products[productIndex]);
});


productRoutes.delete('/:pid', (req, res) => {
  const products = readProducts();
  const pid = parseInt(req.params.pid);

  const productIndex = products.findIndex(p => p.id === pid);
  if (productIndex === -1) {
    return res.status(404).send({ error: 'Producto no encontrado' });
  }

  products.splice(productIndex, 1);
  writeProducts(products);
  res.status(204).send();
});

export default productRoutes;
