import { QueryTypes } from "sequelize";
import { dataSource, Sale, SalesProducts, User } from "../db/dbConnection.js";
import productRepository from './productRepository.js';
import userRepository from './userRepository.js';

/**
 * Repository for Sale entity, responsable of control the datasource operations.
 * 
 * The data source can be changed, whether local or remote, and the controller does not know where the data is.
 */
class SaleRepository {

    async saveSale(idPosUser, dateOfSale, productsSold) {
        if (this.#validateDateRecived(dateOfSale, false)) {
            const sale = await Sale.create({ dateOfSale: dateOfSale });
            try {
                const user = await userRepository.getOneUser(idPosUser);
                sale.setUser(user);
            } catch (error) {
                await sale.destroy();
                throw error;
            }

            try {
                productsSold.forEach(productSold => {
                    this.#saveProductInSale(
                        sale.id,
                        productSold.code,
                        productSold.name,
                        productSold.price,
                        productSold.units
                    );
                });
            } catch (error) {
                await SalesProducts.destroy(
                    { where: { saleId: sale.id } }
                );
                await sale.destroy();
                throw error;
            }
        } else {
            throw Error("The date not has the YYYY-MM-DD HH:MM:SS pattern");
        }
    }

    async #saveProductInSale(saleId, code, name, price, units) {
        if (productRepository.getProductByCode(code)) {
            await SalesProducts.create({
                saleId: saleId,
                productCode: code,
                productName: name,
                currentPrice: price,
                units: units
            });
        }
    }

    async getSalesPerDay(date) {
        if (this.#validateDateRecived(date, true)) {
            let salesPerDay = [];
            const salesRegistered = await dataSource.query(
                'SELECT id FROM sales WHERE DATE(dateOfSale) = :dateToSearch',
                {
                    replacements: { dateToSearch: date },
                    type: QueryTypes.SELECT
                }
            );

            for (const sale of salesRegistered) {
                salesPerDay.push(await this.getSaleDetails(sale.id));
            }

            return salesPerDay;            
        } else {
            throw Error("The date not has the YYYY-MM-DD pattern");
        }
    }

    async getSaleDetails(saleId) {
        const sale = await Sale.findOne({
            attributes: {
                exclude: ['UserId']
            },
            where: { id: saleId },
            include: {
                model: User,
                attributes: ['name']
            }
        });

        if (sale) {
            const productsOfsale = await SalesProducts.findAll({
                attributes: ['productCode', 'productName', 'currentPrice', 'units'],
                where: { saleId: sale.id }
            });

            let totalSale = 0;
            productsOfsale.forEach(productSold => {
                totalSale = totalSale + (productSold.currentPrice * productSold.units);
            });

            return {
                saleData: sale,
                totalSale: Number(totalSale),
                productsSold: productsOfsale
            }
        } else {
            throw Error("Sale not found");
        }
    }

    /**
     * Verify if the recived date follow the correct pattern 
     * 
     * @param {String} date The date should by YYYY-MM-SS HH:MM:SS for save a sale and YYYY-MM-DD for search sales
     * 
     * @param {*} forSearch true if the date is for search sales and false if is to save a sale
     * 
     * @returns true if is valid false if not
     */
    #validateDateRecived(date, forSearch) {
        const dateForSearchRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
        const dateTimeRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01]) (0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;

        let isFormatValid = false;
        if (forSearch) isFormatValid = dateForSearchRegex.test(date);
        else isFormatValid = dateTimeRegex.test(date);

        if (isFormatValid) {
            const dateObject = new Date(date);
            const dateValid = !isNaN(dateObject.getTime());

            if (dateValid) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

}

export default new SaleRepository();