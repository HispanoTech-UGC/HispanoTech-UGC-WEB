let robotPosition = { x: 0, y: 0 };
let mapInfo = null;
let mapData = null;
let mapCanvas = null;
let mapContext = null;

function initializeMapCanvas() {
    mapCanvas = document.getElementById("map");
    if (!mapCanvas) {
        console.error("Canvas element with id 'map' not found.");
        return;
    }
    mapCanvas.style.position = "absolute";
    mapCanvas.style.top = "10px";
    mapCanvas.style.left = "10px";
    mapCanvas.style.zIndex = "100";
    mapCanvas.style.width = "200px"; // Limitar el ancho del minimapa
    mapCanvas.style.height = "200px"; // Limitar la altura del minimapa
    mapContext = mapCanvas.getContext("2d");
}

function drawMap() {
    if (!mapInfo || !mapData || !mapContext) return;

    const res = mapInfo.resolution;
    const origin = mapInfo.origin;
    const width = mapInfo.width;
    const height = mapInfo.height;

    // Adjust canvas size
    mapCanvas.width = width;
    mapCanvas.height = height;

    // Clear the canvas
    mapContext.clearRect(0, 0, mapCanvas.width, mapCanvas.height);

    // Draw the occupancy grid
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const index = y * width + x;
            const value = mapData[index];

            mapContext.fillStyle = evaluarColor(value);
            mapContext.fillRect(x, y, 1, 1);
        }
    }
}

function drawRobot() {
    if (!mapInfo || !mapContext) {
        console.error("Map info or context is not initialized.");
        return;
    }

    const res = mapInfo.resolution;
    const origin = mapInfo.origin;
    const width = mapInfo.width;
    const height = mapInfo.height;

    console.log("Canvas dimensions:", { width, height });
    console.log("Robot world position:", robotPosition);

    const px = Math.round((robotPosition.x - origin.position.x) / res);
    const py = Math.round(height - (robotPosition.y - origin.position.y) / res); // Invert Y-axis

    console.log("Robot canvas coordinates:", { px, py });

    if (px >= 0 && px < width && py >= 0 && py < height) {
        mapContext.beginPath();
        mapContext.fillStyle = "green";
        mapContext.arc(px, py, 5, 0, 2 * Math.PI);
        mapContext.fill();
    } else {
        console.warn("Robot position is out of map bounds:", { px, py });
    }
}

function evaluarColor(value) {
    if (value === 0) return "#FFFFFF";      // libre
    else if (value === 100) return "#000000"; // ocupado
    else if (value === -1) return "#AAAAAA";  // desconocido
    else return "#CCCCCC"; // fallback
}

function updateRobotPosition(newX, newY) {
    console.log("Updating robot position:", { newX, newY });
    robotPosition.x = newX;
    robotPosition.y = newY;

    // Redraw only the robot
    drawRobot();
}

// Attach updateRobotPosition to the global window object
window.updateRobotPosition = updateRobotPosition;

document.addEventListener('DOMContentLoaded', () => {
    initializeMapCanvas();

    const ros = new ROSLIB.Ros({
        url: 'ws://192.168.0.95:9090/' // Ensure this matches the correct IP and port
    });

    const odomTopic = new ROSLIB.Topic({
        ros: ros,
        name: '/odom',
        messageType: 'nav_msgs/Odometry'
    });

    odomTopic.subscribe((message) => {
        const newX = message.pose.pose.position.x;
        const newY = message.pose.pose.position.y;
        updateRobotPosition(newX, newY);
    });

    const mapTopic = new ROSLIB.Topic({
        ros: ros,
        name: '/map',
        messageType: 'nav_msgs/OccupancyGrid'
    });

    mapTopic.subscribe((message) => {
        mapInfo = message.info;
        mapData = message.data;

        console.log("Map data updated. Redrawing map...");
        drawMap(); // Redraw the map when new data is received
        drawRobot(); // Draw the robot on the updated map
    });

    // Suscribirse al tópico del escáner láser
    const scanTopic = new ROSLIB.Topic({
        ros: ros,
        name: '/scan', // Cambiar si el tópico tiene otro nombre
        messageType: 'sensor_msgs/LaserScan'
    });

    scanTopic.subscribe((message) => {
        const angleMin = message.angle_min;
        const angleIncrement = message.angle_increment;
        const ranges = message.ranges;

        if (!mapInfo || !mapContext) {
            console.error("Map info or context is not initialized for scan data.");
            return;
        }

        const res = mapInfo.resolution;
        const origin = mapInfo.origin;
        const height = mapInfo.height;

        // Dibujar obstáculos detectados
        ranges.forEach((range, index) => {
            if (range < message.range_max) { // Filtrar valores válidos
                const angle = angleMin + index * angleIncrement;
                const x = robotPosition.x + range * Math.cos(angle);
                const y = robotPosition.y + range * Math.sin(angle);

                const px = Math.round((x - origin.position.x) / res);
                const py = Math.round(height - (y - origin.position.y) / res); // Invertir eje Y

                if (px >= 0 && px < mapInfo.width && py >= 0 && py < height) {
                    mapContext.fillStyle = "red"; // Color para obstáculos detectados
                    mapContext.fillRect(px, py, 1, 1);
                }
            }
        });
    });

    ros.on('connection', () => {
        console.log('Connected to ROSBridge');
    });

    ros.on('error', (error) => {
        console.error('Error connecting to ROSBridge:', error);
    });

    ros.on('close', () => {
        console.log('Connection to ROSBridge closed');
    });
});
