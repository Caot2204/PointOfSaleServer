import productRepository from "./productRepository.js";

/**
 * Controller for Category routes in the server
 */
class InventoryController {

    /**
     * Save a new product in the inventory
     * @param {*} req 
     * @param {*} res 
     */
    async saveProduct(req, res) {
        try {
            const { code, name, price, stock, isInfinityStock, categoryId } = req.body;
            await productRepository.insertProduct(code, name, price, stock, isInfinityStock, categoryId);
            res.status(201).json({ message: 'Product created' });
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    /**
     * Update a exist product in the inventory
     * @param {*} req 
     * @param {*} res 
     */
    async updateProduct(req, res) {
        const { productCode } = req.params;
        try {
            const { name, price, stock, isInfinityStock, categoryId } = req.body;
            await productRepository.updateProduct(productCode, name, price, stock, isInfinityStock, categoryId);
            res.status(201).json({ message: 'Product updated' });
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    /**
     * Deletes a product in the inventory
     * @param {*} req 
     * @param {*} res 
     */
    async deleteProduct(req, res) {
        const { productCode } = req.params;
        try {
            await productRepository.deleteProduct(productCode);
            res.status(200).json({ message: 'Product deleted' });
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    /**
     * Increase the product's stock in determinate amount
     * 
     * @param {*} req 
     * @param {*} res 
     */
    async increaseStockOfProduct(req, res) {
        const { productCode } = req.params;
        try {
            const { units } = req.body;
            await productRepository.increaseStock(productCode, units);
            res.status(200).json({ message: "Product increase their stock" });
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    /**
     * Returns every product registered in the inventory
     * @param {*} req 
     * @param {*} res 
     */
    async getInventory(req, res) {
        try {
            const inventory = await productRepository.getAllProducts();
            res.status(200).send(JSON.stringify(inventory, null, 2));
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    /**
     * Return a product search it by it's code
     * @param {*} req 
     * @param {*} res 
     */
    async getProductByCode(req, res) {
        const { productCode } = req.params;
        try {
            const product = await productRepository.getProductByCode(productCode);
            res.status(200).send(JSON.stringify(product, null, 2));
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    /**
     * Returns a products lists that it's name includes the string recived
     * @param {*} req 
     * @param {*} res 
     */
    async searchProductsByName(req, res) {
        const { productName } = req.params;
        try {
            const product = await productRepository.searchProductsWithName(productName);
            res.status(200).send(JSON.stringify(product, null, 2));
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

}

export default new InventoryController();