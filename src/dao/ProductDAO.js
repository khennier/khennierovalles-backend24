import Product from '../models/Product.js';

class ProductDAO {
    async getAllProducts() {
        return await Product.find().lean();
    }

    async getProductById(id) {
        return await Product.findById(id).lean();
    }

    async createProduct(productData) {
        const newProduct = new Product(productData);
        return await newProduct.save();
    }

    async updateProduct(id, productData) {
        return await Product.findByIdAndUpdate(id, productData, { new: true });
    }

    async deleteProduct(id) {
        return await Product.findByIdAndDelete(id);
    }
}

export default new ProductDAO();
