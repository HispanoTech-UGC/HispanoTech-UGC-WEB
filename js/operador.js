//'giro-dirección-AD'
import {getCuerpoId, getUsers} from "../services/supa_admin";
import { getMisInformes } from "../services/supa_informs";

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

//'AWSDX-botones'
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








// menu PDA operador

asignarFuncionalidadBotones();

async function opcionSeleccionadaMenu(target){
    const contenido = document.getElementById(target);
    const menu = document.getElementById('menu');
    const retro = document.getElementById('retroceder');

    contenido.style.display = 'block';
    contenido.style.height = '100vh';
    menu.style.display = 'none';

    if (target==='robot'){
        //await filtrar();
        //getAllCuerpos();
    }
}

function retroceder(target){
    const contenido = document.getElementById(target);
    const menu = document.getElementById('menu');

    contenido.style.display = 'none';
    menu.style.display = 'block';
}

function asignarFuncionalidadBotones(){
    const botones = document.querySelectorAll('.game-button');
    const retrocesos = document.querySelectorAll('.retroceder');

    botones.forEach((boton, index) => {
        let opcion = '';

        switch (index) {
            case 0:
                opcion = 'robot';
                break;
            case 1:
                opcion = 'mis-informes';
                break;
            default:
                opcion = 'opcion-desconocida';
        }

        boton.addEventListener('click', () => {
            opcionSeleccionadaMenu(opcion).then(r => r);
        });
    });

    retrocesos.forEach((boton, index) => {
        let opcion = '';

        switch (index) {
            case 0:
                opcion = 'robot';
                break;
            case 1:
                opcion = 'mis-informes';
                break;
            default:
                opcion = 'opcion-desconocida';
        }

        boton.addEventListener('click', () => {
            retroceder(opcion);
        });
    });
}



async function displayMisInformes(result) {
    if(!result){result = await getMisInformes();}
    
    const tbody = document.getElementById('tabla-informes');
    tbody.innerHTML = '';
    const cuerpoTexto = document.getElementById('cuerpo-titulo');
    for (const user of result) {
        const tr = document.createElement("tr");
        // Espera el cuerpo de la base de datos
        const cuerpo = await getCuerpoId(user.cuerpo);  // Suponiendo que 'user.rol' es el id para el cuerpo
        cuerpoTexto.textContent = 'Informes de '+cuerpo;
        console.log(cuerpo);  // Puedes verificar el resultado de getCuerpoId

        // Crear celdas para la fila
        const tdPlaca = document.createElement("td");
        tdPlaca.textContent = user.num_placa;

        const tdRol = document.createElement("td");
        tdRol.textContent = renderRol(user.rol);

        const tdCuerpo = document.createElement("td");
        tdCuerpo.textContent = cuerpo ? cuerpo : "N/A";  // Mostrar el cuerpo o "N/A" si no existe

        // Crear la celda de acciones
        const tdAcciones = document.createElement("td");
        tdAcciones.classList.add("text-end");

        // Crear los botones de "Editar" y "Eliminar"
        const btnEditar = document.createElement("button");
        btnEditar.classList.add("btn", "btn-sm", "btn-outline-primary", "me-1");
        btnEditar.innerHTML = '<i class="bi bi-pencil"></i>';

        // Asignar el evento de clic al botón de "Editar"
        btnEditar.addEventListener("click", () => activarEdicionUsuario(user, tr));

        const btnEliminar = document.createElement("button");
        btnEliminar.classList.add("btn", "btn-sm", "btn-outline-danger");
        btnEliminar.innerHTML = '<i class="bi bi-person-x"></i>';


        // Asignar el evento de clic al botón de "Eliminar"
        btnEliminar.addEventListener("click", () => borrarUser(user.num_placa));

        // Añadir los botones a la celda de acciones
        tdAcciones.appendChild(btnEditar);
        tdAcciones.appendChild(btnEliminar);

        // Añadir las celdas a la fila
        tr.appendChild(tdPlaca);
        tr.appendChild(tdRol);
        tr.appendChild(tdCuerpo);
        tr.appendChild(tdAcciones);

        // Agregar la fila al cuerpo de la tabla
        tbody.appendChild(tr);
    }
}
