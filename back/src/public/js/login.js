const inputEmail = document.getElementById("emailUser");
const inputPassword = document.getElementById("passwordUser");
const btnAccesoRapido = document.getElementById("btn-acceso-rapido");
const mensajeError = document.getElementById("mensaje-error");


// Acceso rápido: autocompleta los inputs
btnAccesoRapido.addEventListener("click", () => {
    inputEmail.value = "tomas@example.com";
    inputPassword.value = "admin123";
});


// Si el servidor mandó un error, existe el <p>: lo ocultamos a los 3 segundos
if (mensajeError) {
    setTimeout(() => {
        mensajeError.style.display = "none";
    }, 3000);
}

/*===================
     modo oscuro
====================*/
const btnTema = document.getElementById("btn-tema");

// Recordamos la elección entre visitas
if (localStorage.getItem("tema") === "oscuro") {
    document.documentElement.classList.add("oscuro");
}

btnTema.addEventListener("click", () => {
    const oscuro = document.documentElement.classList.toggle("oscuro");
    localStorage.setItem("tema", oscuro ? "oscuro" : "claro");
});