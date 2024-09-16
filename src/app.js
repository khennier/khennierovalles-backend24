import express from 'express';
import { create } from 'express-handlebars';
import path from 'path';
import { Server as SocketIO } from 'socket.io';
import http from 'http';
import cartRoutes from './routes/carts.js';
import productRoutes from './routes/products.js';
import { setupSockets } from './sockets/sockets.js';
import viewRoutes from './routes/views.router.js';
import authRoutes from './routes/authRoutes.js'; 
import protectedRoutes from './routes/protectedRoutes.js'; 
import session from 'express-session';
import connectDB from './config/mongoConfig.js';
import passport from './config/passport.js'; 
import cookieParser from 'cookie-parser'; 

const app = express();
const PORT = 8080;

app.use(session({
    secret: 'backend',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,  // 1 día
        secure: false,               
        httpOnly: true
    }
}));

// Conectar a MongoDB
connectDB();

const server = http.createServer(app);
const io = new SocketIO(server);
app.set('socketio', io);

// Configuración de handlebars
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

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), 'src/public')));
app.use(cookieParser()); // Para manejar cookies

// Inicializar Passport
app.use(passport.initialize()); 

// Rutas
app.use('/api/carts', cartRoutes);
app.use('/api/products', productRoutes);
app.use('/', viewRoutes); // Renderizado de vistas de registro y login

// Rutas de autenticación (registro, login)
app.use('/api/auth', authRoutes);

// Rutas protegidas (requieren autenticación y autorización)
app.use('/api', passport.authenticate('jwt', { session: false }), protectedRoutes);

// Configurar Sockets
setupSockets(io);

// Iniciar el servidor
server.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
});
