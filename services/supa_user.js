import { supabase } from '../config/supabaseClient.js';
export async function obtenerRol(numPlaca) {
    // Realizamos una consulta para obtener el usuario basado en num_placa
    const { data, error } = await supabase
        .from('usuarios')  // Asegúrate de que 'usuarios' sea el nombre correcto de la tabla
        .select('rol')     // Seleccionamos el campo 'rol'
        .eq('num_placa', numPlaca)  // Buscamos por el campo num_placa
        .single();  // Esto asegura que solo obtendremos un resultado (el primer usuario encontrado)

    // Si hubo un error o el usuario no se encuentra, lo manejamos
    if (error) {
        return { success: false, message: error.message };
    }

    if (!data) {
        return { success: false, message: 'Usuario no encontrado.' };
    }

    // Devolvemos el rol
    return data.rol ;
}

