import { subirImagenASupabase } from '../services/supa_operator.js'
import { crearInforme,  finalizarInforme } from '../services/supa_informs.js'

const user = JSON.parse(localStorage.getItem('usuario'))
let path = null
let informeId = null

export async function setPath()
{
    console.log('entrando a set path')
    if (user && user.num_placa) {
        const randomCode = Math.floor(1000 + Math.random() * 9000)
        path = `${user.num_placa}/${randomCode}`
        alert(`Path establecido: ${path}`)
        localStorage.setItem('path', path);
        const res = await crearInforme(null, user.num_placa, 1, 'informe_título');

        if (res.success) {
            informeId = res.informe.informe_id;
            localStorage.setItem('informe', informeId);
            console.log('ID del informe:', informeId);
        } else {
            console.error('Error al crear informe:', res.message);
        }

    } else {
        alert('No se pudo establecer path: usuario no definido')
    }
}

export function removePath(){
    const informe_id = localStorage.getItem('informe');
    path = null
    localStorage.removeItem('path');
    finalizarInforme(informe_id);
    alert('Path eliminado')
}

export function hacerFoto() {
    const pathBucket = localStorage.getItem('path');
    if (!pathBucket) {
        alert('Primero establece un path.')
        return
    }

    const img = document.getElementById('cameraFeed')

    const canvas = document.createElement('canvas')
    const informe_id = localStorage.getItem('informe');
    canvas.width = img.naturalWidth || img.width
    canvas.height = img.naturalHeight || img.height

    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

    const now = new Date()
    const timestamp = now.toISOString()
        .replace(/:/g, '-')       // reemplaza ":" para evitar problemas en nombres de archivo
        .replace(/\..+/, '')      // quita milisegundos y zona horaria
        .replace('T', '_')        // opcional: más legible

    const fileName = `captura-${timestamp}.png`

    canvas.toBlob(async (blob) => {
        if (blob) {
            try {
                await subirImagenASupabase(blob, `${pathBucket}/${fileName}`, informe_id)
            } catch (err) {
                alert('Error al subir la imagen.')
                console.error(err)
            }
        }
    }, 'image/png')
}

window.setPath = setPath
window.removePath = removePath
window.hacerFoto = hacerFoto

