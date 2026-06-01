let parametros = [];

async function cargarParametros() {
    try {
        const response = await fetch(`${API_URL}/api/parametros`);
        const result = await response.json();

        parametros = result.data;

        const container = document.getElementById("parametrosContainer");

        container.innerHTML = "";

        parametros.forEach(parametro => {
            const col = document.createElement("div");
            col.className = "col-md-6";

            col.innerHTML = `
                <div class="param-card">
                    <label>${parametro.clave}</label>

                    <input
                        type="number"
                        step="0.01"
                        class="form-control mt-2"
                        id="param_${parametro.clave}"
                        value="${parametro.valor}"
                    >

                    <small>${parametro.descripcion ?? ""}</small>
                </div>
            `;

            container.appendChild(col);
        });

    } catch (error) {
        console.error(error);
        mostrarMensaje("Error al cargar parámetros", "danger");
    }
}

async function guardarParametros() {
    try {
        for (const parametro of parametros) {
            const input = document.getElementById(
                `param_${parametro.clave}`
            );

            await fetch(`${API_URL}/api/parametro/actualizar`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    clave: parametro.clave,
                    valor: Number(input.value)
                })
            });
        }

        mostrarMensaje("Configuración guardada correctamente", "success");

    } catch (error) {
        console.error(error);
        mostrarMensaje("Error al guardar configuración", "danger");
    }
}

function mostrarMensaje(texto, tipo) {
    const mensaje = document.getElementById("mensaje");

    mensaje.className = `mensaje mt-4 ${tipo}`;
    mensaje.innerText = texto;

    setTimeout(() => {
        mensaje.innerText = "";
        mensaje.className = "mensaje mt-4";
    }, 4000);
}

cargarParametros();