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
        return data
    }
}

