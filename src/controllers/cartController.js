import Cart from '../models/cart.js';
import Product from '../models/Product.js';
import Ticket from '../models/Ticket.js';
import { v4 as uuidv4 } from 'uuid';  

 
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


export const addProductToCart = async (req, res) => {
    try {
        const { cid, pid } = req.params; // Obtener el cartId y productId de los parámetros
        const { quantity } = req.body;   // Obtener la cantidad del cuerpo de la solicitud

        // Buscar el carrito por su ID
        let cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }

        // Verificar si el producto ya está en el carrito
        const productIndex = cart.products.findIndex(p => p.productId.toString() === pid);
        if (productIndex >= 0) {
            // Si el producto ya está en el carrito, incrementar la cantidad
            cart.products[productIndex].quantity += quantity;
        } else {
            // Si no está en el carrito, agregar el nuevo producto
            cart.products.push({ productId: pid, quantity });
        }

        // Guardar el carrito actualizado
        await cart.save();

        res.json({ status: 'success', message: 'Producto añadido al carrito' });
    } catch (err) {
        console.error('Error al añadir producto al carrito:', err.message);
        res.status(500).json({ status: 'error', message: 'Error al añadir producto al carrito' });
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
export const updateProductQuantity = async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
        // Encuentra el carrito por ID
        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Cart not found' });
        }

        // Encuentra el producto dentro del carrito
        const productInCart = cart.products.find(p => p.productId.toString() === pid);

        if (!productInCart) {
            return res.status(404).json({ status: 'error', message: 'Product not found in cart' });
        }

        // Actualiza la cantidad del producto
        productInCart.quantity += quantity;

        // Si la cantidad es menor o igual a 0, elimina el producto del carrito
        if (productInCart.quantity <= 0) {
            cart.products = cart.products.filter(p => p.productId.toString() !== pid);
        }

        await cart.save();
        res.json({ status: 'success', message: 'Product quantity updated', cart });
    } catch (err) {
        console.error('Failed to update product quantity:', err.message);
        res.status(500).json({ status: 'error', message: 'Failed to update product quantity' });
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
    try {
        const cart = await Cart.findById(req.params.cid).populate('products.productId').lean();
        
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        // Filtro para evitar productos con productId null
        cart.products = cart.products.filter(item => item.productId !== null);

        res.render('cart', { title: 'Your Cart', cart });
    } catch (err) {
        console.error('Error al obtener el carrito:', err);
        res.status(500).json({ error: 'Error al obtener el carrito' });
    }
};



export const purchaseCart = async (req, res) => {
    try {
        // Buscar el carrito por ID
        const cart = await Cart.findById(req.params.cid).populate('products.productId');
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        let totalAmount = 0;
        let productsNotPurchased = [];

        // Verificar el stock de cada producto en el carrito
        for (let item of cart.products) {
            const product = item.productId;
            if (product.stock >= item.quantity) {
                // Si hay suficiente stock, restar la cantidad del stock del producto
                totalAmount += product.price * item.quantity;
                product.stock -= item.quantity;
                await product.save();
            } else {
                // Si no hay suficiente stock, añadir el producto a la lista de no comprados
                productsNotPurchased.push(product._id);
            }
        }

        // Si se pudieron comprar productos, generar un ticket
        if (totalAmount > 0) {
            const newTicket = new Ticket({
                code: uuidv4(),  // Generar un código único
                purchase_datetime: new Date(),
                amount: totalAmount,
                purchaser: req.user.email  // El email del usuario que compró
            });
            await newTicket.save();
        }

        // Actualizar el carrito con solo los productos que no pudieron ser comprados
        cart.products = cart.products.filter(item => productsNotPurchased.includes(item.productId._id));
        await cart.save();

        // Responder con el total y los productos no comprados
        res.status(200).json({
            message: 'Compra completada',
            totalAmount,
            productsNotPurchased
        });
    } catch (error) {
        console.error('Error al procesar la compra:', error);
        res.status(500).json({ error: 'Error al procesar la compra' });
    }
};
