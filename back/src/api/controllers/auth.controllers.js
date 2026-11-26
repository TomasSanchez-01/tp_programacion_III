/*================================
    Controladores autenticacion
================================*/

// Importamos los modelos del usuario
import UserModels from "../models/user.models.js"


/////////////////
// Renderizamos vista del formulario login
export const vistaLogin = (req, res) => {
    // Leemos el error guardado y lo borramos para que se muestre una sola vez
    const error = req.session.error;
    delete req.session.error;

    // Evita que el navegador reutilice una copia guardada al volver atrás
    res.set("Cache-Control", "no-store");

    res.render("login", {
        title: "Login",
        about: "Introduzca sus credenciales",
        error: error
    });
}


/////////////////
// Funcionalidad de login para usuarios admin
export const loginAdmin = async (req, res) => {
    try {
        // Recibimos los datos como objetos JS gracias al middleware 
        // app.use(express.urlencoded({extended: true}));
        const { email, password } = req.body;

        // Verificamos si llegaron los datos para no hacer una consulta innecesaria
        if (!email || !password) {
            // Si faltan datos
            req.session.error = "Todos los campos son obligatorios";
            return res.redirect("/login");
        }

        // El controlador le pide al modelo de usuarios que traiga el usuarioAdmin
        const [rows] = await UserModels.selectAdminUser(email, password);

        if (rows.length === 0) {
            // Si las credenciales no coinciden
            req.session.error = "Credenciales incorrectas";
            return res.redirect("/login");
        }

        console.log(rows);
        /* Me trae un array de un objeto
        [
            {
                id: 1,
                name: 'Johnny',
                email: 'johnny@melavo.com',
                password: 'melavo'
            }
        ]
        */

        // Extraigo directamente el objeto usuario
        const user = rows[0]
        console.table(user);
        /*
        ┌──────────┬─────────────────────┐
        │ (index)  │ Values              │
        ├──────────┼─────────────────────┤
        │ id       │ 1                   │
        │ name     │ 'Johnny'            │
        │ email    │ 'johnny@melavo.com' │
        │ password │ 'melavo'            │
        └──────────┴─────────────────────┘
        */

        // Al hacerse correctamente un login, creamos una sesion
        req.session.user = {
            id: user.id,
            name: user.name,
            email: user.email
        }

        // Creada la sesion, redirijo a la vista principal
        res.redirect("/dashboard/principal");


    } catch (error) {
        console.log("Error en la autenticacion del admin: ", error);

        res.status(500).json({
            message: "Error interno del servidor"
        });
    }
}



/////////////////
// Funcionalidad logout
export const logoutAdmin = (req, res) => {

    // Terminamos con la sesion existente
    req.session.destroy((err) => {
        // Si hubiera un error destruyendo la sesion
        if (err) {
            console.log("Error al destruir la sesion: ", err);

            return res.status(500).json({
                message: "Error interno al cerrar la sesion"
            });
        }

        // Terminada la sesion, redirigimos a la pagina login
        res.redirect("/login");
    })
}