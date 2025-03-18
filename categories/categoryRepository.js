import { Category } from "../datasource/db/dbConnection.js";

/**
 * Repository for Category entity, responsable of control the datasource operations.
 * 
 * The data source can be changed, whether local or remote, and the controller does not know where the data is.
 */
class CategoryRepository {

    async insertCategory(name) {
        if (this.#validateCategoryData(name)) {
            await Category.create({ name: name });
        }
    }

    async updateCategory(id, name) {
        if (this.#validateCategoryData(id)) {
            await Category.update({ name: name }, { where: { id: id } });
        }
    }

    async deleteCategory(id) {
        const category = await this.getOneCategory(id);
        await category.destroy();      
    }

    async getAllCategories() {
        const categories = await Category.findAll();
        categories.every(category => category instanceof Category);
        return categories;
    }

    async getOneCategory(id) {
        const category = Category.findOne({ where: { id: id } });
        if (!category) {
            throw Error('Category not exists');
        }
        return category;
    }
    
    #validateCategoryData(name) {
        if (!name) throw Error('Please send a category name');
        return true;        
    }

}

export default new CategoryRepository();