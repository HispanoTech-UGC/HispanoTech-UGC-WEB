import { getUsers, getCuerpoId, editUser, deleteUser, getCuerpos, getUsersByCuerpo} from "../services/supa_admin.js";


async function displayUsers(result) {
    if(!result){result = await getUsers();}
    const tbody = document.getElementById('tabla-usuarios');
    tbody.innerHTML = '';
    const cuerpoTexto = document.getElementById('cuerpo-titulo');
    for (const user of result) {
        const tr = document.createElement("tr");
        // Asegurarse de que el rol sea un número (si es necesario)
        //let rol = parseInt(user.rol, 10);

        // Espera el cuerpo de la base de datos
        const cuerpo = await getCuerpoId(user.cuerpo);  // Suponiendo que 'user.rol' es el id para el cuerpo
        cuerpoTexto.textContent = 'Usuarios de '+cuerpo;
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
        btnEditar.textContent = "Editar";

        // Asignar el evento de clic al botón de "Editar"
        btnEditar.addEventListener("click", () => activarEdicionUsuario(user, tr));

        const btnEliminar = document.createElement("button");
        btnEliminar.classList.add("btn", "btn-sm", "btn-outline-danger");
        btnEliminar.textContent = "Eliminar";

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
  
  
  
  // Función para traducir rol a texto (opcional)
  function renderRol(rol) {
    switch (rol) {
      case 1: return "Administrador";
      case 2: return "Agente";
      default: return "Desconocido";
    }
  }


  // Función para eliminar un usuario (con un evento en el botón de eliminar)
async function borrarUser(placa) {
    const confirmation = confirm(`¿Estás seguro de que quieres eliminar al usuario con placa ${placa}?`);
    if (confirmation) {
      const result = await deleteUser(placa);  // Llamada a la función para eliminar al usuario
      if (result.success) {
        alert(result.message);
        await displayUsers();  // Volver a cargar la lista de usuarios después de la eliminación
      } else {
        alert(result.message);  // Mostrar el error si algo salió mal
      }
    }
  }

async function getAllCuerpos() {
    // Obtener los cuerpos desde la base de datos
    const cuerpos = await getCuerpos();  // Supongo que esta función devuelve los datos de cuerpos
    
    // Obtener el elemento del dropdown donde se agregarán las opciones
    const droplist = document.getElementById('filtro-cuerpo');
    
    // Limpiar el contenido previo del dropdown
    droplist.innerHTML = '';
  
    // Crear una opción por defecto (opcional)
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Selecciona un cuerpo';
    droplist.appendChild(defaultOption);
  
    // Agregar las opciones de los cuerpos
    cuerpos.forEach(cuerpo => {
      const option = document.createElement('option');
      option.value = cuerpo.id;  // O el campo que corresponde a la clave del cuerpo
      option.textContent = cuerpo.cuerpo;  // O el nombre del cuerpo
      droplist.appendChild(option);
    });

    // Agregar un listener al dropdown para filtrar por cuerpo
    droplist.addEventListener('change', async (event) => {
    const selectedCuerpo = event.target.value;  // Obtener el cuerpo seleccionado

    // Filtrar los usuarios por el cuerpo seleccionado
    if (selectedCuerpo) {
      await filtrar(selectedCuerpo);  // Filtrar si se selecciona un cuerpo
    } else {
      // Si no se selecciona un cuerpo, mostrar todos los usuarios
      await displayUsers();
    }
  });
}


function activarEdicionUsuario(user, tr) {
    // Guardamos los valores originales por si se cancela
    const originalHTML = tr.innerHTML;

    // Crear inputs para cada campo editable
    tr.innerHTML = '';

    const tdPlaca = document.createElement("td");
    tdPlaca.textContent = user.num_placa;

    const tdRol = document.createElement("td");
    const inputRol = document.createElement("input");
    inputRol.type = "number";
    inputRol.classList.add("form-control");
    inputRol.value = user.rol;
    tdRol.appendChild(inputRol);

    const tdCuerpo = document.createElement("td");
    const inputCuerpo = document.createElement("input");
    inputCuerpo.type = "text";
    inputCuerpo.classList.add("form-control");
    inputCuerpo.value = user.cuerpo;
    tdCuerpo.appendChild(inputCuerpo);

    const tdAcciones = document.createElement("td");
    tdAcciones.classList.add("text-end");

    const btnConfirmar = document.createElement("button");
    btnConfirmar.textContent = "Confirmar";
    btnConfirmar.classList.add("btn", "btn-sm", "btn-success", "me-1");
    btnConfirmar.addEventListener("click", async () => {
        const updatedUser = {
            num_placa: user.num_placa,
            rol: parseInt(inputRol.value),
            cuerpo: inputCuerpo.value
        };

        const result = await editUser(updatedUser);
        if (result.success) {
            alert("Usuario actualizado correctamente.");
            filtrar(); // Refrescar la tabla
        } else {
            alert(result.message || "Error al actualizar.");
        }
    });

    const btnCancelar = document.createElement("button");
    btnCancelar.textContent = "Cancelar";
    btnCancelar.classList.add("btn", "btn-sm", "btn-secondary");
    btnCancelar.addEventListener("click", () => {
        tr.innerHTML = originalHTML;
        // Reasignar los eventos del botón otra vez (si se canceló)
        const btnEditar = tr.querySelector("button:nth-child(1)");
        const btnEliminar = tr.querySelector("button:nth-child(2)");
        btnEditar.addEventListener("click", () => activarEdicionUsuario(user, tr));
        btnEliminar.addEventListener("click", () => borrarUser(user.num_placa));
    });

    tdAcciones.appendChild(btnConfirmar);
    tdAcciones.appendChild(btnCancelar);

    tr.appendChild(tdPlaca);
    tr.appendChild(tdRol);
    tr.appendChild(tdCuerpo);
    tr.appendChild(tdAcciones);
}

async function filtrar(){
    const cuerpo = JSON.parse(localStorage.getItem('usuario'));
    const users = await getUsersByCuerpo(cuerpo.cuerpo);
    console.log(users)
    await displayUsers(users);
  }
  filtrar().then(r => r)
  //displayUsers();
  getAllCuerpos();
  