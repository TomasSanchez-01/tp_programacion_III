/*============================
    Modelos usuario
============================*/

import connection from "../database/db.js";


// Seleccionamos usuarios admin
const selectAdminUser = (email, password) => {
    const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
    return connection.query(sql, [email, password]);
}

const createAdminUser = (name, email, password) => {
    const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

    return connection.query(sql, [name, email, password]);
}

export default {
    selectAdminUser,
    createAdminUser
}