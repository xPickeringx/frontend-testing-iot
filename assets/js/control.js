const API_URL = "http://192.168.0.15:5000";

async function ejecutarMovimiento(idMovimiento)
{
    try
    {
        const response =
        await fetch(
            `${API_URL}/api/movimiento/registrar`,
            {
                method: "POST",
                headers:
                {
                    "Content-Type":
                    "application/json"
                },
                body: JSON.stringify({
                    id_movimiento:
                    idMovimiento,

                    id_dispositivo: 1,

                    id_telemetria: null,

                    origen: "WEB"
                })
            }
        );

        const data =
        await response.json();

        console.log(data);

    }
    catch(error)
    {
        console.error(error);
    }
}