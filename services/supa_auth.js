import { supabase } from '../config/supabaseClient.js';
export async function loginUsuario(numPlaca, password) {
  const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('num_placa', numPlaca)
      .single();

  if (error) {
    return { success: false, message: 'Error al acceder a la base de datos.' };
  }

  if (!data) {
    return { success: false, message: 'Usuario no encontrado.' };
  }

  // Generamos el hash de la contraseña proporcionada usando SHA-256
  const hashedPassword = CryptoJS.SHA256(password).toString(CryptoJS.enc.Base64);

  // Comparamos el hash de la contraseña proporcionada con el hash almacenado en la base de datos
  if (hashedPassword === data.password) {
    // ✅ Actualizar el campo ultima_sesion a la fecha/hora actual
    const { error: updateError } = await supabase
        .from('usuarios')
        .update({ ultima_sesion: new Date().toISOString() })
        .eq('num_placa', numPlaca);

    if (updateError) {
      console.error('No se pudo actualizar ultima_sesion:', updateError.message);
      // No detenemos el login, solo registramos el error
    }
    return { success: true, message: 'Login correcto.', usuario: data };
  } else {
    return { success: false, message: 'Contraseña incorrecta.' };
  }
}

export function generarHash(password) {
  // Generamos el hash de la contraseña usando SHA-256
  const hash = CryptoJS.SHA256(password).toString(CryptoJS.enc.Base64);
  return hash;
}
