const ws = new WebSocket(
    WS_URL
);

ws.onopen = () =>
{
    ws.send(
        JSON.stringify({
            tipo: "WEB"
        })
    );
};

ws.onmessage = (event) =>
{
    const mensaje =
        JSON.parse(event.data);

    console.log(mensaje);

    switch(mensaje.evento)
    {
        case "HEARTBEAT":

            document
            .getElementById("estado")
            .innerHTML = "ONLINE";

            document
            .getElementById("ip")
            .innerHTML =
            mensaje.data.ip;

            document
            .getElementById("rssi")
            .innerHTML =
            mensaje.data.rssi;

        break;

        case "MOVIMIENTO_REGISTRADO":

            document
            .getElementById("movimiento")
            .innerHTML =
            mensaje.data.nombre_movimiento;

        break;

        case "MOVIMIENTO_FINALIZADO":

            console.log(
                "Movimiento completado"
            );

        break;
    }
};

ws.onclose = () =>
{
    document
    .getElementById("estado")
    .innerHTML = "OFFLINE";
};