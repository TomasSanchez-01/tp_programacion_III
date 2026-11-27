/*============================
    Controladores usuario
============================*/
import UserModel from "../models/user.models.js";
import bcrypt from "bcrypt"; // 1. Importamos bcrypt

/////////////////////////
// POST admin user
export const createAdminUser = async (req, res) => {
    try {

        // Obtengo los datos del cuerpo de la peticion HTTP
        const { name, email, password } = req.body;
    
        // Verificacion minima de datos
        if (!name || !email || !password) {
            return res.render("crear", {
                title: "Crear",
                about: "Creacion de productos y usuarios",
                error: "Datos invalidos, asegurate de enviar todos los campos"
            });
        }
   

        /* 2. Hasheamos el password recibido
        Las rondas de sal (salt rounds) en bcrypt son un parámetro que determina cuántas veces se aplica internamente el proceso de hashing para generar el hash de una contraseña.

        Su objetivo es hacer que calcular cada hash sea más lento y, por lo tanto, dificultar los ataques de fuerza bruta.*/
        const saltRounds = 10; // Defino cuantas veces aplicara el hashing
        const hashedPassword = await bcrypt.hash(password, saltRounds); // Esperamos a que asincronicamente hashee la contraseña enviada en el form

        
        // Le pasamos al modelo la responsabilidad de comunicarse con la BBDD
        const [rows] = await UserModel.createAdminUser(name, email, hashedPassword);
    
        res.render("crear", {
            title: "Crear",
            about: "Creacion de productos y usuarios",
            exito: "Usuario admin creado exitosamente"
        });

    } catch (error) {
        console.log("Error al crear usuario admin: ", error);

        return res.render("crear", {
            title: "Crear",
            about: "Creacion de productos y usuarios",
            error: "Error interno del servidor al crear un usuario admin"
        });
    }

}