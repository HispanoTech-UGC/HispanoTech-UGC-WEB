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
    localStorage.removeItem('informe');

    /* ------ Éxito ------ */
    return {
        success: true,
        message: 'Informe finalizado correctamente.',
        informe: data[0]
    };
}


export async function getMisInformes(id) {
    const { data, error } = await supabase
        .from('informes')
        .select('*')  // Selecciona solo el campo 'cuerpo'
        .eq('num_placa', id);  // Filtra por el ID del cuerpo

    console.log('ID solicitado:', id);  // Verificar qué ID se está pasando
    console.log('Datos obtenidos:', data);  // Ver qué datos se obtienen de la consulta

    if (error) {
        return { success: false, message: 'Error al acceder a la base de datos.' };
    }

    if (!data || data.length === 0) {
        return { success: false, message: 'No se encontraron datos de informes.' };
    }

    return data;  // Retorna solo el valor del cuerpo
}

export async function getInformesCuerpo(id) {
    const { data, error } = await supabase
        .from('informes')
        .select('*')  // Selecciona solo el campo 'cuerpo'
        .like('num_placa', `${id}%`) // id es 'CNP', buscará valores que comiencen con 'CNP'

    console.log('ID solicitado:', id);  // Verificar qué ID se está pasando
    console.log('Datos obtenidos:', data);  // Ver qué datos se obtienen de la consulta

    if (error) {
        return { success: false, message: 'Error al acceder a la base de datos.' };
    }

    if (!data || data.length === 0) {
        return { success: false, message: 'No se encontraron datos de informes.' };
    }

    return data;  // Retorna solo el valor del cuerpo
}

export async function getInformesImages(id) {
    const { data: enlaces, error } = await supabase
        .from('informe-imagen')
        .select('imagen_id')
        .eq('informe_id', id);

    if (error) {
        console.error('Error al obtener las relaciones:', error);
        return;
    }

// Extrae los IDs y consulta las imágenes
    const ids = enlaces.map(e => e.imagen_id);

    const { data: imagenes, error: imgError } = await supabase
        .from('imagen')
        .select('url')  // o solo los campos necesarios, como 'url' o 'path'
        .in('imagen_id', ids);

    if (imgError) {
        console.error('Error al obtener las imágenes:', imgError);
    } else {
        console.log('Imágenes:', imagenes);
        // Aquí puedes usarlas para mostrar un slider, galería, etc.
        return imagenes;
    }
}

export async function getIncidenteByInforme(informe) {
    const { data, error } = await supabase
        .from('Incidentes')
        .select('*')
        .eq('informeId', informe);

    console.log('ID solicitado:', informe);
    console.log('Datos obtenidos:', data);

    if (error) {
        return { success: false, message: 'Error al acceder a la base de datos.' };
    }

    if (!data || data.length === 0) {
        // Crear incidente si no existe
        const { data: inserted, error: insertError } = await supabase
            .from('Incidentes')
            .insert([{
                informeId: informe,
                LugarIncidente: '',
                FechaHora: new Date().toISOString(),
                NumCriminales: 0,
                NumAgentes: 0,
                Heridos: 0,
                Fallecidos: 0,
                NumCiviles: 0,
                ArmasDetectadas: 0
            }])
            .select();  // Devuelve los datos insertados

        if (insertError) {
            return { success: false, message: 'Error al crear nuevo incidente.' };
        }

        return inserted;
    }

    return data;
}


// Función para actualizar un incidente
export async function actualizarIncidente(id, datos) {
    const { error } = await supabase
        .from('Incidentes') // Nombre de tu tabla
        .update(datos)
        .eq('IncidenteId', id)

    if (error) {
        console.error('Error actualizando incidente:', error)
        return false
    }

    console.log('Incidente actualizado correctamente')
    return true
}


export async function actualizarInforme(id, datos) {
    const { error } = await supabase
        .from('informes') // Nombre de tu tabla
        .update(datos)
        .eq('informe_id', id)

    if (error) {
        console.error('Error actualizando informe:', error)
        return false
    }

    console.log('Informe actualizado correctamente')
    return true
}


