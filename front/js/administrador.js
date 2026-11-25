const contenedor = document.getElementById("tabla-admin");
const mensaje = document.getElementById("mensaje");
const urlBase = "http://localhost:4000";
const getProductForm = document.getElementById("getProductForm");
const cargarProducto = document.getElementById("cargarProducto");

let idProd = "";

let temporizadorMensaje;
function mostrarMensaje(type, message) {
    mensaje.innerHTML = `
        <p class="mensaje-${type}">${message}</p>
    `;
    clearTimeout(temporizadorMensaje);
    temporizadorMensaje = setTimeout(() => {
        mensaje.innerHTML = "";
    }, 2000);
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

    // CAMBIO: nueva columna "Estado"
    htmlProducto += `<tr><th></th><th>Id</th><th>Nombre</th><th>Equipo</th><th>Categoría</th><th>Precio</th><th>Estado</th><th>Acción</th></tr>`;

    array.forEach(prod => {
        // NUEVO: averiguamos si está activo (1) o inactivo (0)
        const activo = Number(prod.active) === 1;

        // CAMBIO: clase en el <tr> y nueva celda de estado
        htmlProducto +=`
        <tr class="${activo ? "" : "fila-inactiva"}">
            <td><img src="${prod.image}" alt="${prod.name}"></td>
            <td class="linea">${prod.id}</td>
            <td class="linea">${prod.name}</td>
            <td class="linea">${prod.team}</td>
            <td class="linea">${prod.category}</td>
            <td class="linea">${prod.price}</td>
            <td><span class="estado ${activo ? "estado-activo" : "estado-inactivo"}">${activo ? "Activo" : "Inactivo"}</span></td>
            <td> <button onclick="formPutProduct(${prod.id})" class="btn-editar">Editar</button> <button onclick="eliminarProducto(${prod.id})" class="btn-eliminar">Eliminar</button></td>
        </tr>
        `;
    });
    htmlProducto += `</table>`;

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
        
        cargarProducto.innerHTML = htmlErrores;
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
            <option value="camiseta">Camiseta</option>
            <option value="campera">Campera</option>
            <option value="short">Short</option>
        </select>


        <label for="imageProd">Imagen</label>

        <input class="inputsForm"  type="text" name="image" id="imageProd" required>

        <label for="nameProd">Nombre</label>

        <input class="inputsForm"  type="text" name="name" id="nameProd" required>

        <label for="priceProd">Precio</label>

        <input class="inputsForm" type="number" name="price" id="priceProd" min="1" required>

        <input id="btn-create-product" type="submit" value="Crear producto">

    </form>`;

    cargarProducto.innerHTML = formHtml;

    const form = document.getElementById("crearFormProductos");
    form.addEventListener("submit", async (event) => {
        event.preventDefault(); // Evita que la página se recargue!
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
    cargarProducto.innerHTML = "";
    obtenerProductos(idProd);
}


async function formPutProduct(id) {

    console.log("hola");
    try {
        const response = await fetch(`${urlBase}/api/products/${id}`);
        
        const data = await response.json(); // Ajustá a response.data si tu API envuelve el objeto


        console.log("id recibido:", id);
        console.log("respuesta:", data);
        const prod = data.payload[0];
        
        console.log(prod);

        if (!response.ok) {
            return mostrarMensaje("error", data.message);
        }

        let formHtml = `<h2>Actualizar producto</h2>
        
        <form id="crearFormProductos">
        
            <label for="team">Equipo</label>

            <input type="hidden" name="id" value="${prod.id}">

            <select class="inputsForm" name="team" id="equipo" value="${prod.team}" required>
                <option value="racing">Racing</option>
                <option value="san_lorenzo">San Lorenzo</option>
                
            </select>
            
            <label for="categoryProd">Categoria</label>

            <select class="inputsForm" name="category" id="categoryProd" value="${prod.category}"  required>
                <option value="camiseta">Camiseta</option>
                <option value="campera">Campera</option>
                <option value="short">Short</option>
            </select>


            <label for="imageProd">Imagen</label>

            <input class="inputsForm"  type="text" name="image" id="imageProd" value="${prod.image}" required>

            <label for="nameProd">Nombre</label>

            <input class="inputsForm"  type="text" name="name" id="nameProd"  value="${prod.name}" required>

            <label for="priceProd">Precio</label>

            <input class="inputsForm" type="number" name="price" id="priceProd" min="1" value="${prod.price}" required>

            <label for="activeProd">Activo</label>
            <select name="active" id="activeProd" required>
                <option value="1">Activo</option>
                <option value="0">Inactivo</option>
            </select>

            <input id="btn-create-product" type="submit" value="Editar producto">

        </form>`;

        cargarProducto.innerHTML = formHtml;
        cargarProducto.scrollIntoView({ behavior: "smooth" });

        document.getElementById("activeProd").value = String(prod.active);
        document.getElementById("equipo").value = prod.team;
        document.getElementById("categoryProd").value = prod.category;
        
        const actualizarFormProductos = document.getElementById("crearFormProductos");

        actualizarFormProductos.addEventListener("submit", event => {
            // Llamamos a la funcion que hara la peticion PUT y le pasamos el event
            actualizarProducto(event);
        });
    } catch (error) {
        console.error(error);
        alert("Error al cargar los datos del producto");
    }
}


async function actualizarProducto(event) {

    event.preventDefault(); // Evitamos el envio por defecto del formulario

    const formData = new FormData(event.target);

    const formObj = Object.fromEntries(formData.entries());

    // Optimizacion 5: Cambiamos algunos datos del formulario
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

    console.table(formObj);

    
    try {
        const response = await fetch(`${urlBase}/api/products`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formObj)
        });

        console.log(response);

        const data = await response.json();

        cargarProducto.innerHTML = "";

        if (!response.ok) {
            console.error(data.message);
            return mostrarMensaje("error", data.message);
        }

        console.log(data.message);

        mostrarMensaje("exito", data.message);


    } catch (error) {
        console.error("Error al enviar los datos");
        alert("Error al procesar la solicitud");
        mostrarMensaje("error", "Error al enviar la informacion");
    }
    obtenerProductos(idProd);
}



obtenerProductos(idProd);