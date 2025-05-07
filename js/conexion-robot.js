    console.log("entro en la pagina")
    //event.preventDefault();

    let canvasMap = document.getElementById("map");
    let popupInput = document.getElementById("popupInput");

    data = {
        // ros connection
        ros: null,
        rosbridge_address: popupInput.value,
        connected: false,
        // service information 
	    service_busy: false, 
	    service_response: ''
    }

    let cmdVelTopic; // <------- Instancia única de movimiento


    async function connect() {
        console.log("Clic en connect");
      
        return new Promise((resolve, reject) => {
          data.ros = new ROSLIB.Ros({ url: data.rosbridge_address });
      
          data.ros.on("connection", () => {
            data.connected = true;
            localStorage.setItem("robot", popupInput.value);
            console.log("Conexión ROSBridge correcta");
      
            // Suscribirse a /map
            var mapTopic = new ROSLIB.Topic({
              ros: data.ros,
              name: '/map',
              messageType: 'nav_msgs/msg/OccupancyGrid'
            });
      
            mapTopic.subscribe((message) => {
              console.log('Suscrito a /map');
              draw_occupancy_grid(canvasMap, message, 0);
            });
      
            // Publicador cmd_vel
            cmdVelTopic = new ROSLIB.Topic({
              ros: data.ros,
              name: '/cmd_vel',
              messageType: '/geometry_msgs/msg/Twist'
            });
      
            updateCameraFeed();
            resolve(true);
          });
      
          data.ros.on("error", (error) => {
            console.log("Error en ROSBridge: ", error);
            resolve(false);  // Rechazar también sería válido: reject(error)
          });
      
          data.ros.on("close", () => {
            data.connected = false;
            console.log("Conexión ROSBridge cerrada");
            resolve(false);
          });
        });
      }
      

    function disconnect(){
	    return new Promise((resolve) => {
            if (data.ros) {
              data.ros.on("close", () => {
                data.connected = false;
                console.log("Conexión cerrada");
                localStorage.removeItem("robot");
                resolve();
              });
              data.ros.close();
              console.log("Clic en botón de desconexión");
            } else {
              resolve(); // Si ya está desconectado
            }
          });
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

    /*function subscribeService(){
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
    }*/

        // Versión usando librería MJPEGCANVAS (requiere cargarla)
    /*function setCamera(){
        console.log("setting the camera")
    var viewer = new MJPEGCANVAS.Viewer({
        divID : 'mjpeg',
        host : 'localhost',
        width : 640,
        height : 480,
        topic : '/camera/image_raw',
        interval : 200
        })
    }*/

    // otro ejemplo de función (simple para prueba inicial)
    function updateCameraFeed() {
    const img = document.getElementById("cameraFeed");
    //const timestamp = new Date().getTime(); // Evita caché agregando un timestamp
    img.src = `http://127.0.0.1:8080/stream?topic=/camera/image_raw`;
    //img.src = `http://localhost:8080/stream?topic=/turtlebot3/camera/image_raw&console.log("Cactualizando: http://0.0.0.0:8080/stream?topic=/camera/image_raw)"`
    }


