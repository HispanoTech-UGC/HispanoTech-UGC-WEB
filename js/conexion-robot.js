document.addEventListener('DOMContentLoaded', event => {
    console.log("entro en la pagina")

    canvasMap = document.getElementById("map");

    // Agregar control con el teclado (WASD)
    document.addEventListener("keydown", (event) => {
        switch (event.key.toLowerCase()) {
            case "w":
                move();
                break;
            case "s":
                stop();
                break;
            case "a":
                left();
                break;
            case "d":
                right();
                break;
        }
    });


    data = {
        // ros connection
        ros: null,
        rosbridge_address: 'ws://127.0.0.1:9090/',
        connected: false,
        // service information 
        service_busy: false, 
        service_response: ''
    }
    connect();

    function connect(){
        console.log("Clic en connect")
        //console.log(direccionBridge)

        data.ros = new ROSLIB.Ros({
                url: 'ws://127.0.0.1:9090/',
        })

        // Define callbacks
        data.ros.on("connection", () => {
            data.connected = true
            /*estado.textContent = 'Conectado';
            estado.style.background = 'green';*/
            //Subscribe to the map topic
            var mapTopic = new ROSLIB.Topic({
                ros: data.ros,
                name: '/map',
                messageType: 'nav_msgs/msg/OccupancyGrid'
            });

            mapTopic.subscribe((message) => {
                console.log('suscrito a map')
                draw_occupancy_grid(canvasMap, message, 0);
            });
            updateCameraFeed();
            console.log("Conexión camara correcta")

            // Para cuando los topicos /battery_state y /wifi_state estén creados
            // subscribeBattery();
            // console.log("Conexión batería correcta")

            // subscribeWifi();
            // console.log("Conexión wifi correcto")

            console.log("Conexion con ROSBridge correcta")

        })
        data.ros.on("error", (error) => {
            console.log("Se ha producido algun error mientras se intentaba realizar la conexion")
            console.log(error)
        })
        data.ros.on("close", () => {
            data.connected = false
            console.log("Conexion con ROSBridge cerrada")
        })
    }

    function disconnect(){
        data.ros.close()
        data.connected = false
        estado.textContent = 'Desconectado';
        estado.style.background = 'red';
        console.log('Clic en botón de desconexión')
    }

    function move() {
        let topic = new ROSLIB.Topic({
            ros: data.ros,
            name: '/cmd_vel',
            messageType: 'geometry_msgs/msg/Twist'
        })
        let message = new ROSLIB.Message({
            linear: {x: 0.1, y: 0, z: 0, },
            angular: {x: 0, y: 0, z: -0.2, },
        })
        topic.publish(message)
        subscribe(message)
    }

    function stop() {
        let topic = new ROSLIB.Topic({
            ros: data.ros,
            name: '/cmd_vel',
            messageType: 'geometry_msgs/msg/Twist'
        })
        let message = new ROSLIB.Message({
            linear: {x: 0.0, y: 0, z: 0, },
            angular: {x: 0, y: 0, z: 0.0, },
        })
        topic.publish(message)
        subscribe(message)
    }

    function right() {
        let topic = new ROSLIB.Topic({
            ros: data.ros,
            name: '/cmd_vel',
            messageType: 'geometry_msgs/msg/Twist'
        })
        let message = new ROSLIB.Message({
            linear: {x: 0.1, y: 0, z: 0, },
            angular: {x: 0, y: 0, z: 0.0, },
        })
        topic.publish(message)
        subscribe(message)
    }

    function left() {
        let topic = new ROSLIB.Topic({
            ros: data.ros,
            name: '/cmd_vel',
            messageType: 'geometry_msgs/msg/Twist'
        })
        let message = new ROSLIB.Message({
            linear: {x: -0.1, y: 0, z: 0, },
            angular: {x: 0, y: 0, z: 0.0, },
        })
        topic.publish(message)
        subscribe(message)
    }

    function subscribe(message){
        let topic = new ROSLIB.Topic({
            ros: data.ros,
            name: '/odom',
            messageType: 'nav_msgs/msg/Odometry'
        })
        topic.subscribe((message) => {
            data.position = message.pose.pose.position
                document.getElementById("pos_x").innerHTML = data.position.x.toFixed(2)
                document.getElementById("pos_y").innerHTML = data.position.y.toFixed(2)
        })
    }

    function subscribeService(){
        // define the service to be called
        let service = new ROSLIB.Service({
            ros : data.ros,
            name : '/move',
            serviceType : 'rossrv/Type',
        })
        // define the request
        let request = new ROSLIB.ServiceRequest({
            param1 : 123,
            param2 : 'example of parameter',
        })
        // define a callback
        service.callService(request, (result) => {
            console.log('This is the response of the service ')
            console.log(result)

        }, (error) => {
            console.error(error)
        }) 
    }

        // Versión usando librería MJPEGCANVAS (requiere cargarla)
    function setCamera(){
        console.log("setting the camera")
    var viewer = new MJPEGCANVAS.Viewer({
        divID : 'mjpeg',
        host : 'localhost',
        width : 640,
        height : 480,
        topic : '/camera/image_raw',
        interval : 200
        })
    }

    // otro ejemplo de función (simple para prueba inicial)
    function updateCameraFeed() {
    const img = document.getElementById("cameraFeed");
    const timestamp = new Date().getTime(); // Evita caché agregando un timestamp
    img.src = `http://127.0.0.1:8080/stream?topic=/camera/image_raw`;
    //img.src = `http://localhost:8080/stream?topic=/turtlebot3/camera/image_raw&console.log("Cactualizando: http://0.0.0.0:8080/stream?topic=/camera/image_raw)"`
    }

    function subscribeBattery() {
        // Define el tópico de la batería (ajusta el nombre si fuera necesario)
        var batteryTopic = new ROSLIB.Topic({
            ros: data.ros,
            name: '/battery_state',  // Verifica que este sea el nombre correcto
            messageType: 'sensor_msgs/msg/BatteryState'
        });

        batteryTopic.subscribe(function (message) {
            // Se asume que la propiedad 'percentage' viene como un valor entre 0 y 1
            let batteryPercentage = message.percentage * 100;
            console.log("Nivel de batería:", batteryPercentage + "%");

            // Actualiza el número de batería en el HTML
            document.getElementById("batteryStatus").textContent = Math.round(batteryPercentage) + "%";

            // Actualiza el ícono de la batería según el nivel (ajusta las rutas a tus imágenes)
            var batteryIcon = document.getElementById("batteryIcon");
            if (batteryPercentage >= 80) {
                batteryIcon.src = "assets/imágenes/iconos/batería06.svg";
            } else if (batteryPercentage >= 60) {
                batteryIcon.src = "assets/imágenes/iconos/batería05.svg";
            } else if (batteryPercentage >= 40) {
                batteryIcon.src = "assets/imágenes/iconos/batería04.svg";
            } else if (batteryPercentage >= 20) {
                batteryIcon.src = "assets/imágenes/iconos/batería03.svg";
            } else if (batteryPercentage >= 5) {
                batteryIcon.src = "assets/imágenes/iconos/batería02.svg";
            } else {
                batteryIcon.src = "assets/imágenes/iconos/batería01.svg";
            }
        });
    }

    function subscribeWifi() {
        // Define el tópico de WiFi, asegurándote que el nombre y el tipo del mensaje sean correctos.
        var wifiTopic = new ROSLIB.Topic({
            ros: data.ros,
            name: '/wifi_state',  // Este tópico debe estar publicando la calidad de WiFi.
            messageType: 'std_msgs/msg/Float64'  // Se espera un valor numérico, por ejemplo entre 0 y 100.
        });

        wifiTopic.subscribe(function (message) {
            // Suponemos que message.data contiene un valor entre 0 y 100 representando la calidad.
            let wifiQuality = message.data;
            console.log("Calidad de WiFi:", wifiQuality);

            // Actualiza el elemento de WiFi en tu HTML.
            var wifiIcon = document.querySelector(".img.wifi");

            // Actualiza la imagen según el valor de wifiQuality.
            if (wifiQuality >= 70) {
                wifiIcon.src = "assets/imágenes/iconos/Property 1=100wifi.svg";  // Conexión excelente
            }else if (wifiQuality >= 40) {
                wifiIcon.src = "assets/imágenes/iconos/Property 1=50wifi.svg";    // Conexión baja
            } else {
                wifiIcon.src = "assets/imágenes/iconos/Property 1=20wifi.svg";    // Conexión muy baja o sin señal
            }
        });
    }
});
