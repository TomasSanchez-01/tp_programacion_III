import connection from "../database/db.js"; // Importo la conexion a la BBDD

const selectAllProducts = () => {
    const sql = "SELECT * FROM products";
    return connection.query(sql);
}

const selectProductsById = (id) => {
    const sql = `SELECT * FROM products WHERE products.id = ?`;       
    return connection.query(sql, [id]);
}

const deleteProduct = (id) => {
    const sql = "DELETE FROM products WHERE id = ?";
    return connection.query(sql, [id]);
}

const updateProduct = (team, name, image, category, price, active, id) => {
    const sql = "UPDATE products SET team = ?, name = ?, image = ?, category = ?, price = ?, active = ? WHERE id = ?"; 
    return connection.query(sql, [team, name, image, category, price, active, id]);
}

const insertProduct = (team, category, image, name, price) => {    
        const sql = "INSERT INTO products (team, name, image, category, price) VALUES (?, ?, ?, ?, ?)";
        return connection.query(sql, [team, name, image, category, price]);
}

export default {
    selectAllProducts,
    selectProductsById,
    deleteProduct,
    updateProduct,
    insertProduct
}