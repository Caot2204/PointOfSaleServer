import categoryRepository from "./categoryRepository.js";

/**
 * Controller for Category routes in the server
 */
class CategoryController {

    /**
     * Save a new category in the database
     * @param {*} req 
     * @param {*} res 
     */
    async saveCategory(req, res) {
        try {
            const { name } = req.body;
            await categoryRepository.insertCategory(name);
            res.status(201).json({ message: 'Category created' });
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    /**
     * Update a category in the database
     * @param {*} req 
     * @param {*} res 
     */
    async updateCategory(req, res) {
        const { id } = req.params;
        try {
            const { name } = req.body;
            await categoryRepository.updateCategory(id, name);
            res.status(200).json({ message: 'Category updated' });
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    /**
     * Delete a category in the database
     * @param {*} req 
     * @param {*} res 
     */
    async deleteCategory(req, res) {
        const { id } = req.params;
        try {
            await categoryRepository.deleteCategory(id);
            res.status(200).json({ message: 'Category deleted' });
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    /**
     * Get all categories registered in the database
     * @param {*} req 
     * @param {*} res
     * @returns Categories list in JSON format 
     */
    async getAllCategories(req, res) {
        try {
            const categories = await categoryRepository.getAllCategories();
            res.status(201).json(categories);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

}

export default new CategoryController();