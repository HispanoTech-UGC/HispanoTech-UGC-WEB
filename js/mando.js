let sharePressed = false;
let optnPressed = false;
let r3Pressed = false;
let focusMode = false;
let focusedIndex = 0;

let lastRightY = 0;
const sonidos = {
    inicio: new Audio('../audio/LogLogin.mp3'),
    //click: new Audio('sounds/click.mp3'),
    cancel: new Audio('../audio/Cancel.mp3'),
    menu: new Audio('../audio/Refine.mp3')
};

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

            // Botón Options (btn 9)
            if (i === 9) {
                if (btn.pressed && !optnPressed) {
                    optnPressed = true;
                    ocultarBarra();
                } else if (!btn.pressed) {
                    optnPressed = false;
                }
            }

            // Manejo del botón R3 (index 11)
            const r3 = gamepad.buttons[11];
            if (r3.pressed && !r3Pressed) {
                r3Pressed = true;
                focusMode = !focusMode; // Activar/desactivar modo foco
                if (focusMode) {
                    enfocarElemento(0); // Empezar desde el primero
                } else {
                    quitarFoco(); // Limpiar el foco
                }
            } else if (!r3.pressed) {
                r3Pressed = false;
            }

            // Si estamos en modo foco y hay movimiento en el eje Y
            if (focusMode && Math.abs(rightY) > deadZone) {
                moverFoco(rightY);
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

        // Detectar movimiento en eje Y del stick derecho
        // Scroll en un div con id="miDivScrollable"
        const scrollDiv = document.getElementById('negociacion');
        if (scrollDiv) {
            const deadZone = 0.2;
            const scrollSpeed = 5; // mayor valor = más rápido

            if (Math.abs(rightY) > deadZone) {
                scrollDiv.scrollTop += rightY * scrollSpeed;
            }
        }


        lastRightY = rightY;
    }
    requestAnimationFrame(inicializarMando);
}

inicializarMando();
function moveStick(id, x, y) {
    //const dot = document.getElementById(id);
    const radius = 24; // movimiento máximo en px dentro del círculo
    const posX = radius + x * radius;
    const posY = radius + y * radius;
    /*dot.style.left = `${posX}px`;
    dot.style.top = `${posY}px`;*/
}



function ocultarBarra() {
    const barra = document.getElementById('columna');
    const estiloActual = getComputedStyle(barra).display;

    if (estiloActual === 'none') {
        barra.style.display = 'inline-flex';
        barra.classList.remove('animate__slideOutRightCustom');
        barra.classList.add('animate__slideInRightCustom');
        sonidos.menu.play();
        sonidos.menu.pause();
    } else {
        barra.classList.remove('animate__slideInRightCustom');
        barra.classList.add('animate__slideOutRightCustom');

        // Espera a que termine la animación antes de ocultar
        barra.addEventListener('animationend', () => {
            if (barra.classList.contains('animate__slideOutRightCustom')) {
                barra.style.display = 'none';
                sonidos.cancel.play();
                sonidos.cancel.pause();
            }
        }, { once: true });
    }
}

    document.addEventListener('DOMContentLoaded', () => {
    const sonidos = {
    inicio: new Audio('../audio/LogLogin.mp3')
};

    // Espera a que el usuario haga clic en cualquier parte del documento
    document.addEventListener('click', () => {
    sonidos.inicio.play().catch(err => {
    console.warn('No se pudo reproducir el sonido:', err);
});
}, { once: true }); // Solo una vez
});





function enfocarElemento(index) {
    const elementos = document.querySelectorAll('#columna > *');
    if (!elementos.length) return;

    elementos.forEach(el => el.classList.remove('focused'));

    focusedIndex = (index + elementos.length) % elementos.length; // evitar overflow
    elementos[focusedIndex].classList.add('focused');
    elementos[focusedIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
}

let ultimaDireccion = 0;
let ultimaActualizacion = 0;
const intervaloFoco = 200; // ms entre movimientos de foco

function moverFoco(direccionY) {
    const ahora = Date.now();
    if (ahora - ultimaActualizacion < intervaloFoco) return;

    if (direccionY > 0.3) {
        enfocarElemento(focusedIndex + 1);
    } else if (direccionY < -0.3) {
        enfocarElemento(focusedIndex - 1);
    }

    ultimaActualizacion = ahora;
}

function quitarFoco() {
    document.querySelectorAll('#columna > *').forEach(el => el.classList.remove('focused'));
}

