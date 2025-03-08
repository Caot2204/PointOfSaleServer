import { Op } from "sequelize";
import { Category, Product } from "../db/dbConnection.js";
import categoryRepository from "./categoryRepository.js";

/**
 * Repository for Category entity, responsable of control the datasource operations.
 * 
 * The data source can be changed, whether local or remote, and the controller does not know where the data is.
 */
class ProductRepository {

    async insertProduct(productCode, name, price, stock, isInfinityStock, categoryId) {
        if (this.#validateProductData(productCode, name, price, stock, isInfinityStock, categoryId)) {
            const newProduct = await Product.create({
                code: productCode,
                name: name,
                price: price,
                stock: stock,
                isInfinityStock: isInfinityStock
            });

            const category = await categoryRepository.getOneCategory(categoryId);
            if (!category) throw Error("Category not found");
            else newProduct.setCategory(category);
        }
    }

    async updateProduct(productCode, name, price, stock, isInfinityStock, categoryId) {
        if (this.#validateProductData(productCode, name, price, stock, isInfinityStock, categoryId)) {
            const product = await this.getProductByCode(productCode);
            product.set({
                code: productCode,
                name: name,
                price: price,
                stock: stock,
                isInfinityStock: isInfinityStock
            });
            product.save();
            
            const category = await categoryRepository.getOneCategory(categoryId);
            if (!category) {
                throw Error("Category not found");
            } else {
                if (category.id != product.getCategory().id) product.setCategory(category);
            }
        }
    }

    async deleteProduct(productCode) {
        const product = await this.getProductByCode(productCode);
        product.destroy();
    }

    async getAllProducts() {
        const products = await Product.findAll({
            attributes: {
                exclude: ['CategoryId']
            },
            include: {
                model: Category,
                as: 'Category',
                attributes: ['name']
            },
        });
        return products;
    }

    async getProductByCode(productCode) {
        const product = await Product.findOne({
            attributes: {
                exclude: ['CategoryId']
            },
            include: {
                model: Category,
                as: 'Category',
                attributes: ['name']
            },
            where: {
                code: productCode
            }
        });

        if (product) return product;
        else throw Error('Product not found');     
    }

    async searchProductsWithName(nameEntered) {
        const products = await Product.findAll({
            attributes: {
                exclude: ['CategoryId']
            },
            include: {
                model: Category,
                as: 'Category',
                attributes: ['name']
            },
            where: {
                name: { [Op.substring]: nameEntered }
            }
        });

        if (products) return products;
        else throw Error('Product not found');     
    }

    #validateProductData(productCode, name, price, stock, isInfinityStock, categoryId) {
        if (!productCode) throw Error("Please send product's code");
        if (!name) throw Error("Please send product's name");
        if (!price) throw Error("Please send product's price");
        if (stock == null) throw Error("Please send product's stock");
        if (isInfinityStock == null) throw Error("Please indicate if product has infinity stock");
        if (!categoryId) throw Error("Please send product's category");
        return true;
    }

}

export default new ProductRepository();