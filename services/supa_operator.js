import { supabase } from '../config/supabaseClient.js';
/**
 * Sube una imagen (Blob) a Supabase Storage en la ruta indicada.
 * @param {Blob} blob - La imagen en formato Blob.
 * @param {string} fullPath - Ruta completa dentro del bucket (por ejemplo: 'user123/5678/captura.png').
 */
export async function subirImagenASupabase(blob, fullPath, informe_id) {
    const { data, error } = await supabase.storage.from('imagenes.informes').upload(fullPath, blob, {
        upsert: true,
    })
    if (error) {
        console.error('Error al subir imagen:', error)
        throw error
    } else {
        console.log('Imagen subida correctamente:', data)
        await subirFotoADatabase(fullPath, '', informe_id);
        return data
    }
}

export async function subirFotoADatabase(fotoUrl, metadatos, informe_id) {
    // 1. Insertar en la tabla imagen
    const { data, error } = await supabase
      .from('imagen')
      .insert([
        {
          url: fotoUrl,
          metadatos: metadatos
        }
      ])
      .select();
  
    if (error) {
      console.error('Error al subir la imagen:', error);
      return { success: false, message: 'No se pudo subir la imagen.' };
    }
  
    const imagen = data[0];
  
    // 2. Crear relación en la tabla informe_imagen
    const { error: relError } = await supabase
      .from('informe-imagen')
      .insert([
        {
          informe_id: informe_id,
          imagen_id: imagen.imagen_id
        }
      ]);
  
    if (relError) {
      console.error('Error al crear relación informe-imagen:', relError);
      return {
        success: false,
        message: 'Imagen creada pero no se pudo asociar al informe.',
        imagen
      };
    }
  
    // 3. Éxito total
    return {
      success: true,
      message: 'Imagen subida y asociada al informe correctamente.',
      imagen
    };
  }
  


