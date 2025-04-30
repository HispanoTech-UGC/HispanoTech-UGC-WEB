import { supabase } from '../config/supabaseClient.js';
import CryptoJS      from 'crypto-js';          // ← ya lo estabas usando

export async function loginUsuario(numPlaca, password) {
  // 1) Buscamos el usuario: si no hay fila, data === null
  const { data, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('num_placa', numPlaca)
    .maybeSingle();          // ← cambio clave, no altera nombres

  /* ------ 1. Error real de base de datos ------ */
  if (error) {
    console.error('Supabase:', error);          // para tu registro
    return { success: false, message: 'Error al acceder a la base de datos.' };
  }

  /* ------ 2. Usuario no encontrado ------ */
  if (!data) {
    return { success: false, message: 'Usuario no encontrado.' };
  }

  /* ------ 3. Contraseña incorrecta ------ */
  const hashedPassword = CryptoJS.SHA256(password).toString(CryptoJS.enc.Base64);
  if (hashedPassword !== data.password) {
    return { success: false, message: 'Contraseña incorrecta.' };
  }

  /* ------ 4. Login correcto ------ */
  // actualizamos ultima_sesion sin bloquear la respuesta
  supabase
    .from('usuarios')
    .update({ ultima_sesion: new Date().toISOString() })
    .eq('num_placa', numPlaca)
    .then(({ error: updateError }) => {
      if (updateError) {
        console.error('No se pudo actualizar ultima_sesion:', updateError.message);
      }
    });

  // devolvemos el usuario tal cual lo recibías
  return { success: true, message: 'Login correcto.', usuario: data };
}

export async function registrarUsuario(numPlaca, password, cuerpo, rol = 2) {
  // Hasheamos la contraseña con SHA-256 en Base64
  const hashedPassword = CryptoJS.SHA256(password).toString(CryptoJS.enc.Base64);

  // Creamos el objeto de nuevo usuario
  const nuevoUsuario = {
    num_placa: numPlaca,
    password: hashedPassword,
    cuerpo: cuerpo,
    rol: rol,
    ultima_sesion: new Date().toISOString(), // opcional si tienes esta columna
  };

  // Insertamos el usuario en la base de datos
  const { data, error } = await supabase
      .from('usuarios')
      .insert([nuevoUsuario])
      .select(); // para obtener el usuario insertado

  if (error) {
    return { success: false, message: 'Error al registrar el usuario.', error };
  }

  return { success: true, message: 'Usuario registrado correctamente.', usuario: data[0] };
}

