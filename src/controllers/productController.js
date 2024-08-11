import Product from '../models/Product.js';

export const getProducts = async (req, res) => {
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

        const response = {
            status: 'success',
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `/api/products?page=${result.prevPage}` : null,
            nextLink: result.hasNextPage ? `/api/products?page=${result.nextPage}` : null,
        };

        res.json(response);
    } catch (err) {
        console.error('Failed to fetch products:', err.message);
        res.status(500).json({ status: 'error', message: 'Failed to fetch products' });
    }
};

export const addProduct = async (product, io) => {
    try {
        const existingProduct = await Product.findOne({ code: product.code });
        if (existingProduct) {
            console.error(`Product with code ${product.code} already exists.`);
            return;
        }
        const newProduct = new Product(product);
        await newProduct.save();
        io.emit('updateProducts', newProduct);
    } catch (err) {
        console.error('Failed to add product:', err.message);
    }
};

export const deleteProduct = async (productId, io) => {
    try {
        await Product.findByIdAndDelete(productId);
        io.emit('removeProduct', productId);
    } catch (err) {
        console.error('Failed to delete product:', err.message);
    }
};

export const updateProduct = async (productId, updatedProduct, io) => {
    try {
        const product = await Product.findByIdAndUpdate(productId, updatedProduct, { new: true });
        io.emit('updateProducts', product);
    } catch (err) {
        console.error('Failed to update product:', err.message);
    }
};
