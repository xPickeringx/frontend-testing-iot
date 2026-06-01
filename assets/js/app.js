let ultimoHeartbeat = null;

const ws = new WebSocket(WS_URL);

ws.onopen = () => {
    console.log("Dashboard conectado al WebSocket");

    ws.send(JSON.stringify({
        tipo: "WEB"
    }));
};

ws.onmessage = (event) => {
    const mensaje = JSON.parse(event.data);

    console.log("WS:", mensaje);

    if (mensaje.evento === "HEARTBEAT") {
        ultimoHeartbeat = new Date();

        document.getElementById("estado").innerText = "ONLINE";
        document.getElementById("estado").classList.add("online");

        document.getElementById("ip").innerText = mensaje.data.ip;
        document.getElementById("rssi").innerText = `${mensaje.data.rssi} dBm`;
    }

    if (mensaje.evento === "MOVIMIENTO_REGISTRADO") {
        document.getElementById("ultimoMovimiento").innerText =
            mensaje.data.nombre_movimiento;

        mostrarMensaje(
            `Movimiento enviado: ${mensaje.data.nombre_movimiento}`,
            "info"
        );
    }

    if (mensaje.evento === "MOVIMIENTO_FINALIZADO") {
        mostrarMensaje(
            `Movimiento finalizado. Registro: ${mensaje.data.id_registro}`,
            "success"
        );
    }
};

ws.onclose = () => {
    document.getElementById("estado").innerText = "OFFLINE";
    document.getElementById("estado").classList.remove("online");
};

setInterval(() => {
    if (!ultimoHeartbeat) return;

    const diferencia = new Date() - ultimoHeartbeat;

    if (diferencia > 15000) {
        document.getElementById("estado").innerText = "OFFLINE";
        document.getElementById("estado").classList.remove("online");
    }
}, 3000);

async function ejecutarMovimiento(idMovimiento) {
    try {
        const response = await fetch(`${API_URL}/api/movimiento/registrar`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id_movimiento: idMovimiento,
                id_dispositivo: ID_DISPOSITIVO,
                id_telemetria: null,
                origen: "WEB"
            })
        });

        const data = await response.json();

        console.log(data);

        mostrarMensaje("Movimiento enviado correctamente", "info");

    } catch (error) {
        console.error(error);
        mostrarMensaje("Error al enviar movimiento", "danger");
    }
}

async function cargarDemos() {
    try {
        const response = await fetch(`${API_URL}/api/demos`);
        const result = await response.json();

        const select = document.getElementById("selectDemo");

        select.innerHTML = "";

        result.data.forEach(demo => {
            const option = document.createElement("option");

            option.value = demo.id_demo;
            option.textContent = demo.nombre_demo;

            select.appendChild(option);
        });

    } catch (error) {
        console.error(error);
        mostrarMensaje("Error al cargar demos", "danger");
    }
}

async function ejecutarDemo() {
    const idDemo = document.getElementById("selectDemo").value;

    if (!idDemo) {
        mostrarMensaje("Selecciona una demo", "warning");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/api/demo/ejecutar`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id_demo: Number(idDemo),
                id_dispositivo: ID_DISPOSITIVO
            })
        });

        const data = await response.json();

        console.log(data);

        mostrarMensaje("Demo ejecutándose", "success");

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

cargarDemos();