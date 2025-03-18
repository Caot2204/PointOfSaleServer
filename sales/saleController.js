import saleRepository from "./saleRepository.js";

/**
 * Controller for User routes in the server.
 */
class SaleController {

    /**
     * Save a sale and their products in the database
     * @param {*} req 
     * @param {*} res 
     */
    async saveSale(req, res) {
        const { idPosUser, dateOfSale } = req.body;
        const productsSold = req.body.productsSold;
        try {
            await saleRepository.saveSale(idPosUser, dateOfSale, productsSold);
            res.status(201).json({ message: "Sale created" });
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    /**
     * Returns a sale and their products by id
     * @param {*} req 
     * @param {*} res 
     */
    async getSaleDetails(req, res) {
        const { saleId } = req.params;
        try {
            const sale = await saleRepository.getSaleDetails(saleId);
            res.status(200).send(sale);
        } catch (error) {
            res.status(500).send(error.message);
        }     
    }

    /**
     * Returns an sales array on determinate date. The date should by YYYY-MM-DD pattern
     * @param {*} req 
     * @param {*} res 
     */
    async getSalesPerDay(req, res) {
        const { dateToSearch } = req.params;
        try {
            const salesOfDay = await saleRepository.getSalesPerDay(dateToSearch);
            res.status(200).send(salesOfDay);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

}

export default new SaleController();