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