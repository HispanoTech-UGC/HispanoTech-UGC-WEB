import { supabase } from '../config/supabaseClient.js';


export async function crearInforme(fechaFin, numPlaca, robotId, titulo) {
    const fechaIni = new Date().toISOString();  // Fecha actual

    // Insertar nuevo informe
    const { data, error } = await supabase
        .from('informes')
        .insert([
            {
                fecha_ini: fechaIni,
                fecha_fin: fechaFin,
                num_placa: numPlaca,
                robot_id: robotId,
                titulo_informe: titulo
            }
        ])
        .select();   // Para devolver el informe creado

    /* ------ Error de Supabase ------ */
    if (error) {
        console.error('Error al crear informe:', error);
        return { success: false, message: 'No se pudo crear el informe.' };
    }

    /* ------ Éxito ------ */
    return {
        success: true,
        message: 'Informe creado correctamente.',
        informe: data[0]
    };
}


export async function finalizarInforme(informeId) {
    const fechaFin = new Date().toISOString();  // Hora actual

    // Actualizamos el informe
    const { data, error } = await supabase
        .from('informes')
        .update({ fecha_fin: fechaFin })
        .eq('informe_id', informeId)
        .select();   // Para ver el informe actualizado

    /* ------ Error de Supabase ------ */
    if (error) {
        console.error('Error al finalizar informe:', error);
        return { success: false, message: 'No se pudo finalizar el informe.' };
    }

    /* ------ Éxito ------ */
    return {
        success: true,
        message: 'Informe finalizado correctamente.',
        informe: data[0]
    };
}

