import ProductModels from "../models/product.models.js";

export const getAllProducts = async (req, res) => {

    try {
        const [rows, tables] = await ProductModels.selectAllProducts();

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
}

export const getProductsById = async (req, res) => {
    
    // Accedo al valor numerico del parametro de la url 
    try{
        const { id } = req.params;
        const [rows] = await ProductModels.selectProductsById(id);
    
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
}

export const removeProduct = async (req, res) => {
    
    // Optimizacion 1: Validamos el id en el middleware (de ruta) validateId
    
    // Optimizacion 2: Manejo de errores con try catch
    try {
    
        await ProductModels.deleteProduct(req.id);
    
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

}

export const putProduct = async (req, res) => {
    // Optimizacion 1: Validamos los datos del form en el middleware (de ruta) validateProduct

    // Optimizacion 2: Manejo de errores con try catch
    try {
        // Hacemos el destructuring de un objeto que parseamos previamente a traves del middleware express.json()
        const { team, name, image, category, price, active, id } = req.body;
        const [result] = await ProductModels.updateProduct(team, name, image, category, price, active, id);
        console.log(result);

        // TO DO, revisar este endpoint
        // Optimizacion 4: Verificamos si realmente se actualizo algo (hay filas afectadas)
        if (result.changedRows === 0) {
            return res.status(404).json({
                message: "No se actualizo el producto"
            });
        }
        
        return res.status(200).json({
            message: "Producto actualizado correctamente"
        });

    } catch (error) {
        console.log("Error actualizando un producto: ", error);

        // Optimizacion 3: Error 500 si fallo la conexion a la BBDD
        res.status(500).json({
            message: "Error interno del servidor"
        });
    }
}

export const createProduct = async (req, res) => {

    // Optimizacion 1: Validamos los datos del form en el middleware (de ruta) validateProduct

    // Optimizacion 2: Manejo de errores con try catch
    try {
        // Hacemos el destructuring de un objeto que parseamos previamente a traves del middleware express.json()
        // Extraemos los datos que vienen del frontend. 
        // Nota: si en el req.body te llega como 'equipo', lo renombramos a 'team' para usarlo.
        const { team, category, image, name, price } = req.body;
        const [rows] = await ProductModels.insertProduct(team, name, image, category, price);
        console.log(rows);

        res.status(201).json({
            message: "Producto creado exitosamente",
            productId: rows.insertId // Optimizacion 4: Le pasamos el nuevo id del prod
        });

    } catch (error) {
        console.log("Error creando un producto: ", error);

        // Optimizacion 3: Error 500 si fallo la conexion a la BBDD
        res.status(500).json({
            message: "Error interno del servidor"
        });
    }

}
