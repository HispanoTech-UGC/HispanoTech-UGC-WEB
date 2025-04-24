document.addEventListener('DOMContentLoaded', event => {
    console.log("entro en la pagina")

    canvasMap = document.getElementById("map");

    data = {
        // ros connection
        ros: null,
        rosbridge_address: 'ws://127.0.0.1:9090/',
        connected: false,
        // service information 
	    service_busy: false, 
	    service_response: ''
    }

    let cmdVelTopic; // <------- Instancia única de movimiento

    connect();

    function connect(){
	      console.log("Clic en connect")
          //console.log(direccionBridge)

	      data.ros = new ROSLIB.Ros({ url: rosbridge_address })

        // Define callbacks
        data.ros.on("connection", () => {
            data.connected = true
            /*estado.textContent = 'Conectado';
            estado.style.background = 'green';*/
            //Subscribe to the map topic
            console.log("Conexión ROSBridge correcta")

            var mapTopic = new ROSLIB.Topic({
                ros: data.ros,
                name: '/map',
                messageType: 'nav_msgs/msg/OccupancyGrid'
            });

            mapTopic.subscribe((message) => {
                console.log('suscrito a map')
                draw_occupancy_grid(canvasMap, message, 0);
            });

            // Topic cmd_vel
            cmdVelTopic = new ROSLIB.Topic({
                ros: data_ros,
                name: '/cmd_vel',
                messageType: '/geometry_msgs/msg/Twist'
            });

            updateCameraFeed();
            console.log("Conexion con ROSBridge correcta")
            // suscribeBattery(); <-- No está el topic creado
            // suscribeWifi(); <-- No está el topic creado
        })

        data.ros.on("error", (error) => {
            console.log("Error en ROSBridge: ", error)
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


    function publishMovement(linearX, angularZ) {
        if (!cmdVelTopic) {
            console.warn("cmdVelTopic aún no inicializado");
            return;
        }
        const msg = new ROSLIB.Message({
          linear:  { x: linearX, y: 0, z: 0 },
          angular: { x: 0, y: 0, z: angularZ }
        });
        cmdVelTopic.publish(msg);
        subscribe(msg);
        //suscribeOdom();
      }

    // Linea Recta
    function move() {
        publishMovement(0.1, 0.0);
    }

    // Para el robot
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

    // Agregar control con el teclado (WASD)
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

});
