import { subirImagenASupabase } from '../services/supa_operator.js'
import { crearInforme,  finalizarInforme } from '../services/supa_informs.js'
import { reconocerArmas } from '../armas/reconocerArmas.py'

const user = JSON.parse(localStorage.getItem('usuario'))
let path = null
let informeId = null
let capturaIntervalId = null

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
    finalizarInforme(informe_id).then(r => r);
    alert('Path eliminado')
    detenerCapturaAutomatica()
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

    // Convertir a blob para el reconocimiento
    canvas.toBlob(async (blob) => {
        if (!blob) return

        try {
            // Llamada al detector de armas
            const tieneArma = await reconocerArmas(blob)
            if (!tieneArma) {
                console.log('No se detectó arma. Imagen descartada.')
                return
            }

            const now = new Date()
            const timestamp = now.toISOString()
                .replace(/:/g, '-')       // reemplaza ":" para evitar problemas en nombres de archivo
                .replace(/\..+/, '')      // quita milisegundos y zona horaria
                .replace('T', '_')        // opcional: más legible

            const fileName = `captura-${timestamp}.png`
            await subirImagenASupabase(blob, `${pathBucket}/${fileName}`, informe_id)
            console.log('Imagen con arma subida:', fileName)
        } catch (err) {
            console.error('Error en reconocimiento o subida:', err)
        }
    }, 'image/png')
}

// Inicia la captura cada 2 segundos
export function iniciarCapturaAutomatica() {
    if (!path) {
        alert('Primero establece un path.')
        return
    }
    if (capturaIntervalId) {
        console.warn('La captura automática ya está en marcha.')
        return
    }
    capturaIntervalId = setInterval(hacerFoto, 2000)
    console.log('Captura automática iniciada (cada 2s).')
}

// Detiene la captura periódica
export function detenerCapturaAutomatica() {
    if (capturaIntervalId) {
        clearInterval(capturaIntervalId)
        capturaIntervalId = null
        console.log('Captura automática detenida.')
    }
}

window.setPath = setPath
window.removePath = removePath
window.hacerFoto = hacerFoto
window.iniciarCapturaAutomatica = iniciarCapturaAutomatica
window.detenerCapturaAutomatica = detenerCapturaAutomatica

