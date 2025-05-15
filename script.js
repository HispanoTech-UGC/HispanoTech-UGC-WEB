import { supabase } from './config/supabaseClient.js';

async function cargarUsuarios() {
  const { data, error } = await supabase.from('usuarios').select('*');

  if (error) {
    console.error('Error al obtener usuarios:', error);
    document.body.innerHTML += `<p style="color:red;">Error al conectar: ${error.message}</p>`;
    return;
  }

  const lista = document.getElementById('usuarios-lista');
  data.forEach(usuario => {
    const li = document.createElement('li');
    li.textContent = `NumPlaca: ${usuario.numPlaca}, Última sesión: ${usuario.ultimaSesion}`;
    lista.appendChild(li);
  });
}

cargarUsuarios().then(r => r);
