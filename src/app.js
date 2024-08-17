import express from 'express';
import { create } from 'express-handlebars';
import path from 'path';
import { Server as SocketIO } from 'socket.io';
import http from 'http';
import cartRoutes from './routes/carts.js';
import productRoutes from './routes/products.js';
import { setupSockets } from './sockets/sockets.js';
import viewRoutes from './routes/views.router.js';
import connectDB from './config/mongoConfig.js';
import session from 'express-session';

const app = express();
const PORT = 8080;

// Conectar a MongoDB
connectDB();

const server = http.createServer(app);
const io = new SocketIO(server);

app.set('socketio', io);

const hbs = create({
    extname: '.handlebars',
    defaultLayout: 'main',
    layoutsDir: path.join(process.cwd(), 'src/views/layouts'),
    partialsDir: path.join(process.cwd(), 'src/views/partials'),
    helpers: {
        multiply: (a, b) => a * b,
        calculateTotal: (products) => {
            return products.reduce((total, item) => {
                return total + item.productId.price * item.quantity;
            }, 0).toFixed(2);
        }
    },
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
});

app.engine('.handlebars', hbs.engine);
app.set('view engine', '.handlebars');
app.set('views', path.join(process.cwd(), 'src/views'));

// Configuración de la sesión
app.use(session({
    secret: 'Backend', 
    resave: false, 
    saveUninitialized: true, 
    cookie: { secure: false } 
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(process.cwd(), 'src/public')));


app.use('/api/carts', cartRoutes);
app.use('/api/products', productRoutes);
app.use('/', viewRoutes);

setupSockets(io);

server.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
});
