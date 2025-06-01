document.addEventListener('DOMContentLoaded', event => {
    console.log("Entrando en la página");
    event.preventDefault();

    let canvasMap = document.getElementById("map");

    data = {
        ros: null,
        rosbridge_address: 'ws://192.168.0.95:9090', // Dirección IP del robot
        connected: false,
        service_busy: false,
        service_response: ''
    };

    connect();

    function connect() {
        console.log("Intentando conectar a ROSBridge en:", data.rosbridge_address);
        data.ros = new ROSLIB.Ros({ url: data.rosbridge_address });

        data.ros.on("connection", () => {
            console.log("Conectado a ROSBridge en:", data.rosbridge_address);
            data.connected = true;

            // Actualiza el feed de la cámara después de la conexión
            updateCameraFeed();
            console.log("Conexión ROSBridge exitosa");
        });

        data.ros.on("error", (error) => {
            console.error("Error al conectar con ROSBridge:", error);
            console.warn("Verifica que el servidor ROSBridge esté corriendo en la IP:", data.rosbridge_address);
        });

        data.ros.on("close", () => {
            console.log("Conexión a ROSBridge cerrada.");
            data.connected = false;
        });
    }

    function disconnect(){
        data.ros.close();
        data.connected = false;
        estado.textContent = 'Desconectado';
        estado.style.background = 'red';
        console.log('Clic en botón de desconexión');
    }

    function publishMovement(linearX, angularZ) {
        if (!cmdVelTopic) {
            console.warn("cmdVelTopic aún no inicializado");
            return;
        }
        const msg = new ROSLIB.Message({
            linear: { x: linearX, y: 0, z: 0 },
            angular: { x: 0, y: 0, z: angularZ }
        });
        cmdVelTopic.publish(msg);
        subscribe(msg);
    }

    // Movimiento recto
    function move() {
        publishMovement(0.1, 0.0);
    }

    // Detener el robot
    function stop() {
        publishMovement(0.0, 0.0);
    }

    // Sentido horario
    function right() {
        publishMovement(0.0, -0.2);
    }

    // Sentido antihorario
    function left() {
        publishMovement(0.0, 2.0);
    }

    // Control con el teclado (WASD)
    document.addEventListener("keydown", (event) => {
        switch (event.key.toLowerCase()) {
            case "w": move(); break;
            case "s": stop(); break;
            case "a": left(); break;
            case "d": right(); break;
        }
    });

    function subscribe(message){
        let topic = new ROSLIB.Topic({
            ros: data.ros,
            name: '/odom',
            messageType: 'nav_msgs/msg/Odometry'
        });

        topic.subscribe((message) => {
            data.position = message.pose.pose.position;
            document.getElementById("pos_x").innerHTML = data.position.x.toFixed(2);
            document.getElementById("pos_y").innerHTML = data.position.y.toFixed(2);
        });
    }

    // Función para mostrar el feed de la cámara en la página
    function updateCameraFeed() {
        const canvas = document.getElementById("cameraCanvas");

        if (!canvas) {
            console.error("Elemento <canvas> con id 'cameraCanvas' no encontrado en el DOM.");
            return;
        }

        const context = canvas.getContext("2d");

        // Verificar la conexión al topic /image
        const cameraTopic = new ROSLIB.Topic({
            ros: data.ros,
            name: '/image',
            messageType: 'sensor_msgs/msg/Image',
            qos: {
                reliability: ROSLIB.QOS_POLICY_RELIABILITY_BEST_EFFORT,
                durability: ROSLIB.QOS_POLICY_DURABILITY_VOLATILE
            }
        });

        cameraTopic.subscribe((message) => {
            //console.log("Mensaje recibido del topic /image:", message);

            try {
                // Decodificar los datos de la imagen
                const binaryData = atob(message.data);
                const bgrBuffer = new Uint8ClampedArray(binaryData.length);

                for (let i = 0; i < binaryData.length; i++) {
                    bgrBuffer[i] = binaryData.charCodeAt(i);
                }

                // Convertir de BGR a RGBA
                const rgbaBuffer = new Uint8ClampedArray(message.width * message.height * 4);
                for (let i = 0, j = 0; i < bgrBuffer.length; i += 3, j += 4) {
                    rgbaBuffer[j] = bgrBuffer[i + 2];     // R
                    rgbaBuffer[j + 1] = bgrBuffer[i + 1]; // G
                    rgbaBuffer[j + 2] = bgrBuffer[i];     // B
                    rgbaBuffer[j + 3] = 255;              // A (opacidad)
                }

                // Crear ImageData y dibujar en el canvas
                const imageData = new ImageData(rgbaBuffer, message.width, message.height);
                context.putImageData(imageData, 0, 0);
            } catch (error) {
                console.error("Error al procesar los datos de la imagen:", error);
            }
        });
    }
});
