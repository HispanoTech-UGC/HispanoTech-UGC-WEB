import { supabase } from '../config/supabaseClient.js';
/**
 * Sube una imagen (Blob) a Supabase Storage en la ruta indicada.
 * @param {Blob} blob - La imagen en formato Blob.
 * @param {string} fullPath - Ruta completa dentro del bucket (por ejemplo: 'user123/5678/captura.png').
 */
export async function subirImagenASupabase(blob, fullPath) {
    const { data, error } = await supabase.storage.from('imagenes.informes').upload(fullPath, blob, {
        upsert: true,
    })
    if (error) {
        console.error('Error al subir imagen:', error)
        throw error
    } else {
        console.log('Imagen subida correctamente:', data)
        await subirFotoADatabase(fullPath, '');
        return data
    }
}

export async function subirFotoADatabase(fotoUrl, metadatos) {
    const { data, error } = await supabase
        .from('imagen')
        .insert([
            {
                url: fotoUrl,     // URL de la foto generada en el bucket
                metadatos: metadatos  // Datos adicionales relacionados con la foto
            }
        ])
        .select();   // Para devolver el registro creado

    /* ------ Error de Supabase ------ */
    if (error) {
        console.error('Error al subir la URL de la foto:', error);
        return { success: false, message: 'No se pudo subir la URL de la foto.' };
    }

    /* ------ Éxito ------ */
    return {
        success: true,
        message: 'URL de la foto subida correctamente.',
        imagen: data[0]  // Devolvemos el registro de la imagen recién añadida
    };
}


