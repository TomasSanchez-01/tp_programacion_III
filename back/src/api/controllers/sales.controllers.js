import SaleModels from "../models/sales.models.js";

export const postSale = async (req, res) => {
    try {
        const { user_name, total_price, products } = req.body;

        if (!user_name || !total_price || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: "Faltan datos de la venta" });
        }

        // 1. Guardamos la venta
        const [result] = await SaleModels.insertSale(total_price, user_name);
        const saleId = result.insertId; // id que generó la base

        // 2. Guardamos cada producto de esa venta
        for (const prod of products) {
            await SaleModels.insertProductSale(prod.id, saleId, prod.cantidad);
        }

        res.status(201).json({ message: "Venta registrada", id: saleId });

    } catch (error) {
        console.log("Error registrando la venta: ", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
}