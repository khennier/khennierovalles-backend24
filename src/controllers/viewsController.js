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

        // Verificar si el carrito ya existe en la sesión
        let cart;
        if (req.session.cartId) {
            cart = await Cart.findById(req.session.cartId);
            if (!cart) {
                // Si no se encuentra el carrito en la base de datos, creamos uno nuevo
                cart = new Cart({ products: [] });
                await cart.save();
                req.session.cartId = cart._id; // Guardar el cartId en la sesión
            }
        } else {
            // Si no existe cartId en la sesión, creamos un nuevo carrito
            cart = new Cart({ products: [] });
            await cart.save();
            req.session.cartId = cart._id; // Guardar el cartId en la sesión
        }

        res.render('home', {
            title: 'Home Page',
            products: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `/products?page=${result.prevPage}` : null,
            nextLink: result.hasNextPage ? `/products?page=${result.nextPage}` : null,
            cartId: cart._id // Pasar el cartId a la vista
        });
    } catch (err) {
        console.error('Failed to fetch products:', err.message);
        res.status(500).json({ status: 'error', message: 'Failed to fetch products' });
    }
};
export const renderProductDetails = async (req, res) => {
    try {
        const product = await Product.findById(req.params.pid);
        if (!product) {
            return res.status(404).json({ status: 'error', message: 'Product not found' });
        }
        res.render('productDetails', { title: 'Product Details', product });
    } catch (err) {
        console.error('Failed to fetch product:', err.message);
        res.status(500).json({ status: 'error', message: 'Failed to fetch product' });
    }
};

export const renderCart = async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid).populate('products.productId');
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Cart not found' });
        }
        res.render('cart', { title: 'Your Cart', cart });
    } catch (err) {
        console.error('Failed to fetch cart:', err.message);
        res.status(500).json({ status: 'error', message: 'Failed to fetch cart' });
    }
    
};
export const renderRealTimeProducts = (req, res) => {
    // Renderiza la vista realtimeproducts.handlebars
    res.render('realtimeproducts', { title: 'Real Time Products' });
};

