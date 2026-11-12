document.getElementById("btn-cliente").addEventListener("click", () => {
    window.location.href = "index.html";
    }
);
const contenedor = document.getElementById("tabla-admin");
const mensaje = document.getElementById("mensaje");
const urlBase = "http://localhost:4000";
const getProductForm = document.getElementById("getProductForm");
const agregarProducto = document.getElementById("agregarProducto");

let idProd = "";

function mostrarMensaje(type, message) {
    mensaje.innerHTML = `        
        <p class="mensaje-${type}">${message}</p>
    `;
}

//------- get -------
getProductForm.addEventListener("submit", event =>{
    event.preventDefault();
    
    let idProd = event.target.idProd.value.trim();
    console.log(idProd);
    obtenerProductos(idProd);
})

async function obtenerProductos(idProd) {
    try {

        let response;

        if(idProd != ""){
            response = await fetch(`${urlBase}/api/products/${idProd}`);
        }else {response = await fetch(`${urlBase}/api/products`)};
        
        console.log(response); // Response {type: 'cors', url: 'http://localhost:4000/api/products', redirected: false, status: 200, ok: true, …}

       // 1. PRIMERO validamos si la respuesta es correcta (status 200-299)
        if (!response.ok) {
            // Si el servidor respondió con error, intentamos leer el mensaje si existe, 
            // o usamos un texto por defecto.
            const errorData = await response.json().catch(() => ({}));
            return mostrarError(errorData.message || "Ocurrió un error en el servidor");
        }
        
        // 2. SEGUNDO, si todo salió bien, parseamos los datos a JSON
        const data = await response.json();
        
        // En data tenemos payload: arrayDeObjetos
        const productos = data.payload;
        console.table(productos);
        
        renderizarTabla(productos);
        
    } catch (error) {
        // El catch solo captura errores reales de red (no hay conexion o el server esta caido)
        console.error("Error al hacer la solicitud: ", error);
        mostrarError("Fallo la conexion con el servidor");
    }
}

function renderizarTabla(array){
    let htmlProducto = `<table>`;

    htmlProducto += `<tr><th></th><th>Id</th><th>Name</th><th>Team</th><th>Categoria</th><th>Price</th><th>Accion</th></tr>`;
    array.forEach(prod => {
        htmlProducto +=`
        <tr>
            <td><img src="${prod.image}" alt="${prod.name}"></td>
            <td> ${prod.id}</td>
            <td> ${prod.name}</td>
            <td> ${prod.team}</td>
            <td> ${prod.category}</td>
            <td> ${prod.price}</td>
            <td> <button class="btn-editar">Editar</button><button onclick="eliminarProducto(${prod.id})" class="btn-eliminar">Eliminar</button></td>
        </tr>
        `;
    });
    htmlProducto += `</table>`

    contenedor.innerHTML = htmlProducto;
}



async function eliminarProducto(id) {
    
    const confirmacion = confirm("Querés eliminar este producto?");
    
    if (!confirmacion) {
        alert("Eliminacion cancelada");
        return 0;
    }
    
    try {
        const response = await fetch(`${urlBase}/api/products/${id}`, {
            method: "DELETE"
        });
        
        console.log(response);
        
        const data = await response.json();
        
        // Optimizacion 3: Filtramos errores 400 o 500
        if (!response.ok) {
            return mostrarMensaje("error", data.message);
            // el return hace que esta funcion termine
        }
        
        mostrarMensaje("exito", data.message);
        console.log(data.message);
        
    } catch (error) {
        console.error("Error al eliminar un producto: ", error);
        mostrarMensaje("error", "Error al enviar la informacion");
    }
    obtenerProductos(idProd);
}

function mostrarListaErrores(array) {
    let htmlErrores = "";

    array.forEach(error => {
        htmlErrores += `<p class="mensaje error">${error}</p>`;
        });
        
        agregarProducto.innerHTML = htmlErrores;
} 

// Optimizacion 2: Hacemos una validacion previa de los datos del <form> en el cliente
function validarFormulario(data) {
    const errores = []; // Igual que el middleware, creamos un array vacio de errores

    // Verificamos que mandamos todos los campos
    if (!data.name || !data.image || !data.price || !data.category) {
        errores.push("Faltan campos requeridos");
    }
    
    // Validamos el campo nombre
    if (!data.name || data.name.trim().length < 2) {
        errores.push("El nombre debe tener al menos 2 caracteres");
    }

    // Validamos el campo image
    if (!data.image) {
        errores.push("Debe incluirse una imagen");
    }

    // Validamos el campo precio
    if (typeof data.price !== "number" || data.price <= 0) {
        errores.push("El precio debe ser un numero mayor a 0");
    }

    // Validamos el campo category
    if (!data.category) {
        errores.push("Debe seleccionar una categoria")
    }

    return errores;
}


function formNuevoProducto(){
    let formHtml = `<h2>Crear producto</h2>
    
    <form id="crearFormProductos">
    
        <label for="team">Equipo</label>

        <select class="inputsForm" name="team" id="equipo" required>
            <option value="Racing">Racing</option>
            <option value="san_lorenzo">San Lorenzo</option>
            
        </select>
        
        <label for="categoryProd">Categoria</label>

        <select class="inputsForm" name="category" id="categoryProd" required>
            <option value="titular">Titular</option>
            <option value="suplente">Suplente</option>
            <option value="entrenamiento">Entrenamiento</option>
            <option value="edicion_especial">Edicion especial</option>
        </select>


        <label for="imageProd">Imagen</label>

        <input class="inputsForm"  type="text" name="image" id="imageProd" required>

        <label for="nameProd">Nombre</label>

        <input class="inputsForm"  type="text" name="name" id="nameProd" required>

        <label for="priceProd">Precio</label>

        <input class="inputsForm" type="number" name="price" id="priceProd" min="1" required>

        <input id="btn-create-product" type="submit" value="Crear producto">

    </form>`;

    agregarProducto.innerHTML = formHtml;

    const form = document.querySelector("#crearFormProductos");
    form.addEventListener("submit", async (event) => {
        //event.preventDefault(); // ¡Evita que la página se recargue!
        await createProduct(event);  // Ejecutamos tu función asíncrona
    });

}

async function createProduct(event){
    const formData = new FormData(event.target);
    console.log(formData); // FormData(4) { category → "food", image → "urlImagen", name → "Cono papas fritas", price → "123" }

    // Transformamos este objeto nativo del <form> en un objeto literal JS
    const formObj = Object.fromEntries(formData.entries());
    
    // Optimizacion 3: Cambiamos algunos datos del formulario
    formObj.price = Number(formObj.price); // Convertimos el precio en un numero para poder validarlo como tal
    formObj.name = formObj.name.trim();
    console.log(formObj); 
    
    // El objeto con la info del formulario se lo paso a la funcion para validar los campos
    const errores = validarFormulario(formObj); 

    console.log(errores);

    // Si hay errores, mostramos mensaje de error y terminamos aca, no hacemos la peticion
    if (errores.length > 0) {
        return mostrarListaErrores(errores);
    }

    try {
        const response = await fetch(`${urlBase}/api/products`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formObj)
        });

        // Mostramos por consola la respuesta cruda del servidor
        console.log(response);

        // Parseamos el JSON del body de la response para poder acceder al valor de message
        const data = await response.json();

        // Optimizacion 4: Filtramos errores 400 o 500
        if (!response.ok) {
            return mostrarMensaje("error", data.message);
        }

        let mensajeExito = `${data.message} con id ${data.productId}`;
        mostrarMensaje("exito", mensajeExito); // Producto creado exitosamente


    } catch (error) {
        console.error("Error al hacer la solicitud: ", error);
        mostrarMensaje("error", "Error al enviar la informacion");
    }
}



obtenerProductos(idProd);