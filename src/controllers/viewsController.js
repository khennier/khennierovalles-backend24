import Product from '../models/Product.js';
import Cart from '../models/cart.js';

export const renderHome = async (req, res) => {
    try {
        const { page = 1, limit = 10, category, status, sort } = req.query;

        const query = {};
        if (category) query.category = category;
        if (status) query.status = status === 'true';

        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {},
        };

        const result = await Product.paginate(query, options);

        let cart = null;
        if (req.user) {
            cart = await Cart.findOne({ userId: req.user.id });
        }


        res.render('home', {
            title: 'Pagina Principal',
            products: result.docs,
            cartId: cart ? cart._id : null,
            user: req.user, 
            isAdmin: req.user && req.user.role === 'ADMIN', 
            isAuthenticated: !!req.user 
        });
    } catch (err) {
        console.error('Error al renderizar la página principal:', err.message);
        res.status(500).json({ status: 'error', message: 'Error al renderizar la página principal' });
    }
};

export const renderRealTimeProducts = async (req, res) => {
    try {
        // Obtener todos los productos de la base de datos
        const products = await Product.find().lean(); // lean() para mejorar el rendimiento

        // Renderizar la vista de productos en tiempo real
        res.render('realTimeProducts', {
            title: 'Real-Time Products',
            products
        });
    } catch (err) {
        console.error('Failed to fetch real-time products:', err.message);
        res.status(500).json({ status: 'error', message: 'Failed to fetch real-time products' });
    }
};


export const renderCart = async (req, res) => {
    try {
        const { cid } = req.params; // Obtener el ID del carrito desde la URL

        // Encuentra el carrito por ID y popula los productos
        const cart = await Cart.findById(cid).populate('products.productId').lean();

        // Verificar si el carrito existe
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }

        // Renderizar la vista del carrito
        res.render('cart', {
            title: 'Tu Carrito',
            cart
        });
    } catch (err) {
        console.error('Error al renderizar el carrito:', err.message);
        res.status(500).json({ status: 'error', message: 'Error al renderizar el carrito' });
    }
};


export const renderProductDetails = async (req, res) => {
    try {
        const productId = req.params.pid;

        // Verificar si el productId es un ObjectId válido
        if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ status: 'error', message: 'Invalid product ID' });
        }

        const product = await Product.findById(productId).lean();

        if (!product) {
            return res.status(404).json({ status: 'error', message: 'Product not found' });
        }

        res.render('productDetails', {
            title: 'Product Details',
            product: product
        });
    } catch (err) {
        console.error('Failed to fetch product detailsssssss:', err.message);
        res.status(500).json({ status: 'error', message: 'Failed to fetch product details' });
    }
};