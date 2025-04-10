import { supabase } from '../config/supabaseClient.js';

export async function loginUsuario(numPlaca, password) {
  const { data, error } = await supabase
    .from('usuarios')
    .select('*') // ahora trae todos los campos
    .eq('num_placa', numPlaca)
    .single();

  if (error) {
    return { success: false, message: 'Error al acceder a la base de datos.' };
  }

  if (!data) {
    return { success: false, message: 'Usuario no encontrado.' };
  }

  if (data.password === password) {
    return { success: true, message: 'Login correcto.', usuario: data };
  } else {
    return { success: false, message: 'Contraseña incorrecta.' };
  }
}
