import Cart from '../models/cart.js';
import Product from '../models/Product.js';

export const createCart = async (req, res) => {
    try {
        const newCart = new Cart({
            products: [] // Iniciar el carrito vacío
        });
        await newCart.save();
        res.status(201).json({ status: 'success', message: 'Cart created', cart: newCart });
    } catch (err) {
        console.error('Failed to create cart:', err.message);
        res.status(500).json({ status: 'error', message: 'Failed to create cart' });
    }
};

// Agregar produccto a carrito
export const addProductToCart = async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
        let cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Cart not found' });
        }

        const product = await Product.findById(pid);
        if (!product) {
            return res.status(404).json({ status: 'error', message: 'Product not found' });
        }

        // Verifica si el producto ya está en el carrito
        const existingProduct = cart.products.find(p => p.productId.toString() === pid);

        if (existingProduct) {
            // Si el producto ya está en el carrito, incrementa la cantidad
            existingProduct.quantity += quantity;
        } else {
            // Si el producto no está en el carrito, agréguelo
            cart.products.push({ productId: pid, quantity });
        }

        await cart.save();
        res.json({ status: 'success', message: 'Product added to cart', cart });
    } catch (err) {
        console.error('Failed to add product to cart:', err.message);
        res.status(500).json({ status: 'error', message: 'Failed to add product to cart' });
    }
};

// Eliminar un producto específico del carrito
export const deleteProductFromCart = async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Cart not found' });
        }
        cart.products = cart.products.filter(product => product.productId.toString() !== pid);
        await cart.save();
        res.json({ status: 'success', message: 'Product removed from cart' });
    } catch (err) {
        console.error('Failed to delete product from cart:', err.message);
        res.status(500).json({ status: 'error', message: 'Failed to delete product from cart' });
    }
};

// Actualizar el carrito con un nuevo arreglo de productos
export const updateCart = async (req, res) => {
    const { cid } = req.params;
    const { products } = req.body;
    try {
        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Cart not found' });
        }
        cart.products = products.map(product => ({
            productId: product.productId,
            quantity: product.quantity
        }));
        await cart.save();
        res.json({ status: 'success', message: 'Cart updated' });
    } catch (err) {
        console.error('Failed to update cart:', err.message);
        res.status(500).json({ status: 'error', message: 'Failed to update cart' });
    }
};

// Actualizar la cantidad de un producto en el carrito
export const updateProductQuantityInCart = async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    try {
        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Cart not found' });
        }
        const product = cart.products.find(product => product.productId.toString() === pid);
        if (product) {
            product.quantity = quantity;
            await cart.save();
            res.json({ status: 'success', message: 'Product quantity updated in cart' });
        } else {
            res.status(404).json({ status: 'error', message: 'Product not found in cart' });
        }
    } catch (err) {
        console.error('Failed to update product quantity in cart:', err.message);
        res.status(500).json({ status: 'error', message: 'Failed to update product quantity in cart' });
    }
};

// Eliminar todos los productos del carrito
export const clearCart = async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Cart not found' });
        }
        cart.products = [];
        await cart.save();
        res.json({ status: 'success', message: 'Cart cleared' });
    } catch (err) {
        console.error('Failed to clear cart:', err.message);
        res.status(500).json({ status: 'error', message: 'Failed to clear cart' });
    }
};

// Obtener los productos de un carrito específico con populate
export const getCart = async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await Cart.findById(cid).populate('products.productId');
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Cart not found' });
        }
        res.json(cart);
    } catch (err) {
        console.error('Failed to fetch cart:', err.message);
        res.status(500).json({ status: 'error', message: 'Failed to fetch cart' });
    }
};
