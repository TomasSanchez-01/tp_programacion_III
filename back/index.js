/*===============
    Imports
===============*/
import express from "express"; // Importamos el framework Express
import environments from "./src/api/config/environments.js"; // Traigo la info de la variables de entorno
import connection from "./src/api/database/db.js"; // Importo la conexion a la BBDD
import cors from "cors"; // Importamos el middleware CORS


/*===============
    Config
===============*/
const app = express(); // Crea una instancia de aplicacion de Express con todos sus metodos
const PORT = environments.port;


/*===============
    Middlewares
===============*/
app.use(cors()); // Middleware CORS basico para permitir todas las solicitudes

app.use(express.json()); // Middleware para parsear el JSON recibido en el cuerpo de las solicitudes POST y PUT

// Middleware logger para analizar las solicitudes por la consola
app.use((req, res, next) => {
    const fecha = new Date();
    console.log(`[${fecha.toLocaleDateString()} ${fecha.toLocaleTimeString()}] ${req.method} ${req.url}`);
    next(); // Pasa al siguiente middleware (si lo hay) o a la respuesta
})

// Middleware (de ruta) para filtrar ids no validos
const validateId = (req, res, next) => {

    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            message: "El id debe ser un numero entero positivo"
        });
    }

    req.id = id;
    next(); // Damos paso al siguiente middleware o a la response
}

/*===============
    Endpoints
===============*/

// GET all products
app.get("/api/products", async (req, res) => {

    try {
        const sql = "SELECT * FROM products";
        const [rows, tables] = await connection.query(sql);
        //console.log(rows);

        res.status(200).json({
            payload: rows
        });

     } catch (error) {
        console.log("Error obteniendo productos: ", error);

        // Optimizacion 4: Error 500 si fallo la conexion a la BBDD
        res.status(500).json({
            message: "Error interno del servidor"
        });
    }
});


// GET product by id
app.get("/api/products/:id", async (req, res) => {
    
    // Accedo al valor numerico del parametro de la url 
    try{
        const sql = `SELECT * FROM products WHERE products.id = ${req.params.id}`;
        
        const [rows] = await connection.query(sql);
    
        res.status(200).json({
            payload: rows
        });

    } catch (error) {
        console.log("Error obteniendo productos por id: ", error);

        // Optimizacion 3: Error 500 si fallo la conexion a la BBDD
        res.status(500).json({
            message: "Error interno del servidor"
        });
    }
});

// DELETE product
app.delete("/api/products/:id", validateId, async (req, res) => {
    
    // Optimizacion 1: Validamos el id en el middleware (de ruta) validateId
    
    // Optimizacion 2: Manejo de errores con try catch
    try {
        const sql = "DELETE FROM products WHERE id = ?";
    
        await connection.query(sql, [req.id]);
    
        res.status(200).json({
            message: `Producto con id ${req.id} eliminado exitosamente`
        });


    } catch (error) {
        console.log("Error eliminando producto: ", error);

        // Optimizacion 3: Error 500 si fallo la conexion a la BBDD
        res.status(500).json({
            message: "Error interno del servidor"
        });
    }

});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
});