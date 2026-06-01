let movimientos = [];

async function cargarMovimientos() {
    const response = await fetch(`${API_URL}/api/movimientos`);
    const result = await response.json();

    movimientos = result.data;

    pintarFormularioMovimientos();
}

function pintarFormularioMovimientos() {
    const container = document.getElementById("movimientosDemo");

    container.innerHTML = "";

    for (let i = 1; i <= 5; i++) {
        const col = document.createElement("div");
        col.className = "col-md-6";

        const opciones = movimientos.map(mov => {
            return `
                <option value="${mov.id_movimiento}">
                    ${mov.nombre_movimiento}
                </option>
            `;
        }).join("");

        col.innerHTML = `
            <div class="demo-mov-card">
                <label>Movimiento ${i}</label>

                <select id="mov_${i}" class="form-select input-iot mb-3">
                    ${opciones}
                </select>

                <label>Tiempo en milisegundos</label>

                <input
                    type="number"
                    id="tiempo_${i}"
                    class="form-control input-iot"
                    value="1000"
                    min="0"
                >
            </div>
        `;

        container.appendChild(col);
    }
}

async function cargarDemos() {
    try {
        const response = await fetch(`${API_URL}/api/demos`);
        const result = await response.json();

        const container = document.getElementById("listaDemos");

        container.innerHTML = "";

        result.data.forEach(demo => {
            const div = document.createElement("div");

            div.className = "demo-item";

            div.innerHTML = `
                <div>
                    <h4>${demo.nombre_demo}</h4>
                    <p>${demo.descripcion ?? "Sin descripción"}</p>
                </div>

                <button
                    class="btn-demo"
                    onclick="ejecutarDemo(${demo.id_demo})"
                >
                    Ejecutar
                </button>
            `;

            container.appendChild(div);
        });

    } catch (error) {
        console.error(error);
        mostrarMensaje("Error al cargar demos", "danger");
    }
}

async function crearDemo() {
    const nombreDemo = document.getElementById("nombreDemo").value.trim();
    const descripcionDemo = document.getElementById("descripcionDemo").value.trim();

    if (!nombreDemo) {
        mostrarMensaje("Escribe un nombre para la demo", "warning");
        return;
    }

    const movimientosDemo = [];

    for (let i = 1; i <= 5; i++) {
        movimientosDemo.push({
            id_movimiento: Number(
                document.getElementById(`mov_${i}`).value
            ),
            tiempo_ms: Number(
                document.getElementById(`tiempo_${i}`).value
            )
        });
    }

    try {
        const response = await fetch(`${API_URL}/api/demo/crear`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nombre_demo: nombreDemo,
                descripcion: descripcionDemo,
                movimientos: movimientosDemo
            })
        });

        const result = await response.json();

        if (result.success) {
            mostrarMensaje("Demo creada correctamente", "success");

            document.getElementById("nombreDemo").value = "";
            document.getElementById("descripcionDemo").value = "";

            cargarDemos();
        } else {
            mostrarMensaje("No se pudo crear la demo", "danger");
        }

    } catch (error) {
        console.error(error);
        mostrarMensaje("Error al crear demo", "danger");
    }
}

async function ejecutarDemo(idDemo) {
    try {
        const response = await fetch(`${API_URL}/api/demo/ejecutar`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id_demo: idDemo,
                id_dispositivo: ID_DISPOSITIVO
            })
        });

        const result = await response.json();

        if (result.success) {
            mostrarMensaje("Demo ejecutándose", "success");
        } else {
            mostrarMensaje("No se pudo ejecutar la demo", "danger");
        }

    } catch (error) {
        console.error(error);
        mostrarMensaje("Error al ejecutar demo", "danger");
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

cargarMovimientos();
cargarDemos();

