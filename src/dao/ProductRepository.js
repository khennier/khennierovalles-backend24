import productDAO from '../dao/ProductDAO.js';

class ProductRepository {
    async getAllProducts() {
        return await productDAO.getAllProducts();
    }

    async getProductById(id) {
        return await productDAO.getProductById(id);
    }

    async createProduct(productData) {
        return await productDAO.createProduct(productData);
    }

    async updateProduct(id, productData) {
        return await productDAO.updateProduct(id, productData);
    }

    async deleteProduct(id) {
        return await productDAO.deleteProduct(id);
    }
}

export default new ProductRepository();
