import cv2
import numpy as np

# === CONFIGURACIÓN DEL MODELO YOLO ===
CFG_PATH     = "Client_Side/cfg/yolov4.cfg"
WEIGHTS_PATH = "Client_Side/weights/yolov4.weights"
NAMES_PATH   = "Client_Side/obj.names"

# Umbrales
CONF_THRESHOLD = 0.7
NMS_THRESHOLD  = 0.4

# === CARGA DEL MODELO ===
net = cv2.dnn.readNet(WEIGHTS_PATH, CFG_PATH)
net.setPreferableBackend(cv2.dnn.DNN_BACKEND_OPENCV)
net.setPreferableTarget(cv2.dnn.DNN_TARGET_CPU)

with open(NAMES_PATH, "r") as f:
    classes = [line.strip() for line in f]

# === FUNCIONES PRINCIPALES ===

def detectar_arma_en_frame(frame,
                           conf_threshold=CONF_THRESHOLD,
                           nms_threshold=NMS_THRESHOLD) -> bool:
    """
    Procesa un frame BGR y devuelve True si detecta
    al menos una arma con confianza > conf_threshold.
    """
    h, w = frame.shape[:2]
    blob = cv2.dnn.blobFromImage(frame, 1/255.0, (416, 416),
                                 swapRB=True, crop=False)
    net.setInput(blob)
    outs = net.forward(net.getUnconnectedOutLayersNames())

    boxes, confidences = [], []
    for out in outs:
        for det in out:
            scores = det[5:]
            conf = float(np.max(scores))
            if conf > conf_threshold:
                center_x = int(det[0] * w)
                center_y = int(det[1] * h)
                bw = int(det[2] * w)
                bh = int(det[3] * h)
                x = center_x - bw // 2
                y = center_y - bh // 2
                boxes.append([x, y, bw, bh])
                confidences.append(conf)

    idxs = cv2.dnn.NMSBoxes(boxes, confidences,
                            conf_threshold, nms_threshold)
    if len(idxs) > 0:
        idxs = idxs.flatten() if hasattr(idxs, 'flatten') else idxs
        return len(idxs) > 0
    return False

def reconocerArmas(imageInput) -> bool:
    """
    Recibe:
      - imageInput: ruta a fichero (str) o bytes de imagen (blob).
    Devuelve True si detecta arma, False en caso contrario.
    """
    # Cargar frame desde ruta o desde bytes
    if isinstance(imageInput, str):
        frame = cv2.imread(imageInput)
    else:
        buf = np.frombuffer(imageInput, dtype=np.uint8)
        frame = cv2.imdecode(buf, cv2.IMREAD_COLOR)

    if frame is None:
        raise ValueError("No se pudo decodificar la imagen de entrada.")

    return detectar_arma_en_frame(frame)
