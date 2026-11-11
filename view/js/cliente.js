const contenedorProductos = document.getElementById("contenedor-productos");
const urlBase = "http://localhost:4000";

// Optimizacion 1: Mostramos el mensaje de error visualmente
function mostrarError(message) {
    contenedorProductos.innerHTML = `        
        <p class="mensaje error">${message}</p>
    `;
}

async function obtenerProductos() {
    try {
        const response = await fetch(`${urlBase}/api/products`);
        console.log(response); // Response {type: 'cors', url: 'http://localhost:4000/api/products', redirected: false, status: 200, ok: true, …}

        const data = await response.json();

        // Optimizacion 2: Filtramos errores 400 o 500
        if (!response.ok) {
            return mostrarError(data.message);
            // el return hace que esta funcion termine
        }
        
        // En data tenemos payload: arrayDeObjetos
        const productos = data.payload;
        console.table(productos);
        
        renderizarProductos(productos);
        
    } catch (error) {
        // El catch solo captura errores reales de red (no hay conexion o el server esta caido)
        console.error("Error al hacer la solicitud: ", error);
        mostrarError("Fallo la conexion con el servidor");
    }
}


function renderizarProductos(array) {
    let htmlProducto = "";
    
    array.forEach(prod => {
        htmlProducto += `
        <div class="card-producto ${prod.team}">
            <img class="card-img" src="${prod.image}" alt="${prod.name}">
            <h4>${prod.name}</h4>
            <p class="producto-id">Id: ${prod.id}</p>
            <p class="precio">$ ${prod.price}</p>
            <button class="btn-carrito">Agregar al carrito</button>
        </div>
        `;
    });
        
        contenedorProductos.innerHTML = htmlProducto;
    }
    
    obtenerProductos();

document.getElementById("btn-admin").addEventListener("click", () => {
    window.location.href = "administrador.html";
    }
);