//'giro-dirección-AD'
import { getMisInformes, getInformesImages, getIncidenteByInforme, actualizarIncidente, actualizarInforme } from "../services/supa_informs.js";
//import {editUser, getCuerpoId} from "../services/supa_admin";
asignarFuncionalidadBotones();

const user = JSON.parse(localStorage.getItem('usuario'));
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

async function opcionSeleccionadaMenu(target){
    const contenido = document.getElementById(target);
    const menu = document.getElementById('menu');
    const retro = document.getElementById('retroceder');

    contenido.style.display = 'block';
    contenido.style.height = '100vh';
    menu.style.display = 'none';

    if (target==='mis-informes'){
        contenido.style.height = 'auto';
        //await filtrar();
        //getAllCuerpos();
        await displayMisInformes();
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



async function displayMisInformes() {
    const placa = user.num_placa;
    let result = await getMisInformes(placa);
    const tbody = document.getElementById('tabla-informes');
    tbody.innerHTML = '';
    //const cuerpoTexto = document.getElementById('cuerpo-titulo');
    for (const informe of result) {
        console.log(informe)
        const tr = document.createElement("tr");
        // Espera el cuerpo de la base de datos
        //const cuerpo = await getCuerpoId(informe.cuerpo);  // Suponiendo que 'user.rol' es el id para el cuerpo
        /*cuerpoTexto.textContent = 'Informes de '+cuerpo;
        console.log(cuerpo);  // Puedes verificar el resultado de getCuerpoId*/

        // Crear celdas para la fila
        const tdInformeId = document.createElement("td");
        tdInformeId.textContent = informe.informe_id;

        const tdPlaca = document.createElement("td");
        tdPlaca.textContent = informe.num_placa;


        const tdRobot = document.createElement("td");
        tdRobot.textContent = informe.robot_id;

        const tdInicio = document.createElement("td");
        tdInicio.textContent = informe.fecha_ini;

        const tdFinal = document.createElement("td");
        tdFinal.textContent = informe.fecha_fin;

        // Crear la celda de acciones
        const tdAcciones = document.createElement("td");
        tdAcciones.classList.add("text-end");

        // Crear los botones de "Editar" y "Eliminar"
        const btnVerInforme = document.createElement("button");
        btnVerInforme.classList.add("btn", "btn-sm", "btn-outline-primary", "me-1");
        btnVerInforme.innerHTML = '<i class="bi bi-eye"></i>';

        // Asignar el evento de clic al botón de "Editar"
        btnVerInforme.addEventListener("click", async () => await activarVerInforme(informe));

        const btnEliminar = document.createElement("button");
        btnEliminar.classList.add("btn", "btn-sm", "btn-outline-danger");
        btnEliminar.innerHTML = '<i class="bi bi-person-x"></i>';


        // Asignar el evento de clic al botón de "Eliminar"
        //btnEliminar.addEventListener("click", () => borrarUser(user.num_placa));

        // Añadir los botones a la celda de acciones
        tdAcciones.appendChild(btnVerInforme);
        tdAcciones.appendChild(btnEliminar);

        // Añadir las celdas a la fila
        tr.appendChild(tdInformeId);
        tr.appendChild(tdPlaca);
        tr.appendChild(tdRobot);
        tr.appendChild(tdInicio);
        tr.appendChild(tdFinal);
        tr.appendChild(tdAcciones);

        // Agregar la fila al cuerpo de la tabla
        tbody.appendChild(tr);
    }
}


async function activarVerInforme(informe) {
    // Muestra el `<main id="informe">` si está oculto
    const mainInforme = document.getElementById('informe');
    mainInforme.style.display = 'flex';
    document.getElementById('overlay').style.display = 'block';


    // Llena el formulario con los datos del informe
    document.getElementById('informe-id').textContent = 'Informe nº '+ informe.informe_id;
    document.getElementById('id-informe').value = informe.informe_id;
    document.getElementById('informe-título').value = informe.titulo_informe;
    document.getElementById('robot-id').value = informe.robot_id;
    document.getElementById('fecha-ini').value = informe.fecha_ini;
    document.getElementById('fecha-fin').value = informe.fecha_fin;

    // Obtiene imágenes asociadas
    const result = await getIncidenteByInforme(informe.informe_id);
    const info = result[0];

    document.getElementById('id-incidente').value = info.IncidenteId;
    document.getElementById('lugar-incidente').value = info.LugarIncidente;
    document.getElementById('fecha-hora').value = info.FechaHora;
    document.getElementById('num-criminales').value = info.NumCriminales;
    document.getElementById('num-agentes').value = info.NumAgentes;
    document.getElementById('heridos').value = info.Heridos;
    document.getElementById('fallecidos').value = info.Fallecidos;
    document.getElementById('num-civiles').value = info.NumCiviles;
    document.getElementById('armas-detectadas').value = info.ArmasDetectadas;

    const imagenes = await getInformesImages(informe.informe_id);

    const slider = document.getElementById('slider');
    slider.innerHTML = ''; // Limpia contenido previo

    if (imagenes && imagenes.length > 0) {
        imagenes.forEach(img => {
            const imgEl = document.createElement('img');
            imgEl.src = `https://pynqyypeepucyrrmncpi.supabase.co/storage/v1/object/public/imagenes.informes/${img.url}`;
            imgEl.style.maxWidth = '100%';
            imgEl.style.margin = '0.5rem';
            slider.appendChild(imgEl);
        });
    } else {
        slider.innerHTML = '<p>No hay imágenes disponibles.</p>';
    }
}

function cerrarInforme() {
    const mainInforme = document.getElementById('informe');

    // Aplicar clase de animación de salida
    mainInforme.classList.add('zoom-out');

    // Esperar a que termine la animación para ocultar
    mainInforme.addEventListener('animationend', function handleAnimationEnd() {
        mainInforme.style.display = 'none';
        document.getElementById('overlay').style.display = 'none';
        mainInforme.classList.remove('zoom-out');
        mainInforme.removeEventListener('animationend', handleAnimationEnd);
    });
}

function editarInforme(boton, parte) {
    const apartado = document.getElementById(parte);
    const id = document.getElementById('id-informe').value;
    const divBtns = document.getElementById('botones-' + parte);
    boton.style.display = 'none';

    // Habilita inputs
    apartado.querySelectorAll('input').forEach(input => {
        input.disabled = false;
    });

    // Crear botón Confirmar
    const btnConfirmar = document.createElement('a');
    btnConfirmar.href = '#';
    btnConfirmar.textContent = '✅ Confirmar';
    btnConfirmar.classList.add('me-2'); // margen opcional
    btnConfirmar.onclick = (e) => {
        e.preventDefault();
        apartado.querySelectorAll('input').forEach(input => {
            input.disabled = true;
            if (parte==='datos-incidente'){
               guardarIncidente();
            }else if(parte==='datos-informe'){
               guardarInforme();
            }
        });
        boton.style.display = 'inline-block';
        btnConfirmar.remove();
        btnCancelar.remove();
        // Aquí puedes llamar a tu función para guardar los cambios
        console.log('Cambios confirmados para', parte);
    };

    // Crear botón Cancelar
    const btnCancelar = document.createElement('a');
    btnCancelar.href = '#';
    btnCancelar.textContent = '❌ Cancelar';
    btnCancelar.onclick = (e) => {
        e.preventDefault();
        apartado.querySelectorAll('input').forEach(input => {
            input.disabled = true;
            // Aquí podrías restaurar los valores originales si los guardaste
        });
        boton.style.display = 'inline-block';
        btnConfirmar.remove();
        btnCancelar.remove();
        console.log('Edición cancelada para', parte);
    };

    // Añadir botones al contenedor
    divBtns.appendChild(btnConfirmar);
    divBtns.appendChild(btnCancelar);
}


function guardarIncidente(){
    //---------------------------Values------------------------------
    const incidente = document.getElementById('id-incidente').value;
    const lugar = document.getElementById('lugar-incidente').value;
    const fecha = document.getElementById('fecha-hora').value;
    const criminales = document.getElementById('num-criminales').value;
    const agentes = document.getElementById('num-agentes').value;
    const heridos = document.getElementById('heridos').value;
    const fallecidos = document.getElementById('fallecidos').value;
    const civiles = document.getElementById('num-civiles').value;
    const armas = document.getElementById('armas-detectadas').value;

    const datos = {
        LugarIncidente: lugar,
        NumCriminales: criminales,
        NumAgentes: agentes,
        Heridos: heridos,
        Fallecidos: fallecidos,
        NumCiviles: civiles,
        ArmasDetectadas: armas,
        FechaHora: fecha, // Opcional
    }

    actualizarIncidente(incidente, datos).then(r => console.log(r));
}


function guardarInforme(){
    const informe = document.getElementById('id-informe').value;
    const informeTitle = document.getElementById('informe-título').value;
    const robot = document.getElementById('robot-id').value;
    const fechaInicio = document.getElementById('fecha-ini').value;
    const fechaFinal = document.getElementById('fecha-fin').value;

    const datos = {
        fecha_ini: fechaInicio,
        fecha_fin: fechaFinal,
        titulo_informe: informeTitle,
        robot_id: robot,
    }

    actualizarInforme(informe, datos).then(r => r);
}


const editarInf = document.getElementById('editar-informe');
const editarInc = document.getElementById('editar-incidente');

editarInf.addEventListener('click', () => {
    editarInforme(editarInf,'datos-informe');
});
editarInc.addEventListener('click', () => {
    editarInforme(editarInc,'datos-incidente');
});

document.getElementById('close-informe').addEventListener('click', () => {
    cerrarInforme()
});


