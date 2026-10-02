document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("tr.fila-clic").forEach(function (fila) {
        fila.addEventListener("click", function () {
            window.location.href = fila.getAttribute("data-href");
        });
    });
});