import {hacerFoto} from "./camera.js";

let sharePressed = false;

function inicializarMando() {
    const gamepad = navigator.getGamepads()[0];
    if (gamepad) {
        gamepad.buttons.forEach((btn, i) => {
            const el = document.querySelector(`.btn-${i}`);
            if (el) {
                el.classList.toggle('pressed', btn.pressed);
            }

            // Botón Share (btn 8)
            if (i === 8) {
                if (btn.pressed && !sharePressed) {
                    sharePressed = true;
                    hacerFoto();
                } else if (!btn.pressed) {
                    sharePressed = false;
                }
            }
        });

        // Joystick Izquierdo
        const leftX = gamepad.axes[0]; // -1 a 1
        const leftY = gamepad.axes[1];
        moveStick('stick-l', leftX, leftY);

        // Joystick Derecho
        const rightX = gamepad.axes[2];
        const rightY = gamepad.axes[3];
        moveStick('stick-r', rightX, rightY);
    }
    requestAnimationFrame(loop);
}

inicializarMando();
function moveStick(id, x, y) {
    const dot = document.getElementById(id);
    const radius = 24; // movimiento máximo en px dentro del círculo
    const posX = radius + x * radius;
    const posY = radius + y * radius;
    dot.style.left = `${posX}px`;
    dot.style.top = `${posY}px`;
}