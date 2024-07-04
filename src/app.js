import express from 'express';
import cartRoutes from '../routes/cart.js';
import productRoutes from '../routes/product.js';

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});
