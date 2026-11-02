
fetch("/api/estadisticas")
    .then(response => {
        if (!response.ok) {
            throw new Error("Error al obtener las estadísticas");
        }
        return response.json();
    })
    .then(datos => {
        // Gráfico de avistamientos por día
        new Chart(document.getElementById("grafico-avistamientos-dia"), {
            type: "line",
            data: {
                labels: datos.avistamientos_por_dia.map(item => item.fecha),
                datasets: [{
                    label: "Avistamientos",
                    data: datos.avistamientos_por_dia.map(item => item.total),
                    borderWidth: 2,
                    tension: 0.2
                }]
            }
        });

        // Gráfico de avistamientos por especie
        new Chart(document.getElementById("grafico-avistamientos-ave"), {
            type: "pie",
            data: {
                labels: datos.avistamientos_por_ave.map(item => item.ave),
                datasets: [{
                    label: "Avistamientos",
                    data: datos.avistamientos_por_ave.map(item => item.total)
                }]
            }
        });

        // Gráfico de voluntarios por comuna
        new Chart(document.getElementById("grafico-voluntarios-comuna"), {
            type: "bar",
            data: {
                labels: datos.voluntarios_por_comuna.map(item => item.comuna),
                datasets: [{
                    label: "Voluntarios",
                    data: datos.voluntarios_por_comuna.map(item => item.total),
                    borderWidth: 1
                }]
            },
            options: {
                indexAxis: "y"
            }
        });
    })
    .catch(error => {
        console.error("Error al cargar las estadísticas:", error);
    });
