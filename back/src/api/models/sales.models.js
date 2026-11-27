import connection from "../database/db.js";

const insertSale = (total_price, user_name) => {
    const sql = "INSERT INTO sales (date, total_price, user_name) VALUES (NOW(), ?, ?)";
    return connection.query(sql, [total_price, user_name]);
}

const insertProductSale = (product_id, sale_id, quantity) => {
    const sql = "INSERT INTO product_sales (product_id, sale_id, quantity) VALUES (?, ?, ?)";
    return connection.query(sql, [product_id, sale_id, quantity]);
}

export default {
    insertSale,
    insertProductSale
}