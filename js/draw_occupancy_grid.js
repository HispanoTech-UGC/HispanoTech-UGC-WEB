function draw_occupancy_grid(canvas, map_data, robotPosition) {
    const container = canvas.parentElement;
    const ctx = canvas.getContext("2d");

    // Ajustar el tamaño del canvas al tamaño del contenedor
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    const map = map_data;
    const mapWidth = map.info.width;
    const mapHeight = map.info.height;

    // Escalado para ajustar el mapa al canvas
    const scaleX = canvas.width / mapWidth;
    const scaleY = canvas.height / mapHeight;

    /*const pointSize = 1;*/

    for (let i = 0; i < mapHeight; i++) {
        for (let j = 0; j < mapWidth; j++) {
            let pos = mapWidth * i + j;
            let gridValue = map.data[pos];
            let color = evaluarGradiente(gridValue);

            // Posición y escala
            const posX = j * scaleX;
            const posY = i * scaleY;

            ctx.fillStyle = color;
            ctx.fillRect(posX, posY, scaleX, scaleY);
        }
    }
    

    if(robotPosition) {
        let robotSize = {
            width:4,
            height:4,
        }
        const res = map.info.resolution;
        const origin = map.info.origin;

        // Posición en celdas del mapa
        const mapX = (robotPosition.x - origin.position.x) / res;
        const mapY = (robotPosition.y - origin.position.y) / res;

        // Posición en píxeles en el canvas (invertimos eje Y si es necesario)
        const posX = mapX * scaleX;
        const posY = canvas.height - mapY * scaleY; // Invertir Y si tu mapa lo necesita


        console.log(posX, posY)

        ctx.beginPath();
        ctx.fillStyle = 'green';
        ctx.fillRect(posX, posY, robotSize.width, robotSize.height);
        ctx.stroke();

        ctx.beginPath();
        ctx.fillStyle = 'green';
        ctx.arc(posX, posY, robotSize.width/2, 0, 2 * Math.PI);
        ctx.fill();
    }

}

function evaluarGradiente(valor) {

    if (valor === 100) return "rgb(0,0,0)"
    else if (valor === 0) return "rgb(255,255,255)"
    else if (valor < 0) return "rgb(120,120,120)"

    // Define la escala de colores
    const colores = [
        [0, 0, 0],
        [0, 0, 0],
        [255, 0, 255],
        [250, 0, 0],
        [0, 255, 255],
    ];

    // Convierte el valor en una posición en la escala
    let posicion = valor / 100 * (colores.length - 1);
    let posicionEntera = Math.floor(posicion);
    let posicionDecimal = posicion - posicionEntera;

    // Interpola entre los colores en las posiciones correspondientes
    let color1 = colores[posicionEntera];
    let color2 = colores[posicionEntera + 1];

    let r = 0;
    let g = 0;
    let b = 0;

    if (typeof color1 !== 'undefined' && typeof color2 !== 'undefined' && color1.length > 0 && color2.length > 0) {
        r = color1[0] * (1 - posicionDecimal) + color2[0] * posicionDecimal;
        g = color1[1] * (1 - posicionDecimal) + color2[1] * posicionDecimal;
        b = color1[2] * (1 - posicionDecimal) + color2[2] * posicionDecimal;
    }

    // Devuelve el color en formato RGB
    return "rgb(" + Math.round(r) + ", " + Math.round(g) + ", " + Math.round(b) + ")";
}