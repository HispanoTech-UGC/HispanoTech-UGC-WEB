import { loginUsuario } from '../services/supa_auth.js';

const loginBtn      = document.getElementById('loginBtn');
const mensajeDiv    = document.getElementById('mensaje');
const inputPlaca    = document.getElementById('nombre-email');
const inputPassword = document.getElementById('contraseña');
const togglePassword = document.getElementById('toggle-password');

/* 🔹 Función auxiliar para centralizar estilo */
function pintarMensaje(texto = '', color = '') {
  mensajeDiv.textContent = texto;
  mensajeDiv.style.color = color;
}

loginBtn.addEventListener('click', async () => {
  const numPlaca  = inputPlaca.value.trim();
  const password  = inputPassword.value.trim();

  pintarMensaje();                       // limpia mensaje previo

  if (!numPlaca || !password) {
    return pintarMensaje('Rellena todos los campos.', 'red');
  }

  /* Deshabilitamos el botón mientras se valida */
  loginBtn.disabled = true;
  pintarMensaje('Comprobando credenciales…', 'gray');

  try {
    const resultado = await loginUsuario(numPlaca, password);

    if (resultado.success) {
      pintarMensaje('✅ Login correcto', 'green');

      // Guardamos usuario (sin tocar nombres)
      localStorage.setItem('usuario', JSON.stringify(resultado.usuario));

      // Redirección según rol
      switch (resultado.usuario.rol) {
        case 1:
          window.location.href = './admin_cuerpos.html';
          break;
        case 2:
          window.location.href = 'operador.html';
          break;
        default:
          pintarMensaje('Rol no reconocido.', 'red');
      }
    } else {
      /* Aquí ya llega uno de estos textos:
         - 'Error al acceder a la base de datos.'
         - 'Usuario no encontrado.'
         - 'Contraseña incorrecta.'
      */
      pintarMensaje(`❌ ${resultado.message}`, 'red');
    }
  } catch (err) {
    console.error('Error de red o código:', err);
    pintarMensaje('❌ No se pudo conectar con el servidor.', 'red');
  } finally {
    loginBtn.disabled = false;
  }
});

togglePassword.addEventListener('click', () => {
    const isHidden = inputPassword.type === 'password';
    inputPassword.type = isHidden ? 'text' : 'password';
    togglePassword.classList.toggle('bi-eye');
    togglePassword.classList.toggle('bi-eye-slash');
});

