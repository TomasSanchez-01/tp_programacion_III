/*============================
    Controladores vistas
============================*/

import productModels from "../models/product.models.js"


//////////////////////
// Vista principal
export const vistaPrincipal = async (req, res) => {

    // Le solicitamos al modelo de productos los productos activos
    const [rows] = await productModels.selectAllProducts();

    res.render("administrador", {
        title: "Principal",
        about: "Lista de productos",
        listaProductos: rows
    });
    
}

export const vistaCrear = (req, res) => {
    res.render("crear", {
        title: "Crear",
        about: "Crear usuario"
    });
}