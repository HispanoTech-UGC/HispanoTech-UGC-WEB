import { supabase } from '../config/supabaseClient.js';

// Obtener todos los usuarios con su número de placa, rol y cuerpo
export async function getUsers() {
  const { data, error } = await supabase
    .from('usuarios')
    .select(`
      num_placa,
      rol,
      cuerpo
    `);

  if (error) {
    return { success: false, message: 'Error al acceder a la base de datos.' };
  }

  if (!data || data.length === 0) {
    return { success: false, message: 'No se encontraron usuarios.' };
  }

  return data;
}

export async function editUser(updatedUser) {
    //const { num_placa, rol, cuerpo } = updatedUser;
    const { num_placa, rol } = updatedUser;

    if (!num_placa) {
        return { success: false, message: 'El campo num_placa es obligatorio para editar el usuario.' };
    }

    /*const { data, error } = await supabase
        .from('usuarios')
        .update({ rol, cuerpo })
        .eq('num_placa', num_placa)
        .select();*/
    const { data, error } = await supabase
        .from('usuarios')
        .update({ rol })
        .eq('num_placa', num_placa)
        .select();

    if (error) {
        return { success: false, message: 'Error al actualizar el usuario.', details: error };
    }

    if (!data || data.length === 0) {
        return { success: false, message: 'No se encontró ningún usuario con ese num_placa.' };
    }

    return { success: true, message: 'Usuario actualizado correctamente.', user: data[0] };
}

export async function getCuerpos() {
    const { data, error } = await supabase
      .from('cuerpos')
      .select(`*`);
  
    if (error) {
      return { success: false, message: 'Error al acceder a la base de datos.' };
    }
  
    if (!data || data.length === 0) {
      return { success: false, message: 'No se encontraron cuerpos.' };
    }
  
    return data;
  }

// Obtener el nombre del cuerpo basado en el ID
export async function getUsersByCuerpo(id) {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')  // Selecciona solo el campo 'cuerpo'
      .eq('cuerpo', id);  // Filtra por el ID del cuerpo
  
    console.log('ID solicitado:', id);  // Verificar qué ID se está pasando
    console.log('Datos obtenidos:', data);  // Ver qué datos se obtienen de la consulta
  
    if (error) {
      return { success: false, message: 'Error al acceder a la base de datos.' };
    }
  
    if (!data || data.length === 0) {
      return { success: false, message: 'No se encontraron datos del cuerpo.' };
    }
  
    return data;  // Retorna solo el valor del cuerpo
  }


export async function getUserByPlaca(placa) {
    const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .ilike('num_placa', `%${placa}%`);  // ← Búsqueda flexible con LIKE (case-insensitive)

    console.log('ID solicitado:', placa);  // Verificar qué ID se está pasando
    console.log('Datos obtenidos:', data);  // Ver qué datos se obtienen de la consulta

    if (error) {
        return { success: false, message: 'Error al acceder a la base de datos.' };
    }

    if (!data || data.length === 0) {
        return { success: false, message: 'No se encontraron datos del usuario.' };
    }

    return {success: true, message: data};  // Retorna solo el valor del cuerpo
}



// Obtener el nombre del cuerpo basado en el ID
export async function getCuerpoId(id) {
  const { data, error } = await supabase
    .from('cuerpos')
    .select('cuerpo')  // Selecciona solo el campo 'cuerpo'
    .eq('id', id);  // Filtra por el ID del cuerpo

  //console.log('ID solicitado:', id);  // Verificar qué ID se está pasando
  console.log('Datos obtenidos:', data);  // Ver qué datos se obtienen de la consulta

  if (error) {
    return { success: false, message: 'Error al acceder a la base de datos.' };
  }

  if (!data || data.length === 0) {
    return { success: false, message: 'No se encontraron datos del cuerpo.' };
  }

  return data[0].cuerpo;  // Retorna solo el valor del cuerpo
}


export async function deleteUser(placa) {
    // Eliminar los informes relacionados
    const { data: informesData, error: informesError } = await supabase
      .from('informes')
      .delete()
      .eq('num_placa', placa);  // Eliminar los informes que corresponden a esa placa
  
    if (informesError) {
      return { success: false, message: 'Error al eliminar los informes relacionados.' };
    }
  
    // Ahora eliminamos el usuario
    const { data: usuariosData, error: usuariosError } = await supabase
      .from('usuarios')
      .delete()
      .eq('num_placa', placa);  // Eliminar el usuario por placa
  
    if (usuariosError) {
      return { success: false, message: 'Error al eliminar el usuario.' };
    }
  
    if (/*!informesData ||*/ !usuariosData) {
      return { success: false, message: 'No se encontraron usuarios o informes con esa placa.' };
    }
  
    return { success: true, message: 'Usuario y sus informes eliminados exitosamente.' };
  }
  
  
