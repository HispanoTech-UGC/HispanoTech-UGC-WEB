

function drawMapAndRobot() {
    if (!mapInfo || !mapData) return;
    let canvas = document.getElementById("map");
    let ctx = canvas.getContext("2d");

    let mapInfo;
    let mapData;
    let robotPosition = {x: 0, y: 0};
    // Ajustar tamaño canvas
    canvas.width = mapInfo.width;
    canvas.height = mapInfo.height;

    const res = mapInfo.resolution;
    const origin = mapInfo.origin;

    // Escalar cada celda a 1px (o más si quieres ampliar visualmente)
    const scale = 1;
    const width = mapInfo.width;
    const height = mapInfo.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Pintar el grid
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const index = y * width + x;
            const value = mapData[index];

            ctx.fillStyle = evaluarColor(value);
            ctx.fillRect(x * scale, y * scale, scale, scale);
        }
    }

    // Pintar el robot
    let px = (robotPosition.x - origin.position.x) / res;
    let py = height - ((robotPosition.y - origin.position.y) / res); // Invertido en Y

    ctx.beginPath();
    ctx.fillStyle = "green";
    ctx.arc(px, py, 5, 0, 2 * Math.PI);
    ctx.fill();
}

function evaluarColor(value) {
    if (value === 0) return "#FFFFFF";      // libre
    else if (value === 100) return "#000000"; // ocupado
    else if (value === -1) return "#AAAAAA";  // desconocido
    else return "#CCCCCC"; // fallback
}
