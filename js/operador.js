'giro-dirección-AD'
const direccionIcon = document.querySelector('.direccion');
let currentRotation = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === 'a' || e.key === 'A') {
    currentRotation -= 15;
    } else if (e.key === 'd' || e.key === 'D') {
    currentRotation += 15;
    }

    direccionIcon.style.transform = `rotate(${currentRotation}deg)`;

    // Actualiza el texto del elemento con id "angleText-8"
    document.getElementById('angleText-8').textContent = currentRotation + 'º';
});

'AWSDX-botones'
document.addEventListener('DOMContentLoaded', () => {
    const buttonW = document.querySelector('.WASD.W');
    const buttonA = document.querySelector('.WASD.A');
    const buttonS = document.querySelector('.WASD.S');
    const buttonD = document.querySelector('.WASD.D');
    const buttonX = document.querySelector('.WASD.X');

    const mostrarDatos = (key) => {
        // Aquí puedes calcular la velocidad y el ángulo, o bien solo mostrar los valores
        const velocidad = 10;  // Aquí iría tu cálculo de velocidad
        const angulo = 45;     // Aquí iría tu cálculo de ángulo
        
        console.log(`Tecla presionada: ${key}`);
        console.log(`Velocidad: ${velocidad}`);
        console.log(`Ángulo: ${angulo}`);
    };

    document.addEventListener('keydown', (e) => {
        const key = e.key.toLowerCase();
    
        if (key === 'w') {
            buttonW.classList.add('active');
            buttonW.click(); // Simula el clic en el botón
            mostrarDatos('W');
        }
    
        if (key === 'a') {
            buttonA.classList.add('active');
            buttonA.click();
            mostrarDatos('A');
        }
    
        if (key === 's') {
            buttonS.classList.add('active');
            buttonS.click();
            mostrarDatos('S');
        }
    
        if (key === 'd') {
            buttonD.classList.add('active');
            buttonD.click();
            mostrarDatos('D');
        }
    
        if (key === 'x') {
            buttonX.classList.add('active');
            buttonX.click();
            mostrarDatos('X');
        }
    });

    document.addEventListener('keyup', (e) => {
        const key = e.key.toLowerCase();
    
        if (key === 'w') buttonW.classList.remove('active');
        if (key === 'a') buttonA.classList.remove('active');
        if (key === 's') buttonS.classList.remove('active');
        if (key === 'd') buttonD.classList.remove('active');
        if (key === 'x') buttonX.classList.remove('active');
        
        console.log(`Tecla liberada: ${e.key}`);
    });

    // Agregar eventos de click a cada botón
    buttonW.addEventListener('click', () => {
        buttonW.classList.add('active');
        mostrarDatos('W');
    });

    buttonA.addEventListener('click', () => {
        buttonA.classList.add('active');
        mostrarDatos('A');
    });

    buttonS.addEventListener('click', () => {
        buttonS.classList.add('active');
        mostrarDatos('S');
    });

    buttonD.addEventListener('click', () => {
        buttonD.classList.add('active');
        mostrarDatos('D');
    });

    buttonX.addEventListener('click', () => {
        buttonX.classList.add('active');
        mostrarDatos('X');
    });


});