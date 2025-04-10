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

    const pointSize = 1;

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
        let posX = robotPosition.x + canvas.width/2 - robotSize.width/2;
        let posY = robotPosition.y + canvas.height/2 - robotSize.height/2;

        // console.log(posX, posY)

        // ctx.beginPath();
        // ctx.fillStyle = 'green';
        // ctx.fillRect(posX, posY, robotSize.width, robotSize.height);
        // ctx.stroke();

        ctx.beginPath();
        ctx.fillStyle = 'green';
        ctx.arc(posX, posY, robotSize.width/2, 0, 2 * Math.PI);
        ctx.fill();
    }

}

function evaluarGradiente(valor) {

    if (valor == 100) return "rgb(0,0,0)"
    else if (valor == 0) return "rgb(255,255,255)"
    else if (valor < 0) return "rgb(120,120,120)"

    // Define la escala de colores
    var colores = [
        [0, 0, 0],
        [0, 0, 0],
        [255, 0, 255],
        [250, 0, 0],
        [0, 255, 255],
    ];

    // Convierte el valor en una posición en la escala
    var posicion = valor / 100 * (colores.length - 1);
    var posicionEntera = Math.floor(posicion);
    var posicionDecimal = posicion - posicionEntera;

    // Interpola entre los colores en las posiciones correspondientes
    var color1 = colores[posicionEntera];
    var color2 = colores[posicionEntera + 1];

    if (typeof color1 !== 'undefined' && typeof color2 !== 'undefined' && color1.length > 0 && color2.length > 0) {
        var r = color1[0] * (1 - posicionDecimal) + color2[0] * posicionDecimal;
        var g = color1[1] * (1 - posicionDecimal) + color2[1] * posicionDecimal;
        var b = color1[2] * (1 - posicionDecimal) + color2[2] * posicionDecimal;
    }

    // Devuelve el color en formato RGB
    return "rgb(" + Math.round(r) + ", " + Math.round(g) + ", " + Math.round(b) + ")";
}