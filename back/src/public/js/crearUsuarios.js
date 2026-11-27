const urlBase = "http://localhost:4000";
const btnTema = document.getElementById("btn-tema");

// Recordamos la elección entre visitas
if (localStorage.getItem("tema") === "oscuro") {
    document.documentElement.classList.add("oscuro");
}

btnTema.addEventListener("click", () => {
    const oscuro = document.documentElement.classList.toggle("oscuro");
    localStorage.setItem("tema", oscuro ? "oscuro" : "claro");
});