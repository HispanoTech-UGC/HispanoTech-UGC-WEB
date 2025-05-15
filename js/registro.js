import { registrarUsuario } from '../services/supa_auth.js';

const registroBtn = document.getElementById('registroBtn');
const mensajeDiv = document.getElementById('mensaje-registro');
const cuerpo = JSON.parse(localStorage.getItem('usuario')).cuerpo;

console.log(cuerpo)
registroBtn.addEventListener('click', async () => {
    const numPlaca = document.getElementById('codigo-robot').value.trim();
    const password = document.getElementById('contraseña').value.trim();
    const confirmarPassword = document.getElementById('confirmar-contraseña').value.trim();

    mensajeDiv.textContent = '';
    mensajeDiv.style.color = '';

    // Validación básica
    if (!numPlaca || !password || !confirmarPassword) {
        mensajeDiv.textContent = '⚠️ Rellena todos los campos.';
        mensajeDiv.style.color = 'red';
        return;
    }

    if (password !== confirmarPassword) {
        mensajeDiv.textContent = '❌ Las contraseñas no coinciden.';
        mensajeDiv.style.color = 'red';
        return;
    }

    // Aquí puedes agregar validaciones de seguridad: longitud, símbolos, etc.

    // Llamamos a la función que registra el usuario
    const resultado = await registrarUsuario(numPlaca, password, cuerpo); // puedes adaptar esto

    if (resultado.success) {
        mensajeDiv.textContent = '✅ Usuario registrado correctamente.';
        mensajeDiv.style.color = 'green';

        // Redirigir o mostrar mensaje de éxito
        setTimeout(() => {
            window.location.href = 'admin_cuerpos.html';
        }, 1500);

    } else {
        mensajeDiv.textContent = `❌ ${resultado.message}`;
        mensajeDiv.style.color = 'red';
    }
});
