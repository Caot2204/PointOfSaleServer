import productRepositoy from "../datasource/repository/productRepositoy.js";

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
            await productRepositoy.insertProduct(code, name, price, stock, isInfinityStock, categoryId);
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
            await productRepositoy.updateProduct(productCode, name, price, stock, isInfinityStock, categoryId);
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
            await productRepositoy.deleteProduct(productCode);
            res.status(200).json({ message: 'Product deleted' });
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
            const inventory = await productRepositoy.getAllProducts();
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
            const product = await productRepositoy.getProductByCode(productCode);
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
            const product = await productRepositoy.searchProductsWithName(productName);
            res.status(200).send(JSON.stringify(product, null, 2));
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

}

export default new InventoryController();