import express from 'express';
import { create } from 'express-handlebars';
import path from 'path';
import { Server as SocketIO } from 'socket.io';
import http from 'http';
import cartRoutes from './routes/carts.js';
import productRoutes from './routes/products.js';
import { renderHome, renderRealTimeProducts, addProduct, deleteProduct } from './controllers/productController.js';

const app = express();
const PORT = 8080;

const server = http.createServer(app);
const io = new SocketIO(server);

app.set('socketio', io);

const hbs = create({
    extname: '.handlebars',
    defaultLayout: 'main',
    layoutsDir: path.join(process.cwd(), 'src/views/layouts'),
    partialsDir: path.join(process.cwd(), 'src/views/partials')
});

app.engine('.handlebars', hbs.engine);
app.set('view engine', '.handlebars');
app.set('views', path.join(process.cwd(), 'src/views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(process.cwd(), 'src/public')));

app.use('/api/carts', cartRoutes);
app.use('/api/products', productRoutes);

app.get('/', renderHome);

app.get('/realtimeproducts', renderRealTimeProducts);

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('newProduct', (product) => {
        addProduct(product, io);
    });

    socket.on('deleteProduct', (productId) => {
        deleteProduct(productId, io);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
});
