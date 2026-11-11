const contenedor = document.getElementById("tabla-admin");
const urlBase = "http://localhost:4000";
const getProductForm = document.getElementById("getProductForm");
let idProd = "";

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

        const data = await response.json();

        // Optimizacion 2: Filtramos errores 400 o 500
        if (!response.ok) {
            return mostrarError(data.message);
            // el return hace que esta funcion termine
        }
        
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
            <td> <button class="btn-editar">Editar</button><button class="btn-eliminar">Eliminar</button></td>
        </tr>
        `;
    });
    htmlProducto += `</table>`

    contenedor.innerHTML = htmlProducto;
}

document.getElementById("btn-cliente").addEventListener("click", () => {
    window.location.href = "index.html";
    }
);





obtenerProductos(idProd);