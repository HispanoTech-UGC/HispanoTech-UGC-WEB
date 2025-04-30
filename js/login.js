import { loginUsuario} from '../services/supa_auth.js';

const loginBtn = document.getElementById('loginBtn');
const mensajeDiv = document.getElementById('mensaje');

loginBtn.addEventListener('click', async () => {
    const numPlaca = document.getElementById('nombre-email').value.trim();
    const password = document.getElementById('contraseña').value.trim();

    mensajeDiv.textContent = '';
    mensajeDiv.style.color = '';

    if (!numPlaca || !password) {
        mensajeDiv.textContent = 'Rellena todos los campos.';
        mensajeDiv.style.color = 'red';
        return;
    }

    const resultado = await loginUsuario(numPlaca, password);

    if (resultado.success) {
        mensajeDiv.textContent = '✅ Login correcto';
        mensajeDiv.style.color = 'green';

        const usuario = resultado.usuario;

        // Guardamos los datos en localStorage
        localStorage.setItem('usuario', JSON.stringify(usuario));

        // Redirección según el rol
        switch (usuario.rol) {
            case 1:
                window.location.href = './admin_cuerpos.html';
                break;
            case 2:
                window.location.href = 'operador.html';
                break;
            default:
                mensajeDiv.textContent = 'Rol no reconocido.';
                mensajeDiv.style.color = 'red';
                break;
        }

    } else {
        mensajeDiv.textContent = `❌ ${resultado.message}`;
        mensajeDiv.style.color = 'red';
    }
});

const togglePassword = document.getElementById('toggle-password');
const inputPassword = document.getElementById('contraseña');

togglePassword.addEventListener('click', () => {
    const isHidden = inputPassword.type === 'password';
    inputPassword.type = isHidden ? 'text' : 'password';
    togglePassword.classList.toggle('bi-eye');
    togglePassword.classList.toggle('bi-eye-slash');
});

